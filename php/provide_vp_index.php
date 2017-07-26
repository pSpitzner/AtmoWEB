<?php
  include("config.php");
  $dir=$atmocl_dir."/verticalprofiles/";
  $fileformat=".vp";
  chdir($dir);
  $subdirs = glob('*' , GLOB_ONLYDIR);
  $frames=array();
  $targetdirs=array();

    // get framenames in one subdir, should be equal for all folders
    if (count($subdirs>0)) {
      $handle=opendir($subdirs[0]);
      while (false !== ($entry = readdir($handle))) {
        if(strpos($entry, $fileformat) !== false) array_push($frames, $entry);
      }
      echo count($frames)-1;
    }

  // echo $old_frame;


?>
