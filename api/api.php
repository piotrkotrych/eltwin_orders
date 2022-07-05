<?php
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");

date_default_timezone_set('Europe/Warsaw');

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


function addLog($form_id, $message, $user)
{
  try {
    global $pdo;
    global $dsn;
    global $options;
    $sql = $pdo->prepare("INSERT INTO orders_log (form_id, message, user) values (?,?,?)")->execute([$form_id, $message, $user]);
    // $pdo->execute();
  } catch (\Throwable $th) {
    echo $th->getMessage();
  }
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

    if (!$arr) exit(http_response_code(500));

    echo json_encode($arr[0]);

    $stmt = null;

    break;

  case 'getRodzajeDzialy':

    $stmt = $pdo->prepare("SELECT * FROM orders_rodzaje order by id asc");

    $stmt->execute([]);

    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("SELECT dzial FROM orders_dzialy WHERE rodzaj_id=:id order by id asc");

    foreach ($arr as $key => $val) {
      $stmt->execute(array(':id' => $key + 1));
      $arr[$key]["dzial"] = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    if (!$arr) exit(http_response_code(500));

    echo json_encode($arr);

    $stmt = null;

    break;

  case 'postFormData':

    $data = (array) json_decode(file_get_contents('php://input'));

    foreach ($data['produkty'] as $key => $value) {
      $produkty[$key] = (array) $value;
    }

    try {
      $sql = $pdo->prepare("INSERT INTO orders_form (user_added, waluta, ordered_by, initials, email, rodzaj, dzial, cel, firma, kontakt_osoba, kontakt_email, kontakt_telefon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

      $sql->execute([$data['initials'], $data['waluta'],  $data['ordered_by'], $data['initials'], $data['email'], $data['rodzaj'], $data['dzial'], $data['cel'], $data['firma'], $data['kontakt_osoba'], $data['kontakt_email'], $data['kontakt_telefon']]);

      $id = $pdo->lastInsertId();
      // echo $id;
      // var_dump($produkty);

      $query = $pdo->prepare("INSERT INTO orders_produkty (form_id, user_added, indeks, nazwa, ilosc, jednostka, link, cena, koszt_wysylki, uwagi) values (?,?,?,?,?,?,?,?,?,?)");

      foreach ($produkty as $key => $value) {

        if (!$produkty[$key]['koszt_wysylki'] > 0) {
          $produkty[$key]['koszt_wysylki'] = 0;
        }

        //check if produkty[$key]['cena'] has comma and change it to dot
        if (strpos($produkty[$key]['cena'], ',') !== false) {
          $produkty[$key]['cena'] = str_replace(',', '.', $produkty[$key]['cena']);
        }
        if (strpos($produkty[$key]['ilosc'], ',') !== false) {
          $produkty[$key]['ilosc'] = str_replace(',', '.', $produkty[$key]['ilosc']);
        }
        if (strpos($produkty[$key]['koszt_wysylki'], ',') !== false) {
          $produkty[$key]['koszt_wysylki'] = str_replace(',', '.', $produkty[$key]['koszt_wysylki']);
        }

        $query->execute([$id, $data['initials'], $produkty[$key]['indeks'], $produkty[$key]['nazwa'], $produkty[$key]['ilosc'], $produkty[$key]['jednostka'], $produkty[$key]['link'], $produkty[$key]['cena'], $produkty[$key]['koszt_wysylki'], $produkty[$key]['uwagi']]);
      }

      $sql = null;
      $query = null;

      addLog($id, "Utworzono nowe zamówienie", $data['initials']);

      echo $id;
    } catch (PDOException $err) {
      exit(http_response_code(500));
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
      $sql = $pdo->prepare("UPDATE orders_form SET date_modified = now(), waluta=?, user_modify=?, ordered_by=?, initials=?, email=?, rodzaj=?, dzial=?, cel=?, firma=?, kontakt_osoba=?, kontakt_email=?, kontakt_telefon=? where id = ?");

      $sql->execute([$data['waluta'], $user_modify, $data['ordered_by'], $data['initials'], $data['email'], $data['rodzaj'], $data['dzial'], $data['cel'], $data['firma'], $data['kontakt_osoba'], $data['kontakt_email'], $data['kontakt_telefon'], $id]);

      // $id = $pdo->lastInsertId();
      // echo $id;
      // var_dump($produkty);

      // $pdo->exec("DELETE FROM orders_produkty WHERE form_id = '$id'");

      $pdo->prepare("DELETE FROM orders_produkty WHERE form_id=?")->execute([$id]);
      foreach ($produkty as $key => $value) {

        if (!$produkty[$key]['koszt_wysylki'] > 0) {
          $produkty[$key]['koszt_wysylki'] = 0;
        }



        $query = $pdo->prepare("INSERT INTO orders_produkty (form_id, user_added, indeks, nazwa, ilosc, jednostka, link, cena, koszt_wysylki, uwagi) values (?,?,?,?,?,?,?,?,?,?)");

        $query->execute([$id, $data['initials'], $produkty[$key]['indeks'], $produkty[$key]['nazwa'], $produkty[$key]['ilosc'], $produkty[$key]['jednostka'], $produkty[$key]['link'], $produkty[$key]['cena'], $produkty[$key]['koszt_wysylki'], $produkty[$key]['uwagi']]);
      }


      $sql = null;
      $query = null;

      addLog($id, "Aktualizacja zamówienia", $data['initials']);
    } catch (PDOException $err) {
      echo $err->getMessage();
      exit(http_response_code(500));
    }


    break;

  case 'getAllOrders':

    try {
      $sql = $pdo->prepare("SELECT * FROM orders_form");

      $sql->execute([]);

      $arr = $sql->fetchAll(PDO::FETCH_ASSOC);

      $query = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach ($arr as $key => $value) {
        $query->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $query->fetchAll(PDO::FETCH_ASSOC);
      }

      if (!$arr) exit(http_response_code(500));

      echo json_encode($arr);

      $sql = null;
      $query = null;
    } catch (PDOException $err) {
      exit(http_response_code(500));
    }

    break;

  case 'getOrder':

    $id = $_GET['id'];

    try {
      $query = $pdo->prepare("SELECT * FROM orders_form WHERE id = ?");

      $query->execute([$id]);

      $arr = $query->fetchAll(PDO::FETCH_ASSOC);

      if (!$arr) exit(http_response_code(500));

      $sql = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach ($arr as $key => $value) {
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      $sql = $pdo->prepare("SELECT * FROM orders_files WHERE form_id = ?");

      foreach ($arr as $key => $value) {
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['files'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      $sql = $pdo->prepare("SELECT * FROM orders_log WHERE form_id = ? order by date_added desc");

      foreach ($arr as $key => $value) {
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['log'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      $sql = $pdo->prepare("SELECT * FROM orders_invoice WHERE form_id = ? order by date_added desc");

      foreach ($arr as $key => $value) {
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['faktury'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      echo json_encode($arr);

      $sql = null;
      $query = null;
    } catch (PDOException $err) {
      exit(http_response_code(500));
    }

    break;


  case 'editForm':

    $id = $_GET['id'];

    try {
      $query = $pdo->prepare("SELECT * FROM orders_form WHERE id = ?");

      $query->execute([$id]);

      $arr = $query->fetchAll(PDO::FETCH_ASSOC);

      if (!$arr) exit(http_response_code(500));

      $sql = $pdo->prepare("SELECT * FROM orders_produkty WHERE form_id = ?");

      foreach ($arr as $key => $value) {
        $sql->execute([$arr[$key]['id']]);
        $arr[$key]['produkty'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      echo json_encode($arr);

      $sql = null;
      $query = null;
    } catch (PDOException $err) {
      exit(http_response_code(500));
    }

    break;


  case "updateStatus":

    $data = (array) json_decode(file_get_contents('php://input'));

    try {
      if ($data['level1']) {
        $sql = $pdo->prepare("UPDATE orders_form SET level1=?, level1user=?, level1date=now(), status=? WHERE id = ?");
        $sql->execute([$data['level1'], $data['level1user'], $data['status'], $data['id']]);

        addLog($data['id'], "Zaakceptowano na pierwszym poziomie", $data['user']);
      } else if ($data['level2']) {
        $sql = $pdo->prepare("UPDATE orders_form SET level2=?, level2user=?, level2date=now(), status=? WHERE id = ?");
        $sql->execute([$data['level2'], $data['level2user'], $data['status'], $data['id']]);

        addLog($data['id'], "Zaakceptowano na drugim poziomie", $data['user']);
      }

      $sql = null;
      $query = null;
    } catch (PDOException $err) {
      exit(http_response_code(500));
    }

    break;

  case 'uploadFiles':

    $id = $_GET['id'];
    $user = $_GET['user'];
    $time = date("Y-m-d H:i:s");

    $addedFiles = array();

    if (count($_FILES) > 0) {
      foreach ($_FILES as $key => $value) {
        $filename = $id . '_' . $_FILES[$key]['name'];
        $size = round($_FILES[$key]['size'] / 1024);
        $type = $_FILES[$key]['type'];

        // $date_modified = $_FILES[$key]['date_modified'];
        if (move_uploaded_file($_FILES[$key]['tmp_name'], 'c:/wamp64/www/eltwin_orders/upload/' . $filename)) {
          try {
            $sql = $pdo->prepare("INSERT INTO orders_files (form_id, user, filename, type, size) VALUES (?,?,?,?,?)");
            $sql->execute([$id, $user, $filename, $type, $size]);
            $sql = null;

            $addedFiles[$key]['id'] = $pdo->lastInsertId();
            $addedFiles[$key]['user'] = $user;
            $addedFiles[$key]['type'] = $type;
            $addedFiles[$key]['size'] = $size;
            $addedFiles[$key]['filename'] = $filename;
            $addedFiles[$key]['date_added'] = $time;

            addLog($id, "Dodano plik " . $filename, $user);
          } catch (PDOException $err) {
            // exit(http_response_code( 500 ));
            echo "Error: " . $err->getMessage();
          }
        } else {
          exit(http_response_code(500));
        }

        if (count($addedFiles) > 0) {
          echo json_encode($addedFiles);
        } else {
          exit(http_response_code(500));
        }
      }
    }



    break;

  case 'deleteFile':

    $data = (array) json_decode(file_get_contents('php://input'));

    // var_dump($data);

    $table = $data['table'];

    try {
      $sql = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
      $sql->execute([$data['id']]);
      $sql = null;
      if (unlink('c:/wamp64/www/eltwin_orders/upload/' . $data['name']) && $table = 'orders_files') {
        addLog($data['form_id'], "Skasowano plik " . $data['name'], $data['user']);
        exit(http_response_code(200));
      } else if (unlink('c:/wamp64/www/eltwin_orders/upload/' . $data['name']) && $table = 'orders_invoice') {
        addLog($data['form_id'], "Skasowano fakturę " . $data['name'], $data['user']);
        exit(http_response_code(200));
      }
    } catch (PDOException $e) {
      exit(http_response_code(500));
      // echo 'Error: ' . $e->getMessage();
    }

    break;

  case 'uploadInvoice':

    $parser = new \Smalot\PdfParser\Parser();

    $id = $_GET['id'];
    $user = $_GET['user'];
    $time = date("Y-m-d H:i:s");
    $pro = intval($_GET['pro']);

    $addedFiles = array();
    $invoice_info = array();

    if (count($_FILES) > 0) {
      foreach ($_FILES as $key => $value) {
        $filename = $id . '_' . $_FILES[$key]['name'];
        $size = round($_FILES[$key]['size'] / 1024);
        $type = $_FILES[$key]['type'];

        if ($pro === 0) {
          if (move_uploaded_file($_FILES[$key]['tmp_name'], 'c:/wamp64/www/eltwin_orders/upload/' . $filename)) {
            try {
              $sql = $pdo->prepare("INSERT INTO orders_invoice (form_id, rodzaj, user, filename, type, size) VALUES (?,?,?,?,?,?)");
              $sql->execute([$id, $pro, $user, $filename, $type, $size]);
              $sql = null;

              $addedFiles[$key]['id'] = $pdo->lastInsertId();
              $addedFiles[$key]['user'] = $user;
              $addedFiles[$key]['type'] = $type;
              $addedFiles[$key]['size'] = $size;
              $addedFiles[$key]['filename'] = $filename;
              $addedFiles[$key]['date_added'] = $time;
              $addedFiles[$key]['rodzaj'] = $pro;

              addLog($id, "Dodano fakturę proformę " . $filename, $user);
            } catch (PDOException $err) {
              // exit(http_response_code( 500 ));
              echo "Error: " . $err->getMessage();
            }
          } else {
            exit(http_response_code(500));
          }

          if (count($addedFiles) > 0) {
            echo json_encode($addedFiles);
          } else {
            exit(http_response_code(500));
          }
        } else {

          // if($type == 'application/pdf'){

          //   $pdf = $parser->parseFile($_FILES[$key]['tmp_name']);
          //   $text = $pdf->getText();
          //   $text = str_replace(' ','',$text);
          //   $text = str_replace('-','',$text);
          //   $text = str_replace(array("\r", "\n"),'',$text);
          // }

          if (move_uploaded_file($_FILES[$key]['tmp_name'], 'c:/wamp64/www/eltwin_orders/upload/' . $filename)) {
            try {
              $sql = $pdo->prepare("INSERT INTO orders_invoice (form_id, rodzaj, user, filename, type, size) VALUES (?,?,?,?,?,?)");
              $sql->execute([$id, $pro, $user, $filename, $type, $size]);
              $sql = null;

              // if($type == 'application/pdf'){
              //   preg_match_all('/\d{10,}/', $text, $nip);
              //   foreach ($nip[0] as $key => $value){
              //     if($value == '9552320960' || strlen($value) > 10){
              //       unset($nip[0][$key]);
              //     }
              //   }
              //   $addedFiles[$key]['nip'] = $nip[0];

              //   preg_match_all('/\d{26,}/', $text, $nrb);
              //   foreach ($nrb[0] as $key => $value){
              //     if($value == '9552320960' || strlen($value) > 26){
              //       unset($nrb[0][$key]);
              //     }
              //   }
              //   $addedFiles[$key]['nrb'] = $nrb[0];

              //   preg_match_all('/[A-Z]{2}\d{26,}/', $text, $iban);
              //   foreach ($iban[0] as $key => $value){
              //     if($value == '9552320960' || strlen($value) > 28){
              //       unset($iban[0][$key]);
              //     }
              //   }
              //   $addedFiles[$key]['iban'] = $iban[0];
              // }

              $addedFiles[$key]['id'] = $pdo->lastInsertId();
              $addedFiles[$key]['user'] = $user;
              $addedFiles[$key]['type'] = $type;
              $addedFiles[$key]['size'] = $size;
              $addedFiles[$key]['filename'] = $filename;
              $addedFiles[$key]['date_added'] = $time;
              $addedFiles[$key]['rodzaj'] = $pro;

              addLog($id, "Dodano fakturę do zapłaty " . $filename, $user);
            } catch (PDOException $err) {
              // exit(http_response_code( 500 ));
              echo "Error: " . $err->getMessage();
            }
          } else {
            exit(http_response_code(500));
          }

          if (count($addedFiles) > 0) {
            echo json_encode($addedFiles);
          } else {
            exit(http_response_code(500));
          }
        }
      }
    }



    // $pdf    = $parser->parseFile('3.pdf');

    // $text = $pdf->getText();

    // $text = str_replace(' ','',$text);
    // $text = str_replace('-','',$text);
    // $text = str_replace(array("\r", "\n"),'',$text);

    // $invoice_info = array();
    // echo "<pre>";
    // // echo $text;

    // preg_match_all('/\d{10,}/', $text, $nip);
    // foreach ($nip[0] as $key => $value){
    //   if($value == '9552320960' || strlen($value) > 10){
    //     unset($nip[0][$key]);
    //   }
    // }
    // $invoice_info['nip'] = $nip[0];
    // preg_match_all('/\d{26,}/', $text, $nrb);
    // foreach ($nrb[0] as $key => $value){
    //   if($value == '9552320960' || strlen($value) > 26){
    //     unset($nrb[0][$key]);
    //   }
    // }
    // $invoice_info['nrb'] = $nrb[0];
    // preg_match_all('/[A-Z]{2}\d{26,}/', $text, $iban);
    // foreach ($iban[0] as $key => $value){
    //   if($value == '9552320960' || strlen($value) > 28){
    //     unset($iban[0][$key]);
    //   }
    // }
    // $invoice_info['iban'] = $iban[0];

    // print_r($invoice_info);
    // echo "</pre>";



    break;

  default:

    echo "lol";

    break;
}