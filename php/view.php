<?php
  // include("config.php");

  // load images
  $imagedir=$atmocl_dir."img/";
  chdir($imagedir);
  $imagesubdirs = glob('*' , GLOB_ONLYDIR);

  // load verticalprofiles
  $vpdir = $atmocl_dir."/verticalprofiles/";
  chdir($vpdir);
  $vpsubdirs = glob('*', GLOB_ONLYDIR);

  // load timeseries
  $tsdir = $atmocl_dir."/timeseries/";
  $fileformat = ".ts";
  if (!file_exists($tsdir)) exit();
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
?>

<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" id="navbar_collapse_toggle" data-target="#navbar_collapse_content" aria-expanded="false" onclick="this.blur();">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">AtmoWEB</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="navbar_collapse_content">
        <button id="button_refresh" class="btn btn-default navbar-btn" onclick="toggle_stay_on_last();"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
        <button id="button_play" class="btn btn-default navbar-btn" onclick="play();"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button></button>
        <button class="btn btn-default navbar-btn disabled" type="button">Count: <span id="framecounter" class="badge">4</span></button>

        <ul class="nav navbar-nav navbar-right">
        <div style="float: right;">
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
          <div class="btn-group">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            VP <span class="caret"></span></button>
            <ul class="dropdown-menu dropdown-right" role="menu">
            <?php
              for ($i=0; $i < count($vpsubdirs); $i++) echo '<li onclick="toggle_chart_panel(\''.$vpsubdirs[$i].'\', \'vp\');"><a class="clickable-list-item"><input id="'.$vpsubdirs[$i].'_vp_checkbox" type="checkbox" style="margin-right:12px">'.$vpsubdirs[$i].'</a></li>';
            ?>
            </ul>
          </div>
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
        </div>
        </ul>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<!-- main -->
<div class="container-fluid">

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

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="./js/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
<script src="./js/bootstrap.min.js"></script>
<script src="./js/docs.min.js"></script>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="./js/ie10-viewport-bug-workaround.js"></script>

<script src="./js/atmo_view_img.js"></script>
<script>
  update_last_frame_form_query(); // do this first so jquery finishes in time for set_frame
  toggle_view_panel("XY_uv_ground");
  toggle_view_panel("XY_int_lwp");
  // toggle_view_panel("XY_w_2km");
  // toggle_view_panel("XY_w_600m");
  // toggle_view_panel("XZ_int_cloud");
  // toggle_view_panel("XZ_int_rho_c");
  // toggle_view_panel("XZ_int_rho_i");
  // toggle_view_panel("XZ_int_rho_s");
  // toggle_view_panel("XZ_int_rho_r");
  // toggle_view_panel("XZ_rho_c");
  // toggle_view_panel("XZ_rho_i");
  // toggle_view_panel("XZ_rho_s");
  // toggle_view_panel("XZ_rho_r");
  // toggle_view_panel("XZ_rho_v");
  // toggle_view_panel("XZ_n_c");
  // toggle_view_panel("XZ_n_i");
  // toggle_view_panel("XZ_n_s");
  // toggle_view_panel("XZ_n_r");
  // toggle_view_panel("XZ_n_d");
  toggle_view_panel("XZ_w");
  set_frame(0);
  setInterval("render()",100);
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
toggle_chart_panel("VP_ql", "vp");
toggle_chart_panel("XZ_int_rho_c", "ts");
</script>

