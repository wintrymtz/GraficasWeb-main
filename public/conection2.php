<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Responde al preflight con éxito
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gcw";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "No se pudo conectar: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "Error al decodificar JSON."]);
    exit();
}

if ($method === 'POST') {
    $action = $data['action'];
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    if ($action === 'login') {
        $query = "SELECT * FROM gamedata WHERE Jugador='$username' AND Contrasena='$password'";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            echo json_encode(["success" => "Inicio de sesión exitoso.", "user" => $username]);
        } else {
            echo json_encode(["error" => "Credenciales incorrectas."]);
        }
    } elseif ($action === 'register') {
        $checkQuery = "SELECT * FROM gamedata WHERE Jugador='$username'";
        $checkResult = $conn->query($checkQuery);

        if ($checkResult->num_rows > 0) {
            echo json_encode(["error" => "El usuario ya existe."]);
        } else {
            $query = "INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ('$username', '$password', 0, '59:59:59')";
            if ($conn->query($query) === TRUE) {
                echo json_encode(["success" => "Registro exitoso.", "user" => $username]);
            } else {
                echo json_encode(["error" => "Error al registrar: " . $conn->error]);
            }
        }
    } else {
        echo json_encode(["error" => "Acción no válida."]);
    }
}

$conn->close();
?>
