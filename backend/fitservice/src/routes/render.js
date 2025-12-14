const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * GET /api/render
 * Renders an HTML page with a ThreeJS mannequin scene
 * 
 * Query parameters:
 * - height: height in cm
 * - chest: chest circumference in cm
 * - waist: waist circumference in cm
 * - hips: hips circumference in cm
 * - shoulderWidth: shoulder width in cm
 * - products: JSON string with array of products [{"id": "1", "type": "shirt", "modelUrl": "..."}]
 */
router.get('/render', (req, res) => {
  try {
    // Body parameters with default values
    const bodyParams = {
      height: parseFloat(req.query.height) || 175,
      chest: parseFloat(req.query.chest) || 100,
      waist: parseFloat(req.query.waist) || 85,
      hips: parseFloat(req.query.hips) || 95,
      shoulderWidth: parseFloat(req.query.shoulderWidth) || 45,
    };

    // Products (clothing)
    let products = [];
    if (req.query.products) {
      try {
        products = JSON.parse(decodeURIComponent(req.query.products));
      } catch (e) {
        console.error('Error parsing products:', e);
        products = [];
      }
    }

    // Send HTML with ThreeJS scene
    res.send(generateHTML(bodyParams, products));
  } catch (error) {
    console.error('Error in render endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/render
 * Renders an HTML page with a ThreeJS mannequin scene (POST variant)
 */
router.post('/render', (req, res) => {
  try {
    const bodyParams = {
      height: parseFloat(req.body.height) || 175,
      chest: parseFloat(req.body.chest) || 100,
      waist: parseFloat(req.body.waist) || 85,
      hips: parseFloat(req.body.hips) || 95,
      shoulderWidth: parseFloat(req.body.shoulderWidth) || 45,
    };

    const products = req.body.products || [];

    res.send(generateHTML(bodyParams, products));
  } catch (error) {
    console.error('Error in render endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Generates HTML with ThreeJS scene
 */
function generateHTML(bodyParams, products) {
  const bodyParamsJson = JSON.stringify(bodyParams);
  const productsJson = JSON.stringify(products);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Mannequin Renderer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: #1a1a1a;
        }
        #canvas-container {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="canvas-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js"></script>
    <script>
        // Body parameters
        const bodyParams = ${bodyParamsJson};
        const products = ${productsJson};

        // Initialize ThreeJS scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const container = document.getElementById('canvas-container');
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Lighting
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

        // Camera position
        camera.position.set(0, bodyParams.height / 100, bodyParams.height / 100 * 1.5);
        camera.lookAt(0, bodyParams.height / 100 / 2, 0);

        // Create custom mannequin based on body parameters
        function createMannequin(params) {
            const mannequinGroup = new THREE.Group();

            // Scale based on height
            const heightScale = params.height / 175; // 175 - base height

            // Head
            const headGeometry = new THREE.SphereGeometry(0.15 * heightScale, 32, 32);
            const headMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffdbac,
                roughness: 0.8,
                metalness: 0.1
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
            const chestScale = params.chest / 100; // 100 - base chest circumference
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
            const waistScale = params.waist / 85; // 85 - base waist circumference
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
            const hipsScale = params.hips / 95; // 95 - base hips circumference
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
            const shoulderScale = params.shoulderWidth / 45; // 45 - base shoulder width
            const shoulderGeometry = new THREE.BoxGeometry(
                0.4 * shoulderScale,
                0.08 * heightScale,
                0.15 * heightScale
            );
            const shoulders = new THREE.Mesh(shoulderGeometry, headMaterial);
            shoulders.position.y = params.height / 100 * 0.8;
            shoulders.castShadow = true;
            mannequinGroup.add(shoulders);

            // Arms (upper part)
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

            // Arms (lower part)
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

        // Create mannequin
        const mannequin = createMannequin(bodyParams);
        scene.add(mannequin);

        // Load and overlay clothing
        const loader = new THREE.GLTFLoader();
        const clothingGroup = new THREE.Group();

        async function loadClothing(product) {
            return new Promise((resolve, reject) => {
                if (!product.modelUrl) {
                    // If no model, create simple geometry for demonstration
                    createSimpleClothing(product).then(resolve).catch(reject);
                    return;
                }

                loader.load(
                    product.modelUrl,
                    (gltf) => {
                        const clothing = gltf.scene;
                        clothing.scale.setScalar(1);
                        clothing.position.y = bodyParams.height / 100 * 0.5;
                        clothing.castShadow = true;
                        clothing.receiveShadow = true;
                        clothingGroup.add(clothing);
                        resolve(clothing);
                    },
                    undefined,
                    reject
                );
            });
        }

        // Create simple clothing for demonstration
        async function createSimpleClothing(product) {
            const clothing = new THREE.Group();
            
            if (product.type === 'shirt' || product.type === 't-shirt') {
                const shirtGeometry = new THREE.CylinderGeometry(
                    0.28 * (bodyParams.chest / 100),
                    0.32 * (bodyParams.chest / 100),
                    (bodyParams.height / 100) * 0.4,
                    32
                );
                const shirtMaterial = new THREE.MeshStandardMaterial({
                    color: product.color || 0x3498db,
                    roughness: 0.7,
                    metalness: 0.1
                });
                const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
                shirt.position.y = bodyParams.height / 100 * 0.65;
                shirt.castShadow = true;
                shirt.receiveShadow = true;
                clothing.add(shirt);
            } else if (product.type === 'pants' || product.type === 'trousers') {
                const pantsMaterial = new THREE.MeshStandardMaterial({
                    color: product.color || 0x2c3e50,
                    roughness: 0.8,
                    metalness: 0.0
                });
                
                // Левая штанина
                const legLGeometry = new THREE.CylinderGeometry(
                    0.1 * (bodyParams.hips / 95),
                    0.12 * (bodyParams.hips / 95),
                    (bodyParams.height / 100) * 0.55,
                    32
                );
                const legL = new THREE.Mesh(legLGeometry, pantsMaterial);
                legL.position.set(-0.1 * (bodyParams.hips / 95), bodyParams.height / 100 * 0.25, 0);
                legL.castShadow = true;
                legL.receiveShadow = true;
                clothing.add(legL);

                // Правая штанина
                const legR = new THREE.Mesh(legLGeometry, pantsMaterial);
                legR.position.set(0.1 * (bodyParams.hips / 95), bodyParams.height / 100 * 0.25, 0);
                legR.castShadow = true;
                legR.receiveShadow = true;
                clothing.add(legR);
            }

            clothingGroup.add(clothing);
            return clothing;
        }

        // Load all products
        Promise.all(products.map(loadClothing))
            .then(() => {
                scene.add(clothingGroup);
            })
            .catch((error) => {
                console.error('Error loading clothing:', error);
            });

        // Background (floor)
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        scene.add(floor);

        // Camera controls (rotation)
        let mouseDown = false;
        let mouseX = 0;
        let mouseY = 0;

        renderer.domElement.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        renderer.domElement.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;

            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;

            const spherical = new THREE.Spherical();
            spherical.setFromVector3(camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, bodyParams.height / 100 / 2, 0);

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Zoom with mouse wheel
        renderer.domElement.addEventListener('wheel', (e) => {
            const distance = camera.position.length();
            const newDistance = distance + e.deltaY * 0.01;
            if (newDistance > 1 && newDistance < 10) {
                camera.position.normalize().multiplyScalar(newDistance);
            }
        });

        // Resize on window change
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Light mannequin rotation (optional)
            // mannequin.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>`;
}

module.exports = router;

