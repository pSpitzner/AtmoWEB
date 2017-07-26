<?php
  // return content of the file after a certain line
  header('Content-Type: application/json');

  include("config.php");
  $file = $_REQUEST["f"];
  $line = $_REQUEST["l"];
  $file=$atmocl_dir."/timeseries/".$file.".ts";

  $data=array();

  $spl = new SplFileObject($file);
  $spl->seek($line+1);
  while ( ! $spl->eof()) {
    $thisline = $spl->fgetcsv("\t");
    if(strlen($thisline[0]) == 0) continue;
    else if(strlen($thisline[0])-strcmp($thisline[0], '#')==1) continue;
    else {
      $myline=array();
      $myline["t"] = $thisline[0];
      $myline["val"] = $thisline[1];
      array_push($data, $myline);
      // $data[$thisline[0]] = $thisline[1];
    }

  }
  echo json_encode($data);

?>
