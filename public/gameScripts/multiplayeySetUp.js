import { scene } from '../gameScripts/levelScript.js';


(function () {
    const socket = io();
    let username = 'wintry';
    socket.emit("joinRoom", username, 1);    // document.addEventListener('keydown', function (event) {
    //     if (event.key === 'm' || event.key === 'M') {
    //         startMultiplayer();
    //     }
    // });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'r' || event.key === 'R') {
            socket.emit("chat", {
                username: 'wintry',
                position: 'hola'
            }, 1);
        }
    });

    socket.on("chat", function (position) {
        console.log(position);
    });

    socket.on("update", function (update) {

        scene.add(capsule2);
        console.log('recevied');
    });

})();