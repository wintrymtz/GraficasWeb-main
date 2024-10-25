export class InputController {
    constructor(type) {
        this.type = type;
        this.init();
    }

    init() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false
        }
        document.addEventListener('keydown', (e) => this.onkeydown(e, true), false)
        document.addEventListener('keyup', (e) => this.onkeydown(e, false), false)
    }

    onkeydown(event, down) {
        if (this.type == 1) {
            switch (event.keyCode) {
                case 87: //W
                    this.keys.forward = down;
                    break;
                case 65: //A
                    this.keys.left = down;
                    break;
                case 83: //S
                    this.keys.backward = down;
                    break;
                case 68: //D
                    this.keys.right = down;
                    break;
                case 32: //SPACE
                    this.keys.space = down;
                    break;
            }
        } else if (this.type == 2) {
            switch (event.keyCode) {
                case 38: //delante
                    this.keys.forward = down;
                    break;
                case 37: //izquierda
                    this.keys.left = down;
                    break;
                case 40: //atras
                    this.keys.backward = down;
                    break;
                case 39: //dercha
                    this.keys.right = down;
                    break;
                case 13: //
                    this.keys.space = down;
                    break;
            }
        }

    }

    getKeys() {
        return this.keys;
    }

}