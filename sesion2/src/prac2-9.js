import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 100 ); // Posicionar la cámara frente al modelo

// Crear el renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Cargar el modelo COLLADA
const modelUrl = "../models/iss.dae";
let iss;

const loadingManager = new THREE.LoadingManager(() => {
    scene.add(iss);
    console.log('Model loaded');
});

const loader = new ColladaLoader(loadingManager);
loader.load(modelUrl, (collada) => {
    iss = collada.scene;
    iss.scale.set(0.3, 0.3, 0.3); // Redimensionar el modelo
    iss.rotation.set(Math.PI / 5, Math.PI / 5, 0); // Rotar el modelo
    iss.position.set(0, 0, 0); // Posicionar el modelo en el centro
    iss.updateMatrix();
});

const light = new THREE.AmbientLight(0xffffff); // Luce ambientale
scene.add(light);

function animate() {
    requestAnimationFrame(animate); // Richiama la funzione di animazione
    renderer.render(scene, camera); // Rende la scena
}

animate(); // Avvia l'animazione


// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
