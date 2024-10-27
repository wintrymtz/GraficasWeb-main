import * as THREE from "../three.module.js";
import { OrbitControls } from "../OrbitControls.js";
import { FirstPersonControls } from "../gameScripts/FirstPersonControls.js";
import { CharacterController } from "./CharacterController.js";
import { Collider } from "./Colliders.js";
import { STLLoader } from "./STLLoader.js";
import { GLTFLoader } from "./GLTFLoader.js";

// const width = 1200;
// const height = 675;

const width = window.innerWidth;
const height = window.innerHeight;

let scene;
let loader;
let camera;
let camera2;
let clock;
let renderer;
let renderer2
let player;
let player2;
let col;
let col2;
let player2Col;

let ColArray = [];
let orbitControl1;
let orbitControl2;
let planeCol;

let mixerArray = [];
let mixer2;
let mixer3;

let player2Exist = false;
let aspect = window.innerWidth / window.innerHeight;
let aspect2 = window.innerWidth / window.innerHeight * 2;
let robotObj;



function Init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock(true);
    camera = new THREE.PerspectiveCamera
        (
            75,
            aspect,
            0.1,
            1000
        );

    camera2 = new THREE.PerspectiveCamera
        (
            75,
            aspect,
            0.1,
            1000
        );
    //x, y, z0
    camera.position.set(0, 80, -20);
    scene.add(camera);

    loader = new THREE.TextureLoader();
    loader.load('img/2k_stars.jpg', function (texture) {
        scene.background = texture;
    });

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // let fps = new FirstPersonControls(camera, renderer.domElement)
    // fps.movementSpeed = 150;
    // fps.lookSpeed = 150;

    let robot = new GLTFLoader();
    let robot_model;
    let robotObj1;

    // robot.load("./recursos/player3.glb", function (model) {
    //     console.log(model);
    //     robot_model = model;
    //     robotObj1 = model.scene;
    //     robotObj1.scale.set(300, 300, 300);
    //     robotObj1.position.set(0, 0, 0);
    //     scene.add(robotObj1);


    //     mixer2 = new THREE.AnimationMixer(robotObj1);
    //     const action = mixer2.clipAction(model.animations[0]);
    //     action.play();
    // });

    const light = new THREE.AmbientLight(0x404040, 100); // soft white light
    scene.add(light);

    robot.load("./recursos/player5.glb", function (model) {
        // console.log(model);
        robot_model = model;
        robotObj = model.scene;
        robotObj.scale.set(300, 300, 300);
        robotObj.position.set(0, -4, -15);
        robotObj.rotation.y = -1.5708;
        scene.add(robotObj);
        mixer3 = new THREE.AnimationMixer(robotObj);
        const action = mixer3.clipAction(model.animations[0]);
        // action.play();

        // let colision = new Collider(robotObj);
        // ColArray.push(colision);
        // colision.renderHelper(scene);
        // colision.boxBB.translate(new THREE.Vector3(0, 4, 0))
        // colision.scaleY(15);
        // colision.scaleX(7);
        // colision.scaleX(-7);

        // robotObj = capsule;

        let colision = new Collider(robotObj, 1, true);
        ColArray.push(colision);
        colision.renderHelper(scene);
        colision.translate(0, 3.5, 0);
        colision.scaleY(13);
        colision.scaleX(6);
        colision.scaleZ(4);
        player = new CharacterController(robotObj, camera, 1, colision);




        orbitControl1 = new OrbitControls(camera, renderer.domElement);
        orbitControl1.maxDistance = 40;
        orbitControl1.enablePan = false;
        // cameraControl.maxPolarAngle
        orbitControl1.minDistance = 20;
        orbitControl1.target = player.Object3d.position;
    });

    const geometry = new THREE.CapsuleGeometry(6, 7, 3, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(geometry, material); scene.add(capsule);

    const size = 100;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);




    const g = new THREE.BoxGeometry(7, 4, 4);
    const m = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
    const cube = new THREE.Mesh(g, m);
    cube.position.set(0, 5, 5);
    capsule.add(cube);


    const origin = new THREE.Vector3(capsule.position.x, capsule.position.y, capsule.position.z);
    const length = 30;
    const hex = 0xffff00;

    // const arrowHelper = new THREE.ArrowHelper(player.forward, origin, length, hex);
    // capsule.add(arrowHelper);

    const CubeG = new THREE.BoxGeometry(10, 30, 10);
    const CubeM = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
    let Cube = new THREE.Mesh(CubeG, CubeM);
    Cube.position.set(0, 0, 20);
    let colision = new Collider(Cube);
    colision.renderHelper(scene);
    ColArray.push(colision);
    scene.add(Cube);

    const CubeG2 = new THREE.BoxGeometry(10, 20, 10);
    const CubeM2 = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
    let Cube2 = new THREE.Mesh(CubeG2, CubeM2);
    Cube2.position.set(0, -10, -30);
    let colision2 = new Collider(Cube2);
    colision2.renderHelper(scene);
    ColArray.push(colision2);
    scene.add(Cube2);

    const planegeometry = new THREE.BoxGeometry(100, 100);
    const planematerial = new THREE.MeshBasicMaterial({ color: '#5b1c1b' });
    const plane = new THREE.Mesh(planegeometry, planematerial);
    plane.position.set(0, -20, 0);
    plane.rotation.x = (90 * 3.1416 / 180);
    planeCol = new Collider(plane);
    ColArray.push(planeCol);
    const helper3 = new THREE.Box3Helper(planeCol.boxBB, 0xffff00);
    scene.add(helper3);
    scene.add(plane);



    const planegeometry2 = new THREE.BoxGeometry(100, 100);
    const planematerial2 = new THREE.MeshBasicMaterial({ color: '#5b1c1b' });
    const plane2 = new THREE.Mesh(planegeometry2, planematerial2);
    plane2.position.set(130, -20, 0);
    plane2.rotation.x = (90 * 3.1416 / 180);
    let planeCol2 = new Collider(plane2);
    ColArray.push(planeCol2);

    const helper4 = new THREE.Box3Helper(planeCol2.boxBB, 0xffff00);
    scene.add(helper4);
    scene.add(plane2);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'O' || e.key === 'o') {  // Para detectar tanto "p" minúscula como "P" mayúscula
            console.log("Tecla 'P' presionada");
            if (!player2Exist) {
                player2Exist = true;


                const geometry2 = new THREE.CapsuleGeometry(6, 7, 3, 10);
                const material2 = new THREE.MeshBasicMaterial({ color: '#3018cb' });
                const capsule2 = new THREE.Mesh(geometry2, material2); scene.add(capsule2);

                player2Col = new Collider(capsule2, 1, true);
                player2 = new CharacterController(capsule2, camera2, 2, player2Col);
                player2Col.renderHelper(scene);

                const g2 = new THREE.BoxGeometry(7, 4, 4);
                const m2 = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
                const cube2 = new THREE.Mesh(g2, m2);
                cube2.position.set(0, 5, 5);
                capsule2.add(cube2);


                //x, y, z0
                camera2.position.set(camera.position.x, camera.position.y, camera.position.z);
                camera2.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
                scene.add(camera2);

                orbitControl2 = new OrbitControls(camera2, renderer.domElement);
                orbitControl2.maxDistance = 40;
                orbitControl2.enablePan = false;
                // cameraControl.maxPolarAngle
                orbitControl2.minDistance = 20;
                orbitControl2.target = player2.Object3d.position;

                camera.aspect = aspect2;
                camera2.aspect = aspect2;
                camera.updateProjectionMatrix();
                camera2.updateProjectionMatrix();
            }
        }
    })

}




function Update() {
    const delta = clock.getDelta();
    scene.traverse(child => {
        if (typeof child.update === 'function') child.update(delta);
    })

    if (mixer3) {
        mixer3.update(0.01);
        player.update(delta, 1, ColArray);
    }

    if (player2Exist) {
        player2.update(delta, 1, ColArray);
    }

    //Se actualiza en el controlador
    ColArray.forEach((e) => {
        if (!e.isStatic) {
            e.update();
        }
    });

}

function Render() {
    if (player2Exist) {
        // Configuración para la primera cámara
        renderer.setViewport(0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2);
        renderer.setScissor(0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);

        // Configuración para la segunda cámara
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight / 2);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight / 2);
        renderer.setScissorTest(true);
        renderer.render(scene, camera2);

        // Desactivar scissor al finalizar
        renderer.setScissorTest(false);
    } else {
        renderer.render(scene, camera);
    }
}

Init();

renderer.setAnimationLoop(() => {
    Render();
    Update();
})

export { scene };

//------------------------------------------------------------------------


