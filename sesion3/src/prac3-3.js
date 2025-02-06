import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';

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
camera.position.set( 0, 0, 300 );

//crea un cubo de lado 100 unidades y de material básico, 
//que es blanco por defecto independientemente de las fuentes de luz que haya en la escena.
const geometry = new THREE.BoxGeometry( 100, 100, 100 );
const textureLoader = new THREE.TextureLoader( );  
//añadendo textura y el mapa topológico
const material = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "textures/brick.jpg" ),
        bumpMap: textureLoader.load( "textures/brick-map.jpg" )
    } );
const box = new THREE.Mesh( geometry, material );

//control
const controlData = {
    bumpScale: material.bumpScale
}

//stats
let stats = new Stats( );
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

//rotacion
box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

//añadir el objeto creado a la escena y renderizarla
scene.add( box );

// añadendo una luz ambiental para iluminar toda la escena
const ambientLight = new THREE.AmbientLight(0xffffff); 
scene.add(ambientLight);

// añadendo una luz direccional que ilumina en una dirección
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5); // Luz blanca
scene.add(dirLight);

// añadendo una luz puntual que emite luz en todas las direcciones
const pointLight= new THREE.PointLight(0xff0000, 1, 100); // Luz blanca con intensidad 1
pointLight.position.set(50, 50, 50); // Posición de la luz puntual
scene.add(pointLight);

function animate() {
    box.rotation.y += -0.005;
    renderer.render(scene, camera);
    material.bumpScale = controlData.bumpScale;
    stats.update( );
    requestAnimationFrame(animate);
    
}

animate();

const gui = new GUI( );
gui.add( controlData, 'bumpScale', -4, 4 ).step(0.1).name( 'bumpScale' );

//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );