export class InputController {
    constructor() {
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
    }

    getKeys() {
        return this.keys;
    }

}