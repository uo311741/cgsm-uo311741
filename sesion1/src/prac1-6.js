import * as THREE from 'three';

import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() ) {
    console.log('WebGL supported and works correclty!')

} else {
	console.warn('WebGL not supported and not working');
}

//escena
const scene = new THREE.Scene();

//renderer
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//cámara
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 400);

//cubo
const geometry = new THREE.BoxGeometry( 30, 30, 30 ); 
const material = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
const cube = new THREE.Mesh( geometry, material ); 

//esfera
const geometry1 = new THREE.SphereGeometry( 30, 64, 32 ); 
const material1 = new THREE.MeshPhongMaterial( {color: 0x00ff00, shininess: 50 } ); 
const sphere = new THREE.Mesh( geometry1, material1 ); 

//cilindro
const geometry2 = new THREE.CylinderGeometry( 10, 10, 40, 64 ); 
const material2 = new THREE.MeshLambertMaterial( {color: 0x0000ff} ); 
const cylinder = new THREE.Mesh( geometry2, material2 );
cylinder.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

const geometry3 = new THREE.BufferGeometry();

const inner = 40; //tamaño interno
const outer = 20; //tamaño externo

//vértices de la geometría
const vertices = new Float32Array([
    // base (cuadrado)
    -outer, -outer, 0,   
    outer, -outer, 0,   
    outer, outer, 0,  
    -outer, outer, 0,  

    // Techo (triángulo)
     0, inner, 0 
]);

// Índices para definir las caras (triángulos)
const indices = [
    // base (2 triángulos para formar el cuadrado)
    0, 1, 2,     
    2, 3, 0,     

    // techo (triángulo sobre la base)
    0, 1, 4,     
    1, 2, 4,     
    2, 3, 4,     
    3, 0, 4      
];

// asignamos los índices y las posiciones a la geometría
geometry3.setIndex(indices);
geometry3.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const material3 = new THREE.MeshBasicMaterial({ color: 0x0ff0000 });
const house = new THREE.Mesh(geometry3, material3);

//moviendo los objetos desde el origen de coordenadas para que no se solapen
const distance = 80;
cube.position.set(-distance, 0, 0);
cylinder.position.set(0, 0, 0);
sphere.position.set(distance, 0, 0);
house.position.set(distance*2,0,0)

//añadendo los objetos a la escena
scene.add( cube );
scene.add( cylinder );
scene.add( sphere );
scene.add( house );

// añadendo una luz ambiental para iluminar toda la escena
const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);

// añadendo una luz direccional que ilumina en una dirección
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5); // Luz blanca
scene.add(dirLight);

// añadendo una luz puntual que emite luz en todas las direcciones
const pointLight= new THREE.PointLight(0xff0000, 1, 100); // Luz blanca con intensidad 1
pointLight.position.set(50, 50, 50); // Posición de la luz puntual
scene.add(pointLight);

//rendering 
renderer.render( scene, camera );

//Redimensionando la escena
window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    }, false );