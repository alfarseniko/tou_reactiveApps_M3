import * as React from "react";
import * as THREE from "three";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export default function ThreeViewer() {
  let scene: THREE.Scene | null;
  let mesh: THREE.Object3D | null;
  let renderer: THREE.WebGLRenderer | null;
  let cameraControls: OrbitControls | null;
  let camera: THREE.PerspectiveCamera | null;
  let axes: THREE.AxesHelper | null;
  let grid: THREE.GridHelper | null;
  let directionalLightTop: THREE.DirectionalLight | null;
  let ambientLight: THREE.AmbientLight | null;
  let objLoader: OBJLoader | null;
  let mtlLoader: MTLLoader | null;

  function setViewer() {
    scene = new THREE.Scene();

    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLDivElement;
    if (!viewerContainer) {
      console.error("Viewer container not found!");
    }
    const containerDimensions = viewerContainer.getBoundingClientRect();

    const fov = 75;
    camera = new THREE.PerspectiveCamera(fov);
    camera.position.z = 5;
    camera.near = 0.0001;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    function resizeViewer() {
      if (!camera) {
        return;
      }
      const containerDimensions = viewerContainer.getBoundingClientRect();
      renderer?.setSize(containerDimensions.width, containerDimensions.height);
      camera.aspect = containerDimensions.width / containerDimensions.height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", () => resizeViewer());
    resizeViewer();
    viewerContainer.append(renderer.domElement);
    renderer.setSize(containerDimensions.width, containerDimensions.height);

    directionalLightTop = new THREE.DirectionalLight();
    directionalLightTop.position.y = -10;
    ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.4;

    scene.add(ambientLight, directionalLightTop);

    cameraControls = new OrbitControls(camera, viewerContainer);

    function renderScene() {
      if (!scene) {
        return;
      }
      if (!camera) {
        return;
      }
      renderer?.render(scene, camera);
      requestAnimationFrame(renderScene);
    }

    renderScene();

    axes = new THREE.AxesHelper();
    grid = new THREE.GridHelper();
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    grid.material.color = new THREE.Color("#fff");

    scene.add(axes, grid);

    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();

    mtlLoader.load("../assets/3dModel/skull.mtl", (materials) => {
      materials.preload();
      objLoader?.setMaterials(materials);
      objLoader?.load("../assets/3dModel/skull.obj", (object) => {
        if (!scene) {
          return;
        }
        scene.add(object);
        mesh = object;
      });
    });
  }
  useEffect(() => {
    setViewer();
    return () => {
      mesh?.removeFromParent();
      mesh?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      mesh = null;
    };
  }, []);

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0 }}
    />
  );
}
