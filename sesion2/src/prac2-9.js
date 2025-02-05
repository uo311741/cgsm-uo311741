import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

//escena
const scene = new THREE.Scene();

//cámara
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 100 ); 

//renderer
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
    iss.scale.set(0.3, 0.3, 0.3); 
    iss.rotation.set(Math.PI / 5, Math.PI / 5, 0); 
    iss.position.set(0, 0, 0); 
    iss.updateMatrix();
});

const light = new THREE.AmbientLight(0xffffff); 
scene.add(light);

function animate() {
    requestAnimationFrame(animate); 
    if (iss) {
        iss.rotation.y += 0.01;  // Girar alrededor del eje Y
    }
    renderer.render(scene, camera); 
}

animate(); 


// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
