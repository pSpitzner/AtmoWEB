<?php
  include("config.php");
  $src_arg = $_REQUEST["src"];
  $f = $_REQUEST["f"];
  $n = $_REQUEST["n"];

  // open the file in a binary mode
  if ($f != -1) {
    $name = sprintf("%s/%s/img/%s/%05d.png", $atmocl_dir, $src_arg, $n, $f);
    header("Content-Type: image/png");
    header("Content-Length: " . filesize($name));
  } else {
    $name = "../loading.gif";
    header("Content-Type: image/gif");
    header("Content-Length: " . filesize($name));
  }

  readfile($name);
?>
