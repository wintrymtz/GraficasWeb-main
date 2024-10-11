import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";

export class CharacterController {

    constructor(Object3d, camera) {
        this.Object3d = Object3d;
        this.camera = camera;
        this.input = new InputController();
        this.velocity = 1;
        this.forward = new THREE.Vector3(0, 0, 1);
    }

    Move() {

    }

    update(delta, keyPressed) {
        let keys = this.input.getKeys();

        if (keys.forward) {
            let newPos = new THREE.Vector3(0, 0, 0);
            let result = new THREE.Vector3(0, 0, 0);
            newPos.copy(this.Object3d.position);
            result.copy(this.forward);
            result.setX(result.x * this.velocity);
            result.setY(result.y * this.velocity);
            result.setZ(result.z * this.velocity);
            newPos.add(result);

            this.Object3d.position.set(newPos.x, newPos.y, newPos.z);
            console.log('forward: '
                + result.x + ''
                + result.y + ''
                + result.z + '');
        }
        if (keys.backward) {
            console.log('backward');
            let newPos = new THREE.Vector3(0, 0, 0);
            let result = new THREE.Vector3(0, 0, 0);
            newPos.copy(this.Object3d.position);
            result.copy(this.forward);
            result.setX(result.x * -this.velocity);
            result.setY(result.y * -this.velocity);
            result.setZ(result.z * -this.velocity);
            newPos.add(result);

            this.Object3d.position.set(newPos.x, newPos.y, newPos.z);
            console.log('forward: '
                + result.x + ''
                + result.y + ''
                + result.z + '');
        }
        if (keys.left) {
            console.log('left');
        }
        if (keys.right) {
            console.log('right');
        }
        if (keys.space) {
            console.log('space');
        }
    }
}