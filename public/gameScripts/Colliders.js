import * as THREE from "../three.module.js";

export class Collider {

    constructor(object, type, dynamic, width, height, depth) {

        if (type == undefined) {
            type = 1;
        }

        if (dynamic == undefined) {
            dynamic = false;
        }

        this.isStatic = !dynamic;
        switch (type) {
            case 1:
                this.object3D = object;
                this.boxBB = new THREE.Box3();
                this.boxBB.setFromObject(object, false);

                this.helper = new THREE.Box3Helper(this.boxBB, 0xffff00);
                break;
        }

    }

    update() {
        // this.boxBB
        //     .copy(this.obj.geometry.boundingBox)
        //     .applyMatrix4(this.obj.matrixWorld);

        this.boxBB.applyMatrix4(this.object3D.matrixWorld);
        this.boxBB.setFromObject(this.object3D);

        this.setOffsets(this.boxBB, this.object3D.position, this.object3D.quaternion);
    }
    getCollider() {
        return this.boxBB;
    }

    renderHelper(scene) {
        scene.add(this.helper);
    }

    scaleY(y) {
        this._scaleY = y;
    }

    scaleX(x) {
        this._scaleX = x;
    }

    scaleZ(z) {
        this._scaleZ = z;
    }

    translate(x, y, z) {
        this._translate = new THREE.Vector3(x, y, z);
    }

    setOffsets(box, pos, rotationQ) {
        if (this._scaleZ) {
            let vec1 = pos.clone().add(new THREE.Vector3(0, 0, this._scaleZ).applyQuaternion(rotationQ));
            let vec2 = pos.clone().add(new THREE.Vector3(0, 0, -this._scaleZ).applyQuaternion(rotationQ));
            box.expandByPoint(vec1);
            box.expandByPoint(vec2);
        }

        if (this._scaleX) {
            let vec1 = pos.clone().add(new THREE.Vector3(this._scaleX, 0, 0).applyQuaternion(rotationQ));
            let vec2 = pos.clone().add(new THREE.Vector3(-this._scaleX, 0, 0).applyQuaternion(rotationQ));
            box.expandByPoint(vec1);
            box.expandByPoint(vec2);
        }

        if (this._scaleY) {
            let vec = pos.clone().add(new THREE.Vector3(0, this._scaleY, 0).applyQuaternion(rotationQ));
            box.expandByPoint(vec);
        }

        if (this._translate) {
            let translatedOffset = this._translate.clone().applyQuaternion(rotationQ);
            box.translate(translatedOffset);
        }
        return box;
    }

}