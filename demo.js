import * as THREE from 'three';
import { drawThreeGeo } from './index';

//New scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);

//New Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Render the image
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// Create a sphere to make visualization easier.
var planet = new THREE.Object3D();
var geometry = new THREE.SphereGeometry(10, 32, 32);
var material = new THREE.MeshBasicMaterial({
    color: '#333333',
    wireframe: true,
    transparent: true
});

var sphere = new THREE.Mesh(geometry, material);
planet.add(sphere);

// Set the camera position
camera.position.z = 20;

fetch("http://jdomingu.github.io/ThreeGeoJSON/test_geojson/countries_states.geojson", { mode: "cors" }).then(function(resp) {
    if (resp.ok) {
        console.log(resp.status)
        return resp.json()
    }
    console.error('fetch failed')
}).then(function(data) {
    drawThreeGeo(data, 10, 'sphere', {
        color: 'green'
    }, planet);
}).then(function() {
    scene.add(planet)
    render();
}).catch(function(err) {
    console.log(err)
});
