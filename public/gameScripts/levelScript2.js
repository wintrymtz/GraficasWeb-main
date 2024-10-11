import * as THREE from "../three.module.js";
import { OrbitControls } from "../OrbitControls.js";
import { FirstPersonControls } from "../gameScripts/FirstPersonControls.js";

// const width = 1200;
// const height = 675;

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#997fa7');
const loader = new THREE.TextureLoader();
loader.load('img/2k_stars.jpg', function (texture) {
    scene.background = texture;
    console.log(texture);
});

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.PerspectiveCamera
    (
        75,
        width / height,
        0.1,
        1000
    );
//x, y, z0
camera.position.set(0, 0, 20);
scene.add(camera);



const sunGeometry = new THREE.SphereGeometry(8, 32, 16);
const sunMaterial = createSunMaterial();
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
scene.add(sun);

const light = new THREE.PointLight('#f4f4f4', 10000, 1000);
light.position.set(0, 5, 0);
sun.add(light);

const light2 = new THREE.AmbientLight('#f4f4f4', 0.01);
light2.position.set(70, 5, 0);
scene.add(light2);


const earthGeometry = new THREE.SphereGeometry(5, 32, 16);
const earthMaterial = createEarthMaterial();
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 0, 50);
sun.add(earth);

const cloudGeometry = new THREE.SphereGeometry(5.2, 32, 16);
const cloudMaterial = createCloudMaterial();
const earthClouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(earthClouds);

// const size = 100;
// const divisions = 20;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);


const moonGeometry = new THREE.SphereGeometry(2, 32, 16);
const moonMaterial = createMoonMaterial();
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(0, 0, 20);
earth.add(moon);

const point = new THREE.Object3D();
point.position.set(0, 0, 0);
scene.add(point);

const marsGeometry = new THREE.SphereGeometry(8, 32, 16);
const marsMaterial = createMarsMaterial();
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 0, -100);
point.add(mars);


const radius = 10;
const sectors = 16;
const rings = 8;
const divisions = 64;

const helper = new THREE.PolarGridHelper(radius, sectors, rings, divisions);
scene.add(helper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
// const cameraControl = new OrbitControls(camera, renderer.domElement);

let fps = new FirstPersonControls(camera, renderer.domElement)
fps.movementSpeed = 150;
fps.lookSpeed = 150;


function createEarthMaterial() {
    const earthMaterial = new THREE.MeshLambertMaterial();
    const earthTexture = new THREE.TextureLoader().load(
        "img/2k_earth_daymap.jpg"
    );
    earthMaterial.map = earthTexture;
    return earthMaterial;
}

function createMarsMaterial() {
    const marsMaterial = new THREE.MeshLambertMaterial();
    const marsTexture = new THREE.TextureLoader().load(
        "img/2k_mars.jpg"
    );
    marsMaterial.map = marsTexture;
    return marsMaterial;
}

function createMoonMaterial() {
    const moonMaterial = new THREE.MeshLambertMaterial();
    const moonTexture = new THREE.TextureLoader().load(
        "img/2k_moon.jpg"
    );
    moonMaterial.map = moonTexture;
    return moonMaterial;
}


function createCloudMaterial() {
    const cloudMaterial = new THREE.MeshLambertMaterial();
    const cloudTexture = new THREE.TextureLoader().load(
        "img/2k_earth_clouds.png"
    );
    cloudMaterial.map = cloudTexture;
    cloudMaterial.transparent = true;
    return cloudMaterial;
}

function createSunMaterial() {
    const sunMaterial = new THREE.MeshBasicMaterial();
    const sunTexture = new THREE.TextureLoader().load(
        "img/2k_sun.jpg"
    );
    sunMaterial.map = sunTexture;
    return sunMaterial;
}

function animateEarth() {
    requestAnimationFrame(animateEarth);
    earth.rotation.y += 0.001;
    earthClouds.rotation.y += 0.003;
    earthClouds.rotation.x += 0.001;

    renderer.render(scene, camera);
}

function animateSun() {
    requestAnimationFrame(animateSun);
    sun.rotation.y += 0.003;

    renderer.render(scene, camera);
}

function animateMars() {
    requestAnimationFrame(animateMars);
    point.rotation.y += 0.005;
    mars.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animateEarth();
animateSun();
animateMars();

const geometry = new THREE.CapsuleGeometry(10, 15, 3, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const capsule = new THREE.Mesh(geometry, material); scene.add(capsule);

let x = prompt('x');
let z = prompt('z');
capsule.position.set(x, 0, z);

const geometry2 = new THREE.CapsuleGeometry(10, 15, 3, 10);
const material2 = new THREE.MeshBasicMaterial({
    color: '#fffb00'
});
const capsule2 = new THREE.Mesh(geometry2, material2);


export { scene };

//------------------------------------------------------------------------


