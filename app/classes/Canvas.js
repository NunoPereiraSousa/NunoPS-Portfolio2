import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "shaders/fragment.glsl";
import vertex from "shaders/vertex.glsl";
import gsap from "gsap";
import mockup from "../../shared/Mockup.jpg";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

export default class Canvas {
  constructor(options) {
    this.container = document.querySelector(options.domElement);

    this.scroll = options.scroll;

    this.height = this.container.offsetHeight;
    this.width = this.container.offsetWidth;

    this.time = 0;
    this.speed = 0;
    this.speedTarget = 0;

    this.materials = [];
    this.images = [...document.querySelectorAll("img")];

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.addCamera();
    this.addRenderer();

    // this.addControls();

    this.addImages();
    this.setPosition();

    this.mouseMovement();
    this.resize();

    this.composerPass();
    this.render();

    this.setupResize();
  }

  /**
   * Add controls to the scene
   */
  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * Add three js renderer
   */
  addRenderer() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * Add three js camera
   */
  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 1;
  }

  composerPass() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    //custom shader pass
    var counter = 0.0;
    this.myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        scrollSpeed: { value: null }
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix 
          * modelViewMatrix 
          * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      uniform float scrollSpeed;
      void main(){
        vec2 newUV = vUv;
        float area = smoothstep(0.4,0.,vUv.y);
        area = pow(area, 4.);
        newUV.x -= (vUv.x - 0.5)*0.03*area*scrollSpeed;
        gl_FragColor = texture2D( tDiffuse, newUV);
        // gl_FragColor = vec4(area,0.,0.,1.);
      }
      `
    };

    this.customPass = new ShaderPass(this.myEffect);
    this.customPass.renderToScreen = true;

    this.composer.addPass(this.customPass);

    console.log(this.composer);
  }

  /**
   * Add images to the scene
   */
  addImages() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uImage: { value: 0 },
        hover: { value: new THREE.Vector2(0.5, 0.5) },
        hoverState: { value: 0 },
        mockupTexture: { value: new THREE.TextureLoader().load(mockup) }
      },
      side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex
    });

    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect();

      let geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10);

      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      let material = this.material.clone();

      img.addEventListener("mouseenter", () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 1
        });
      });

      img.addEventListener("mouseout", () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 0
        });
      });

      this.materials.push(material);

      material.uniforms.uImage.value = texture;

      let mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);

      mesh.scale.set(bounds.width, bounds.height, 1);

      return {
        img: img,
        mesh: mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      };
    });

    console.log(this.imageStore);
  }

  setPosition() {
    this.imageStore.forEach(o => {
      o.mesh.position.y =
        this.currentScroll - o.top + this.height / 2 - o.height / 2;
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
    });
  }

  /**
   * Resize changes
   */
  resize() {
    this.height = this.container.offsetHeight;
    this.width = this.container.offsetWidth;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;

    this.imageStore.forEach(i => {
      let bounds = i.img.getBoundingClientRect();

      i.mesh.scale.set(bounds.width, bounds.height, 1);

      i.top = bounds.top + this.currentScroll;
      i.left = bounds.left;
      i.width = bounds.width;
      i.height = bounds.height;
    });
  }

  mouseMovement() {
    window.addEventListener(
      "mousemove",
      event => {
        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
          console.log(intersects[0]);

          let obj = intersects[0].object;
          obj.material.uniforms.hover.value = intersects[0].uv;
        }
      },
      false
    );
  }

  /**
   * Resize event listener
   */
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  /**
   * Animation loop
   */
  render() {
    this.time += 0.05;
    // this.scroll.render();

    this.setPosition();

    this.speed =
      Math.min(
        Math.abs(Math.round(this.scroll.current) - this.scroll.current),
        200
      ) / 200;
    this.speedTarget += (this.speed - this.speedTarget) * 0.2;

    this.customPass.uniforms.scrollSpeed.value = this.speedTarget;

    this.materials.forEach(m => {
      m.uniforms.time.value = this.time;
    });

    this.composer.render();

    window.requestAnimationFrame(this.render.bind(this));
  }
}
