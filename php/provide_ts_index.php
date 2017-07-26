<?php
  // return content of the file after a certain line
  header('Content-Type: application/json');

  include("config.php");
  $file = $_REQUEST["f"];
  $file=$atmocl_dir."/timeseries/".$file.".ts";
  $headerlength = 2;

  echo intval(exec("wc -l '$file'")) - $headerlength;
?>
