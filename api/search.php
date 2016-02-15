<?php 
  error_reporting(E_ALL || ~E_NOTICE);
  header("Content-Type: text/html; charset=UTF-8");
  $search = htmlspecialchars($_POST["search"]);
  $type = htmlspecialchars($_POST["type"]);

  $allowType = ["book", "music", "movie"];

  if (!in_array($type, $allowType, true)) {
    // invalid type
    $res["status"] = false;
    $res["code"] = 101;
    echo json_encode($res);
    die();
  }

  if ($search == "") {
    // No input search words
    $res["status"] = false;
    $res["code"] = 201;
    echo json_encode($res);
    die();
  }

  // make GET-url
  $searchUrl = "https://api.douban.com/v2/book/search?q=" . $search;
  // from api GET the search res
  $searchRes = file_get_contents($searchUrl);
  $searchResJSON = json_decode($searchRes);

  if ($searchResJSON->count === 0) {
    // None of result data
    $res["status"] = false;
    $res["code"] = 202;
    echo json_encode($res);
    die();
  }

  $res["status"] = true;
  $res["code"] = 0;
  $res["type"] = $type;
  $res["data"] = $searchResJSON->books;

  echo json_encode($res);
 ?>