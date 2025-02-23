import * as THREE from 'three';

import WebGL from 'three/addons/capabilities/WebGL.js';

import dashjs from "./dash.all.min.js"

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
camera.position.set( 0, 0, 1000 );

//canvas video
const video = document.getElementById( 'player' );

const image = document.createElement( 'canvas' );
image.width = 1920;  // Video width
image.height = 1080; // Video height
const imageContext = image.getContext( '2d' );
imageContext.fillStyle = '#000000';
imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
const texture = new THREE.Texture( image );

//plano con textura video
const material = new THREE.MeshBasicMaterial( { map: texture } );
const wall = new THREE.Mesh( new THREE.PlaneGeometry( image.width, image.height, 4, 4 ), material );
scene.add( wall );

const manifestUrl = 'http://localhost:60080/sintel_final.mpd'; 
const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), manifestUrl, true);


function animate() {
    requestAnimationFrame(animate);

    wall.rotation.y += 0.01;

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
        imageContext.drawImage( video, 0, 0 );
        if ( texture ) texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
}

animate();

//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );