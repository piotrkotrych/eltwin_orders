<?php

header("Access-Control-Allow-Origin: *");

$dsn = "mysql:host=10.47.8.236;dbname=elt";

$options = [

  PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements

  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions

  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array

];

try {

  $pdo = new PDO($dsn, "AOITHT", "eltwin123", $options);

} catch (Exception $e) {

  error_log($e->getMessage());
  echo $e;
  exit('Cannot connect to database'); //something a user can understand

}



switch ($_GET['type']) {

  case 'getUserInfo':

    $login = $_GET['login'];

    $stmt = $pdo->prepare("SELECT id, login as name, orders_level as level, email FROM users WHERE login = ?");

    $stmt->execute([$login]);

    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if(!$arr) exit(http_response_code( 400 ));

    echo json_encode($arr[0]);

    $stmt = null;

    break;

  
  case 'checkUserToken':

    $login = $_GET['login'];
    $level = $_GET['level'];
    $email = $_GET['email'];

    $stmt = $pdo->prepare("SELECT id, login as name, orders_level as level FROM users WHERE login = ? and orders_level = ? and email = ?");

    $stmt->execute([$login,$level,$email]);

    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if(!$arr) exit(http_response_code( 404 ));

    // echo json_encode($arr[0]);
    return true;

    $stmt = null;

    break;

  

  default:

    echo "lol";

    break;

}


?>