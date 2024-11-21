CREATE DATABASE gwc;
USE gwc;

CREATE TABLE gamedata (
   ID INT PRIMARY KEY AUTO_INCREMENT,
   Jugador VARCHAR(50) UNIQUE,
   Contrasena VARCHAR(20),
   Puntuacion BIGINT,
   Tiempo TIME
);

INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player0", "pass01", 10, '00:01:00');
INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player1", "pass01", 20, '00:02:00');
INSERT INTO gamedata (Jugador, Contrasena, Puntuacion, Tiempo) VALUES ("Player2", "pass01", 50, '00:01:30');

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
SELECT (@row_number := @row_number + 1) AS Posicion, Jugador, Tiempo FROM gamedata ORDER BY Tiempo ASC;
END //
DELIMITER ;


CALL StoryMode;
CALL TimeTrial;

TRUNCATE TABLE gamedata;
