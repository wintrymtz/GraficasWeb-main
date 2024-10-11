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

        this.left.copy(this.forward);
        this.left.cross(Object3d.up);
        console.log(this.left);
    }

    Move() {

    }

    update(delta, keyPressed) {
        let keys = this.input.getKeys();


        let newPos = new THREE.Vector3(0, 0, 0);
        let movement = new THREE.Vector3(0, 0, 0);
        newPos.copy(this.Object3d.position);

        if (keys.forward) {
            console.log('forward');
            movement.add(this.forward.clone().multiplyScalar(this.velocity));
        }
        if (keys.backward) {
            console.log('backward');
            movement.add(this.forward.clone().multiplyScalar(-this.velocity));
        }
        if (keys.right) {
            console.log('backward');
            movement.add(this.left.clone().multiplyScalar(this.velocity));
        }
        if (keys.left) {
            console.log('backward');
            movement.add(this.left.clone().multiplyScalar(-this.velocity));
        }

        socket.emit("updatePlayer", this.Object3d.position, 1);

        // if (keys.left) {
        //     result.copy(this.left);
        //     console.log('left');
        //     this.currentSpeed = -this.velocity;
        // } else if (keys.right) {
        //     result.copy(this.left);
        //     console.log('right');
        //     this.currentSpeed = this.velocity;
        // } else this.currentSpeed = 0;

        // console.log(this.currentSpeed);

        // if (keys.left) {
        //     console.log('left');
        //     this.currentSpeed = this.velocity;
        // } else if (keys.right) {
        //     console.log('right');
        //     this.currentSpeed = -this.velocity;
        // } else this.currentSpeed = 0;

        // if (keys.space) {
        //     console.log('space');
        // }

        // if (keys.forward || keys.backward) {
        //     result.setX(result.x * this.currentSpeed);
        //     result.setY(result.y * this.currentSpeed);
        //     result.setZ(result.z * this.currentSpeed);
        //     newPos.add(result);
        // }

        // if (keys.left || keys.right) {
        //     result.setX(result.x * this.currentSpeed);
        //     result.setY(result.y * this.currentSpeed);
        //     result.setZ(result.z * this.currentSpeed);
        //     newPos.add(result);
        // }
        newPos.add(movement);
        this.Object3d.position.set(newPos.x, newPos.y, newPos.z);

    }
}