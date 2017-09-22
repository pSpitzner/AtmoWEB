<?php
  include("config.php");
  $src_arg = $_REQUEST["src"];
  $dir=$atmocl_dir.$src_arg."/img/";
  $fileformat=".png";
  chdir($dir);
  $subdirs = glob('*' , GLOB_ONLYDIR);
  $frames=array();
  $targetdirs=array();

    // get framenames in one subdir, should be equal for all folders
    if (count($subdirs)>0) {
      $handle=opendir($subdirs[0]);
      while (false !== ($entry = readdir($handle))) {
        if(strpos($entry, $fileformat) !== false) array_push($frames, $entry);
      }
      echo count($frames)-1;
    } else {
      echo -1;
    }

  // echo $old_frame;

?>
