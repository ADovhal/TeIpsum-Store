import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Path to the body model
// For Create React App: if direct import doesn't work, 
// copy the file to public/models/ and use '/models/base_male_body_meshy.glb'
// For now, using a path that should work with webpack's file-loader
const baseMaleBodyModel = require('../../assets/models/base_male_body_meshy.glb');

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

    // Helper to get container dimensions (handles mobile properly)
    const getContainerSize = () => {
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width || container.clientWidth || window.innerWidth,
        height: rect.height || container.clientHeight || window.innerHeight,
      };
    };

    const initialSize = getContainerSize();
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      75,
      initialSize.width / initialSize.height || 1,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better mobile performance
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Ensure canvas has proper styles for mobile
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none'; // Prevent default touch behaviors
    
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

    // Base parameters for the model (default values)
    const baseParams = {
      height: 175,
      chest: 100,
      waist: 85,
      hips: 95,
      shoulderWidth: 45,
    };

    // Store original vertex positions for morphing
    const originalVertices = new Map();
    let mannequinGroup = null;
    let bodyMesh = null;

    /**
     * Apply body parameter deformations to the loaded model
     */
    function applyBodyDeformation(mesh, params) {
      if (!mesh || !mesh.geometry) return;

      const geometry = mesh.geometry;
      
      // Ensure we have position attribute
      if (!geometry.attributes.position) return;

      // Get or store original vertices
      if (!originalVertices.has(mesh.uuid)) {
        const positions = geometry.attributes.position;
        const originalPos = new Float32Array(positions.array.length);
        originalPos.set(positions.array);
        originalVertices.set(mesh.uuid, originalPos);
      }

      const originalPos = originalVertices.get(mesh.uuid);
      const positions = geometry.attributes.position;
      const vertexCount = positions.count;

      // Calculate scale factors
      const heightScale = params.height / baseParams.height;
      const chestScale = params.chest / baseParams.chest;
      const waistScale = params.waist / baseParams.waist;
      const hipsScale = params.hips / baseParams.hips;
      const shoulderScale = params.shoulderWidth / baseParams.shoulderWidth;

      // Calculate bounding box to determine body regions
      const bbox = new THREE.Box3().setFromBufferAttribute(positions);
      const bodyHeight = bbox.max.y - bbox.min.y;
      const bodyCenterY = (bbox.max.y + bbox.min.y) / 2;

      // Apply deformations to each vertex
      for (let i = 0; i < vertexCount; i++) {
        const idx = i * 3;
        let x = originalPos[idx];
        let y = originalPos[idx + 1];
        let z = originalPos[idx + 2];

        // Normalize Y position relative to body (0 = bottom, 1 = top)
        const normalizedY = (y - bbox.min.y) / bodyHeight;

        // Apply height scaling (uniform vertical scaling)
        y = bodyCenterY + (y - bodyCenterY) * heightScale;

        // Determine body region and apply appropriate scaling
        let scaleX = 1;
        let scaleZ = 1;

        if (normalizedY > 0.85) {
          // Head region - scale with height only
          scaleX = heightScale;
          scaleZ = heightScale;
        } else if (normalizedY > 0.75) {
          // Shoulder/neck region - scale with shoulder width
          const blend = (normalizedY - 0.75) / 0.1;
          scaleX = 1 + (shoulderScale - 1) * blend;
          scaleZ = 1 + (chestScale - 1) * blend * 0.5;
        } else if (normalizedY > 0.55) {
          // Chest region - scale with chest
          scaleX = chestScale;
          scaleZ = chestScale;
        } else if (normalizedY > 0.45) {
          // Waist region - scale with waist
          const blend = (normalizedY - 0.45) / 0.1;
          const chestBlend = 1 - blend;
          scaleX = chestScale * chestBlend + waistScale * blend;
          scaleZ = chestScale * chestBlend + waistScale * blend;
        } else if (normalizedY > 0.25) {
          // Hips region - scale with hips
          const blend = (normalizedY - 0.25) / 0.2;
          const waistBlend = 1 - blend;
          scaleX = waistScale * waistBlend + hipsScale * blend;
          scaleZ = waistScale * waistBlend + hipsScale * blend;
        } else {
          // Legs region - scale with height and hips proportionally
          scaleX = heightScale * 0.7 + hipsScale * 0.3;
          scaleZ = heightScale * 0.7 + hipsScale * 0.3;
        }

        // Apply horizontal scaling (X and Z axes)
        x *= scaleX;
        z *= scaleZ;

        // Update vertex position
        positions.array[idx] = x;
        positions.array[idx + 1] = y;
        positions.array[idx + 2] = z;
      }

      // Mark position attribute as needing update
      positions.needsUpdate = true;
      
      // Recalculate normals for proper lighting
      geometry.computeVertexNormals();
      
      // Update bounding box
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }

    /**
     * Load and setup the GLB body model
     */
    function loadBodyModel(params) {
      const loader = new GLTFLoader();
      
      loader.load(
        baseMaleBodyModel,
        (gltf) => {
          // Remove old mannequin if exists
          if (mannequinGroup) {
            scene.remove(mannequinGroup);
            // Dispose of old geometry
            mannequinGroup.traverse((object) => {
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
          }

          mannequinGroup = gltf.scene.clone();
          
          // Find the main body mesh
          mannequinGroup.traverse((object) => {
            if (object.isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
              
              // Store reference to main body mesh (usually the largest mesh)
              if (!bodyMesh || object.geometry.attributes.position.count > bodyMesh.geometry.attributes.position.count) {
                bodyMesh = object;
              }
            }
          });

          // Apply initial deformation
          if (bodyMesh) {
            applyBodyDeformation(bodyMesh, params);
          }

          // Center and position the model
          const box = new THREE.Box3().setFromObject(mannequinGroup);
          const center = box.getCenter(new THREE.Vector3());
          
          // Center the model at origin
          mannequinGroup.position.sub(center);
          
          // Position model on floor
          const minY = box.min.y - center.y;
          mannequinGroup.position.y = -minY;

          scene.add(mannequinGroup);
        },
        undefined,
        (error) => {
          // eslint-disable-next-line no-console
          console.error('Error loading body model:', error);
        }
      );
    }

    // Load the body model
    loadBodyModel(safeParams);

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

    // Touch controls for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouching = false;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastTouchX = touchStartX;
        lastTouchY = touchStartY;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        // Pinch zoom - prevent default to avoid page zoom
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isTouching) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const deltaY = e.touches[0].clientY - lastTouchY;

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, safeParams.height / 100 / 2, 0);

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        if (e.touches.length === 2 && e.changedTouches.length === 2) {
          const prevDistance = Math.hypot(
            e.changedTouches[0].clientX - e.changedTouches[1].clientX,
            e.changedTouches[0].clientY - e.changedTouches[1].clientY
          );
          const scale = distance / prevDistance;
          const currentDistance = camera.position.length();
          const newDistance = currentDistance / scale;
          if (newDistance > 1 && newDistance < 10) {
            camera.position.normalize().multiplyScalar(newDistance);
          }
        }
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

    // Wheel zoom - prevent page scroll when hovering over canvas
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const distance = camera.position.length();
      const newDistance = distance + e.deltaY * 0.01;
      if (newDistance > 1 && newDistance < 10) {
        camera.position.normalize().multiplyScalar(newDistance);
      }
    };
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Resize handler - properly handles mobile orientation changes
    const onResize = () => {
      if (!container) return;
      const size = getContainerSize();
      
      camera.aspect = size.width / size.height || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    };
    
    // Use ResizeObserver for better mobile support
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(container);
    
    // Fallback for older browsers
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    // Update model when parameters change
    const updateModel = (newParams) => {
      if (bodyMesh) {
        applyBodyDeformation(bodyMesh, newParams);
        
        // Update camera position based on new height
        const newHeight = newParams.height / 100;
        camera.position.set(
          0,
          newHeight,
          newHeight * 1.5
        );
        camera.lookAt(0, newHeight / 2, 0);
      }
    };

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update model if parameters changed
      const currentParams = {
        height: bodyParams?.height || 175,
        chest: bodyParams?.chest || 100,
        waist: bodyParams?.waist || 85,
        hips: bodyParams?.hips || 95,
        shoulderWidth: bodyParams?.shoulderWidth || 45,
      };
      
      // Check if parameters changed
      if (bodyMesh && (
        currentParams.height !== safeParams.height ||
        currentParams.chest !== safeParams.chest ||
        currentParams.waist !== safeParams.waist ||
        currentParams.hips !== safeParams.hips ||
        currentParams.shoulderWidth !== safeParams.shoulderWidth
      )) {
        Object.assign(safeParams, currentParams);
        updateModel(safeParams);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      
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

      // Clear original vertices cache
      originalVertices.clear();

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
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px', // Ensure minimum height on mobile
        position: 'relative',
        display: 'block',
      }}
    />
  );
};

export default ThreeMannequinCanvas;

