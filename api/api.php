<?php

header("Access-Control-Allow-Origin: *");

$dsn = "mysql:host=10.47.8.236;dbname=elt;charset=utf8";

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

  case 'tryLogin':

    $login = $_GET['login'];
    $pass = $_GET['pass'];

    $stmt = $pdo->prepare("SELECT id, login, email, level, lastvisit, name, secondname, tel, avatar FROM orders_users WHERE login = ? and pass = sha1(?)");

    $stmt->execute([$login, $pass]);

    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $lvid = $arr[0]["id"];

    $lastvisit = $pdo->prepare("UPDATE orders_users SET lastvisit = NOW() where id = ?");
    $lastvisit->execute([$lvid]);

    if(!$arr) exit(http_response_code( 500 ));

    echo json_encode($arr[0]);

    $stmt = null;

    break;

  case 'getRodzajeDzialy':

    $stmt = $pdo->prepare("SELECT * FROM orders_rodzaje order by id asc");

    $stmt->execute([]);

    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("SELECT dzial FROM orders_dzialy WHERE rodzaj_id=:id order by id asc");

    foreach ($arr as $key => $val) {
      $stmt->execute(array(':id' => $key+1));
      $arr[$key]["dzial"] = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    if(!$arr) exit(http_response_code( 500 ));

    echo json_encode($arr);

    $stmt = null;

    break;

  case 'postFormData':

    $data = (array) json_decode(file_get_contents('php://input'));

    foreach ($data['produkty'] as $key => $value) {
      $produkty[$key] = (array) $value;
    }

    try {
    $sql = $pdo->prepare("INSERT INTO orders_form (user_added, ordered_by, initials, email, rodzaj, dzial, cel, firma, kontakt_osoba, kontakt_email, kontakt_telefon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $sql->execute([$data['initials'], $data['ordered_by'], $data['initials'], $data['email'], $data['rodzaj'], $data['dzial'], $data['cel'], $data['firma'], $data['kontakt_osoba'], $data['kontakt_email'], $data['kontakt_telefon']]);

    $id = $pdo->lastInsertId();
    // echo $id;
    // var_dump($produkty);

    $query = $pdo->prepare("INSERT INTO orders_produkty (form_id, user_added, indeks, nazwa, ilosc, jednostka, link, cena, koszt_wysylki, uwagi) values (?,?,?,?,?,?,?,?,?,?)");

      foreach ($produkty as $key => $value) {

        if(!$produkty[$key]['koszt_wysylki'] > 0){
          $produkty[$key]['koszt_wysylki'] = 0;
        }
        
        $query->execute([$id, $data['initials'], $produkty[$key]['indeks'], $produkty[$key]['nazwa'], $produkty[$key]['ilosc'], $produkty[$key]['jednostka'], $produkty[$key]['link'], $produkty[$key]['cena'], $produkty[$key]['koszt_wysylki'], $produkty[$key]['uwagi']]);

      }

      $sql = null;
      $query = null;

    }

    catch(PDOException $err){
      exit(http_response_code( 500 ));
    }


    break;

  case 'updateFormData':

    $id = $_GET['id'];
    $user_modify = $_GET['user_modify'];

    $data = (array) json_decode(file_get_contents('php://input'));

    foreach ($data['produkty'] as $key => $value) {
      $produkty[$key] = (array) $value;
    }

    try {
    $sql = $pdo->prepare("UPDATE orders_form SET date_modified = now(), user_modify=?, ordered_by=?, initials=?, email=?, rodzaj=?, dzial=?, cel=?, firma=?, kontakt_osoba=?, kontakt_email=?, kontakt_telefon=? where id = ?");

    $sql->execute([$user_modify, $data['ordered_by'], $data['initials'], $data['email'], $data['rodzaj'], $data['dzial'], $data['cel'], $data['firma'], $data['kontakt_osoba'], $data['kontakt_email'], $data['kontakt_telefon'], $id]);

    // $id = $pdo->lastInsertId();
    // echo $id;
    // var_dump($produkty);

    $query = $pdo->prepare("UPDATE orders_produkty SET indeks=?, nazwa=?, ilosc=?, jednostka=?, link=?, cena=?, koszt_wysylki=?, uwagi=? where id = ?");

      foreach ($produkty as $key => $value) {

        if(!$produkty[$key]['koszt_wysylki'] > 0){
          $produkty[$key]['koszt_wysylki'] = 0;
        }
        
        $query->execute([$produkty[$key]['indeks'], $produkty[$key]['nazwa'], $produkty[$key]['ilosc'], $produkty[$key]['jednostka'], $produkty[$key]['link'], $produkty[$key]['cena'], $produkty[$key]['koszt_wysylki'], $produkty[$key]['uwagi'], $produkty[$key]['id']]);

      }

      $sql = null;
      $query = null;

    }

    catch(PDOException $err){
      exit(http_response_code( 500 ));
    }


    break;

  case 'getAllOrders':

    try{
      $sql = $pdo->prepare("SELECT * FROM orders_form");

      $sql->execute([]);

      $arr = $sql->fetchAll(PDO::FETCH_ASSOC);

      $query = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach ($arr as $key => $value) {
        $query->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $query->fetchAll(PDO::FETCH_ASSOC);
      }

      if(!$arr) exit(http_response_code( 500 ));

      echo json_encode($arr);

      $sql = null;
      $query = null;
    }
    catch(PDOException $err){exit(http_response_code( 500 ));}

    break;

  case 'getOrder':

    $id = $_GET['id'];

    try {
      $query = $pdo->prepare("SELECT * FROM orders_form WHERE id = ?");

      $query->execute([$id]);

      $arr = $query->fetchAll(PDO::FETCH_ASSOC);

      if(!$arr) exit(http_response_code( 500 ));

      $sql = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach($arr as $key => $value){
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      echo json_encode($arr);

      $sql = null;
      $query = null;
    }
    catch(PDOException $err){exit(http_response_code( 500 ));}

    break;


  case 'editForm':

    $id = $_GET['id'];

    try {
      $query = $pdo->prepare("SELECT * FROM orders_form WHERE id = ?");

      $query->execute([$id]);

      $arr = $query->fetchAll(PDO::FETCH_ASSOC);

      if(!$arr) exit(http_response_code( 500 ));

      $sql = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach($arr as $key => $value){
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      echo json_encode($arr);

      $sql = null;
      $query = null;
    }
    catch(PDOException $err){exit(http_response_code( 500 ));}

    break;


  case "updateStatus":

    $id = $_GET['id'];

    

    break;

  default:

    echo "lol";

    break;

}


?>