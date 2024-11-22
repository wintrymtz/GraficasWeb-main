
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
        this.amountCoins = 10;
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
        localStorage.removeItem('score');
        localStorage.removeItem('level');
        localStorage.removeItem('gameMode');


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
                break;
            case 1: //item
                break;
            case 2: // STAR
                console.log('Ganaste');
                openFacebookPrompt();
                this.finishGame();
                break;
            case 3:
                this.damage(1);
                break;
        }
    }

    finishGame() {
        if (this.alive) { //el jugador ha ganado
            localStorage.setItem('score', this.points);
            localStorage.setItem('level', this.level);
            localStorage.setItem('gameMode', this.gameMode);

        } else { //el jugador ha perdido

        }
    }

    damage(damage) {
        this.vida -= damage;
        this.updateVida(this.vida);
        if (this.vida <= 0) {
            this.alive = false;
            this.vida = 0;
            this.finishGame();
        }
    }

    darVida(vida) {

        if (this.vida < 3) {
            this.vida += vida;
            this.updateVida(this.vida);
        }

    }

}
