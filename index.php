<?php
  include("./php/config.php");

  if (!file_exists($atmocl_dir)) {
    echo 'Incorrect folder specified in config';
    exit;
  }

  // chdir($atmocl_dir);
  // $src_arg = glob('*' , GLOB_ONLYDIR)[0];

  $src_is_valid = false;
  // load possible input argument
  if (isset($_REQUEST["src"])) $src_arg = $_REQUEST["src"];
  chdir($atmocl_dir);
  $src_subdirs = glob('*' , GLOB_ONLYDIR);
  for ($i=0; $i < count($src_subdirs); $i++) {
    if ($src_arg == $src_subdirs[$i]) $src_is_valid = true;
  }
  if (count($src_subdirs) == 0) {
    echo 'No input folder present, aborting';
    exit;
  }
  if (!$src_is_valid || count($src_subdirs) == 1 && !isset($_REQUEST["src"])) {
    echo '<script type="text/javascript">
            window.location = "?src='.$src_subdirs[0].'"
          </script>';
    exit;
  }

  // content sub directories
  $imagedir=$atmocl_dir.$src_arg."/img/";
  $vpdir = $atmocl_dir.$src_arg."/verticalprofiles/";
  $tsdir = $atmocl_dir.$src_arg."/timeseries/";

  if (!file_exists($imagedir)) {
    echo 'Content folder missing (img)';
    // recycle src is valid variable
    $src_is_valid = false;
  } else {
    chdir($imagedir);
    $imagesubdirs = glob('*' , GLOB_ONLYDIR);
  }

  if (file_exists($vpdir)) {
    chdir($vpdir);
    $vpsubdirs = glob('*', GLOB_ONLYDIR);
  } else {
    $vpsubdirs = [];
  }

  if (file_exists($tsdir)) {
    // load timeseries
    $fileformat = ".ts";
    $tsfiles=array();
    $handle=opendir($tsdir);
    while (false !== ($entry = readdir($handle))) {
          if(strpos($entry, $fileformat) !== false) {
            // array_push($tsfiles,      $entry);
            array_push($tsfiles, substr($entry, 0,-strlen($fileformat)));
          }
    }
    closedir($handle);
    sort($tsfiles);
  } else {
    $tsfiles=[];
  }

  // set tab title
  ob_start();
  include("header.html");
  $buffer=ob_get_contents();
  ob_end_clean();
  $title = "AtmoWEB ".$src_arg;
  $buffer = preg_replace('/(<title>)(.*?)(<\/title>)/i', '$1' . $title . '$3', $buffer);
  echo $buffer;

  // check interface title is set
  if (!isset($interface_title)) $interface_title = "AtmoWEB";

?>

<body>
<nav class="navbar navbar-default navbar-fixed-top" id="main-navbar">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" id="navbar_collapse_toggle" data-target="#navbar_collapse_content" aria-expanded="false" onclick="this.blur();">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <div class="btn-group navbar-btn navbar-padr">
        <button id="button_refresh" type="button" class="btn btn-default" onclick="toggle_stay_on_last();"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
        <button id="button_play" class="btn btn-default" onclick="play();"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>
        <button class="btn btn-default disabled" type="button">Count: <span id="framecounter" class="badge">0</span></button>
      </div>
      <a class="navbar-brand hidden-xs" href="">
        <?php echo $interface_title;?>
      </a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <!-- controls -->
    <div class="collapse navbar-collapse" id="navbar_collapse_content">
				<!-- <ul class="nav navbar-nav navbar-right">
          <div class="btn-group navbar-btn navbar-padr">
            <button id="button_refresh" class="btn btn-default" onclick="toggle_stay_on_last();"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
            <button id="button_play" class="btn btn-default" onclick="play();"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button></button>
            <button class="btn btn-default disabled" type="button">Count: <span id="framecounter" class="badge">0</span></button>
          </div>
        </ul> -->

        <!-- input src -->
        <ul class="nav navbar-nav navbar-right">
          <div class="btn-group navbar-btn navbar-padlr">
            <div class="btn-group">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              <?php
              echo $src_arg;
              ?>
              <span class="caret"></span></button>
              <ul class="dropdown-menu" role="menu">
                <?php
                  for ($i=0;$i<count($src_subdirs);$i++) {
                    if ($src_arg != $src_subdirs[$i]) echo '<li class=""><a class="clickable-list-item" href="?src='.$src_subdirs[$i].'">'.$src_subdirs[$i].'</a></li>';
                  }
                  if (count($src_subdirs)==1) echo '<li class="disabled"><a class="clickable-list-item" href="">No other input available</a></li>';
                ?>
              </ul>
            </div>
          </div>
        </ul>

        <ul class="nav navbar-nav navbar-left">
          <div class="btn-group navbar-btn navbar-padlr">
            <div class="btn-group">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              Images <span class="caret"></span></button>
              <ul class="dropdown-menu" role="menu">
                <?php
                  for ($i=0;$i<count($imagesubdirs);$i++) echo '<li onclick="toggle_view_panel(\''.$imagesubdirs[$i].'\');"><a class="clickable-list-item"><input id="'.$imagesubdirs[$i].'_img_checkbox" type="checkbox" style="margin-right:12px">'.$imagesubdirs[$i].'</a></li>';
                ?>
              </ul>
            </div>
          </div>
        </ul>

        <ul class="nav navbar-nav navbar-left">
          <div class="btn-group navbar-btn navbar-padlr">
            <div class="btn-group">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              VP <span class="caret"></span></button>
              <ul class="dropdown-menu dropdown-right" role="menu">
              <?php
                for ($i=0; $i < count($vpsubdirs); $i++) echo '<li onclick="toggle_chart_panel(\''.$vpsubdirs[$i].'\', \'vp\');"><a class="clickable-list-item"><input id="'.$vpsubdirs[$i].'_vp_checkbox" type="checkbox" style="margin-right:12px">'.$vpsubdirs[$i].'</a></li>';
              ?>
              </ul>
            </div>
          </div>
        </ul>

        <ul class="nav navbar-nav navbar-left">
          <div class="btn-group navbar-btn navbar-padlr">
            <div class="btn-group">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              TS <span class="caret"></span></button>
              <ul class="dropdown-menu" role="menu">
                <?php
                for ($i=0; $i < count($tsfiles); $i++) echo '<li onclick="toggle_chart_panel(\''.$tsfiles[$i].'\', \'ts\');"><a class="clickable-list-item"><input id="'.$tsfiles[$i].'_ts_checkbox" type="checkbox" style="margin-right:12px">'.$tsfiles[$i].'</a></li>';
                ?>
              </ul>
            </div>
          </div>
        </ul>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<!-- main -->
<div class="container-fluid half-padding vfill" id="contentarea">
	<div id="navbar-stretcher"></div>

  <div class="col-md-12">
    <div class="row" id="table_view_images">
    <!-- image view panels -->
      <!-- <div class="col-sm-6 col-lg-4">
        <div class="panel panel-default">
          <div class="panel-heading"><h3 class="panel-title">Panel Template</h3></div>
          <img src="img/00001.png" alt="img" class="img-responsive panel-body-img" width="100%">
        </div>
      </div> -->
    <!-- time series panels -->
    </div>

    <div class="row" id="table_view_highcharts">
      <!-- <div class="col-md-6">
          <div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">tstest</h3></div><div id="ts_test" class="panel-body-vp" width="100% height=100%"></div></div>
      </div> -->
    </div>
  </div>
</div>
</body>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="./js/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
<script src="./js/bootstrap.min.js"></script>
<!-- <script src="./js/docs.min.js"></script> -->
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="./js/ie10-viewport-bug-workaround.js"></script>

<!-- dont launch further scripts if no content available, but render nav bar nonetheless -->
<?php
if (!$src_is_valid) exit;
?>

<!-- array of active panels as cookies, load this after jquery-->
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>

<!-- need to set this variable, to call the right getter from javascript :/ -->
<script>var src_arg = "<?php Print($src_arg); ?>";</script>
<script src="./js/atmo_view_img.js"></script>
<script>
  init_img_view();
  var img_cookie_list = Cookies.getJSON('img');
  console.log("img from cookies: "+img_cookie_list);
  for (const i in img_cookie_list) {toggle_view_panel(img_cookie_list[i]);}
</script>

<!-- highchart -->
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/heatmap.js"></script>
<script src="https://code.highcharts.com/modules/data.js"></script>
<script src="https://code.highcharts.com/modules/boost-canvas.js"></script>
<script src="https://code.highcharts.com/modules/boost.js"></script>
<script src="./js/atmo_view_highchart.js"></script>
<!-- <script src="./js/atmo_view_ts.js"></script> -->
<script>
	var vp_cookie_list = Cookies.getJSON('vp');
  var ts_cookie_list = Cookies.getJSON('ts');
	console.log("vp from cookies: "+vp_cookie_list);
  console.log("ts from cookies: "+ts_cookie_list);
  for (const i in vp_cookie_list) {toggle_chart_panel(vp_cookie_list[i], 'vp');}
 	for (const i in ts_cookie_list) {toggle_chart_panel(ts_cookie_list[i], 'ts');}
</script>

