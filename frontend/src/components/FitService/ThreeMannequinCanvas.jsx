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

    // Helper: create mannequin group (more realistic human-like proportions)
    function createMannequin(params) {
      const mannequinGroup = new THREE.Group();

      const heightMeters = params.height / 100;
      const heightScale = params.height / 175; // relative to base 175 cm

      // Base materials
      const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe0c2,
        roughness: 0.7,
        metalness: 0.05,
      });
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.6,
        metalness: 0.05,
      });

      // ===== HEAD & NECK =====
      const headHeight = heightMeters * 0.12; // ~1/8 of body
      const headRadius = headHeight * 0.32;

      const headGeometry = new THREE.SphereGeometry(headRadius, 48, 48);
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.y = heightMeters * 0.92;
      head.castShadow = true;
      mannequinGroup.add(head);

      const neckHeight = headHeight * 0.35;
      const neckRadius = headRadius * 0.45;
      const neckGeometry = new THREE.CylinderGeometry(
        neckRadius,
        neckRadius * 1.05,
        neckHeight,
        32
      );
      const neck = new THREE.Mesh(neckGeometry, skinMaterial);
      neck.position.y = heightMeters * 0.85;
      neck.castShadow = true;
      mannequinGroup.add(neck);

      // ===== TORSO =====
      const chestScale = params.chest / 100;
      const waistScale = params.waist / 85;
      const hipsScale = params.hips / 95;
      const shoulderScale = params.shoulderWidth / 45;

      const torsoHeight = heightMeters * 0.38;
      const upperTorsoHeight = torsoHeight * 0.55;
      const lowerTorsoHeight = torsoHeight * 0.45;

      // Upper torso (rib cage) – more rounded
      const upperTorsoGeometry = new THREE.CylinderGeometry(
        0.20 * chestScale,
        0.26 * chestScale,
        upperTorsoHeight,
        40
      );
      const upperTorso = new THREE.Mesh(upperTorsoGeometry, bodyMaterial);
      upperTorso.position.y = heightMeters * 0.68;
      upperTorso.castShadow = true;
      mannequinGroup.add(upperTorso);

      // Lower torso (abs/waist)
      const lowerTorsoGeometry = new THREE.CylinderGeometry(
        0.16 * waistScale,
        0.20 * chestScale,
        lowerTorsoHeight,
        36
      );
      const lowerTorso = new THREE.Mesh(lowerTorsoGeometry, bodyMaterial);
      lowerTorso.position.y = heightMeters * 0.54;
      lowerTorso.castShadow = true;
      mannequinGroup.add(lowerTorso);

      // Pelvis / hips block – slightly wider
      const pelvisHeight = heightMeters * 0.20;
      const pelvisGeometry = new THREE.CapsuleGeometry(
        0.18 * hipsScale,
        pelvisHeight * 0.4,
        8,
        24
      );
      const pelvis = new THREE.Mesh(pelvisGeometry, bodyMaterial);
      pelvis.rotation.z = Math.PI / 2;
      pelvis.position.y = heightMeters * 0.40;
      pelvis.castShadow = true;
      mannequinGroup.add(pelvis);

      // ===== SHOULDERS & ARMS =====
      const shoulderWidth = 0.45 * shoulderScale; // overall span
      const shoulderRadius = heightMeters * 0.05;

      const shouldersGeometry = new THREE.CapsuleGeometry(
        shoulderRadius,
        shoulderWidth,
        8,
        24
      );
      const shoulders = new THREE.Mesh(shouldersGeometry, bodyMaterial);
      shoulders.rotation.z = Math.PI / 2;
      shoulders.position.y = heightMeters * 0.80;
      shoulders.castShadow = true;
      mannequinGroup.add(shoulders);

      const upperArmLength = heightMeters * 0.26;
      const lowerArmLength = heightMeters * 0.24;
      const armRadius = heightMeters * 0.035 * heightScale;

      const upperArmGeometry = new THREE.CapsuleGeometry(
        armRadius,
        upperArmLength * 0.4,
        8,
        24
      );
      const lowerArmGeometry = new THREE.CapsuleGeometry(
        armRadius * 0.9,
        lowerArmLength * 0.3,
        8,
        24
      );

      // Left upper arm
      const upperArmL = new THREE.Mesh(upperArmGeometry, bodyMaterial);
      upperArmL.position.set(-shoulderWidth * 0.55, heightMeters * 0.73, 0);
      upperArmL.rotation.z = Math.PI / 9;
      upperArmL.castShadow = true;
      mannequinGroup.add(upperArmL);

      // Right upper arm
      const upperArmR = new THREE.Mesh(upperArmGeometry, bodyMaterial);
      upperArmR.position.set(shoulderWidth * 0.55, heightMeters * 0.73, 0);
      upperArmR.rotation.z = -Math.PI / 9;
      upperArmR.castShadow = true;
      mannequinGroup.add(upperArmR);

      // Left lower arm
      const lowerArmL = new THREE.Mesh(lowerArmGeometry, bodyMaterial);
      lowerArmL.position.set(-shoulderWidth * 0.65, heightMeters * 0.55, 0.02);
      lowerArmL.castShadow = true;
      mannequinGroup.add(lowerArmL);

      // Right lower arm
      const lowerArmR = new THREE.Mesh(lowerArmGeometry, bodyMaterial);
      lowerArmR.position.set(shoulderWidth * 0.65, heightMeters * 0.55, 0.02);
      lowerArmR.castShadow = true;
      mannequinGroup.add(lowerArmR);

      // ===== LEGS =====
      const legRadius = heightMeters * 0.055;
      const upperLegLength = heightMeters * 0.26;
      const lowerLegLength = heightMeters * 0.25;

      const upperLegGeometry = new THREE.CapsuleGeometry(
        legRadius,
        upperLegLength * 0.5,
        8,
        24
      );
      const lowerLegGeometry = new THREE.CapsuleGeometry(
        legRadius * 0.9,
        lowerLegLength * 0.4,
        8,
        24
      );

      const hipOffsetX = 0.10 * hipsScale;

      // Left upper leg
      const upperLegL = new THREE.Mesh(upperLegGeometry, bodyMaterial);
      upperLegL.position.set( -hipOffsetX, heightMeters * 0.27, 0);
      upperLegL.castShadow = true;
      mannequinGroup.add(upperLegL);

      // Right upper leg
      const upperLegR = new THREE.Mesh(upperLegGeometry, bodyMaterial);
      upperLegR.position.set( hipOffsetX, heightMeters * 0.27, 0);
      upperLegR.castShadow = true;
      mannequinGroup.add(upperLegR);

      // Left lower leg
      const lowerLegL = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
      lowerLegL.position.set( -hipOffsetX, heightMeters * 0.08, 0.01);
      lowerLegL.castShadow = true;
      mannequinGroup.add(lowerLegL);

      // Right lower leg
      const lowerLegR = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
      lowerLegR.position.set( hipOffsetX, heightMeters * 0.08, 0.01);
      lowerLegR.castShadow = true;
      mannequinGroup.add(lowerLegR);

      // ===== SIMPLE FEET =====
      const footLength = heightMeters * 0.12;
      const footHeight = heightMeters * 0.04;
      const footGeometry = new THREE.BoxGeometry(
        footLength,
        footHeight,
        legRadius * 1.4
      );

      const footL = new THREE.Mesh(footGeometry, bodyMaterial);
      footL.position.set(-hipOffsetX, 0.02, footLength * 0.2);
      footL.castShadow = true;
      mannequinGroup.add(footL);

      const footR = new THREE.Mesh(footGeometry, bodyMaterial);
      footR.position.set(hipOffsetX, 0.02, footLength * 0.2);
      footR.castShadow = true;
      mannequinGroup.add(footR);

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

