
export class GameManager {

    constructor() {

        if (GameManager.instance) {
            return GameManager.instance; // Devuelve la instancia existente si ya fue creada
        }

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        this.gameMode = params.get('gameMode') || 'Fail';

        this.level = params.get('level') || 'Fail';
        this.difficulty = localStorage.getItem('difficulty') || 'normal';
        this.amountCoins = 0;
        this.currentCoins = 0;
        console.log(this.difficulty);
        if (this.difficulty === "hard") {
            document.getElementById('vida').src = "./recursos/UI/1.png";
            this.vida = 1;
        }
        this.isFinished = false;
        this.playerAlive = true;
        this.points = 0;
        this.musicVolume = (localStorage.getItem("musicVolume") || 50) / 100;
        console.log(this.musicVolume)
        this.soundVolume = 1;
        this.extraVelocity = 2;
        //localStorage.removeItem('score');
        localStorage.removeItem('level');
        localStorage.removeItem('gameMode');
        console.log('nivel: ', this.level)
        switch (this.level) {
            case "1":
                this.amountCoins = 12;
                break;
            case "2":
                this.amountCoins = 8;
                break;
            case "3":
                this.amountCoins = 16;
                break;
        }

        this.gravityItemStatus = false;


        this.canBeDamaged = true;

        this.vida = 3;
        this.updateVida(this.vida);

        GameManager.instance = this; // Guarda la única instancia
    }

    update() {
        if (this.isFinished) {
            finishGame(this.playerAlive);
        }
    }

    updateVida(vida) {
        switch (vida) {
            case 0:
                document.getElementById('vida').src = "./recursos/UI/0.png"
                break;
            case 1:
                document.getElementById('vida').src = "./recursos/UI/1.png"
                break;
            case 2:
                document.getElementById('vida').src = "./recursos/UI/2.png"
                break;
            case 3:
                document.getElementById('vida').src = "./recursos/UI/3.png"
                break;
        }
    }

    itemCollected(type) {
        switch (type) {
            case 0: //moneda
                this.currentCoins += 1;
                let currentTime = document.getElementById("time").textContent;
                this.points += Math.round(100 / currentTime);
                document.getElementById("score").textContent = this.points;
                console.log('obtuviste una moneda');

                if (this.gameMode == 1) {
                    console.log(this.currentCoins, this.amountCoins)
                    if (this.currentCoins >= this.amountCoins) {
                        this.finishGame();
                    }
                }


                break;
            case 1: //item
                break;
            case 2: // STAR
                this.finishGame();
                console.log('Ganaste');
                openFacebookPrompt();
                break;
            case 3: //daño
                this.damage(1);
                break;

            case 4:// vida
                this.darVida(1);
                break;

            case 5://inmunidad
                this.canBeDamaged = false;
                break;

            case 6:// menos gravedad
                this.gravityItemStatus = true;
                break;
        }
    }


    saveScoreToDatabase(points) {
        const playerName = localStorage.getItem('playerName'); // Asegúrate de que el jugador haya iniciado sesión correctamente

        if (!playerName) {
            console.error("Error: No se encontró el nombre del jugador en localStorage.");
            return;
        }

        fetch('http://localhost/gcw/SaveScore.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Jugador: localStorage.getItem('playerName'),
                Puntuacion: points,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === 'error') {
                    console.error('Error en la respuesta del servidor:', data.message);
                } else {
                    console.log('Puntos actualizados exitosamente:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error al actualizar los puntos:', error);
            });



    }

    finishGame() {
        if (this.playerAlive) {
            localStorage.setItem('score', this.points);
            localStorage.setItem('level', this.level);
            localStorage.setItem('gameMode', this.gameMode);

            if (this.gameMode == 0) { //modo hisotira

            } else if (this.gameMode == 1) {  //modo contrarreloj
                alert('se acabó el contrarreloj');
                window.location.href = "./MainMenu2.html";
            }
            this.saveScoreToDatabase(this.points);
        } else {
            window.location.reload();
        }


    }

    damage(damage) {
        if (this.canBeDamaged == false) {
            return false;
        }
        this.vida -= damage;
        this.updateVida(this.vida);
        if (this.vida <= 0) {
            this.playerAlive = false;
            this.vida = 0;
            this.finishGame();
        }
        return true;
    }

    darVida(vida) {

        if (this.vida < 3) {
            this.vida += vida;
            this.updateVida(this.vida);
        }

    }

}
