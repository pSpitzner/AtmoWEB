var panel_lists = new Array();
var panel_obj_lists = new Array();
panel_lists['ts'] = new Array();
panel_lists['vp'] = new Array();
panel_obj_lists['ts'] = new Array();
panel_obj_lists['vp'] = new Array();

setInterval(update_all_charts_from_source, 5000);


function chartpanel(toggle_id, type) {
  this.toggle_id = toggle_id;
  this.inner_html = "test";
  this.type = type;
  this.dm = 1;
  this.dt = 1;
  this.last_available = 0;
  this.last_loaded = 0;
  this.all_loaded = 0;
  this.loading = false;
  this.source = new Array();
}

chartpanel.prototype.init_chart = function() {
  var self = this;
  if (this.type == 'vp') {
    this.chart = new Highcharts.chart(this.toggle_id+"_vp_content", {
      chart: {
          type: 'heatmap',
          margin: [0, 0, null, null]
      },
      boost: {
          useGPUTranslations: true
      },
      title: {
          text: ''
      },
      xAxis: {
          type: 'datetime',
          labels: {
              align: 'left',
              x: 5,
              y: 14,
          },
          showLastLabel: true,
          tickLength: 16,
          min: 0,
          // max: 11*this.dt*1000
      },
      yAxis: {
          // type: 'linear',
          title: {
              text: ''
          },
          labels: {
              format: '{value}m'
          },
          minPadding: 0,
          maxPadding: 0,
          startOnTick: true,
          endOnTick: false,
          tickWidth: 1,
          tickLength: 8,
          reversed: false,
          min: 0,
      },
      colorAxis: {
          stops: [
              [0, '#3060cf'],
              [0.5, '#fffbbc'],
              [0.9, '#c4463a'],
              [1, '#c4463a']
          ],
          startOnTick: false,
          endOnTick: false,
          labels: {
              format: '{value}',
              formatter: function() {
                return this.value.toExponential(1); // 2 digits of precision
              }
          },
      },
      series: [{
          boostThreshold: 100,
          borderWidth: 0,
          colsize:this.dt*1000,
          rowsize:this.dm,
          nullColor: '#EFEFEF',
          turboThreshold: Number.MAX_VALUE, // #3404, remove after 4.0.5 release
          tooltip: {
            headerFormat: "",
            pointFormatter: function() {
              return this.y+"m, "+this.x/60000+"min, "+this.value.toExponential(1); // 2 digits of precision
            },
          },
          // tooltip: {
          //     headerFormat: 'Temperature<br/>',
          //     pointFormat: '{point.x:%Hh %Mmin}, {point.y}m, <b>{point.value} ℃</b>'
          // },
      }]
    });
  } else if (this.type == 'ts') {
    this.chart = Highcharts.chart(this.toggle_id+"_ts_content", {
        boost: {
          useGPUTranslations: true
        },
        chart: {
            type: 'line',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          labels: {
              align: 'left',
              x: 5,
              y: 14,
          },
          showLastLabel: true,
          tickLength: 16,
          min: 0,
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + self.toggle_id + '</b><br/>' +
                    Highcharts.dateFormat('%H:%M', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            },
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{

        }]
    });

  }
}

chartpanel.prototype.init_variables_from_source_format = function() {
  var self = this;
  if (self.type == 'vp') {
    jQuery.getJSON("./php/provide_vp_details.php?f="+this.toggle_id+"&i="+pad(0,5), function( data ) {
      self.dt=(Number(data.dt));
      self.dm=(Number(data.dm));
      self.init_chart();
      self.update_last_source_entry_form_query();
    });
  } else if (self.type == 'ts') {
    jQuery.getJSON("./php/provide_ts_details.php?f="+this.toggle_id, function( data ) {
      self.dt=(Number(data.dt));
      self.init_chart();
      self.update_last_source_entry_form_query();
    });
  }
}

chartpanel.prototype.update_last_source_entry_form_query = function() {
  var self = this;
  if (self.type == 'vp') {
    jQuery.get("./php/provide_vp_index.php").done(function( data ) {
      if (self.last_available!=Number(data)) {
        self.last_available=Number(data);
        self.chart.xAxis[0].setExtremes(0, self.last_available*self.dt*1000);
        self.append_new_data_and_redraw();
      }
    });
  } else if (self.type == 'ts') {
      jQuery.get("./php/provide_ts_index.php?f="+self.toggle_id).done(function( data ) {
      if (self.last_available!=Number(data)) {
        self.last_available=Number(data);
        self.chart.xAxis[0].setExtremes(0, self.last_available*self.dt*1000);
        self.append_new_data_and_redraw();
      }
    });
  }
}

chartpanel.prototype.append_new_data_and_redraw = function() {
  var self = this;
  if (self.loading) return;
  self.loading = true;
  var querytarget;
  if (self.type == 'vp') {
    for (var target_index = self.last_loaded; target_index <= self.last_available; target_index++) {
      if (self.type == 'vp') querytarget = "./php/provide_vp_data.php?f="+self.toggle_id+"&i="+pad(target_index,5);
      jQuery.getJSON(querytarget, function( data ) {
        // this is asynchroneous!
        var newdata_height = new Array();
        var newdata_val = new Array();
        var time;

        self.all_loaded += 1;
        $.each( data, function(key, entry ) {
          newdata_height.push(Number(entry.h));
          newdata_val.push(Number(entry.val));
          time = Number(entry.t);
        })
        time *= 1000;

        for (var i = 0; i < newdata_val.length; i++) {
          var temp = [time, newdata_height[i], newdata_val[i]];
          self.source.push(temp);
        }

        // only reload after final read
        if (self.all_loaded == self.last_available+1) {
          self.last_loaded = self.last_available;
          self.all_loaded = self.last_available;
          self.chart.series[0].setData(self.source,true,true,true);
          // self.chart.redraw(true);
          self.loading = false;
        }
      });
    }
  } else if (self.type == 'ts') {
    querytarget = "./php/provide_ts_data.php?f="+self.toggle_id+"&l="+self.last_loaded;
    jQuery.getJSON(querytarget, function( data ) {
      // this is asynchroneous!
      var val;
      var time;
      var source_to_append = new Array();
      $.each( data, function(key, entry ) {
        val = Number(entry.val);
        time = Number(entry.t)*self.dt;
        time *= 1000;
        source_to_append.push([time, val]);
      })
      source_to_append.sort(function(a,b) {
        return a[0] - b[0];
      });
      self.source = self.source.concat(source_to_append);

      self.last_loaded = self.last_available;
      self.chart.series[0].setData(self.source,true,true,true);
      // self.chart.redraw(true);
      self.loading = false;
    });
  }
}

function update_all_charts_from_source() {
  // check if refreshing button is enabled from atmo_view_img.js
  if (stay_on_last_frame) {
    // console.log(panel_obj_lists['vp']);
    for (var i = 0; i < panel_obj_lists['vp'].length; i++) {
      panel_obj_lists['vp'][i].update_last_source_entry_form_query();
    }
    for (var i = 0; i < panel_obj_lists['ts'].length; i++) {
      panel_obj_lists['ts'][i].update_last_source_entry_form_query();
    }
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function chart_panel_exists(toggle_id, type) {
  if (panel_lists[type].indexOf(toggle_id) == -1) return false;
  else return true;
}

function toggle_chart_panel(toggle_id, type) {
  var panel_id = toggle_id + "_" + type + "_panel";
  var content_id = toggle_id + "_" + type + "_content";

  if (chart_panel_exists(toggle_id, type)) {
    var panel = document.getElementById(panel_id);
    var index = panel_lists.indexOf(toggle_id);
    panel_lists[type].splice(index,1);
    panel_obj_lists[type].splice(index,1);
    panel.parentNode.removeChild(panel);
  } else {
    var panel = document.createElement('div');
    panel.id = panel_id;
    panel.className = 'col-md-6';
    panel.innerHTML = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+toggle_id+'</h3></div><div id="'+content_id+'" class="panel-body-vp"></div></div>';
    var tabview = document.getElementById('table_view_highcharts');
    tabview.appendChild(panel);

    // now init the chart
    var newchart = new chartpanel(toggle_id, type);
    newchart.init_variables_from_source_format();

    panel_obj_lists[type].push(newchart);
    panel_lists[type].push(toggle_id);
  }

  // indicate state via checkbox (clicking the box also clicks the listelement)
  var cb = document.getElementById(toggle_id+'_'+type+'_checkbox');
  cb.checked=chart_panel_exists(toggle_id, type);
  cb.blur();
}

