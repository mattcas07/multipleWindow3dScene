// engine.js — exporta la clase SceneEngine
import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js';

export class SceneEngine {
  constructor({ container, baseColor, onParamChange }) {
    this.onParamChange = onParamChange;
    this.color = baseColor;
    this.morph = 0;

    // — SCENE / CAMERA / RENDERER —
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 100 );
    this.camera.position.set( 0, 0, 5 );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( this.renderer.domElement );

    // — LIGHTS —
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set( 5, 5, 5 );
    this.scene.add(light);

    // — GEOMETRÍA Y MATERIAL —
    const geom = new THREE.SphereGeometry(1, 64, 64);
    this.mat = new THREE.MeshStandardMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.1
    });
    this.mesh = new THREE.Mesh( geom, this.mat );
    this.scene.add( this.mesh );

    // — EVENTOS & ANIMACIÓN —
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.animate();
  }

  onResize() {
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onScroll() {
    // mapeo scroll → morph [0,1]
    const f = Math.min(1, window.scrollY / (document.body.scrollHeight - window.innerHeight));
    if (Math.abs(f - this.morph) < 0.001) return;
    this.morph = f;
    this.mat.displacementScale = f * 0.5;
    this.onParamChange(f);
  }

  setMorph(f) {
    this.morph = f;
    this.mat.displacementScale = f * 0.5;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    // pequeña rotación continua
    this.mesh.rotation.y += 0.005;
    this.mesh.rotation.x += 0.003;
    this.renderer.render(this.scene, this.camera);
  }
}
