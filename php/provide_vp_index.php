<?php
  include("config.php");
  // $dir=$atmocl_dir."/verticalprofiles/";
  // $fileformat=".vp";
  // chdir($dir);
  // $subdirs = glob('*' , GLOB_ONLYDIR);
  // $targetdirs=array();

  $frames=array();
  $fileformat=".vp";
  $file = $_REQUEST["f"];

      $handle=opendir($atmocl_dir."/verticalprofiles/".$file."/");
      while (false !== ($entry = readdir($handle))) {
        if(strpos($entry, $fileformat) !== false) array_push($frames, $entry);
      }
      echo count($frames)-1;


  // echo $old_frame;


?>
