import * as THREE from "../three.module.js";

export class Collider {

    constructor(object, type, width, height, depth) {

        switch (type) {
            case 1:
                // this.geometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
                // this.material = new THREE.MeshBasicMaterial({ color: '#062fff', wireframe: true });
                // this.mesh = new THREE.Mesh(this.geometry, this.material);
                // object.Object3d.add(this.mesh);

                this.obj = object;
                this.boxBB = new THREE.Box3();
                this.boxBB.setFromObject(object, false);
                // console.log(this.box);

                break;
        }

    }

    update() {
        this.boxBB
            .copy(this.obj.geometry.boundingBox)
            .applyMatrix4(this.obj.matrixWorld);
    }
    getCollider() {
        return this.boxBB;
    }
}