import * as THREE from 'three';

/**
 * Creates a procedural studio environment gradient for metallic reflections
 */
export function createStudioEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);

  // Studio highlight sphere panels
  const lightGeo = new THREE.PlaneGeometry(10, 10);
  
  // Gold top panel
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xf4e295 });
  const topPanel = new THREE.Mesh(lightGeo, goldMat);
  topPanel.position.set(0, 8, 4);
  topPanel.rotation.x = Math.PI / 3;
  scene.add(topPanel);

  // Cool rim panel
  const coolMat = new THREE.MeshBasicMaterial({ color: 0x88bbff });
  const backPanel = new THREE.Mesh(lightGeo, coolMat);
  backPanel.position.set(-6, -4, -6);
  backPanel.rotation.y = Math.PI / 4;
  scene.add(backPanel);

  // Rose-gold fill panel
  const roseMat = new THREE.MeshBasicMaterial({ color: 0xc98993 });
  const fillPanel = new THREE.Mesh(lightGeo, roseMat);
  fillPanel.position.set(6, -2, 4);
  fillPanel.rotation.y = -Math.PI / 4;
  scene.add(fillPanel);

  const renderTarget = pmremGenerator.fromScene(scene);
  return renderTarget.texture;
}

/**
 * Creates high-fidelity 3D procedural scissors with separate rotating blade arms.
 */
export function createScissorMesh(envMap = null) {
  const scissorGroup = new THREE.Group();

  // Materials with high specular response
  const matteBlackSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1f2026,
    metalness: 0.94,
    roughness: 0.25,
    envMap: envMap,
    envMapIntensity: 2.0,
  });

  const sharpBladeMat = new THREE.MeshStandardMaterial({
    color: 0xf0f2fa,
    metalness: 0.98,
    roughness: 0.08,
    envMap: envMap,
    envMapIntensity: 3.0,
  });

  const goldScrewMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.18,
    envMap: envMap,
    envMapIntensity: 3.5,
  });

  // Helper to build a scissor arm (Blade + Shank + Finger Ring)
  function createBladeArm(isUpper = true) {
    const armGroup = new THREE.Group();

    // 1. Blade Body (Tapered Extrusion with cutting bevel)
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.1);
    bladeShape.lineTo(2.6, -0.02);
    bladeShape.lineTo(2.7, 0.0);
    bladeShape.lineTo(2.6, 0.04);
    bladeShape.lineTo(0, 0.24);
    bladeShape.lineTo(-0.25, 0.12);
    bladeShape.lineTo(-0.25, -0.08);
    bladeShape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 4,
    };

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const bladeMesh = new THREE.Mesh(bladeGeo, sharpBladeMat);
    bladeMesh.castShadow = true;
    bladeMesh.receiveShadow = true;
    armGroup.add(bladeMesh);

    // 2. Handle Shank (Curved connecting bridge)
    const shankCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0, 0.03),
      new THREE.Vector3(-0.9, isUpper ? 0.35 : -0.35, 0.03),
      new THREE.Vector3(-1.6, isUpper ? 0.6 : -0.6, 0.03),
    ]);
    const shankGeo = new THREE.TubeGeometry(shankCurve, 24, 0.08, 14, false);
    const shankMesh = new THREE.Mesh(shankGeo, matteBlackSteelMat);
    shankMesh.castShadow = true;
    armGroup.add(shankMesh);

    // 3. Ergonomic Finger Ring (Torus)
    const ringGeo = new THREE.TorusGeometry(0.4, 0.075, 18, 36);
    const ringMesh = new THREE.Mesh(ringGeo, matteBlackSteelMat);
    ringMesh.position.set(-1.95, isUpper ? 0.72 : -0.72, 0.03);
    ringMesh.rotation.z = isUpper ? 0.25 : -0.25;
    ringMesh.castShadow = true;
    armGroup.add(ringMesh);

    // 4. Finger Tang / Rest (for upper arm)
    if (isUpper) {
      const tangCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.25, 0.9, 0.03),
        new THREE.Vector3(-2.6, 1.15, 0.03),
        new THREE.Vector3(-2.8, 1.35, 0.03),
      ]);
      const tangGeo = new THREE.TubeGeometry(tangCurve, 14, 0.045, 10, false);
      const tangMesh = new THREE.Mesh(tangGeo, goldScrewMat);
      armGroup.add(tangMesh);
    }

    return armGroup;
  }

  // Build upper & lower blades
  const bladeUpper = createBladeArm(true);
  const bladeLower = createBladeArm(false);
  bladeLower.scale.y = -1;

  scissorGroup.add(bladeUpper);
  scissorGroup.add(bladeLower);

  // Center Pivot Screw / Knurled Dial
  const screwGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
  const screwMesh = new THREE.Mesh(screwGeo, goldScrewMat);
  screwMesh.rotation.x = Math.PI / 2;
  screwMesh.position.z = 0.03;
  scissorGroup.add(screwMesh);

  // Inner Gem / Ring
  const gemGeo = new THREE.TorusGeometry(0.12, 0.025, 16, 28);
  const gemMesh = new THREE.Mesh(gemGeo, sharpBladeMat);
  gemMesh.position.z = 0.13;
  scissorGroup.add(gemMesh);

  function setOpenAngle(angleRad) {
    bladeUpper.rotation.z = angleRad;
    bladeLower.rotation.z = -angleRad;
  }

  setOpenAngle(0.38);

  return {
    group: scissorGroup,
    bladeUpper,
    bladeLower,
    setOpenAngle,
  };
}

/**
 * Creates a 3D Rose-Gold Precision Barber Comb.
 */
export function createCombMesh(envMap = null) {
  const combGroup = new THREE.Group();

  const roseGoldMat = new THREE.MeshStandardMaterial({
    color: 0xc98993,
    metalness: 0.92,
    roughness: 0.2,
    envMap: envMap,
    envMapIntensity: 2.5,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf4e295,
    metalness: 0.96,
    roughness: 0.15,
    envMap: envMap,
    envMapIntensity: 3.0,
  });

  // 1. Comb Spine
  const spineLength = 3.6;
  const spineGeo = new THREE.BoxGeometry(spineLength, 0.32, 0.07);
  const spineMesh = new THREE.Mesh(spineGeo, roseGoldMat);
  spineMesh.castShadow = true;
  combGroup.add(spineMesh);

  // Gold Stripe
  const stripeGeo = new THREE.BoxGeometry(spineLength * 0.92, 0.035, 0.075);
  const stripeMesh = new THREE.Mesh(stripeGeo, goldAccentMat);
  stripeMesh.position.y = 0.06;
  combGroup.add(stripeMesh);

  // 2. Teeth Generation (42 teeth total)
  const totalTeeth = 42;
  const toothWidth = 0.038;
  const toothDepth = 0.06;
  const startX = -spineLength / 2 + 0.18;
  const stepX = (spineLength - 0.36) / totalTeeth;

  for (let i = 0; i < totalTeeth; i++) {
    const isFine = i > totalTeeth / 2;
    const toothLength = isFine ? 0.85 : 0.95;
    const toothGeo = new THREE.BoxGeometry(toothWidth, toothLength, toothDepth);
    const toothMesh = new THREE.Mesh(toothGeo, roseGoldMat);
    toothMesh.position.set(startX + i * stepX, -toothLength / 2 - 0.16, 0);
    toothMesh.castShadow = true;
    combGroup.add(toothMesh);
  }

  // Tail Sectioning Pick
  const tailShape = new THREE.Shape();
  tailShape.moveTo(startX - 0.1, 0.16);
  tailShape.lineTo(startX - 0.95, -0.06);
  tailShape.lineTo(startX - 0.1, -0.16);
  tailShape.closePath();

  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015 });
  const tailMesh = new THREE.Mesh(tailGeo, roseGoldMat);
  tailMesh.position.z = -0.03;
  combGroup.add(tailMesh);

  return combGroup;
}

/**
 * Creates a 3D Titanium Sectioning Clip.
 */
export function createClipMesh(envMap = null) {
  const clipGroup = new THREE.Group();

  const gunmetalMat = new THREE.MeshStandardMaterial({
    color: 0x242630,
    metalness: 0.95,
    roughness: 0.28,
    envMap: envMap,
    envMapIntensity: 2.0,
  });

  const springMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.98,
    roughness: 0.15,
    envMap: envMap,
    envMapIntensity: 3.0,
  });

  // Upper Beak
  const upperCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, 0.22, 0),
    new THREE.Vector3(-0.2, 0.32, 0),
    new THREE.Vector3(1.1, 0.06, 0),
    new THREE.Vector3(1.4, 0.0, 0),
  ]);
  const upperGeo = new THREE.TubeGeometry(upperCurve, 24, 0.07, 10, false);
  const upperMesh = new THREE.Mesh(upperGeo, gunmetalMat);
  clipGroup.add(upperMesh);

  // Lower Jaw
  const lowerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, -0.22, 0),
    new THREE.Vector3(-0.2, -0.16, 0),
    new THREE.Vector3(1.1, -0.06, 0),
    new THREE.Vector3(1.4, 0.0, 0),
  ]);
  const lowerGeo = new THREE.TubeGeometry(lowerCurve, 24, 0.07, 10, false);
  const lowerMesh = new THREE.Mesh(lowerGeo, gunmetalMat);
  clipGroup.add(lowerMesh);

  // Spring Coil
  const coilGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.26, 20);
  const coilMesh = new THREE.Mesh(coilGeo, springMat);
  coilMesh.position.set(-0.4, 0.06, 0);
  coilMesh.rotation.x = Math.PI / 2;
  clipGroup.add(coilMesh);

  return clipGroup;
}

/**
 * Creates a 3D Classic Straight Razor.
 */
export function createRazorMesh(envMap = null) {
  const razorGroup = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xf5f6fa,
    metalness: 0.98,
    roughness: 0.1,
    envMap: envMap,
    envMapIntensity: 3.0,
  });

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x141418,
    metalness: 0.7,
    roughness: 0.35,
    envMap: envMap,
  });

  // Carbon Blade
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, -0.16);
  bladeShape.lineTo(2.0, -0.13);
  bladeShape.lineTo(2.1, 0.09);
  bladeShape.lineTo(0, 0.14);
  bladeShape.lineTo(-0.45, 0.05);
  bladeShape.lineTo(-0.45, -0.05);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.035, bevelEnabled: true, bevelSize: 0.015 });
  const bladeMesh = new THREE.Mesh(bladeGeo, steelMat);
  razorGroup.add(bladeMesh);

  // Folding Handle
  const handleGeo = new THREE.BoxGeometry(2.2, 0.24, 0.09);
  const handleMesh = new THREE.Mesh(handleGeo, handleMat);
  handleMesh.position.set(-1.2, -0.45, 0);
  handleMesh.rotation.z = -0.48;
  razorGroup.add(handleMesh);

  return razorGroup;
}

/**
 * Creates a field of floating golden bokeh dust.
 */
export function createParticleDustField(count = 160) {
  const dustGroup = new THREE.Group();

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const dustMat = new THREE.PointsMaterial({
    color: 0xf4e295,
    size: 0.07,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(dustGeo, dustMat);
  dustGroup.add(points);

  return { group: dustGroup, points };
}
