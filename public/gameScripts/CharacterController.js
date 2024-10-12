import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";
import socket from "./socket-connection.js";
import { Collider } from "./Colliders.js";

export class CharacterController {

    constructor(Object3d, camera) {
        this.Object3d = Object3d;
        this.camera = camera;
        this.input = new InputController();
        this.velocity = 40;
        this.currentSpeed = 0;

        this.forward = new THREE.Vector3(0, 0, 1);
        this.left = new THREE.Vector3(0, 0, 0);

        this.camForward = new THREE.Vector3(0, 0, 1);
        this.camLeft = new THREE.Vector3(0, 0, 0);

        this.left.copy(this.forward);
        this.left.cross(Object3d.up);

        this.camLeft.copy(this.camForward);
        this.camLeft.cross(Object3d.up);

        // console.log(this.left);

        const dir = new THREE.Vector3(1, 2, 0);

    }

    setCollider(col) {
        this.col = col;
    }


    Move() {

    }

    checkCollisions(objCol, box) {

        if (box.intersectsBox(objCol.boxBB)) {
            console.log('collides');
            return true;
        }
        return false;
    }

    update(delta, keyPressed, objCol) {

        //Obtenemos la posicion actual y el movimiento generado por el controlador
        let currentPosition = this.Object3d.position.clone();
        let move = this.getMovement(delta);

        //Se añade el movimiento a la posicion actual para calcular la siguiente posicion
        let newPos = currentPosition.clone().add(move);

        //Se crea una copia de la geometría y se crea un box3 pero en la siguiente posicion 
        let tentativeObject = this.Object3d.clone();
        tentativeObject.position.copy(newPos);
        let box = new THREE.Box3().setFromObject(tentativeObject);

        //se recalcula la forma
        box.copy(tentativeObject.geometry.boundingBox)
            .applyMatrix4(tentativeObject.matrixWorld);

        if (this.checkCollisions(objCol, box)) {
            this.Object3d.position.copy(currentPosition);
        } else {
            this.Object3d.position.copy(newPos);
        }

        this.updateForward(move);
    }

    getMovement(delta) {
        let keys = this.input.getKeys();

        let movement = new THREE.Vector3();

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
        return movement;

    }


    updateForward(movement) {
        if (!movement.equals(new THREE.Vector3(0, 0, 0))) {

            let nextPos = new THREE.Vector3();
            nextPos.copy(this.Object3d.position);
            nextPos.add(movement);
            this.Object3d.lookAt(nextPos);
            let newForward = new THREE.Vector3(0, 0, 0);
            newForward.set(
                nextPos.x - this.Object3d.position.x,
                nextPos.y - this.Object3d.position.y,
                nextPos.z - this.Object3d.position.z,
            ).normalize();
            // console.log(this.forward);
            this.forward.set(newForward.x, newForward.y, newForward.z);

            socket.emit("updatePlayer", this.Object3d.position, 1);
        }
    }

}