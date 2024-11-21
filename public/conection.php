<?php

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gcw";

$conn = new mysqli($servername, $username, $password , $dbname);

if($conn->connect_error) {
    die("No se pudo conectar".$conn->connect_error);
}

$sql = "SELECT * from gamedata";
$SP1 = "CALL StoryMode";
// $SP2 = "CALL TimeTrial";
$result = $conn->query($sql);
$resultSP1 = $conn->query($SP1);
// $resultSP2 = $conn->query($SP2);

$playerdata = array();
$playerdataSM = array();
$playerdataTT = array();

if($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $player = array(
            "Jugador" => $row['Jugador'],
            "Contrasena" => $row['Contrasena'],
            "Puntuacion" => $row['Puntuacion'], 
            "Tiempo" => $row['Tiempo'], 
        );
        array_push($playerdata, $player);
    }

    echo json_encode($playerdata);

}
else {
    echo "sin resultados";
}

if($resultSP1->num_rows > 0) {

    while($row = $resultSP1->fetch_assoc()) {
        $player = array(
            "Posicion" => $row['Posicion'],
            "Jugador" => $row['Jugador'],
            "Puntuacion" => $row['Puntuacion'],
        );
        array_push($playerdataSM, $player);
    }

    echo json_encode($playerdataSM);

}
else {
    echo "sin resultados";
}



if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = file_get_contents("php://input");
    $user = json_decode($data, true);
    if ($user === null){
        echo json_encode(["error"=>"Error al decodificar JSON."]);
        exit();
    }

    echo json_encode($user);

    $Jugador = $user['Jugador'];
    $Contrasena = $user['Contrasena'];
    $Puntuacion = $user['Puntuacion'];
    $Tiempo = $user['Tiempo'];

    $insertar = "INSERT INTO gamedata VALUES ('$Jugador', '$Contrasena', '$Puntuacion', '$Tiempo')";
    $resultado = mysqli_query($conn, $insertar);
}

$conn->close();


?>