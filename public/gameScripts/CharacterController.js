import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";
// import socket from "./socket-connection.js";
import { Collider } from "./Colliders.js";

export class CharacterController {

    constructor(Object3d, camera, type, collider) {
        this.Object3d = Object3d;
        this.camera = camera;
        this.input = new InputController(type);
        this.velocity = 60;
        this.currentSpeed = 0;
        this.gravity = true;
        this.gravitySpeed = 8;

        this.forward = new THREE.Vector3(1, 0, 0);
        this.left = new THREE.Vector3(0, 0, 0);
        this.currentYSpeedDown = 0;
        this.currentYSpeedUp = 0;

        this.camForward = new THREE.Vector3(0, 0, 1);
        if (this.camera) {
            this.camera.getWorldDirection(this.camForward);
        }
        this.camLeft = new THREE.Vector3(0, 0, 0);

        this.left.copy(this.forward);

        this.left.cross(Object3d.up);

        this.camLeft.copy(this.camForward);
        this.camLeft.cross(Object3d.up);

        this.isGrounded = false;
        this.canMove = true;

        this.floorDistanceTolerance = 1;
        this.canJump = true;
        this.isJumping = false;
        this.jumpForce = 150;


        //colisionador :)
        this.collider = collider;

        this.updateForwardY = false;

        // console.log(this.left);

        const dir = new THREE.Vector3(1, 2, 0);
        this.camForward.normalize();
        this.camForward.y = 0;
        // console.log(this.camForward);

    }

    setCollider(col) {
        this.col = col;
    }


    Move() {

    }

    //no usado
    checkCollisions(arrayCol, box) {

        if (box.intersectsBox(arrayCol.boxBB)) {
            // console.log('collides');
            return true;
        }
        return false;
    }

    update(delta, keyPressed, objCol) {

        //Obtenemos la posicion actual y el movimiento generado por el controlador
        let currentPosition = this.Object3d.position.clone();
        let move = this.getMovement(delta);
        this.updateForward(move);

        let gravity = this.applyGravity(delta);
        // console.log(this.currentYSpeedDown);
        move.add(gravity);

        //Se añade el movimiento a la posicion actual para calcular la siguiente posicion
        let newPos = currentPosition.clone().add(move);

        //Se crea una copia de la geometría y se crea un box3 pero en la siguiente posicion 
        let tentativeObject = this.Object3d.clone();
        tentativeObject.position.copy(newPos);
        let box = new THREE.Box3().setFromObject(tentativeObject);

        //solucion?
        box.applyMatrix4(tentativeObject.matrixWorld);
        box.setFromObject(tentativeObject);
        box = this.collider.setOffsets(box, tentativeObject.position, tentativeObject.quaternion);

        //se recalcula la forma
        // box.copy(tentativeObject.geometry.boundingBox)
        //     .applyMatrix4(tentativeObject.matrixWorld);


        let arrayObjCol = objCol;
        let floorPosition = this.checkVerticalCollision(box, arrayObjCol);
        if (floorPosition !== 0) {
            newPos.y = floorPosition;
        }

        if (this.isGrounded) {
            move.sub(gravity);
            this.canJump = true;
        }

        let colision = this.checkHorizontalCollisions(box, arrayObjCol);
        if (colision) {
            let moveDir = move.clone().normalize();
            let colisionNormal = this.calculateCollisionNormal(colision, newPos);

            // Aquí calculamos el vector lateral
            let lateralVector = new THREE.Vector3();
            lateralVector.crossVectors(moveDir, colisionNormal); // Calculamos el vector lateral

            // Verificamos si el vector lateral tiene una magnitud significativa
            if (lateralVector.length() > 0) {
                lateralVector.normalize(); // Normalizamos el vector lateral
                let lateralMovement = lateralVector.multiplyScalar(move.length() / 2); // Escalar el movimiento lateral

                // Verificamos en qué dirección se está moviendo
                if (Math.abs(moveDir.x) > Math.abs(moveDir.z)) {
                    // Movimiento principal en X
                    move.add(new THREE.Vector3(0, 0, lateralMovement.z)); // Ajustar el movimiento en Z
                } else {
                    // Movimiento principal en Z
                    move.add(new THREE.Vector3(lateralMovement.x, 0, 0)); // Ajustar el movimiento en X
                }
            }

            console.log('Dirección de movimiento:', moveDir);
            console.log('Normal de colisión:', colisionNormal);
            console.log('Vector lateral:', lateralVector);

            newPos = currentPosition.clone().add(move);
        }
        // console.log(move.clone().normalize());

        if (this.canMove) {
            this.Object3d.position.copy(newPos);
            if (this.camera) {
                this.camera.position.add(move);
            }
        } else if (!this.canMove && !this.isGrounded) {
            newPos = currentPosition.clone().add(gravity);
            this.Object3d.position.copy(newPos);
            if (this.camera) {
                this.camera.position.add(gravity);
            }
        }
        else {
            this.Object3d.position.copy(currentPosition);
        }
        // console.log('isGrounded: ' + this.isGrounded + ' CanMove: ' + this.canMove + ' CanJump: ' + this.canJump);
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
        if (keys.space) {
            if (this.canJump) {
                this.currentYSpeedUp = this.jumpForce;
                this.Jump()
            }
        }
        movement.add(this.UpdateJump(delta));

        return movement;

    }


    updateForward(movement) {
        if (!movement.equals(new THREE.Vector3(0, 0, 0))) {
            let nextPos = new THREE.Vector3();
            nextPos.copy(this.Object3d.position);
            nextPos.add(movement);

            if (!this.updateForwardY) {
                nextPos.y = this.Object3d.position.y;
            }
            // console.log(this.Object3d.rotation.y);

            this.Object3d.lookAt(nextPos);
            // console.log(this.Object3d.rotation.y);
            let newForward = new THREE.Vector3(0, 0, 0);
            newForward.set(
                nextPos.x - this.Object3d.position.x,
                nextPos.y - this.Object3d.position.y,
                nextPos.z - this.Object3d.position.z,
            ).normalize();
            // console.log(this.forward);
            this.forward.set(newForward.x, newForward.y, newForward.z);
            // socket.emit("updatePlayer", this.Object3d.position, 1);
        }

        //Actualizamos vectores de direccion de la camara
        if (this.camera) {
            this.camera.getWorldDirection(this.camForward);
        }
        this.camForward.y = 0;
        this.camForward.normalize();

        this.camLeft.copy(this.camForward);
        this.camLeft.cross(this.Object3d.up);
        this.camLeft.normalize();

        // console.log(this.camForward);
        // console.log(this.camLeft);

    }

    applyGravity(delta) {
        let movement = new THREE.Vector3(0, 0, 0);

        if (!this.isGrounded && this.currentYSpeedUp <= 0) {

            if (this.currentYSpeedDown < this.gravitySpeed) {
                this.currentYSpeedDown += 0.2;
            }
            movement.set(-this.Object3d.up.x, -this.Object3d.up.y, -this.Object3d.up.z);
            movement.add(movement.clone().multiplyScalar(this.currentYSpeedDown * delta));
        }

        if (this.isGrounded) {
            // console.log('0000');
            this.currentYSpeedDown = 0;
        }
        return movement;
    }

    checkVerticalCollision(box, colBoxes) {

        for (let i = 0; i < colBoxes.length; i++) {
            let colBox = colBoxes[i].boxBB;
            if (colBox === this.collider.boxBB) {
                this.isGrounded = false;
                return 0;//Colisiona con su propia caja
            }
            if (box.intersectsBox(colBox)) {
                // Si la colisión es solo en el eje Y (vertical)
                if ((Math.abs(box.min.y - colBox.max.y) < 2)) { //tolerancia a la distancia al piso

                    this.isGrounded = true;  // Colisión en el suelo
                    return colBox.max.y;
                }

            }
        }
        this.isGrounded = false;
        return 0;
    }

    checkHorizontalCollisions(box, colBoxes) {
        for (let i = 0; i < colBoxes.length; i++) {
            let colBox = colBoxes[i].boxBB;

            if (colBox === this.collider.boxBB) {
                this.canMove = true;
                return null; //Colisiona con su propia caja, debería poder moverse
            }
            if (box.intersectsBox(colBox)) {
                // Si la colisión es en X o Z
                if (box.min.y < colBox.max.y - this.floorDistanceTolerance) {
                    this.canMove = false;
                    return colBox; //si colisiona
                }
            }
        }
        this.canMove = true;
        return null;  // No hay colisión en X o Z
    }


    UpdateJump(delta) {
        let movement = new THREE.Vector3(0, 0, 0);
        if (this.isJumping) {
            movement = this.Object3d.up.clone();

            if (this.currentYSpeedUp > 0) {
                this.currentYSpeedUp -= this.gravitySpeed;
            } else {
                this.currentYSpeedUp = 0;
            }

            movement.y = this.currentYSpeedUp * delta;
            // console.log(this.currentYSpeedUp);

            // console.log(movement);
        }

        return movement;
    }

    Jump() {
        if (this.canJump) {
            this.isJumping = true;
            this.canJump = false;
        }
    }

    calculateCollisionNormal(box, objectPosition) {
        // Asumimos que 'box' es un Box3 y 'objectPosition' es la posición de tu objeto.

        let closestPoint = new THREE.Vector3(
            Math.max(box.min.x, Math.min(objectPosition.x, box.max.x)),
            Math.max(box.min.y, Math.min(objectPosition.y, box.max.y)),
            Math.max(box.min.z, Math.min(objectPosition.z, box.max.z))
        );

        let normal = new THREE.Vector3().subVectors(objectPosition, closestPoint);

        // Normalizar la normal
        if (normal.length() > 0) {
            normal.normalize();
        }

        return normal;
    }

}