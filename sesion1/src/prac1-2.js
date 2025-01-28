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
// A continuación se le especifica un tamaño, que será el tamaño del viewport de la escena, y se añade al árbol del DOM.
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//creación de la cámara
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 300 );

//crea un cubo de lado 100 unidades y de material básico, 
//que es blanco por defecto independientemente de las fuentes de luz que haya en la escena.
const geometry = new THREE.BoxGeometry( 100, 100, 100 );
const material = new THREE.MeshBasicMaterial( );
const box = new THREE.Mesh( geometry, material );

//añadir el objeto creado a la escena y renderizarla
scene.add( box );
renderer.render( scene, camera );