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
camera.position.set( 0, 0, 300 );

//crea un cubo de lado 100 unidades y con textura
const geometry = new THREE.BoxGeometry( 100, 100, 100 );
const mapUrl = "../textures/crate.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
const material = new THREE.MeshBasicMaterial( { map: map } );
const box = new THREE.Mesh( geometry, material );

//rotacion
box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

//añadir el objeto creado a la escena y renderizarla
scene.add( box );
renderer.render( scene, camera );

//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );