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


var panels = new Array(); // contains toggle_ids, not panel_ids
var upnext = new Array();
var upback = new Array();
var frame_index=0;
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
  // console.log("+");
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
    panel.innerHTML = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+toggle_id+'</h3></div><img id="'+image_id+'" alt="img" class="img-responsive panel-body-img" width="100%"></div>';
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

var startx = 0;
var starty = 0;
var startt = 0;

window.addEventListener('load', function(){ // on page load
  var contentarea = document.getElementById("contentarea");
  //playhandle = setInterval(next_frame,1000);
  contentarea.addEventListener("touchstart", touchStart, false);
  contentarea.addEventListener("touchmove", touchMove, false);
  contentarea.addEventListener("touchend", touchEnd, false);
  // contentarea.addEventListener("touchcancel", touchCancel, false);
  // contentarea.addEventListener("touchforcechange", touchForceChange, false);
}, false)

var frame_repeat_interval = 0;
var frame_repeat_bool = false;
var frame_repeat_handle;

function set_frame_repeat_interval(new_interval) {
	if (new_interval == frame_repeat_interval) return;
	else {
		frame_repeat_interval = new_interval;
		frame_repeat_bool = true;
	}
}

function frame_repeat() {
	// console.log(frame_repeat_interval+" <- "+new_interval);
	if (frame_repeat_bool == false || Math.abs(frame_repeat_interval) > 1000) {
		var swap = frame_repeat_handle;
		frame_repeat_handle = setTimeout(frame_repeat, 250);
		clearTimeout(swap);
		return;
	}
	else if (frame_repeat_interval>0) next_frame();
	else if (frame_repeat_interval<0) back_frame();
	var swap = frame_repeat_handle;
	frame_repeat_handle = setTimeout(frame_repeat, Math.abs(frame_repeat_interval));
	clearTimeout(swap);
}

var touchlong_handle;
function touchLong(e) {
	frame_repeat();
  if (startx > contentarea.offsetWidth/2.0) set_frame_repeat_interval(200);
  else set_frame_repeat_interval(-200);
  document.getElementById("button_counter").className="btn btn-default disabled changing";
  e.preventDefault();
}

function touchStart(e) {
  var touchobj = e.changedTouches[0];
  startt = new Date().getTime();
  startx = parseInt(touchobj.clientX);

	touchlong_handle = setTimeout(touchLong, 400, e);
}

function touchMove(e) {
  var touchobj = e.changedTouches[0];
  var nowx = parseInt(touchobj.clientX);
  var nowt = new Date().getTime();
  if (nowt - startt < 200 || frame_repeat_bool == false) {
  	clearTimeout(touchlong_handle);
  	frame_repeat_bool= false;
  	return;
  } else {
  	var target_interval = 8000/(nowx-startx);
  	if (Math.abs(target_interval)<200) set_frame_repeat_interval(target_interval);
  	e.preventDefault();
  }
}

function touchEnd(e) {
// console.log("end");
  var touchobj = e.changedTouches[0];

  clearTimeout(touchlong_handle);

  frame_repeat_interval = 0;
  frame_repeat_bool = false;
  clearTimeout(frame_repeat_handle);
  document.getElementById("button_counter").className="btn btn-default disabled";

  var nowt = new Date().getTime()
  if (nowt - startt < 100) {
  	if (parseInt(touchobj.clientX) > contentarea.offsetWidth/2.0) next_frame();
		else back_frame();
	}

  disableDoubleTap(e);
}

function disableDoubleTap(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return;

  e.preventDefault();
}
