import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Path to the body model
const baseMaleBodyModel = require('../../assets/models/final_version.glb');

// Body parameter ranges - matches Blender Shape Keys (0 = min, 1 = max)
const BODY_PARAM_RANGES = {
  height: { min: 160, max: 200 },
  chest: { min: 80, max: 120 },
  waist: { min: 60, max: 100 },
  hips: { min: 80, max: 120 },
  shoulderWidth: { min: 40, max: 60 }
};

// Default body parameters
const DEFAULT_BODY_PARAMS = {
  height: 175,
  chest: 100,
  waist: 85,
  hips: 95,
  shoulderWidth: 45,
};

// Product color to material mapping
const PRODUCT_MATERIALS = {
  'tshirt-white': { color: 0xffffff },
  'tshirt-black': { color: 0x1a1a1a },
  'tshirt-red': { color: 0xe74c3c },
  'tshirt-blue': { color: 0x3498db },
  'tshirt-green': { color: 0x27ae60 },
  'tshirt-navy': { color: 0x2c3e50 },
  'tshirt-gray': { color: 0x7f8c8d },
};

const MODEL_FEATURES = {
  NONE: 'none',
  MORPH_TARGETS: 'morphTargets',
  ARMATURE: 'armature',
  VERTEX_DEFORM: 'vertexDeform'
};

/**
 * Pure Three.js mannequin renderer with Shape Keys support.
 * Shape Keys from Blender: Height, Shoulders, Chest, Waist, Hips
 */
const ThreeMannequinCanvas = ({ bodyParams, products }) => {
  const containerRef = useRef(null);
  const bodyParamsRef = useRef(bodyParams);
  const productsRef = useRef(products);
  
  useEffect(() => {
    bodyParamsRef.current = bodyParams;
  }, [bodyParams]);
  
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ========== SCENE SETUP ==========
    const getContainerSize = () => {
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width || container.clientWidth || window.innerWidth,
        height: rect.height || container.clientHeight || window.innerHeight,
      };
    };

    const initialSize = getContainerSize();
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      50,
      initialSize.width / initialSize.height || 1,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    
    container.appendChild(renderer.domElement);

    // ========== LIGHTS ==========
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // ========== STATE ==========
    const appliedParams = { ...DEFAULT_BODY_PARAMS };
    
    let mannequinGroup = null;
    let bodyMesh = null;
    let clothingMesh = null;
    let previousProductIds = '';
    let modelHeight = 1.8;
    let isModelLoaded = false;
    
    // Camera state - FIXED: proper initial distance
    let cameraDistance = 4.0;
    let targetDistance = 4.0; // Same as cameraDistance - no initial zoom animation
    let cameraTheta = 0;
    let cameraPhi = Math.PI / 3;
    const lookAtTarget = new THREE.Vector3(0, 0.9, 0);
    
    const MIN_PHI = 0.15;
    const MAX_PHI = Math.PI / 2 - 0.05;
    const MIN_DISTANCE = 1.5;
    const MAX_DISTANCE = 8;
    const ZOOM_SMOOTHNESS = 0.1;

    function updateCameraPosition() {
      camera.position.x = cameraDistance * Math.sin(cameraPhi) * Math.sin(cameraTheta);
      camera.position.y = lookAtTarget.y + cameraDistance * Math.cos(cameraPhi);
      camera.position.z = cameraDistance * Math.sin(cameraPhi) * Math.cos(cameraTheta);
      camera.lookAt(lookAtTarget);
    }

    updateCameraPosition();

    // ========== MODEL FEATURE DETECTION ==========
    
    function detectModelFeatures(gltfScene) {
      const result = {
        feature: MODEL_FEATURES.NONE,
        meshes: [],
        bodyMesh: null,
        clothingMesh: null
      };

      gltfScene.traverse((object) => {
        if (object.isMesh) {
          const meshInfo = {
            name: object.name,
            vertexCount: object.geometry?.attributes?.position?.count || 0,
            hasMorphTargets: !!(object.morphTargetInfluences && object.morphTargetDictionary),
            morphTargetNames: object.morphTargetDictionary ? Object.keys(object.morphTargetDictionary) : []
          };
          result.meshes.push(meshInfo);

          const nameLower = object.name.toLowerCase();
          
          // Detect body mesh
          if (nameLower.includes('body') || nameLower === 'body' || nameLower === 'mesh') {
            result.bodyMesh = object;
          }
          // Detect clothing mesh
          if (nameLower.includes('cloth') || nameLower.includes('shirt') || 
              nameLower.includes('tshirt') || nameLower.includes('t-shirt')) {
            result.clothingMesh = object;
          }

          // Check for morph targets
          if (object.morphTargetInfluences && object.morphTargetDictionary) {
            result.feature = MODEL_FEATURES.MORPH_TARGETS;
                }
              }
            });

      // Fallback to vertex deform if no morph targets
      if (result.feature === MODEL_FEATURES.NONE && result.meshes.length > 0) {
        result.feature = MODEL_FEATURES.VERTEX_DEFORM;
      }

      return result;
    }

    function logModelInfo(features) {
      console.log('═══════════════════════════════════════════════════');
      console.log('📦 MODEL ANALYSIS REPORT');
      console.log('═══════════════════════════════════════════════════');
      console.log(`🎯 Detected Feature: ${features.feature.toUpperCase()}`);
      console.log('');
      
      console.log('📐 MESHES:');
      features.meshes.forEach((mesh, idx) => {
        const isBody = features.bodyMesh?.name === mesh.name ? ' [BODY]' : '';
        const isClothing = features.clothingMesh?.name === mesh.name ? ' [CLOTHING]' : '';
        console.log(`  ${idx + 1}. "${mesh.name}" - ${mesh.vertexCount} vertices${isBody}${isClothing}`);
        if (mesh.hasMorphTargets) {
          console.log(`     ✓ Morph Targets: [${mesh.morphTargetNames.join(', ')}]`);
        }
      });

      console.log('═══════════════════════════════════════════════════');
      console.log(`💡 Deformation method: ${features.feature}`);
      console.log('═══════════════════════════════════════════════════');
    }

    // ========== SHAPE KEY / MORPH TARGET APPLICATION ==========
    
    /**
     * Convert body parameter to Shape Key value (0-1)
     * Blender Shape Keys: 0 = min value, 1 = max value
     * 
     * Example for height (range 160-200):
     *   height=160 → shapeKey=0.0
     *   height=180 → shapeKey=0.5
     *   height=200 → shapeKey=1.0
     */
    function paramToShapeKey(param, value) {
      const range = BODY_PARAM_RANGES[param];
      if (!range) return 0.5;
      
      // Clamp value to range
      const clampedValue = Math.max(range.min, Math.min(range.max, value));
      // Linear interpolation: min -> 0, max -> 1
      const shapeKeyValue = (clampedValue - range.min) / (range.max - range.min);
      return shapeKeyValue;
    }

    /**
     * Apply morph targets (Shape Keys) to a mesh
     * Matches Blender Shape Keys: Height, Shoulders, Chest, Waist, Hips
     */
    function applyMorphTargets(mesh, params) {
      if (!mesh?.morphTargetInfluences || !mesh?.morphTargetDictionary) {
        return false;
      }
    
      const influences = mesh.morphTargetInfluences;
      const dictionary = mesh.morphTargetDictionary;
      const availableKeys = Object.keys(dictionary);
      
      console.log(`Applying morph targets to "${mesh.name}". Available keys:`, availableKeys);

      // Map body params to Blender Shape Key names
      const paramMappings = [
        { param: 'height', blenderKeys: ['Height', 'height'] },
        { param: 'shoulderWidth', blenderKeys: ['Shoulders', 'shoulders', 'Shoulder', 'shoulder'] },
        { param: 'chest', blenderKeys: ['Chest', 'chest'] },
        { param: 'waist', blenderKeys: ['Waist', 'waist'] },
        { param: 'hips', blenderKeys: ['Hips', 'hips', 'Hip', 'hip'] }
      ];

      let appliedCount = 0;

      paramMappings.forEach(({ param, blenderKeys }) => {
        const matchedKey = blenderKeys.find(k => availableKeys.includes(k));
        if (matchedKey) {
          const paramValue = params[param] || DEFAULT_BODY_PARAMS[param];
          const range = BODY_PARAM_RANGES[param];
          const shapeKeyValue = paramToShapeKey(param, paramValue);
          influences[dictionary[matchedKey]] = shapeKeyValue;
          appliedCount++;
          console.log(`  ${param}: ${paramValue} (range ${range.min}-${range.max}) → "${matchedKey}" = ${shapeKeyValue.toFixed(3)}`);
        }
      });

      return appliedCount > 0;
    }

    /**
     * Compute morphed bounding box for a mesh with morph targets
     * Standard Box3.setFromObject doesn't account for morph targets
     */
    function computeMorphedBoundingBox(mesh) {
      if (!mesh?.geometry?.attributes?.position) return null;
      
      const geometry = mesh.geometry;
      const position = geometry.attributes.position;
      const morphAttributes = geometry.morphAttributes.position;
      const morphInfluences = mesh.morphTargetInfluences;
      
      let minY = Infinity;
      let maxY = -Infinity;
      let minX = Infinity;
      let maxX = -Infinity;
      let minZ = Infinity;
      let maxZ = -Infinity;
      
      // If no morph targets, use regular bounding box
      if (!morphAttributes || !morphInfluences || morphInfluences.length === 0) {
        geometry.computeBoundingBox();
        return geometry.boundingBox;
      }
      
      // Compute morphed positions
      for (let i = 0; i < position.count; i++) {
        let x = position.getX(i);
        let y = position.getY(i);
        let z = position.getZ(i);
        
        // Apply morph target influences
        for (let j = 0; j < morphAttributes.length; j++) {
          if (morphInfluences[j] !== 0) {
            const morphAttr = morphAttributes[j];
            x += morphAttr.getX(i) * morphInfluences[j];
            y += morphAttr.getY(i) * morphInfluences[j];
            z += morphAttr.getZ(i) * morphInfluences[j];
          }
        }
        
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
      }
      
      const box = new THREE.Box3(
        new THREE.Vector3(minX, minY, minZ),
        new THREE.Vector3(maxX, maxY, maxZ)
      );
      
      return box;
    }

    /**
     * Position model so feet are on floor (y=0)
     */
    function positionModelOnFloor() {
      if (!mannequinGroup || !bodyMesh) return;
      
      // Reset position first
      mannequinGroup.position.set(0, 0, 0);
      mannequinGroup.updateMatrixWorld(true);
      
      // Compute morphed bounding box
      const morphedBox = computeMorphedBoundingBox(bodyMesh);
      
      if (morphedBox) {
        // Get mesh's local-to-world transform (excluding group transform since we reset it)
        // The mesh might have its own position/rotation relative to the group
        const meshLocalMatrix = new THREE.Matrix4();
        meshLocalMatrix.compose(
          bodyMesh.position,
          bodyMesh.quaternion,
          bodyMesh.scale
        );
        morphedBox.applyMatrix4(meshLocalMatrix);
        
        const center = morphedBox.getCenter(new THREE.Vector3());
        
        // Center horizontally
        mannequinGroup.position.x = -center.x;
        mannequinGroup.position.z = -center.z;
        
        // Place feet on floor (min.y should be at y=0)
        mannequinGroup.position.y = -morphedBox.min.y;
        
        // Update model height for camera
        modelHeight = morphedBox.max.y - morphedBox.min.y;
        lookAtTarget.y = modelHeight * 0.45;
        
        console.log(`Floor position: y=${mannequinGroup.position.y.toFixed(3)}, model height=${modelHeight.toFixed(2)}m`);
      }
    }

    /**
     * Apply deformation to body and clothing
     */
    function applyDeformation(params) {
      if (!isModelLoaded) return;
      
      // Apply morph targets to body
      if (bodyMesh) {
        applyMorphTargets(bodyMesh, params);
      }
      
      // Apply to clothing too if it has morph targets
      if (clothingMesh && clothingMesh.visible) {
        applyMorphTargets(clothingMesh, params);
      }

      // Reposition model on floor after deformation
      positionModelOnFloor();
    }

    // ========== CLOTHING MATERIAL ==========

    function updateClothingMaterial(selectedProducts) {
      if (!clothingMesh) {
        console.warn('No clothing mesh found');
        return;
      }

      if (!selectedProducts || selectedProducts.length === 0) {
        clothingMesh.visible = false;
        return;
      }

      const product = selectedProducts[0];
      clothingMesh.visible = true;

      let color = 0xffffff;
      
      if (product.color) {
        if (typeof product.color === 'string') {
          if (product.color.startsWith('#')) {
            color = parseInt(product.color.slice(1), 16);
          } else if (product.color.startsWith('0x')) {
            color = parseInt(product.color, 16);
          }
        } else if (typeof product.color === 'number') {
          color = product.color;
        }
      } else if (product.id && PRODUCT_MATERIALS[product.id]) {
        color = PRODUCT_MATERIALS[product.id].color;
      }

      if (clothingMesh.material) {
        if (Array.isArray(clothingMesh.material)) {
          clothingMesh.material.forEach(mat => {
            mat.color.setHex(color);
            mat.needsUpdate = true;
          });
        } else {
          clothingMesh.material.color.setHex(color);
          clothingMesh.material.needsUpdate = true;
        }
      } else {
        clothingMesh.material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.8,
          metalness: 0.0
        });
      }

      // Apply morph targets to clothing when it becomes visible
      applyMorphTargets(clothingMesh, appliedParams);

      console.log(`✓ Clothing visible with color: #${color.toString(16).padStart(6, '0')}`);
    }

    // ========== MODEL LOADING ==========
    
    function loadBodyModel() {
      const loader = new GLTFLoader();

      loader.load(
        baseMaleBodyModel,
        (gltf) => {
          mannequinGroup = gltf.scene;

          const features = detectModelFeatures(mannequinGroup);
          logModelInfo(features);

          bodyMesh = features.bodyMesh;
          clothingMesh = features.clothingMesh;

          // Fallback mesh detection if named detection fails
          mannequinGroup.traverse((object) => {
            if (object.isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
              
              // If body/clothing not found by name, use heuristics
              if (!bodyMesh && !clothingMesh) {
                if (!bodyMesh) {
                  bodyMesh = object;
                } else {
                  clothingMesh = object;
                }
              } else if (!bodyMesh) {
                bodyMesh = object;
              } else if (!clothingMesh && object !== bodyMesh) {
                clothingMesh = object;
              }
            }
          });

          scene.add(mannequinGroup);
          isModelLoaded = true;

          // Hide clothing initially
          if (clothingMesh) {
            clothingMesh.visible = false;
            console.log(`Clothing mesh found: "${clothingMesh.name}"`);
          }

          // Apply initial deformation - this will also position model on floor
          const currentParams = bodyParamsRef.current || DEFAULT_BODY_PARAMS;
          Object.assign(appliedParams, {
            height: currentParams.height || DEFAULT_BODY_PARAMS.height,
            chest: currentParams.chest || DEFAULT_BODY_PARAMS.chest,
            waist: currentParams.waist || DEFAULT_BODY_PARAMS.waist,
            hips: currentParams.hips || DEFAULT_BODY_PARAMS.hips,
            shoulderWidth: currentParams.shoulderWidth || DEFAULT_BODY_PARAMS.shoulderWidth,
          });
          
          // Apply deformation which handles floor positioning with morphed bounding box
          applyDeformation(appliedParams);
          
          // Set camera distance based on model height
          cameraDistance = modelHeight * 2.2;
          targetDistance = cameraDistance;
          updateCameraPosition();

          // Show clothing if products already selected
          const currentProducts = productsRef.current || [];
          if (currentProducts.length > 0) {
            updateClothingMaterial(currentProducts);
            previousProductIds = currentProducts.map(p => p.id).sort().join(',');
          }

          console.log('✓ Model loaded successfully');
          console.log(`  Height: ${modelHeight.toFixed(2)}m`);
          console.log(`  Body: ${bodyMesh?.name || 'auto-detected'}`);
          console.log(`  Clothing: ${clothingMesh?.name || 'auto-detected'}`);
        },
        (progress) => {
          if (progress.total > 0) {
            console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
          }
        },
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    }

    // ========== FLOOR ==========
    
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(10, 20, 0x444444, 0x333333);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // ========== CAMERA CONTROLS ==========

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

      cameraTheta -= deltaX * 0.008;
      cameraPhi -= deltaY * 0.008;
      cameraPhi = Math.max(MIN_PHI, Math.min(MAX_PHI, cameraPhi));

      updateCameraPosition();

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Touch controls
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouching = false;
    let lastPinchDistance = 0;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isTouching = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        lastPinchDistance = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isTouching) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const deltaY = e.touches[0].clientY - lastTouchY;

        cameraTheta -= deltaX * 0.008;
        cameraPhi -= deltaY * 0.008;
        cameraPhi = Math.max(MIN_PHI, Math.min(MAX_PHI, cameraPhi));

        updateCameraPosition();

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        
        const delta = lastPinchDistance - currentDistance;
        targetDistance += delta * 0.01;
        targetDistance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, targetDistance));
        
        lastPinchDistance = currentDistance;
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length === 0) {
        isTouching = false;
      }
    };

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Wheel zoom
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const zoomDelta = e.deltaY * 0.002 * targetDistance;
      targetDistance += zoomDelta;
      targetDistance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, targetDistance));
    };
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const size = getContainerSize();
      
      camera.aspect = size.width / size.height || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    };
    
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    // ========== LOAD MODEL ==========
    loadBodyModel();

    // ========== ANIMATION LOOP ==========
    let animationFrameId;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Smooth zoom
      if (Math.abs(cameraDistance - targetDistance) > 0.001) {
        cameraDistance += (targetDistance - cameraDistance) * ZOOM_SMOOTHNESS;
        updateCameraPosition();
      }
      
      // Check for parameter changes
      if (isModelLoaded) {
        const currentParams = bodyParamsRef.current || DEFAULT_BODY_PARAMS;
        
        const paramsChanged = 
          currentParams.height !== appliedParams.height ||
          currentParams.chest !== appliedParams.chest ||
          currentParams.waist !== appliedParams.waist ||
          currentParams.hips !== appliedParams.hips ||
          currentParams.shoulderWidth !== appliedParams.shoulderWidth;
        
        if (paramsChanged) {
          Object.assign(appliedParams, {
            height: currentParams.height || DEFAULT_BODY_PARAMS.height,
            chest: currentParams.chest || DEFAULT_BODY_PARAMS.chest,
            waist: currentParams.waist || DEFAULT_BODY_PARAMS.waist,
            hips: currentParams.hips || DEFAULT_BODY_PARAMS.hips,
            shoulderWidth: currentParams.shoulderWidth || DEFAULT_BODY_PARAMS.shoulderWidth,
          });
          applyDeformation(appliedParams);
        }

        // Check for products changes
        const currentProducts = productsRef.current || [];
      const currentProductIds = currentProducts.map(p => p.id).sort().join(',');
      
      if (currentProductIds !== previousProductIds) {
          updateClothingMaterial(currentProducts);
          previousProductIds = currentProductIds;
        }
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // ========== CLEANUP ==========
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose?.());
            } else {
              object.material.dispose?.();
            }
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        display: 'block',
        cursor: 'grab',
      }}
    />
  );
};

export default ThreeMannequinCanvas;
