// unfocus collapse toggle
$('#navbar_collapse_content')
  .on('show.bs.collapse', function (e) {
    var sender = document.getElementById('navbar_collapse_toggle');
    // $('#navbar_collapse_toggle').addClass('expanded');
    // $('#navbar_collapse_toggle').removeClass('inactive');
    sender.blur();
  })
  .on('hidden.bs.collapse', function (e) {
    var sender = document.getElementById('navbar_collapse_toggle');
    // $('#navbar_collapse_toggle').removeClass('expanded');
    // $('#navbar_collapse_toggle').addClass('inactive');
    sender.blur();
});

// pad content under navbar
$(window).resize(function () {
    $('#navbar-stretcher').css('padding-top', parseInt($('#main-navbar').css("height"))+10);
});

$(window).load(function () {
    $('#navbar-stretcher').css('padding-top', parseInt($('#main-navbar').css("height"))+10);
});

// window.addEventListener('load', function(){ // on page load
//   document.getElementById("contentarea").addEventListener("touchstart", touchStart, false);
// 	document.getElementById("contentarea").addEventListener("touchmove", touchMove, false);
// 	document.getElementById("contentarea").addEventListener("touchend", touchEnd, false);
// 	document.getElementById("contentarea").addEventListener("touchcancel", touchCancel, false);
// 	document.getElementById("contentarea").addEventListener("touchforcechange", touchForceChange, false);
// }, false)


var panels = new Array(); // contains toggle_ids, not panel_ids
var upnext = new Array();
var upback = new Array();
var frame_index=-1;
var last_frame=-1;
var playing=0;
var stay_on_last_frame=false;

function pbc(i) {
  var j=0;
  if (i<=last_frame && i>=0) j=i;
  else if (i<0 && last_frame != 0) j = last_frame + i%last_frame +1;
  else if (last_frame==0) j=0;
  else j = -1 + i%last_frame;
  // console.log(j+" "+i+" / "+last_frame);
  return j;
}

function set_frame(i) {
  for (v=0;v<panels.length;v++) {
    if (last_frame != -1) {
      var toggle_id = panels[v];
      frame_index = pbc(i);
      document.getElementById(toggle_id+'_img_image').src="./php/image.php?src="+src_arg+"&n="+toggle_id+"&f="+pbc(frame_index);
      if (last_frame > 0) {
        upnext[v].src="./php/image.php?src="+src_arg+"&n="+toggle_id+"&f="+pbc(frame_index+1);
        upback[v].src="./php/image.php?src="+src_arg+"&n="+toggle_id+"&f="+pbc(frame_index-1);
      }
      document.getElementById("framecounter").innerHTML=frame_index;
    } else {
      var toggle_id = panels[v];
      frame_index = -1;
      document.getElementById(toggle_id+'_img_image').src="./php/image.php?src="+src_arg+"&n="+toggle_id+"&f="+frame_index;
      document.getElementById("framecounter").innerHTML="loading...";
    }
  }
}

function next_frame() {
  set_frame(frame_index+1);
}

function back_frame() {
  set_frame(frame_index-1);
}

function play() {
  var button = document.getElementById("button_play");
  button.blur();
  if (playing==0) {
      playing=1;
      button.innerHTML='<span class="glyphicon glyphicon-pause" aria-hidden="true"></span>';
      button.className = 'btn btn-primary';
  } else {
      (playing=0);
      button.innerHTML='<span class="glyphicon glyphicon-play" aria-hidden="true"></span>';
      button.className = 'btn btn-default';
  }
}

function toggle_stay_on_last() {
  var button = document.getElementById("button_refresh");
  button.blur();
  if (stay_on_last_frame==0) {
      stay_on_last_frame=1;
      button.className = 'btn btn-primary';
  } else {
      (stay_on_last_frame=0);
      button.className = 'btn btn-default';
  }
}

function render() {
  if (playing==1) next_frame();
}


function update_last_frame_form_query() {
  jQuery.get("./php/provide_img_index.php?src="+src_arg).done(function( data ) {
    last_frame=Number(data);
    if (stay_on_last_frame) {
      set_frame(last_frame);
    }
  });
  setTimeout(update_last_frame_form_query, 5000);
}

function set_source(toggle_id) {
  var img = document.getElementById(toggle_id+'_img_image');
  img.src="./php/image.php?src="+src_arg+"&n="+toggle_id+"&f="+frame_index;
  // document.getElementById("dirselecta"+panel_id).blur();
}

function panel_exists(toggle_id) {
  if (panels.indexOf(toggle_id) == -1) return false;
  else return true;
}

function toggle_view_panel(toggle_id) {
  var panel_id = toggle_id+'_img_panel';
  var image_id = toggle_id+'_img_image';
  if (panel_exists(toggle_id)) {
    var panel = document.getElementById(panel_id);
    var index = panels.indexOf(toggle_id);
    panels.splice(index,1);
    upnext.splice(index,1);
    upback.splice(index,1);
    panel.parentNode.removeChild(panel);
  } else {
    panels.push(toggle_id);
    upnext.push(new Image());
    upback.push(new Image());
    var panel = document.createElement('div');

    panel.id = panel_id;
    panel.className = 'col-sm-6 col-lg-4 half-padding';
    panel.innerHTML = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+toggle_id+'</h3></div><img src="'+src_arg+'img/00001.png" id="'+image_id+'" alt="img" class="img-responsive panel-body-img" width="100%"></div>';
    var tabview = document.getElementById('table_view_images');
    tabview.appendChild(panel);
    set_source(toggle_id);
  }

  // indicate state via checkbox (clicking the box also clicks the listelement)
  var cb = document.getElementById(toggle_id+'_img_checkbox');
  cb.checked=panel_exists(toggle_id);
  cb.blur();
  Cookies.set('img',panels);
}

function init_img_view() {
  setInterval("render()",100);
  update_last_frame_form_query();
  set_frame(-1);
  // manually get last frame
  jQuery.get("./php/provide_img_index.php?src="+src_arg).done(function( data ) {
    last_frame=Number(data);
    if (last_frame>=0) set_frame(0);
    else set_frame(-1);
  });
}

function keyhandler(keyEv) {
  if(!keyEv)keyEv=window.event;
  if(keyEv.which)
  {
    keyCode = keyEv.which;
  }
  else if(keyEv.keyCode)
  {
    keyCode = keyEv.keyCode;
  }
  //alert("Taste mit Dezimalwert "+keyCode+" gedr&uuml;ckt.");
  // arrows
  if(keyCode==39){
    next_frame();
    keyEv.preventDefault();}
  if(keyCode==37){
    back_frame();
    keyEv.preventDefault();}
  if(keyCode==38){
    set_frame(0);
    keyEv.preventDefault();}
  if(keyCode==40){
    set_frame(last_frame);
    keyEv.preventDefault();}
  // space to play
  if(keyCode==32){
    play();
    keyEv.preventDefault(); // disable scrolling via spacebar
  }
  // press r to toggle updating
  if(keyCode==82){
    toggle_stay_on_last();
  }
}

document.onkeydown = keyhandler;

