<?php
  include("config.php");
  $f = $_REQUEST["f"];
  $n = $_REQUEST["n"];

  // open the file in a binary mode
  $name = sprintf("%simg/%s/%05d.png", $atmocl_dir, $n, $f);
  // echo $name;

  // send the right headers
  header("Content-Type: image/png");
  header("Content-Length: " . filesize($name));

  readfile($name);
?>
