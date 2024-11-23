<?php
// Habilitar visualización de errores para depuración en desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurar encabezados para la respuesta JSON y CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;
}

// Leer el cuerpo de la solicitud
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validar datos recibidos
if (!isset($data['Jugador']) || !isset($data['Puntuacion'])) {
    echo json_encode(["status" => "error", "message" => "Datos inválidos."]);
    exit;
}

$jugador = $data['Jugador'];
$puntuacion = $data['Puntuacion'];

// Validar contenido de los datos
if (empty($jugador) || !is_numeric($puntuacion)) {
    echo json_encode(["status" => "error", "message" => "Jugador o puntuación no válidos."]);
    exit;
}

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "Guillermo2004.";
$dbname = "gcw";

// Crear conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error de conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit;
}

// Preparar la consulta SQL
$stmt = $conn->prepare("UPDATE gamedata SET Puntuacion = ? WHERE Jugador = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("is", $puntuacion, $jugador);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Puntuación actualizada correctamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al ejecutar la consulta: " . $stmt->error]);
}

// Cerrar recursos
$stmt->close();
$conn->close();

?>
