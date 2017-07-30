<?php
  // return content of the file after a certain line
  header('Content-Type: application/json');

  include("config.php");

  $file = $_REQUEST["f"];
  $init = $_REQUEST["i"];
  $last = $_REQUEST["l"];

  $data=array();
  for ($i=$init; $i <= $last; $i++) {
    $target_index = str_pad($i, 5, "0", STR_PAD_LEFT);
    $target_file =  $atmocl_dir."verticalprofiles/".$file."/".$target_index.".vp";
    // echo $target_file;

    $dm=1.0;
    $dt=1.0;

    $splhead = new SplFileObject($target_file);
    while ( ! $splhead->eof()) {
      $thisline = $splhead->fgetcsv("\t");
      if(strlen($thisline[0]) == 0) continue;
      // check for comment
      if(strlen($thisline[0])-strcmp($thisline[0], '#')==1) {
        if(strlen($thisline[0])-strcmp($thisline[0], '#dt=')==4) {
          $dt = floatval(substr($thisline[0], 4, strlen($thisline[0])-3));
          // echo $dt;
        }
        if (strlen($thisline[0])-strcmp($thisline[0], '#dm=')==4) {
          $dm = floatval(substr($thisline[0], 4, strlen($thisline[0])-3));
        }
      } else {
      $myline=array();
      $myline["h"] = $thisline[0];
      $myline["t"] = (int)$target_index*$dt;
      $myline["val"] = $thisline[1];
      array_push($data, $myline);
      }
    }
  }

  // $ret=array();
  // $ret["dm"]=$dm;
  // $ret["dt"]=$dt;
  // echo json_encode($ret);

  echo json_encode($data);
?>
