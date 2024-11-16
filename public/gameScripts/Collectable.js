import * as THREE from "../three.module.js";
import { GameManager } from "./gameManager.js";

export class Collectable {
    //type
    //0 - moneda 
    //1 - item
    //2 - estrella

    constructor(type, collision) {

        this.name = 'unamed';
        this.type = type;
        this.collision = collision;
        this.isCollected = false;
        this.isVisible = true;
    }

    update(scene) {
        if (this.isCollected) {
            if (this.isVisible) {
                scene.remove(this.collision.object3D);
                this.isVisible = false;
            }
            return;
        }

        if (this.collision.isTriggered) {
            this.isCollected = true;
            this.collect();
        }
    }

    collect() {
        const sound = new Audio('./recursos/sound/coin2.wav');
        sound.play();

        this.isCollected = true;
        const gameManager = new GameManager();
        console.log('Collectable: se collectó')
        gameManager.itemCollected(this.type);
    }
}
