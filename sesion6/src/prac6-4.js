import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() ) {
    console.log('WebGL supported and works correctly!');
} else {
    console.warn('WebGL not supported and not working');
}

// Creación de la escena
const scene = new THREE.Scene();

// Creación del renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creación de la cámara
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
camera.position.set(0, 0, 1000);

// Captura de vídeo desde la cámara web
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Error al acceder a la cámara: ", error);
    });

// Creación del canvas para la textura de vídeo
const image = document.createElement('canvas');
image.width = 1280;  
image.height = 720;
const imageContext = image.getContext('2d');
imageContext.fillStyle = '#000000';
imageContext.fillRect(0, 0, image.width - 1, image.height - 1);
const texture = new THREE.Texture(image);

// Creación del plano con la textura de vídeo
const material = new THREE.MeshBasicMaterial({ map: texture });
const wall = new THREE.Mesh(new THREE.PlaneGeometry(image.width, image.height, 4, 4), material);
scene.add(wall);

function animate() {
    requestAnimationFrame(animate);
    wall.rotation.y += 0.01;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        imageContext.drawImage(video, 0, 0);
        if (texture) texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
}

animate();

// Redimensionando la escena
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}, false);
