import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";
import { Animator } from "./Animator.js";
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
        this.gravitySpeed = 16;
        this.animator;

        this.forward = new THREE.Vector3(1, 0, 0);
        this.left = new THREE.Vector3(0, 0, 0);
        this.currentYSpeedDown = 0;
        this.currentYSpeedUp = 0;

        this.isMoving = false;

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

        this.floorDistanceTolerance = 4;
        this.canJump = true;
        this.isJumping = false;
        this.jumpForce = 300;


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

    setAnimator(animator) {
        this.animator = animator;
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
            if (Math.abs(floorPosition - this.Object3d.position.y) > 0.5) {
                console.log('posicion del suelo', floorPosition);
                console.log('posicion del jugador', this.Object3d.position.y);
                // Ajusta la posición de la cámara según el cambio en la altura del suelo
                this.camera.position.y += (floorPosition - newPos.y);
            }
            // Actualiza la nueva posición del suelo
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

            // console.log('Dirección de movimiento:', moveDir);
            // console.log('Normal de colisión:', colisionNormal);
            // console.log('Vector lateral:', lateralVector);

            newPos = currentPosition.clone().add(move);
        }
        // console.log(move.clone().normalize());

        if (this.canMove) {
            this.Object3d.position.copy(newPos);
            if (this.camera) {
                this.camera.position.add(move);
            }
        } else if (!this.canMove && !this.isGrounded) {
            console.log('aire colision')
            newPos = currentPosition.clone().add(gravity);
            // this.Object3d.position.add(move);
            this.Object3d.position.copy(newPos)
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
        this.isMoving = false;
        if (keys.forward) {
            // console.log('forward');
            this.isMoving = true;
            movement.add(this.camForward.clone().multiplyScalar(this.velocity * delta));
        }
        if (keys.backward) {
            // console.log('backward');
            this.isMoving = true;
            movement.add(this.camForward.clone().multiplyScalar(-this.velocity * delta));
        }
        if (keys.right) {
            // console.log('right');
            this.isMoving = true;
            movement.add(this.camLeft.clone().multiplyScalar(this.velocity * delta));
        }
        if (keys.left) {
            // console.log('left');
            this.isMoving = true;
            movement.add(this.camLeft.clone().multiplyScalar(-this.velocity * delta));
        }
        if (keys.space) {
            if (this.canJump) {
                this.currentYSpeedUp = this.jumpForce;
                this.Jump()
            }
        }
        movement.add(this.UpdateJump(delta));

        if (this.isMoving) {
            this.animator.setState('move');
        } else {
            this.animator.setState('idle');
        }

        return movement;

    }


    updateForward(movement) {

        // if (this.isJumping == true && movement.equals(new THREE.Vector3(0, 0, 0))) {
        //     this.Object3d.lookAt(this.forward);
        //     return;
        // }

        if (!movement.equals(new THREE.Vector3(0, 0, 0))) {
            let nextPos = new THREE.Vector3();
            nextPos.copy(this.Object3d.position);
            nextPos.add(movement);

            if (!this.updateForwardY) {
                nextPos.y = this.Object3d.position.y;
            }
            this.Object3d.lookAt(nextPos);
            let newForward = new THREE.Vector3(0, 0, 0);
            newForward.set(
                nextPos.x - this.Object3d.position.x,
                nextPos.y - this.Object3d.position.y,
                nextPos.z - this.Object3d.position.z,
            ).normalize();
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
    }

    applyGravity(delta) {
        let movement = new THREE.Vector3(0, 0, 0);

        if (!this.isGrounded && this.currentYSpeedUp <= 0) {

            if (this.currentYSpeedDown < 110) {
                this.currentYSpeedDown += 5;
                // console.log(this.currentYSpeedDown)
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

        // let floor1 = false;

        for (let i = 0; i < colBoxes.length; i++) {

            let colBoxInst = colBoxes[i];

            switch (colBoxInst.type) {
                case 1:
                    let colBox = colBoxInst.boxBB;
                    if (colBox === this.collider.boxBB) {
                        this.isGrounded = false;
                        return 0;//Colisiona con su propia caja
                    }
                    if (box.intersectsBox(colBox)) {
                        // Si la colisión es solo en el eje Y (vertical)
                        if ((Math.abs(box.min.y - colBox.max.y) < this.floorDistanceTolerance)) { //tolerancia a la distancia al piso

                            this.isGrounded = true;
                            this.isJumping = false;  // Colisión en el suelo/ parte superior de caja
                            return colBox.max.y;
                        }

                    }
                    break;

                case 2:
                    const raycaster = new THREE.Raycaster();
                    const downDirection = new THREE.Vector3(0, -1, 0); // Dirección hacia abajo

                    // Obtener la posición del personaje y actualizar el raycaster
                    const characterPosition = new THREE.Vector3(this.Object3d.position.x, this.Object3d.position.y + 5, this.Object3d.position.z);
                    raycaster.set(characterPosition, downDirection);

                    // Verificar intersección con el plano inclinado
                    const intersects = raycaster.intersectObject(colBoxInst.object3D);

                    if (intersects.length > 0) {

                        this.isGrounded = true;

                        const intersectionPoint = intersects[0].point;
                        // Obtener la normal de la superficie en el punto de intersección
                        let surfaceNormal = intersects[0].face.normal.clone();
                        surfaceNormal.applyQuaternion(colBoxInst.object3D.quaternion);

                        // Crear el quaternion de alineación con la inclinación del terreno
                        const alignmentQuaternion = new THREE.Quaternion();
                        alignmentQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);

                        // Obtener la rotación actual del personaje
                        // const currentQuaternion = this.Object3d.quaternion.clone();

                        // Combinar la alineación del terreno con la rotación Y actual del personaje
                        const finalQuaternion = new THREE.Quaternion();
                        finalQuaternion.multiplyQuaternions(alignmentQuaternion, new THREE.Quaternion(0, Math.sin(this.Object3d.rotation.y / 2), 0, Math.cos(this.Object3d.rotation.y / 2)));

                        // Aplicar el ajuste de rotación suavemente
                        this.Object3d.quaternion.slerp(finalQuaternion, 0);

                        // Ajustar la posición del personaje en Y para mantenerse sobre el suelo
                        if (Math.abs(box.min.y - intersectionPoint.y + 1) < 3) { // Tolerancia a la distancia al piso
                            return intersectionPoint.y + 1; // Ajuste en altura para mantenerse sobre el suelo
                        }
                    }

                    break;

                case 4:
                    const raycaster2 = new THREE.Raycaster();
                    const downDirection2 = new THREE.Vector3(0, -1, 0); // Dirección hacia abajo

                    // Obtener la posición del personaje y actualizar el raycaster
                    const characterPosition2 = new THREE.Vector3(this.Object3d.position.x, this.Object3d.position.y + 5, this.Object3d.position.z);
                    raycaster.set(characterPosition, downDirection);

                    // Verificar intersección con el plano inclinado
                    const intersects2 = raycaster.intersectObject(colBoxInst.object3D);

                    if (intersects.length > 0) {
                        colBoxInst.triggered(true)
                    }
                    break;
            }

        }
        this.isGrounded = false;
        return 0;
    }

    checkHorizontalCollisions(box, colBoxes) {
        for (let i = 0; i < colBoxes.length; i++) {
            let colBoxInst = colBoxes[i];
            let colBox = colBoxInst.boxBB;

            if (colBoxInst.type == 1) {

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
            } else if (colBoxInst.isTrigger) {

                if (box.intersectsBox(colBox)) {
                    colBoxInst.triggered(true);
                } else {
                    colBoxInst.triggered(false);
                }
            } else if (colBoxInst.type == 2) {
                const raycaster = new THREE.Raycaster();
                raycaster.near = 1;
                raycaster.far = 5;
                const frontDirection = this.forward; // Dirección hacia frente

                // Obtener la posición del personaje y actualizar el raycaster
                const characterPosition = new THREE.Vector3(this.Object3d.position.x, this.Object3d.position.y + 10, this.Object3d.position.z);
                raycaster.set(characterPosition, frontDirection);

                // Verificar intersección con el plano inclinado
                const intersects = raycaster.intersectObject(colBoxInst.object3D);
                if (intersects.length > 0) {
                    console.log('colision con suelo')
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
        }


        return movement;
    }

    Jump() {
        if (this.canJump) {
            this.isJumping = true;
            this.canJump = false;
            if (this.animator) {
                this.animator.setState('jump');
            }
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