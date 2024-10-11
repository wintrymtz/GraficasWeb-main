import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";
import socket from "./socket-connection.js";

export class CharacterController {

    constructor(Object3d, camera) {
        this.Object3d = Object3d;
        this.camera = camera;
        this.input = new InputController();
        this.velocity = 1;
        this.currentSpeed = 0;

        this.forward = new THREE.Vector3(0, 0, 1);
        this.left = new THREE.Vector3(0, 0, 0);

        this.camForward = new THREE.Vector3(0, 0, 1);
        this.camLeft = new THREE.Vector3(0, 0, 0);

        this.left.copy(this.forward);
        this.left.cross(Object3d.up);

        this.camLeft.copy(this.camForward);
        this.camLeft.cross(Object3d.up);

        console.log(this.left);

        const dir = new THREE.Vector3(1, 2, 0);

    }

    Move() {

    }

    update(delta, keyPressed) {
        let keys = this.input.getKeys();


        let newPos = new THREE.Vector3();
        let movement = new THREE.Vector3();
        newPos.copy(this.Object3d.position);

        if (keys.forward) {
            // console.log('forward');
            movement.add(this.camForward.clone().multiplyScalar(this.velocity * delta));
        }
        if (keys.backward) {
            // console.log('backward');
            movement.add(this.camForward.clone().multiplyScalar(-this.velocity * delta));
        }
        if (keys.right) {
            // console.log('right');
            movement.add(this.camLeft.clone().multiplyScalar(this.velocity * delta));
        }
        if (keys.left) {
            // console.log('left');
            movement.add(this.camLeft.clone().multiplyScalar(-this.velocity * delta));
        }

        if (!movement.equals(new THREE.Vector3(0, 0, 0))) {
            newPos.add(movement);
            this.Object3d.lookAt(newPos);
            let newForward = new THREE.Vector3(0, 0, 0);
            newForward.set(
                newPos.x - this.Object3d.position.x,
                newPos.y - this.Object3d.position.y,
                newPos.z - this.Object3d.position.z,
            ).normalize();
            console.log(this.forward);
            this.forward.set(newForward.x, newForward.y, newForward.z);

            socket.emit("updatePlayer", this.Object3d.position, 1);
        }

        this.Object3d.position.set(newPos.x, newPos.y, newPos.z);
    }
}