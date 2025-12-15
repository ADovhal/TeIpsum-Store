import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Pure Three.js mannequin renderer that runs fully on the client.
 * 
 * Props:
 * - bodyParams: { height, chest, waist, hips, shoulderWidth }
 * - products: [{ id, type, color, modelUrl }]
 */
const ThreeMannequinCanvas = ({ bodyParams, products }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Camera position based on height
    const safeParams = {
      height: bodyParams?.height || 175,
      chest: bodyParams?.chest || 100,
      waist: bodyParams?.waist || 85,
      hips: bodyParams?.hips || 95,
      shoulderWidth: bodyParams?.shoulderWidth || 45,
    };

    camera.position.set(
      0,
      safeParams.height / 100,
      (safeParams.height / 100) * 1.5
    );
    camera.lookAt(0, safeParams.height / 100 / 2, 0);

    // Helper: create mannequin group (ported from backend render.js)
    function createMannequin(params) {
      const mannequinGroup = new THREE.Group();

      const heightScale = params.height / 175; // base height 175

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15 * heightScale, 32, 32);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.8,
        metalness: 0.1,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = params.height / 100 * 0.9;
      head.castShadow = true;
      mannequinGroup.add(head);

      // Neck
      const neckGeometry = new THREE.CylinderGeometry(
        0.08 * heightScale,
        0.1 * heightScale,
        0.1 * heightScale,
        32
      );
      const neck = new THREE.Mesh(neckGeometry, headMaterial);
      neck.position.y = params.height / 100 * 0.85;
      neck.castShadow = true;
      mannequinGroup.add(neck);

      // Torso (chest)
      const chestScale = params.chest / 100;
      const chestGeometry = new THREE.CylinderGeometry(
        0.25 * chestScale,
        0.3 * chestScale,
        (params.height / 100) * 0.35,
        32
      );
      const chest = new THREE.Mesh(chestGeometry, headMaterial);
      chest.position.y = params.height / 100 * 0.65;
      chest.castShadow = true;
      mannequinGroup.add(chest);

      // Waist
      const waistScale = params.waist / 85;
      const waistGeometry = new THREE.CylinderGeometry(
        0.2 * waistScale,
        0.25 * chestScale,
        (params.height / 100) * 0.1,
        32
      );
      const waist = new THREE.Mesh(waistGeometry, headMaterial);
      waist.position.y = params.height / 100 * 0.5;
      waist.castShadow = true;
      mannequinGroup.add(waist);

      // Hips
      const hipsScale = params.hips / 95;
      const hipsGeometry = new THREE.CylinderGeometry(
        0.25 * hipsScale,
        0.2 * waistScale,
        (params.height / 100) * 0.25,
        32
      );
      const hips = new THREE.Mesh(hipsGeometry, headMaterial);
      hips.position.y = params.height / 100 * 0.35;
      hips.castShadow = true;
      mannequinGroup.add(hips);

      // Shoulders
      const shoulderScale = params.shoulderWidth / 45;
      const shoulderGeometry = new THREE.BoxGeometry(
        0.4 * shoulderScale,
        0.08 * heightScale,
        0.15 * heightScale
      );
      const shoulders = new THREE.Mesh(shoulderGeometry, headMaterial);
      shoulders.position.y = params.height / 100 * 0.8;
      shoulders.castShadow = true;
      mannequinGroup.add(shoulders);

      // Arms (upper)
      const armUpperGeometry = new THREE.CylinderGeometry(
        0.06 * heightScale,
        0.07 * heightScale,
        (params.height / 100) * 0.25,
        32
      );
      const armUpperL = new THREE.Mesh(armUpperGeometry, headMaterial);
      armUpperL.position.set(-0.15 * shoulderScale, params.height / 100 * 0.65, 0);
      armUpperL.rotation.z = Math.PI / 6;
      armUpperL.castShadow = true;
      mannequinGroup.add(armUpperL);

      const armUpperR = new THREE.Mesh(armUpperGeometry, headMaterial);
      armUpperR.position.set(0.15 * shoulderScale, params.height / 100 * 0.65, 0);
      armUpperR.rotation.z = -Math.PI / 6;
      armUpperR.castShadow = true;
      mannequinGroup.add(armUpperR);

      // Arms (lower)
      const armLowerGeometry = new THREE.CylinderGeometry(
        0.05 * heightScale,
        0.06 * heightScale,
        (params.height / 100) * 0.25,
        32
      );
      const armLowerL = new THREE.Mesh(armLowerGeometry, headMaterial);
      armLowerL.position.set(-0.25 * shoulderScale, params.height / 100 * 0.45, 0);
      armLowerL.castShadow = true;
      mannequinGroup.add(armLowerL);

      const armLowerR = new THREE.Mesh(armLowerGeometry, headMaterial);
      armLowerR.position.set(0.25 * shoulderScale, params.height / 100 * 0.45, 0);
      armLowerR.castShadow = true;
      mannequinGroup.add(armLowerR);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(
        0.08 * heightScale,
        0.1 * heightScale,
        (params.height / 100) * 0.5,
        32
      );
      const legL = new THREE.Mesh(legGeometry, headMaterial);
      legL.position.set(-0.1 * hipsScale, params.height / 100 * 0.1, 0);
      legL.castShadow = true;
      mannequinGroup.add(legL);

      const legR = new THREE.Mesh(legGeometry, headMaterial);
      legR.position.set(0.1 * hipsScale, params.height / 100 * 0.1, 0);
      legR.castShadow = true;
      mannequinGroup.add(legR);

      return mannequinGroup;
    }

    // Mannequin
    const mannequin = createMannequin(safeParams);
    scene.add(mannequin);

    // Clothing
    const loader = new GLTFLoader();
    const clothingGroup = new THREE.Group();

    function createSimpleClothing(product) {
      const clothing = new THREE.Group();

      if (product.type === 'shirt' || product.type === 't-shirt') {
        const shirtGeometry = new THREE.CylinderGeometry(
          0.28 * (safeParams.chest / 100),
          0.32 * (safeParams.chest / 100),
          (safeParams.height / 100) * 0.4,
          32
        );
        const shirtMaterial = new THREE.MeshStandardMaterial({
          color: product.color || 0x3498db,
          roughness: 0.7,
          metalness: 0.1,
        });
        const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
        shirt.position.y = safeParams.height / 100 * 0.65;
        shirt.castShadow = true;
        shirt.receiveShadow = true;
        clothing.add(shirt);
      } else if (product.type === 'pants' || product.type === 'trousers') {
        const pantsMaterial = new THREE.MeshStandardMaterial({
          color: product.color || 0x2c3e50,
          roughness: 0.8,
          metalness: 0.0,
        });

        const legLGeometry = new THREE.CylinderGeometry(
          0.1 * (safeParams.hips / 95),
          0.12 * (safeParams.hips / 95),
          (safeParams.height / 100) * 0.55,
          32
        );
        const legL = new THREE.Mesh(legLGeometry, pantsMaterial);
        legL.position.set(
          -0.1 * (safeParams.hips / 95),
          safeParams.height / 100 * 0.25,
          0
        );
        legL.castShadow = true;
        legL.receiveShadow = true;
        clothing.add(legL);

        const legR = new THREE.Mesh(legLGeometry, pantsMaterial);
        legR.position.set(
          0.1 * (safeParams.hips / 95),
          safeParams.height / 100 * 0.25,
          0
        );
        legR.castShadow = true;
        legR.receiveShadow = true;
        clothing.add(legR);
      }

      clothingGroup.add(clothing);
      return clothing;
    }

    function loadClothing(product) {
      return new Promise((resolve, reject) => {
        if (!product.modelUrl) {
          try {
            const simple = createSimpleClothing(product);
            resolve(simple);
          } catch (e) {
            reject(e);
          }
          return;
        }

        loader.load(
          product.modelUrl,
          (gltf) => {
            const clothing = gltf.scene;
            clothing.scale.setScalar(1);
            clothing.position.y = safeParams.height / 100 * 0.5;
            clothing.castShadow = true;
            clothing.receiveShadow = true;
            clothingGroup.add(clothing);
            resolve(clothing);
          },
          undefined,
          (error) => reject(error)
        );
      });
    }

    const productsSafe = Array.isArray(products) ? products : [];
    Promise.all(productsSafe.map(loadClothing))
      .then(() => {
        scene.add(clothingGroup);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error loading clothing:', error);
      });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c2c2c,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mouse rotation controls
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e) => {
      mouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseUp = () => {
      mouseDown = false;
    };

    const onMouseMove = (e) => {
      if (!mouseDown) return;

      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, safeParams.height / 100 / 2, 0);

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Wheel zoom
    const onWheel = (e) => {
      const distance = camera.position.length();
      const newDistance = distance + e.deltaY * 0.01;
      if (newDistance > 1 && newDistance < 10) {
        camera.position.normalize().multiplyScalar(newDistance);
      }
    };
    renderer.domElement.addEventListener('wheel', onWheel);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);

      container.removeChild(renderer.domElement);

      scene.traverse((object) => {
        if (object.isMesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose && m.dispose());
            } else if (object.material.dispose) {
              object.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
    };
  }, [bodyParams, products]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ThreeMannequinCanvas;

