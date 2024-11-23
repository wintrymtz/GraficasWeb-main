import * as THREE from "../three.module.js";

export class Animator {
    //type
    //0 - moneda 
    //1 - item
    //2 - estrella

    constructor(mixer, animations) {

        this.mixer = mixer;
        this.animations = animations;
        this.currentState = 'idle';

        this.isJumping = false;


        this.mixer.addEventListener('finished', (event) => {
            if (this.isJumping) {
                console.log('Salto terminado', event);
                this.isJumping = false;
                this.currentState = 'idle';
            }

        });
    }

    update() {
        if (this.mixer) {
            this.mixer.update(0.03);
        }
    }

    jump(animationIndex) {
        if (this.currentState == 'jump') {
            return;
        }
        this.currentState = 'jump';
        this.action = this.mixer.clipAction(this.animations[animationIndex]);
        this.action.setLoop(THREE.LoopOnce);
        // action.clampWhenFinished = true;
        // action.enable = true;
        this.action.play();
    }

    move(animationIndex) {
        // console.log('intenado entrar:', this.currentState);
        if (this.currentState == 'move' || this.currentState == 'jump') {
            return;
        }
        console.log('entró--------------------------------------:');
        this.currentState = 'move';
        this.action = this.mixer.clipAction(this.animations[animationIndex]);
        this.action.setLoop(THREE.LoopRepeat);
        // action.clampWhenFinished = true;
        // action.enable = true;
        this.action.play();
    }

    setState(state) {

        // console.log('estado:', this.currentState);

        if (this.isJumping) {
            return;
        }

        if (state == 'jump') {
            this.mixer.stopAllAction();
            this.isJumping = true;
            this.jump(0);
            return;

        }
        if (state == 'move') {
            this.move(1);
            return;
        }

        if (state == 'idle') {
            this.mixer.stopAllAction();
            this.currentState = 'idle';
        }
    }

}
