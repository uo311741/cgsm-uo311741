import * as THREE from 'three';

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
camera.position.set( 0, 0, 10 );

//Creación de la Tierra
const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const mapUrl = "../textures/tierra.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const map = textureLoader.load( mapUrl,( loaded ) => { renderer.render( scene, camera )});
const material = new THREE.MeshPhongMaterial( { map: map } );
const earth = new THREE.Mesh( geometry, material );

//Creación de la atmosfera
const geometry1  = new THREE.SphereGeometry( 1.05, 33, 17 ); 
const atmosphereMap = new THREE.TextureLoader().load("../textures/atmosfera.png", ( loaded ) => { renderer.render( scene, camera )});
var atmosphereMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atmosphereMap, transparent: true } );
const atmosphere = new THREE.Mesh( geometry1, atmosphereMaterial );

//Creación de la Luna (0.27 veces la Tierra)
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 16);
const moonMap = new THREE.TextureLoader().load("../textures/luna.gif", ( loaded ) => { renderer.render( scene, camera )});
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonMap });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(3, 0, 0); //posición relativa a la Tierra

//Distancia Tierra-Luna (no a escala real)
const distance = 30;
moon.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

//Rotación de la Luna para mostrar siempre la misma cara a la Tierra
moon.rotation.y = Math.PI;

//Grupo para la Luna (permitirá su órbita)
const moonGroup = new THREE.Object3D();
moonGroup.add(moon);

//Inclinación de la órbita lunar
moonGroup.rotation.x = 0.089;

//luz punctual 
const light = new THREE.PointLight( 0xffffff, 2000, 200);
light.position.set( -30, 20, 30);
scene.add( light );

//Grupo atmosfera-tierra-luna
// Crear un grupo para agrupar Tierra, atmósfera y Luna
const planetGroup = new THREE.Object3D();
planetGroup.add(earth);
planetGroup.add(atmosphere);
planetGroup.add(moonGroup);

//rotacion de 23°
planetGroup.rotation.set((23 * Math.PI) / 180, 0, 0);  // Inclinación respecto al eje X 
planetGroup.rotation.set(0, 0, (23 * Math.PI) / 180);  // Inclinación respecto al eje Y


//añadir el grupo a la escena
scene.add(planetGroup);

//reloj para medir el tiempo de animación
const clock = new THREE.Clock();

//velocidades de rotación
const earthRotationSpeed = (Math.PI * 2) / 24; //la Tierra rota en 24 horas
const moonOrbitSpeed = (2 * Math.PI) / (28 * 24); //la Luna orbita en 28 días

//Ángulo de la Luna
let moonAngle = 0;

//función de animación
function animate() {
    const delta = clock.getDelta(); 

    //rotación de la Tierra y la atmósfera
    const rotation = (delta * Math.PI * 2) / 24; 
    earth.rotation.y += rotation;
    atmosphere.rotation.y += rotation * 0.95; 

    //rotación de la Luna alrededor de la Tierra
    moonAngle += moonOrbitSpeed * delta;
    moonGroup.rotation.y = moonAngle; // Rotar el grupo de la Luna

    //mantener siempre la misma cara de la Luna hacia la Tierra
    moon.rotation.y = Math.PI + moonAngle;

    //renderizar la escena
    renderer.render(scene, camera);

    //solicitar el siguiente frame
    requestAnimationFrame(animate);
}

//iniciar la animación
animate();


//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );