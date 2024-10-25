import * as THREE from "../three.module.js";
// import { scene } from '../gameScripts/levelScript.js';
import socket from "../gameScripts/socket-connection.js";


(function () {
    const geometry = new THREE.CapsuleGeometry(6, 7, 3, 10);
    const material = new THREE.MeshBasicMaterial({ color: '#893efc' });
    const capsule = new THREE.Mesh(geometry, material);

    let username = 'wintry';
    socket.emit("joinRoom", username, 1);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'r' || event.key === 'R') {
            socket.emit("chat", {
                username: 'wintry',
                position: 'hola'
            }, 1);
        }
    });

    // socket.on("chat", function (position) {
    //     console.log(position);
    // });

    socket.on("update", function (update) {
        capsule.position.set(10, 0, 10);
        scene.add(capsule);

        console.log('recevied');
    });

    socket.on("updatePlayer", function (position) {
        capsule.position.set(position['x'], position['y'], position['z']);
        console.log(position);
    })

    function updatePlayer() {
    }

})();