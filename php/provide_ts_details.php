<?php
  // return content of the file after a certain line
  header('Content-Type: application/json');

  include("config.php");
  $file = $_REQUEST["f"];
  $file=$atmocl_dir."/timeseries/".$file.".ts";

  $dm=1.0;
  $dt=1.0;

  $splhead = new SplFileObject($file);
  while ( ! $splhead->eof()) {
    $thisline = $splhead->fgetcsv("\t");
    if(strlen($thisline[0]) == 0) continue;
    // check for comment
    if(strlen($thisline[0])-strcmp($thisline[0], '#')==1) {
      if(strlen($thisline[0])-strcmp($thisline[0], '#dt=')==4) {
        $dt = floatval(substr($thisline[0], 4, strlen($thisline[0])-3));
        // echo $dt;
      }
    }
  }

  $ret=array();
  $ret["dt"]=$dt;
  echo json_encode($ret);
?>
