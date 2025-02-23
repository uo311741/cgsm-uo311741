import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() ) {
    console.log('WebGL supported and works correclty!')

} else {
	console.warn('WebGL not supported and not working');
}


//creación de objeto de escena
const scene = new THREE.Scene();

//Este código hace que el objeto body de la página sea el elemento padre del canvas que se creará para renderizar la escena. 
//Este objeto canvas se crea automáticamente mediante la instanciación del renderizador. 
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//creación de la cámara
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 30, 500 );

const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
helper.position.y = 0.1;
scene.add(helper);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5); // Luz blanca
dirLight.position.set(0,0.5,100);
scene.add(dirLight);

//Luz hemisférica
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xf0f0f0, 0.6 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

//textures
const textureLoader = new THREE.TextureLoader( );
const regularFaceTexture = textureLoader.load("textures/brick.jpg");
const regularFaceMaterial = new THREE.MeshPhongMaterial({ map: regularFaceTexture });// Material for the rest of the faces
const soundOnTexture = textureLoader.load("textures/sonido_activado.png");
const soundOffTexture = textureLoader.load("textures/sonido_desactivado.png");
const soundOnMaterial = new THREE.MeshPhongMaterial({ map: soundOnTexture });
const soundOffMaterial = new THREE.MeshPhongMaterial({ map: soundOffTexture });

// Inicialmente las cajas estarán con el sonido apagado
const materialsOff1 = [
    soundOffMaterial,       //cara frontal con el botón apagado
    regularFaceMaterial,    //otras caras
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
];

const materialsOff2 = [
    soundOffMaterial,       //cara frontal con el botón apagado
    regularFaceMaterial,    //otras caras
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
];

const materialsOn = [
    soundOnMaterial,        //cara frontal con el botón encendido
    regularFaceMaterial,    //otras caras
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
];


const geometry = new THREE.BoxGeometry( 50, 50, 50 );
const box1 = new THREE.Mesh( geometry, materialsOff1 );
const box2 = new THREE.Mesh( geometry, materialsOff2 );


box1.position.set(200, 25, 0);
box2.position.set(-200, 25, 0);

box1.rotation.y = -Math.PI/4;
box2.rotation.y = -Math.PI/4;

//Audio box1
const listener1 = new THREE.AudioListener();
camera.add( listener1 );

const audioLoader1 = new THREE.AudioLoader();
const sound1 = new THREE.PositionalAudio( listener1 );
audioLoader1.load( "sounds/376737_Skullbeatz___Bad_Cat_Maste.ogg", ( buffer ) => {
    sound1.setBuffer( buffer );
    sound1.setRefDistance( 20 );
    sound1.setLoop( true );
    sound1.setRolloffFactor( 1 );
    //sound.play(); // Modern browsers do not allow sound to start without user interaction
});
box1.add( sound1 );

//Audio box2 
const listener2 = new THREE.AudioListener();
camera.add( listener2 );

const audioLoader2 = new THREE.AudioLoader();
const sound2 = new THREE.PositionalAudio( listener2 );
audioLoader2.load( "sounds/dog.ogg", ( buffer ) => {
    sound2.setBuffer( buffer );
    sound2.setRefDistance( 20 );
    sound2.setLoop( true );
    sound2.setRolloffFactor( 1 );
    //sound.play(); // Modern browsers do not allow sound to start without user interaction
});
box2.add( sound2 );


scene.add( box1 );
scene.add( box2 );

const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 70;
controls.lookSpeed = 0.05;
controls.noFly = false;
controls.lookVertical = false;

//raycaster para la selección de objetos
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;

document.body.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

document.body.addEventListener( 'keydown', ( event ) => {
    const spaceKeyCode = 32;
    if ( event.keyCode === spaceKeyCode && intersectedObject ) {
        let sound, box;
        if (intersectedObject.name === "Box 1") {
            sound = sound1;
            box = box1;
        } else if (intersectedObject.name === "Box 2") {
            sound = sound2;
            box = box2;
        }
        if (sound) {
            if (sound.isPlaying) {
                sound.pause();
                box.material[0] = soundOffMaterial;
            } else {
                sound.play();
                box.material[0] = soundOnMaterial;
            }
            box.material.needsUpdate = true;
        }
    }
}, false );


box1.name = "Box 1";
box2.name = "Box 2";

const clock = new THREE.Clock( );

function animate() {

    const delta = clock.getDelta();
    controls.update( delta );

    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (intersectedObject !== intersects[0].object) {
            intersectedObject = intersects[0].object;
            console.log('New intersected object: ' + intersectedObject.name);
        }
    } else {
        intersectedObject = null;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

animate();


//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );