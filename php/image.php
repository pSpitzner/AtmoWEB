<?php
  include("config.php");
  $src_arg = $_REQUEST["src"];
  $f = $_REQUEST["f"];
  $n = $_REQUEST["n"];

  // open the file in a binary mode
  $name = sprintf("%s/%s/img/%s/%05d.png", $atmocl_dir, $src_arg, $n, $f);
  // echo $name;

  // send the right headers
  header("Content-Type: image/png");
  header("Content-Length: " . filesize($name));

  readfile($name);
?>
