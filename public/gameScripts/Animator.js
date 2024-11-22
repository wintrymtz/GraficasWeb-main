import * as THREE from "../three.module.js";

export class Animator {
    //type
    //0 - moneda 
    //1 - item
    //2 - estrella

    constructor(mixer, animations) {

        this.mixer = mixer;
        this.animations = animations;
    }

    update() {
        if (this.mixer) {
            this.mixer.update(0.03);
        }
    }

    jump(animationIndex) {
        this.mixer.stopAllAction();
        this.action = this.mixer.clipAction(this.animations[animationIndex]);
        this.action.setLoop(THREE.LoopOnce);
        // action.clampWhenFinished = true;
        // action.enable = true;
        this.action.play();
    }

    move(animationIndex) {
        this.mixer.stopAllAction();
        this.action = this.mixer.clipAction(this.animations[animationIndex]);
        this.action.setLoop(THREE.LoopRepeat);
        // action.clampWhenFinished = true;
        // action.enable = true;
        this.action.play();
    }
}
