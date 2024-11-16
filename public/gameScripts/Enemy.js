import * as THREE from "../three.module.js";
import { InputController } from "./InputController.js";
import { Collider } from "./Colliders.js";
import { CharacterController } from "./CharacterController.js";

export class Enemy {

    state = {
        PATROLLING: 0,
        CHASING: 1,
        ATTACKING: 2
    }

    constructor(Object3D, type, collider, terrain) {

        this.Object3D = Object3D;
        this.type = type;
        this.collider = collider;

        this.collider = collider;
        this.velocity = 10;


        this.currentState = state.PATROLLING;
        this.forward = new THREE.Vector3(1, 0, 0);
    }

    setCollider(col) {
        this.col = col;
    }


    Update(player) {
        ckeckNearPlayer(player);
        switch (this.currentState) {
            case state.CHASING:
                this.Object3D.lookAt(player.position);
                break;

            case state.PATROLLING:
                break;

            case state.ATTACKING:
                break;
        }
    }

    ckeckNearPlayer() {
        if (distance(player.Object3D.position, this.Object3D.position) < 10) {
            this.currentState = state.CHASING;

        } else {
            this.currentState = state.PATROLLING;
        }
    }




    getMovement(delta) {
        let movement = new THREE.Vector3();
        movement.add(this.forward.clone().multiplyScalar(this.velocity * delta));

        const raycaster = new THREE.Raycaster();
        const downDirection = new THREE.Vector3(0, -1, 0); // Dirección hacia abajo

        const characterPosition = this.object3D.position.clone();
        raycaster.set(characterPosition, downDirection);

        // Verificar intersección con el plano inclinado
        const intersects = raycaster.intersectObject(this.terrain);

        if (intersects.length > 0) {
            this.isGrounded = true;

            const intersectionPoint = intersects[0].point;
            // Obtener la normal de la superficie en el punto de intersección
            let surfaceNormal = intersects[0].face.normal.clone();
            surfaceNormal.applyQuaternion(this.terrain.quaternion);

            // Crear el quaternion de alineación con la inclinación del terreno
            const alignmentQuaternion = new THREE.Quaternion();
            alignmentQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);


            // Combinar la alineación del terreno con la rotación Y actual del personaje
            const finalQuaternion = new THREE.Quaternion();
            finalQuaternion.multiplyQuaternions(alignmentQuaternion, new THREE.Quaternion(0, Math.sin(this.object3D.rotation.y / 2), 0, Math.cos(this.object3D.rotation.y / 2)));

            // Aplicar el ajuste de rotación suavemente
            this.Object3d.quaternion.slerp(finalQuaternion, 0);

            // Ajustar la posición del personaje en Y para mantenerse sobre el suelo
            if (Math.abs(collider.box.min.y - intersectionPoint.y + 3) < 2) { // Tolerancia a la distancia al piso
                return intersectionPoint.y + 1; // Ajuste en altura para mantenerse sobre el suelo
            }

        }
        return movement;
    }
}