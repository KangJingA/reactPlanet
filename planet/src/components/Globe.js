import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// import downloaded textures 
import bumpImage from "./images/elev_bump_4k.jpg";
import cloudImage from "./images/fair_clouds_4k.png";
import galaxyImage from "./images/galaxy_starfield.png";
import earthImage from "./images/no_clouds_8k.jpg";
import waterImage from "./images/water_4k.png";


function Marker() {
    THREE.Object3D.call(this);

    var radius = 0.005;
    var sphereRadius = 0.02;
    var height = 0.05;

    var material = new THREE.MeshPhongMaterial({ color: 0xbab68f }); // change colour to smth brighter

    var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
    cone.position.y = height * 0.5;
    cone.rotation.x = Math.PI;

    var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
    sphere.position.y = height * 0.95 + sphereRadius;

    this.add(cone, sphere);
}

Marker.prototype = Object.create(THREE.Object3D.prototype);

// ------ Earth object -------------------------------------------------

function Earth (radius, textureLoader) {
    THREE.Object3D.call(this);
    
    // update global radius
    this.userData.radius = radius;

    // radius, width segments, height segments
    var sphere = new THREE.SphereGeometry(radius, 64.0, 48.0);
    
    //var texture = loader.load('https://s3-eu-west-2.amazonaws.com/bckld/lab/textures/earth_latlon.jpg');
    // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    var texture = new THREE.MeshPhongMaterial({
        map:         textureLoader.load(earthImage),
        bumpMap:     textureLoader.load(bumpImage),
        bumpScale:   0.01,
        specularMap: textureLoader.load(waterImage),
        specular:    new THREE.Color('grey')								
    });

    var earth = new THREE.Mesh(sphere, texture);

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

function createClouds(radius, textureLoader) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.003, 64.0, 48.0),
        new THREE.MeshPhongMaterial({
            map: textureLoader.load(cloudImage),
            transparent: true
        })
    );		
}
function createGalaxy(radius, textureLoader) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, 90, 64), 
        new THREE.MeshBasicMaterial({
            map:  textureLoader.load(galaxyImage), 
            side: THREE.BackSide
        })
    );
}

const Globe = () => {
    const globeRef = useRef(null);

    useEffect(() => {
    var scene = new THREE.Scene();
    
    // field of view, aspect ratio, near plane, far plane
    var camera = new THREE.PerspectiveCamera(
        75,
        globeRef.current.clientWidth / globeRef.current.clientHeight,
        0.01,
        1000
    );
    
    camera.position.z = 2;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globeRef.current.clientWidth,globeRef.current.clientHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.enablePan = false;
    
    var ambient = new THREE.AmbientLight(0x333333,4.5);
    scene.add(ambient);
    // var directional = new THREE.DirectionalLight(0xffffff, 0.8); // colour, intensity 
    // directional.position.set(5.0, 3.0, 5.0) //.normalize();
    //scene.add(directional);
    
    var animate= () => {

        requestAnimationFrame(animate);   
        controls.update();    
        renderer.render(scene, camera);
    }

    // create objects 

    // init texture loader
    var loader = new THREE.TextureLoader();
    
    var earth = new Earth(1.0, loader);
    scene.add(earth);
    // earth.createMarker(48.856700, 2.350800); // Paris
    earth.createMarker(51.507222, -0.1275); // London
    // earth.createMarker(34.050000, -118.250000); // LA
    // earth.createMarker(41.836944, -87.684722); // Chicago
    earth.createMarker(35.683333, 139.683333); // Tokyo
    // earth.createMarker(33.333333, 44.383333); // Baghdad
    // earth.createMarker(40.712700, -74.005900); // New York
    
    var clouds = createClouds(1.0,loader);
    scene.add(clouds);
    var galaxy = createGalaxy(90.0,loader);
    scene.add(galaxy);
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