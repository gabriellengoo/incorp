
import React, { Component } from "react";

import {
  Scene,
  Engine,
  AssetsManager,
  ArcRotateCamera,CubicEase,Animation,
  Vector3,
  HemisphericLight,QuadraticEase,
  SpotLight,
  PointLight,
  ShadowGenerator,
  FxaaPostProcess,
  PassPostProcess,
  ConvolutionPostProcess,
  TonemapPostProcess,
  TonemappingOperator,
  DefaultRenderingPipeline,
  ImageProcessingPostProcess,
  ParticleSystem,EasingFunction,
  Mesh,
  SceneLoader,Layer,
  Color3,
  Color4,
  Tools,
  HighlightLayer,
  MeshBuilder,
  Texture,
  FreeCamera,
  DirectionalLight,
  PhotoDome,
  HDRCubeTexture,
  CubeTexture,
  StandardMaterial,
  PBRMaterial,
  PBRMetallicRoughnessMaterial,
  ReflectionProbe,
  FresnelParameters,
  RefractionTexture,
  BackgroundMaterial,
  MirrorTexture,
  Plane,
  ActionManager,
  SwitchBooleanAction,
  ExecuteCodeAction,
  PointerEventTypes,
  KeyboardEventTypes,
  Axis,
  GlowLayer,
  Space,
  Matrix,
  DefaultLoadingScreen,
  EnvironmentTextureTools,
} from "babylonjs";
import "babylonjs-loaders";

// Here we extend Reacts component class
class Scene3 extends Component {
  // Makes the canvas behave responsively
  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
    }
  };

  // Sets up our canvas tag for webGL scene
  setEngine = () => {
    this.engine = new Engine(this.stage, true, {
      antialias: true,
      stencil: true,
      preserveDrawingBuffer: true,
    });
  };

  // Creates the scene graph
  setScene = () => {
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(1, 1, 1, 1).toLinearSpace();
    // this.scene.debugLayer.show();
  };

  setCamera = () => {
    this.camera = new ArcRotateCamera(
        "Camera",
        1.5708,
        1.5708,
        512.0955,
        new Vector3(-3.317, 151.078, -6.399),
        this.scene
      );
      this.camera.attachControl(this.stage, true);
      this.camera.lowerRadiusLimit=512.0955
      this.camera.upperRadiusLimit=512.0955
  };


  constructor(props) {
    super(props);
    // We bind our event to keep the proper "this" context.
    this.loadModels = this.loadModels.bind(this);
  }

  loadModels = async () => {
    DefaultLoadingScreen.prototype.displayLoadingUI = function () {
      if (this._loadingDiv) {
        // Do not add a loading screen if there is already one
        return;
      }
    //   this._loadingDivBlock = document.createElement("div");
    //   this._loadingDivBlock.id = "babylonjsLoadingDivBlock";
    //   this._loadingDivBlock.style.opacity = "1";
    //   this._loadingDiv = document.createElement("div");
    //   this._loadingDiv.id = "babylonjsLoadingDiv";
    //   this._loadingDiv.style.animation = "spin 1s linear infinite";
    //   // Generating keyframes
    //   var style = document.createElement("style");
    //   style.type = "text/css";
    //   document.getElementsByTagName("head")[0].appendChild(style);
    //   document.body.appendChild(this._loadingDivBlock);
    //   this._loadingDivBlock.appendChild(this._loadingDiv);
    //   this._loadingDivBlock.style.transition = "opacity 1s ease";
    //   this._loadingDivBlock.style.pointerEvents = "none";
    //   this._loadingDivBlock.style.backgroundColor = "transparent";
    //   this._loadingDivBlock.style.position = "absolute";
    //   this._loadingDivBlock.style.width = "100%";
    //   this._loadingDivBlock.style.height = "100vh";
    //   this._loadingDivBlock.style.top = "-15vh";
    //   if (window.innerWidth < 470) {
    //     this._loadingDivBlock.style.left = "-12%";
    //   } else {
    //     this._loadingDivBlock.style.left = "-4%";
    //   }
    //   this._loadingDiv.style.opacity = "1";
    //   this._loadingDiv.style.transition = "opacity 1s ease";
    //   this._loadingDiv.style.pointerEvents = "none";
    //   this._loadingDiv.style.backgroundColor = "transparent";
    //   this._loadingDiv.style.borderRadius = "50%";
    //   this._loadingDiv.style.position = "relative";
    //   this._loadingDiv.style.margin = "auto";
    //   this._loadingDiv.style.top = "47vh";
    //   this._loadingDiv.style.width = "12vh";
    //   this._loadingDiv.style.height = "12vh";
    //   this._loadingDiv.innerHTML = "<img src='loadingfig.gif' />";
    };
    
    let HDR = new CubeTexture.CreateFromPrefilteredData(
      "./Hdr.env",
      this.scene
    );
    //HDR.setReflectionTextureMatrix(Matrix.RotationY(Tools.ToRadians(0)));
    this.scene.environmentTexture = HDR;
    HDR.level = 1;
    
    await SceneLoader.AppendAsync("", "./model_80 (1).glb", this.scene);

    this.engine.runRenderLoop(() => {
 

      this.scene.render();
    });
  };

  //Build the scene when the component has been loaded.
  componentDidMount() {
    this.setEngine();
    this.setScene();
    this.setCamera();
    this.loadModels();
    window.addEventListener("resize", this.onResizeWindow);
  }
  //Renderes our Canvas tag and saves a reference to it.
  render() {
    return <canvas className="canvas3d" ref={(el) => (this.stage = el)}></canvas>;
  }
}
//returns the scene to be used by other components
export default Scene3;
