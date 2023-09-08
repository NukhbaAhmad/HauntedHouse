import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import dat from "dat.gui";

// Scene
const scene = new THREE.Scene();

// Canvas
const canvas = document.querySelector("canvas.webgl");
// DatGui
const gui = new dat.GUI();

// TextureLoader
const textureLoader = new THREE.TextureLoader();

// WallsTextures
const wallsTexture = textureLoader.load("./textures/bricks/color.jpg");
const wallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/bricks/ambientOcclusion.jpg"
);
const wallsNormalTexture = textureLoader.load("./textures/bricks/normal.jpg");
const wallsRoughnessTexture = textureLoader.load(
  "./textures/bricks/roughness.jpg"
);

// DoorTextures
const doorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/bricks/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);

//FloorTexture
const floorColorTexture = textureLoader.load("./textures/grass/color.jpg");
const floorAmbientOcculusionTexture = textureLoader.load(
  "./textures/grass/ambientOcclusion.jpg.jpg"
);
const floorNormalTexture = textureLoader.load("./textures/grass/normal.jpg");
const floorRoughnessTexture = textureLoader.load(
  "./textures/grass/roughness.jpg"
);
// Repeating - Vector-2 - x and y
floorColorTexture.repeat.set(8, 8);
floorAmbientOcculusionTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorRoughnessTexture.repeat.set(8, 8);

// Stretched Soltuion
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcculusionTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcculusionTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wraptT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;

// Lights
const AmbientLight = new THREE.AmbientLight("#b9d5ff", 0.10);
scene.add(AmbientLight);

const MoonDirectionalLight = new THREE.DirectionalLight("#b9d5ff", 0.10);
MoonDirectionalLight.position.set(-4,5,-2)
scene.add(MoonDirectionalLight);

const moonlighthelper= new THREE.DirectionalLightHelper(MoonDirectionalLight , 0.3)
// scene.add(moonlighthelper)

const doorPointLight = new THREE.PointLight("#ff7d46", 0.8, 12);
doorPointLight.position.y = 0.55;
doorPointLight.position.x = -0.08;
doorPointLight.position.z = 1.2;

// ghostLights
const ghost1 = new THREE.PointLight("#ff00ff", 5, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#ffff00", 5, 7);
ghost2.position.y=4;
scene.add(ghost2);

// Fog
const fog = new THREE.Fog("#262837", 1, 20);
scene.fog = fog;

// Geometry

// Floor
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 0.3),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorAmbientOcculusionTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.835;
scene.add(floor);

// House
const house = new THREE.Group();
scene.add(house);
// Effective only on house
house.add(doorPointLight);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.5, 2),
  new THREE.MeshStandardMaterial({
    // color: "#432616",
    map: wallsTexture,
    aoMap: wallsAmbientOcclusionTexture,
    normalMap: wallsNormalTexture,
    roughnessMap: wallsRoughnessTexture,
  })
);
// Uv2
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.z = 0.02;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(1.9, 1, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  })
);
roof.rotation.y = 0.8;
roof.position.y = 1.097;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(0.8, 0.9, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    // AMap - Black transparent
    transparent: true,
    alphaMap: doorAlphaTexture,
    // AoMap - Need uv-Cordinates
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
// Uv2
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

// Z-fighting glitch at 1
door.position.z = 1 + 0.001;
door.position.y = -0.32;
house.add(door);

// Bushes
const BushGeometry = new THREE.SphereGeometry(1, 10, 10);
const BushMaterial = new THREE.MeshStandardMaterial({
  color: "#61b828",
});

// Bushes Group
const Bush = new THREE.Group();
scene.add(Bush);

// Bush1
const Bush1 = new THREE.Mesh(BushGeometry, BushMaterial);
Bush1.position.y = -0.59;
Bush1.position.x = 0.55;
Bush1.position.z = 1.097;
Bush1.scale.set(0.2, 0.2, 0.2);

// Bush2
const Bush2 = new THREE.Mesh(BushGeometry, BushMaterial);
Bush2.position.y = -0.6;
Bush2.position.x = 0.8;
Bush2.position.z = 1.09;
Bush2.scale.set(0.1, 0.1, 0.1);
// Bush3
const Bush3 = new THREE.Mesh(BushGeometry, BushMaterial);
Bush3.position.y = -0.5;
Bush3.position.x = -0.62;
Bush3.position.z = 1.09;
Bush3.scale.set(0.25, 0.25, 0.25);
// Bush4
const Bush4 = new THREE.Mesh(BushGeometry, BushMaterial);
Bush4.position.y = -0.6;
Bush4.position.x = -0.9;
Bush4.position.z = 1.09;
Bush4.scale.set(0.1, 0.1, 0.1);
// Bush5
const Bush5 = new THREE.Mesh(BushGeometry, BushMaterial);
Bush5.position.y = -0.5;
Bush5.position.x = -0.34;
Bush5.position.z = 1.3;
Bush5.scale.set(0.1, 0.1, 0.1);
// Add all bushes to bush group
Bush.add(Bush1, Bush2, Bush3, Bush4);

// Graves
const Graves = new THREE.Group();
scene.add(Graves);
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: "#585940",
});
for (let i = 0; i <= 25; i++) {
  // GraveMesh
  const GraveMesh = new THREE.Mesh(graveGeometry, graveMaterial);
  // Position
  const x = Math.random() * -(2 - 8) + 2;
  const z = Math.random() * (-8 - 8) + 8;
  GraveMesh.position.set(x, -0.35, z);
  // GraveRotation
  GraveMesh.rotation.z = 0.234;
  GraveMesh.rotation.x = 0.029;
  GraveMesh.castShadow = true;
  // Add to scene
  Graves.add(GraveMesh);
}
for (let i = 0; i <= 25; i++) {
  // GraveMesh
  const GraveMesh = new THREE.Mesh(graveGeometry, graveMaterial);
  // Position
  const x = Math.random() * (-2 - 5) + -2;
  const z = Math.random() * (-8 - 8) + 8;
  GraveMesh.position.set(x, -0.35, z);
  // GraveRotation
  GraveMesh.rotation.z = -0.234;
  GraveMesh.rotation.x = 0.029;
  // GravesShadow
  GraveMesh.castShadow = true;
  // Add to scene
  Graves.add(GraveMesh);
}

// Shadows

// LightsShadow & ShadowOptimization

// MoonLights
MoonDirectionalLight.castShadow=true;
MoonDirectionalLight.shadow.mapSize.width = 256;
MoonDirectionalLight.shadow.mapSize.height = 256;
MoonDirectionalLight.shadow.camera.near=1;
MoonDirectionalLight.shadow.camera.far=6;

// DoorLights
doorPointLight.castShadow=true;
doorPointLight.shadow.mapSize.width = 256;
doorPointLight.shadow.mapSize.height = 256;
doorPointLight.shadow.camera.near = 1;
doorPointLight.shadow.camera.far = 6;

// Ghosts
ghost1.castShadow=true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.near = 1;
ghost2.shadow.camera.far = 6;

ghost2.castShadow=true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.near = 1;
ghost2.shadow.camera.far = 6;

// HouseShadow
walls.castShadow=true;
Bush1.castShadow=true;
Bush2.castShadow = true;
Bush3.castShadow = true;
Bush4.castShadow = true;

// FloorShadow
floor.receiveShadow=true;

// LightOptmization

// Size
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// Camera
const camera = new THREE.PerspectiveCamera(
  55,
  size.width / size.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
// FogEdges
renderer.setClearColor("#262837");
// Shadow
renderer.shadowMap.enabled=true;
// ShadowType
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// SnapShot
const clock = new THREE.Clock();

const SnapShot = () => {
  // ElapsedTime
  const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  //GhostLight
  ghost1.position.x = Math.cos(elapsedTime) * 3.5;
  ghost1.position.z = Math.sin(elapsedTime) * 3.5;
  ghost1.position.y = Math.abs(Math.sin(elapsedTime * 1));

  ghost2.position.x = Math.cos(-elapsedTime) * 6;
  ghost2.position.z = Math.sin(-elapsedTime) * 6;

  //  Render Scene
  renderer.render(scene, camera);

  //   FrameRate
  window.requestAnimationFrame(SnapShot);
};
SnapShot();

// Resize
window.addEventListener("resize", () => {
  // Update Size
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  //   Update Camera Aspect
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  //   Update renderer size

  renderer.setSize(size.width, size.height);

  //   PixelRatio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Handle FullScreen
window.addEventListener("dblclick", () => {
  const FullScreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  //To enter Full Screen
  if (!FullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  }
  //To exit Full Screen
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});
