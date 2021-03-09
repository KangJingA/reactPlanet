import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

function Marker() {
    THREE.Object3D.call(this);

    var radius = 0.005;
    var sphereRadius = 0.02;
    var height = 0.05;

    var material = new THREE.MeshPhongMaterial({ color: 0xbab68f });

    var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
    cone.position.y = height * 0.5;
    cone.rotation.x = Math.PI;

    var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
    sphere.position.y = height * 0.95 + sphereRadius;

    this.add(cone, sphere);
}

Marker.prototype = Object.create(THREE.Object3D.prototype);

// ------ Earth object -------------------------------------------------

function Earth (radius, texture) {
    THREE.Object3D.call(this);

    this.userData.radius = radius;

    var sphere = new THREE.SphereBufferGeometry(radius, 64.0, 48.0);
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var earth = new THREE.Mesh(sphere, material);

    this.add(earth);
};

Earth.prototype = Object.create(THREE.Object3D.prototype);

Earth.prototype.createMarker = function (lat, lon) {
    var marker = new Marker();

    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var r = this.userData.radius;

    marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

    this.add(marker);
};


const Globe = () => {
    const globeRef = useRef(null);

    useEffect(() => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        75,
        globeRef.current.clientWidth / globeRef.current.clientHeight,
        0.1,
        1000
    );
    
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globeRef.current.clientWidth,globeRef.current.clientHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.0;
    controls.enablePan = false;
    
    var ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    var directional = new THREE.DirectionalLight(0xffffff, 0.5);
    directional.position.set(5.0, 2.0, 5.0).normalize();
    scene.add(directional);
    
    var animate= () => {

        requestAnimationFrame(animate);   
        controls.update();    
        renderer.render(scene, camera);
    }

    camera.position.z = 2;

    var loader = new THREE.TextureLoader();
    loader.load('https://s3-eu-west-2.amazonaws.com/bckld/lab/textures/earth_latlon.jpg', (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        var earth = new Earth(1.0, texture);
        scene.add(earth);
        earth.createMarker(48.856700, 2.350800); // Paris
        earth.createMarker(51.507222, -0.1275); // London
        earth.createMarker(34.050000, -118.250000); // LA
        earth.createMarker(41.836944, -87.684722); // Chicago
        earth.createMarker(35.683333, 139.683333); // Tokyo
        earth.createMarker(33.333333, 44.383333); // Baghdad
        earth.createMarker(40.712700, -74.005900); // New York
    });
    
    animate();

    window.addEventListener('resize', onResize);
    onResize();

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    }, []);
    
    return (
        <div
        ref={globeRef}
        style={{ width: "100%", height: "100%", margin: "0px" }}
        >
      </div>
    );
    };
 
export default Globe;