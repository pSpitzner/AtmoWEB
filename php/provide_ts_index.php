<?php
  // return content of the file after a certain line
  header('Content-Type: application/json');

  include("config.php");
  $src_arg = $_REQUEST["src"];
  $file = $_REQUEST["f"];
  $file=$atmocl_dir.$src_arg."/timeseries/".$file.".ts";
  $headerlength = 2;

  echo intval(exec("wc -l '$file'")) - $headerlength;
?>
