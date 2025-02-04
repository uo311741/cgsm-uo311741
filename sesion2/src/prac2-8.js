import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() ) {
    console.log('WebGL supported and works correctly!')
} else {
    console.warn('WebGL not supported and not working');
}

//Creación de objeto de escena
const scene = new THREE.Scene();

//Este código hace que el objeto body de la página sea el elemento padre del canvas que se creará para renderizar la escena. 
//Este objeto canvas se crea automáticamente mediante la instanciación del renderizador. 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//creación de la cámara
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
camera.position.set(0, 0, 200);

//creación de la Tierra
const geometry = new THREE.SphereGeometry(1, 32, 16); 
const mapUrl = "../textures/tierra.gif";  
const textureLoader = new THREE.TextureLoader();
const map = textureLoader.load(mapUrl, (loaded) => { renderer.render(scene, camera) });
const material = new THREE.MeshPhongMaterial({ map: map });
const earth = new THREE.Mesh(geometry, material);

//creación de la atmósfera
const geometry1  = new THREE.SphereGeometry(1.05, 33, 17); 
const atmosphereMap = new THREE.TextureLoader().load("../textures/atmosfera.png", (loaded) => { renderer.render(scene, camera) });
var atmosphereMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: atmosphereMap, transparent: true });
const atmosphere = new THREE.Mesh(geometry1, atmosphereMaterial);

//creación de la Luna (0.27 veces la Tierra)
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 16);
const moonMap = new THREE.TextureLoader().load("../textures/luna.gif", (loaded) => { renderer.render(scene, camera) });
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonMap });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(3, 0, 0); //posición relativa a la Tierra

//distancia Tierra-Luna (no a escala real)
const distance = 30;
moon.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

//rotación de la Luna para mostrar siempre la misma cara a la Tierra
moon.rotation.y = Math.PI;

//grupo para la Luna
const moonGroup = new THREE.Object3D();
moonGroup.add(moon);

//inclinación de la órbita lunar
moonGroup.rotation.x = 0.089;

//luz puntual
const light = new THREE.PointLight(0xffffff, 4000, 400);
light.position.set(-50, 0, 50);
scene.add(light);

//grupo atmósfera-tierra-luna-luna
const planetGroup = new THREE.Object3D();
planetGroup.add(earth);
planetGroup.add(atmosphere);
planetGroup.add(moonGroup);

//rotación de 23°
planetGroup.rotation.set((23 * Math.PI) / 180, 0, 0);  // Inclinación respecto al eje X 
planetGroup.rotation.set(0, 0, (23 * Math.PI) / 180);  // Inclinación respecto al eje Y

//añadir el grupo a la escena
scene.add(planetGroup);

//esfera solar
let sunMaterial;
let sun;

//crear el objecto 'uniform'
const NOISEMAP = 'textures/cloud.png';
const SUNMAP = 'textures/lavatile.jpg';
const textureLoader2 = new THREE.TextureLoader( );
const uniforms = {
    "fogDensity": { value: 0},
    "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
    "time": { value: 1.0 },
    "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
    "texture1": { value: textureLoader2.load( NOISEMAP ) },
    "texture2": { value: textureLoader2.load( SUNMAP ) }
};

uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

//cargar el shader
const loader = new THREE.FileLoader();
loader.load('shaders/vertex.glsl', (vertexShader) => {
    loader.load('shaders/fragment.glsl', (fragmentShader) => {
        sunMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms
        });

        //crear la esfera solar
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        sun = new THREE.Mesh(sunGeometry, sunMaterial);

        //la esfera solar está en la misma posición que la luz
        sun.position.set(light.position.x, light.position.y, light.position.z);

        //añadir la esfera solar a la escena
        scene.add(sun);

        //función de animación
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
            moonGroup.rotation.y = moonAngle; //rotar el grupo de la Luna

            //mantener siempre la misma cara de la Luna hacia la Tierra
            moon.rotation.y = Math.PI + moonAngle;

            sunMaterial.uniforms.time.value += 0.2 * delta;

            //rotación de la esfera solar
            sun.rotation.y += delta * 0.1;

            //renderizar la escena
            renderer.render(scene, camera);

            //solicitar el siguiente frame
            requestAnimationFrame(animate);
        }

        //iniciar la animación
        animate();
    });
});

//redimensionando la escena
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}, false);
