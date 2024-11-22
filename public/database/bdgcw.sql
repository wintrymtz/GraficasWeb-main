CREATE DATABASE gwc;
USE gcw;

CREATE TABLE gamedata (
   ID INT PRIMARY KEY AUTO_INCREMENT,
   Jugador VARCHAR(50) UNIQUE,
   Contrasena VARCHAR(20),
   Puntuacion INT,
   Tiempo INT
);

INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player0", "pass01", 10, '60');
INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player1", "pass01", 20, '120');
INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player2", "pass01", 50, '90');
INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player3", "pass01", 2, '215999');
SELECT * FROM gamedata;

DELIMITER //
CREATE PROCEDURE StoryMode()
BEGIN
SET @row_number = 0;
SELECT (@row_number := @row_number + 1) AS Posicion, Jugador, Puntuacion FROM gamedata ORDER BY Puntuacion DESC;
END //
DELIMITER ;
DELIMITER //
CREATE PROCEDURE TimeTrial()
BEGIN
SET @row_number = 0;
SELECT (@row_number := @row_number + 1) AS Posicion, Jugador,  SEC_TO_TIME(Tiempo) AS Tiempo FROM gamedata ORDER BY Tiempo ASC;
END //
DELIMITER ;


CALL StoryMode;
CALL TimeTrial;

TRUNCATE TABLE gamedata;
