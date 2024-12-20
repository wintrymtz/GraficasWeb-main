<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$servername = "localhost";
$username = "root";
$password = "Guillermo2004.";
$dbname = "gcw";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("No se pudo conectar: " . $conn->connect_error);
}

// Consultas
$sql = "SELECT * FROM gamedata";
$SP1 = "CALL StoryMode";
$SP2 = "CALL TimeTrial";

// Resultados
$result = $conn->query($sql);
$resultSP1 = $conn->query($SP1);
while ($conn->next_result()) {
    $conn->store_result();
}
$resultSP2 = $conn->query($SP2);

// Estructuras de datos
$playerdata = array();
$playerdataSM = array();
$playerdataTT = array();

// Procesar resultados generales
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $player = array(
            "Jugador" => $row['Jugador'],
            "Contrasena" => $row['Contrasena'],
            "Puntuacion" => $row['Puntuacion'],
            "Tiempo" => $row['Tiempo'],
        );
        array_push($playerdata, $player);
    }
}

// Procesar resultados del modo historia
if ($resultSP1->num_rows > 0) {
    while ($row = $resultSP1->fetch_assoc()) {
        $player = array(
            "Posicion" => $row['Posicion'],
            "Jugador" => $row['Jugador'],
            "Puntuacion" => $row['Puntuacion'],
        );
        array_push($playerdataSM, $player);
    }
}

// Procesar resultados del modo contrarreloj
if ($resultSP2->num_rows > 0) {
    while ($row = $resultSP2->fetch_assoc()) {
        $player = array(
            "Posicion" => $row['Posicion'],
            "Jugador" => $row['Jugador'],
            "Tiempo" => $row['Tiempo'],
        );
        array_push($playerdataTT, $player);
    }
}

// Construir respuesta JSON
$data = array(
    "general" => $playerdata,       // Datos generales
    "storyMode" => $playerdataSM,   // Datos del modo historia
    "timeTrial" => $playerdataTT    // Datos del modo contrarreloj
);

echo json_encode($data);

$conn->close();


?>