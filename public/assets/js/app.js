/** Import */
import * as THREE from "../../three/build/three.module.js";
import { OrbitControls } from "../../three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../../three/examples/jsm/loaders/FBXLoader.js";
import { RGBELoader } from "../../three/examples/jsm/loaders/RGBELoader.js";

import { WEBGL } from "./WebGL.js";

/** Setup global variables */
var container, controls;
var camera, scene, renderer, pmremGenerator;
var modelsGroup;
var isLocal;
var bottle;
var loadedChain;
var loadedKeyChain;
var withoutChainCheckbox;
var viewAsKeyChain;
var lidMaterial,
  bodyMaterial,
  helixMaterial,
  liquidMaterial,
  ringMaterial,
  textures;

var dataSet = {
  camera: {
    position: new THREE.Vector3(0, 70, -600),
    target: new THREE.Vector3(0, 40, 0),
    distance: 200,
    fov: 45,
    z: 0,
  },
  containerWidth: 0,
  containerHeight: 0,
  containerInitWidth: 0,
  containerInitHeight: 0,
  aspectRatio: 0,
};

$(document).ready(init);

function init() {
  textures = {};
  isLocal = true;
  bottle = $("#bottles option:selected").val();
  withoutChainCheckbox = $("#withoutChainCheckbox");
  viewAsKeyChain = $("#viewAsKeyChain");
  if (WEBGL.isWebGLAvailable()) {
    modelsGroup = new THREE.Group();
    modelsGroup.name = "Group";

    initRenderer();
    initCamera();
    initScene();
    initEnvironment();
    initEvents();
    animate();
  } else {
    $(document).trigger("WEBGL_ERROR");
  }

  // Listen to click event of without chain control

  withoutChainCheckbox.change((e) => {
    let flag = e.target.checked;

    if (flag) {
      removeChainFormScene();
    } else {
      addChainToScene();
    }
  });

  // Listen to click event of without chain control

  viewAsKeyChain.change((e) => {
    let flag = e.target.checked;

    if (flag) {
      disabledWithoutChainControl();
      removeChainFormScene();
      addKeyChainToScene();
    } else {
      enabledWithoutChainControl();
      addChainToScene();
      removeKeyChainFormScene();
    }
  });
  disabledWithoutChainControl();
  disabledKeyChainControl();
}

function initRenderer() {
  container = $("#canvasHolder");
  dataSet.containerInitWidth = dataSet.containerWidth = container.width();
  dataSet.containerInitHeight = dataSet.containerHeight = container.height();
  dataSet.aspectRatio = container.width() / container.height();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(dataSet.containerWidth, dataSet.containerHeight);
  renderer.setClearColor(0x000000, 0);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  container.append(renderer.domElement);

  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, dataSet.aspectRatio, 1, 600);
  camera.position.set(0, 40, -150);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.target = new THREE.Vector3(0, 40, 0);
  controls.screenSpacePanning = true;
  controls.minDistance = 50;
  controls.maxDistance = 300;
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefefef);
  scene.add(modelsGroup);

  scene.fog = new THREE.Fog(0xefefef, 400, 550);

  const light2 = new THREE.PointLight(0xffffff, 0.1);
  light2.position.set(6, 350, -250);
  light2.castShadow = true;

  light2.shadow.mapSize.width = 2048;
  light2.shadow.mapSize.height = 2048;
  light2.shadow.camera.near = 0.5;
  light2.shadow.camera.far = 1500;

  scene.add(light2);
}

function initEnvironment() {
  var path = isLocal ? "./assets/textures/env/" : "./assets/textures/env/";
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath(path)
    .load("ballroom_1k.hdr", function (texture) {
      var envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
      initMaterials();
    });
}

function initMaterials() {
  //She
  textures.sheLidNormalTexture = loadTexture(
    "./assets/textures/shebox/lid_normal.jpg"
  );
  textures.sheBodyBaseTexture = loadTexture(
    "./assets/textures/shebox/body_baked.jpg"
  );
  textures.she5mlLidNormalTexture = loadTexture(
    "./assets/textures/shebox/5ml_lid_normal.jpg"
  );
  textures.she5mlBodyBaseTexture = loadTexture(
    "./assets/textures/shebox/5ml_body_baked.jpg"
  );
  textures.sheLinkRingBaseTexture = loadTexture(
    "./assets/textures/shebox/lid_basecolor.jpg"
  );

  //He
  textures.heLidBaseTexture = loadTexture(
    "./assets/textures/hebox/lid_basecolor.jpg"
  );
  textures.he5mlLidBaseTexture = loadTexture(
    "./assets/textures/hebox/5ml_lid_basecolor.jpg"
  );
  textures.heLidTexture = loadTexture("./assets/textures/hebox/lid.jpg");
  textures.he5mlLidTexture = loadTexture("./assets/textures/hebox/5ml_lid.jpg");
  textures.heBodyBaseTexture = loadTexture(
    "./assets/textures/hebox/body_baked.jpg"
  );
  textures.he5mlBodyBaseTexture = loadTexture(
    "./assets/textures/hebox/5ml_body_baked.jpg"
  );
  textures.heLinkRingBaseTexture = loadTexture(
    "./assets/textures/hebox/lid_basecolor.jpg"
  );

  //They
  textures.theyLidBaseTexture = loadTexture(
    "./assets/textures/theybox/lid_basecolor.jpg"
  );
  textures.they5mlLidBaseTexture = loadTexture(
    "./assets/textures/theybox/5ml_lid_basecolor.jpg"
  );
  textures.theyBodyBaseTexture = loadTexture(
    "./assets/textures/theybox/body_baked.jpg"
  );
  textures.they5mlBodyBaseTexture = loadTexture(
    "./assets/textures/theybox/5ml_body_baked.jpg"
  );
  textures.theyLidTexture = loadTexture("./assets/textures/theybox/lid.jpg");
  textures.they5mlLidTexture = loadTexture(
    "./assets/textures/theybox/5ml_lid.jpg"
  );
  textures.theyLinkRingBaseTexture = loadTexture(
    "./assets/textures/theybox/lid_basecolor.jpg"
  );

  lidMaterial = new THREE.MeshPhysicalMaterial({});

  helixMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbcbcb,
    envMapIntensity: 0.4,
    metalness: 0.25,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.13,
    envMapIntensity: 1.5,
    side: THREE.BackSide,
    depthWrite: true,
    depthTest: true,
  });

  ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdbdbdb,
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
  });

  bodyMaterial = new THREE.MeshPhysicalMaterial({
    map: null,
    metalness: 0.09,
    roughness: 0.12,
    envMapIntensity: 1,
    depthWrite: true,
    transmission: 1,
    opacity: 1,
    side: THREE.DoubleSide,
    ior: 5,
    thickness: 5,
    specularIntensity: 1,
    specularTint: 0xfffdf3,
    transparent: true,
  });

  updateMaterials();
  if (bottle.indexOf("5ml") == -1) {
    loadModel(bottle + "box.fbx");
  } else {
    loadModel("5mlbox.fbx");
  }
}

function updateMaterials() {
  bodyMaterial.map = textures[bottle + "BodyBaseTexture"];
  if (bottle == "she" || bottle == "she5ml") {
    lidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x936a22,
      envMapIntensity: 0.5,
      metalness: 1,
      roughness: 0.1,
      side: THREE.DoubleSide,
      normalMap: textures[bottle + "LidNormalTexture"],
      normalScale: new THREE.Vector2(0.75, 0.75),
    });

    liquidMaterial.color = new THREE.Color(0xd9c468);
  } else if (bottle == "he" || bottle == "he5ml") {
    lidMaterial = new THREE.MeshPhysicalMaterial({
      map: textures[bottle + "LidBaseTexture"],
      envMapIntensity: 0.5,
      metalness: 1,
      roughnessMap: textures[bottle + "LidTexture"],
      side: THREE.DoubleSide,
    });

    liquidMaterial.color = new THREE.Color(0xa04c1d);
  } else if (bottle == "they" || bottle == "they5ml") {
    lidMaterial = new THREE.MeshPhysicalMaterial({
      map: textures[bottle + "LidBaseTexture"],
      envMapIntensity: 0.65,
      metalness: 1,
      roughnessMap: textures[bottle + "LidTexture"],
      side: THREE.DoubleSide,
    });

    liquidMaterial.color = new THREE.Color(0xff9900);
  }
}

function initEvents() {
  window.addEventListener("resize", onWindowResize, false);
  $("#bottles").on("change", function () {
    resetScene();
    resetCheckboxControl();
    bottle = $(this).val();
    updateMaterials();
    if (bottle.indexOf("5ml") == -1) {
      loadModel(bottle + "box.fbx");

      disabledWithoutChainControl();
      disabledKeyChainControl();
    } else {
      //Checking if the bottle name starts with 5ml then addin different chain to each bottle

      loadModel("chain.fbx");
      loadModel("5mlbox.fbx");
      loadModel("key_chain.fbx");

      enabledWithoutChainControl();
      enabledKeyChainControl();
    }
  });
}

function loadModel(fbx) {
  loading(true);
  var loader = new FBXLoader();
  loader.load("./assets/models/" + fbx, function (object) {
    object.name = fbx;

    //Setting position and scaling chain model
    switch (object.name) {
      case "chain.fbx":
        object.scale.multiplyScalar(5);
        object.position.set(0, 101, 0);
        break;
      case "key_chain.fbx":
        object.rotation.y = Math.PI;
        object.rotation.z = Math.PI / 10;
        object.scale.multiplyScalar(5);
        object.position.set(-14, 17, 0);
        break;
      default:
        object.scale.multiplyScalar(0.8);
        object.position.set(0, 0, 0);
        break;
    }

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;

        if (child.name == "lid") {
          child.material = lidMaterial;
        } else if (child.name == "body") {
          child.material = bodyMaterial;
        } else if (child.name == "liquid") {
          child.material = liquidMaterial;
        } else if (child.name == "helix") {
          child.material = helixMaterial;
        } else {
          child.material = lidMaterial;
        }
      }
    });

    if (fbx === "key_chain.fbx") {
      loadedKeyChain = object;
    } else {
      modelsGroup.add(object);
    }
    onWindowResize();
    loading(false);
  });
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = dataSet.aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(dataSet.containerWidth, dataSet.containerHeight);
}

function resetScene() {
  for (var i = 0; i < scene.getObjectByName("Group").children.length; i++) {
    scene.remove(scene.getObjectByName("Group").children[i]);
  }
  scene.remove(scene.getObjectByName("Group"));

  modelsGroup = new THREE.Group();
  modelsGroup.name = "Group";

  scene.add(modelsGroup);

  camera.position.set(
    dataSet.camera.position.x,
    dataSet.camera.position.y,
    dataSet.camera.position.z
  );
  controls.target.set(
    dataSet.camera.target.x,
    dataSet.camera.target.y,
    dataSet.camera.target.z
  );
  camera.fov = dataSet.camera.fov;

  camera.updateProjectionMatrix();
  controls.update();
}

function log() {
  try {
    console.log.apply(console, arguments);
  } catch (e) {
    return;
  }
}

function loading(s) {
  if (s) {
    $("#loading").removeClass("hidden");
  } else {
    $("#loading").addClass("hidden");
  }
}

function loadTexture(path) {
  return new THREE.TextureLoader().load(path);
}

function resetCheckboxControl() {
  $("#withoutChainCheckbox").prop("checked", false);
  $("#viewAsKeyChain").prop("checked", false);
}

function disabledWithoutChainControl() {
  $("#withoutChainCheckbox").prop("disabled", true);
}

function disabledKeyChainControl() {
  $("#viewAsKeyChain").prop("disabled", true);
}

function enabledWithoutChainControl() {
  $("#withoutChainCheckbox").prop("disabled", false);
}

function enabledKeyChainControl() {
  $("#viewAsKeyChain").prop("disabled", false);
}

function removeChainFormScene() {
  let group = scene.children[1];

  for (let i = 0; i < group.children.length; i++) {
    if (group.children[i].name === "chain.fbx") loadedChain = group.children[i];
  }

  group.remove(loadedChain);
}

function removeKeyChainFormScene() {
  let group = scene.children[1];

  for (let i = 0; i < group.children.length; i++) {
    if (group.children[i].name === "key_chain.fbx")
      loadedKeyChain = group.children[i];
  }

  group.remove(loadedKeyChain);
}

function addChainToScene() {
  let group = scene.children[1];
  group.add(loadedChain);
}

function addKeyChainToScene() {
  let group = scene.children[1];

  group.add(loadedKeyChain);
}
