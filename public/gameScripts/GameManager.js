
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
            document.getElementById('vida').src = "./recursos/UI/1.png"
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

        GameManager.instance = this; // Guarda la única instancia
    }

    update() {
        if (this.isFinished) {
            finishGame(this.playerAlive);
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
                this.finishGame
                break;
        }
    }

    finishGame(alive) {
        if (alive) { //el jugador ha ganado
            localStorage.setItem('score', this.points);
            localStorage.setItem('level', this.level);
            localStorage.setItem('gameMode', this.gameMode);

        } else { //el jugador ha perdido

        }
    }

}
