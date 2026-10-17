/**
 * Generador 3D Procedural del BHA (Bottom Hole Assembly)
 * Utiliza geometrías de Three.js con materiales PBR de alta fidelidad.
 */

const THREE = window.THREE;

export class BHAModelBuilder {
  constructor() {
    this.materials = this.initMaterials();
    this.componentMeshes = new Map();
  }

  initMaterials() {
    // Materiales PBR especializados para herramientas petroleras
    return {
      pdcMatrix: new THREE.MeshStandardMaterial({
        color: 0x4a433a,
        metalness: 0.85,
        roughness: 0.35,
        bumpScale: 0.05
      }),
      pdcCutterDiamond: new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.95,
        roughness: 0.08,
        emissive: 0x0f172a,
        emissiveIntensity: 0.2
      }),
      pdcCutterPost: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.2
      }),
      chromeSteel: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.98,
        roughness: 0.12
      }),
      hardfacing: new THREE.MeshStandardMaterial({
        color: 0x0f766e,
        metalness: 0.85,
        roughness: 0.4
      }),
      mudMotorHousing: new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        metalness: 0.85,
        roughness: 0.25
      }),
      mwdCollar: new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        metalness: 0.88,
        roughness: 0.2
      }),
      mwdInsulator: new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.2,
        roughness: 0.7
      }),
      mwdPulserGlow: new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.2
      }),
      nmdcSteel: new THREE.MeshStandardMaterial({
        color: 0xcfd8dc,
        metalness: 0.96,
        roughness: 0.15
      }),
      jarBody: new THREE.MeshStandardMaterial({
        color: 0xc2410c,
        metalness: 0.85,
        roughness: 0.3
      }),
      jarMandrel: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.99,
        roughness: 0.08
      }),
      drillCollarSteel: new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.88,
        roughness: 0.32
      }),
      hwdpSteel: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.35
      }),
      toolJointHardband: new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.9,
        roughness: 0.5
      }),
      threadedPin: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.25,
        wireframe: false
      }),
      brassAccent: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.25
      }),
      glowHighlight: new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      })
    };
  }

  /**
   * Construye el ensamblaje completo alineado a lo largo del eje Y vertical
   */
  buildBHA(componentsData) {
    const bhaRoot = new THREE.Group();
    bhaRoot.name = 'BHA_Assembly';

    let currentY = 0; // Inicia en la base (Barrena)

    componentsData.forEach((compData, index) => {
      const compGroup = new THREE.Group();
      compGroup.name = compData.id;
      compGroup.userData = {
        ...compData,
        assembledY: currentY + compData.height / 2,
        explodedOffset: index * 1.4 // Desfase vertical en vista explosionada
      };

      // Construir la geometría específica del componente
      const toolMesh = this.buildToolGeometry(compData.id, compData.height);
      compGroup.add(toolMesh);

      // Añadir unión roscada API (Pin/Box) entre componentes para la vista explosionada
      const jointMesh = this.buildAPIJoint(compData.height);
      compGroup.add(jointMesh);

      // Añadir etiqueta/punto focal interactivo
      const beacon = this.buildInteractiveBeacon(compData.name, compData.height);
      beacon.name = 'beacon_' + compData.id;
      compGroup.add(beacon);

      // Posición inicial ensamblada
      compGroup.position.y = compGroup.userData.assembledY;

      bhaRoot.add(compGroup);
      this.componentMeshes.set(compData.id, compGroup);

      // Siguiente posición hacia arriba
      currentY += compData.height;
    });

    // Centrar el BHA respecto al origen
    const totalHeight = currentY;
    bhaRoot.position.y = -totalHeight / 2;
    bhaRoot.userData.totalHeight = totalHeight;

    return { bhaRoot, totalHeight, componentMeshes: this.componentMeshes };
  }

  buildToolGeometry(id, height) {
    const group = new THREE.Group();

    switch (id) {
      case 'drill-bit':
        return this.createDrillBit(height);
      case 'mud-motor':
        return this.createMudMotor(height);
      case 'near-bit-stab':
        return this.createStabilizer(height, 8.4375 / 8.5, 0x0d9488);
      case 'mwd-lwd':
        return this.createMWDTool(height);
      case 'nmdc':
        return this.createNMDC(height);
      case 'drilling-jar':
        return this.createDrillingJar(height);
      case 'string-stab':
        return this.createStabilizer(height, 8.375 / 8.5, 0x059669);
      case 'spiral-dc':
        return this.createSpiralDrillCollar(height);
      case 'hwdp':
        return this.createHWDP(height);
      case 'drill-pipe-xover':
        return this.createXOverAndDrillPipe(height);
      default:
        return this.createGenericCollar(height);
    }
  }

  /**
   * Barrena PDC 8 ½": 5 Aletas helicoidales con cortadores de diamante y boquillas
   */
  createDrillBit(height) {
    const group = new THREE.Group();

    // 1. Cuerpo matriz cónico / parabólico
    const bodyGeo = new THREE.CylinderGeometry(0.78, 0.45, height * 0.7, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.pdcMatrix);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    // Cono de corte inferior (crown)
    const crownGeo = new THREE.ConeGeometry(0.72, height * 0.35, 32);
    crownGeo.rotateX(Math.PI);
    const crownMesh = new THREE.Mesh(crownGeo, this.materials.pdcMatrix);
    crownMesh.position.y = -height * 0.38;
    crownMesh.castShadow = true;
    group.add(crownMesh);

    // 2. 5 Aletas espirales (Blades) con cortadores PDC
    const numBlades = 5;
    for (let i = 0; i < numBlades; i++) {
      const angle = (i / numBlades) * Math.PI * 2;
      const bladeGroup = new THREE.Group();
      bladeGroup.rotation.y = angle;

      // Estructura de la aleta
      const bladeGeo = new THREE.BoxGeometry(0.22, height * 0.75, 0.5);
      const bladeMesh = new THREE.Mesh(bladeGeo, this.materials.pdcMatrix);
      bladeMesh.position.set(0, -height * 0.1, 0.55);
      bladeMesh.rotation.x = -0.15;
      bladeMesh.rotation.z = 0.08;
      bladeMesh.castShadow = true;
      bladeGroup.add(bladeMesh);

      // Cortadores PDC a lo largo del perfil de la aleta
      for (let c = 0; c < 7; c++) {
        const cutterPostGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.07, 16);
        const cutterPost = new THREE.Mesh(cutterPostGeo, this.materials.pdcCutterPost);

        // Cara de diamante negro/espejo
        const diamondFaceGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.015, 16);
        const diamondFace = new THREE.Mesh(diamondFaceGeo, this.materials.pdcCutterDiamond);
        diamondFace.position.y = 0.038;
        cutterPost.add(diamondFace);

        cutterPost.rotation.x = Math.PI / 2.3;
        const radialPos = 0.42 + c * 0.065;
        const yPos = -height * 0.45 + c * 0.11;
        cutterPost.position.set(0, yPos, radialPos);
        bladeGroup.add(cutterPost);
      }

      group.add(bladeGroup);
    }

    // 3. Boquillas de flujo hidráulico (Nozzles) con orificio visible
    for (let n = 0; n < 4; n++) {
      const nAngle = (n / 4) * Math.PI * 2 + 0.3;
      const nozzleGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.08, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, this.materials.chromeSteel);
      nozzle.position.set(Math.cos(nAngle) * 0.35, -height * 0.42, Math.sin(nAngle) * 0.35);
      nozzle.rotation.x = 0.2 * Math.sin(nAngle);
      nozzle.rotation.z = 0.2 * Math.cos(nAngle);

      // Orificio oscuro central de la boquilla
      const holeGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.085, 16);
      const hole = new THREE.Mesh(holeGeo, this.materials.pdcCutterDiamond);
      nozzle.add(hole);

      group.add(nozzle);
    }

    // 4. Cuello y calibre de la barrena (Gauge pad section)
    const gaugeGeo = new THREE.CylinderGeometry(0.8, 0.8, height * 0.25, 32);
    const gaugeMesh = new THREE.Mesh(gaugeGeo, this.materials.pdcMatrix);
    gaugeMesh.position.y = height * 0.25;
    group.add(gaugeMesh);

    // Ranuras de flujo de desvío (Junk Slot channels)
    for (let s = 0; s < 5; s++) {
      const slotGeo = new THREE.BoxGeometry(0.12, height * 0.28, 0.3);
      const slot = new THREE.Mesh(slotGeo, this.materials.pdcMatrix);
      slot.rotation.y = (s / 5) * Math.PI * 2 + 0.2;
      slot.position.set(Math.cos(slot.rotation.y) * 0.76, height * 0.25, Math.sin(slot.rotation.y) * 0.76);
      group.add(slot);
    }

    return group;
  }

  /**
   * Motor de Fondo PDM: Sección de rodamientos, bent housing articulado y sección de potencia Moineau
   */
  createMudMotor(height) {
    const group = new THREE.Group();

    // Sección 1: Ensamblaje de rodamientos inferior (Bearing Section)
    const bearingH = height * 0.28;
    const bearingGeo = new THREE.CylinderGeometry(0.72, 0.72, bearingH, 32);
    const bearingMesh = new THREE.Mesh(bearingGeo, this.materials.chromeSteel);
    bearingMesh.position.y = -height / 2 + bearingH / 2;
    group.add(bearingMesh);

    // Anillos protectores de carburo en cojinete
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(0.73, 0.02, 16, 32);
      const ring = new THREE.Mesh(ringGeo, this.materials.hardfacing);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -height / 2 + 0.2 + r * 0.35;
      group.add(ring);
    }

    // Sección 2: Bent Housing (Carcasa acodada ajustable)
    const bentH = height * 0.18;
    const bentY = -height / 2 + bearingH + bentH / 2;
    const bentGeo = new THREE.CylinderGeometry(0.74, 0.72, bentH, 32);
    const bentMesh = new THREE.Mesh(bentGeo, this.materials.mudMotorHousing);
    bentMesh.position.y = bentY;
    // Ligera inclinación visible que ilustra el Bent Sub (1.5 grados)
    bentMesh.rotation.z = 0.035;
    group.add(bentMesh);

    // Indicador de graduación angular (escala de 0° a 3°)
    const dialRingGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.08, 32);
    const dialRing = new THREE.Mesh(dialRingGeo, this.materials.brassAccent);
    dialRing.position.y = bentY;
    group.add(dialRing);

    // Sección 3: Carcasa de Potencia / Estator (Power Section)
    const powerH = height * 0.44;
    const powerY = bentY + bentH / 2 + powerH / 2;
    const powerGeo = new THREE.CylinderGeometry(0.7, 0.7, powerH, 32);
    const powerMesh = new THREE.Mesh(powerGeo, this.materials.mudMotorHousing);
    powerMesh.position.y = powerY;
    powerMesh.castShadow = true;
    group.add(powerMesh);

    // Ranuras y placas de grabado de especificaciones en el estator
    for (let g = 0; g < 4; g++) {
      const stripeGeo = new THREE.BoxGeometry(0.04, powerH * 0.8, 0.72);
      const stripe = new THREE.Mesh(stripeGeo, this.materials.chromeSteel);
      stripe.rotation.y = (g / 4) * Math.PI;
      stripe.position.y = powerY;
      group.add(stripe);
    }

    // Sección 4: Válvula de seguridad superior (Top Sub / Catch Sub)
    const topSubH = height * 0.1;
    const topSubY = powerY + powerH / 2 + topSubH / 2;
    const topSubGeo = new THREE.CylinderGeometry(0.72, 0.7, topSubH, 32);
    const topSub = new THREE.Mesh(topSubGeo, this.materials.chromeSteel);
    topSub.position.y = topSubY;
    group.add(topSub);

    return group;
  }

  /**
   * Estabilizador (Near-Bit o String): Mandril con 3 aletas espirales y canales de flujo
   */
  createStabilizer(height, gaugeScale, bladeColor) {
    const group = new THREE.Group();

    // Mandril central del estabilizador
    const mandrelRadius = 0.65;
    const mandrelGeo = new THREE.CylinderGeometry(mandrelRadius, mandrelRadius, height, 32);
    const mandrel = new THREE.Mesh(mandrelGeo, this.materials.chromeSteel);
    mandrel.castShadow = true;
    group.add(mandrel);

    // Cuellos lisos superior e inferior (Fishing necks)
    const neckTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.67, 0.65, height * 0.18, 32),
      this.materials.chromeSteel
    );
    neckTop.position.y = height * 0.41;
    group.add(neckTop);

    const neckBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.67, height * 0.18, 32),
      this.materials.chromeSteel
    );
    neckBottom.position.y = -height * 0.41;
    group.add(neckBottom);

    // 3 Aletas Espirales Integrales (360° Wrap)
    const numBlades = 3;
    const bladeMat = new THREE.MeshStandardMaterial({
      color: bladeColor,
      metalness: 0.92,
      roughness: 0.25
    });

    const steps = 14;
    const bladeHeight = height * 0.62;
    const stepHeight = bladeHeight / steps;
    const bladeRadius = 0.85 * gaugeScale;

    for (let b = 0; b < numBlades; b++) {
      const baseAngle = (b / numBlades) * Math.PI * 2;

      for (let s = 0; s < steps; s++) {
        // Torsión espiral continua
        const progress = s / steps;
        const currentAngle = baseAngle + progress * (Math.PI * 0.75); // Giro helicoidal de 135°
        const yPos = -bladeHeight / 2 + s * stepHeight;

        const bladeSegmentGeo = new THREE.BoxGeometry(0.24, stepHeight * 1.15, 0.32);
        const bladeSegment = new THREE.Mesh(bladeSegmentGeo, bladeMat);

        bladeSegment.position.set(
          Math.cos(currentAngle) * (bladeRadius - 0.12),
          yPos,
          Math.sin(currentAngle) * (bladeRadius - 0.12)
        );
        bladeSegment.rotation.y = -currentAngle;
        bladeSegment.rotation.z = 0.12; // Inclinación suave
        bladeSegment.castShadow = true;
        group.add(bladeSegment);

        // Pastillas de carburo de tungsteno en el calibre (Hardfacing buttons)
        if (s % 2 === 0) {
          const buttonGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12);
          const button = new THREE.Mesh(buttonGeo, this.materials.pdcCutterDiamond);
          button.rotation.x = Math.PI / 2;
          button.position.set(
            Math.cos(currentAngle) * bladeRadius,
            yPos,
            Math.sin(currentAngle) * bladeRadius
          );
          group.add(button);
        }
      }
    }

    return group;
  }

  /**
   * Herramienta MWD / LWD: Cuello no magnético con ranuras de resistividad, sensor gamma y telemetría por pulso
   */
  createMWDTool(height) {
    const group = new THREE.Group();

    // 1. Cuerpo principal del collar MWD
    const bodyGeo = new THREE.CylinderGeometry(0.68, 0.68, height, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.mwdCollar);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // 2. Antenas de Resistividad de Propagación (Grooves con bobinas aisladas)
    for (let a = 0; a < 4; a++) {
      const grooveY = -height * 0.3 + a * (height * 0.15);
      const insulatorGeo = new THREE.CylinderGeometry(0.69, 0.69, 0.09, 32);
      const insulator = new THREE.Mesh(insulatorGeo, this.materials.mwdInsulator);
      insulator.position.y = grooveY;
      group.add(insulator);

      // Bobina de cobre / electrodo emisor
      const coilGeo = new THREE.TorusGeometry(0.695, 0.015, 12, 32);
      const coil = new THREE.Mesh(coilGeo, this.materials.brassAccent);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = grooveY;
      group.add(coil);
    }

    // 3. Ventana del Sensor de Rayos Gamma (Gamma Ray window)
    const grWindowGeo = new THREE.BoxGeometry(0.18, 0.45, 0.72);
    const grWindow = new THREE.Mesh(grWindowGeo, this.materials.chromeSteel);
    grWindow.position.set(0, height * 0.15, 0);
    group.add(grWindow);

    // 4. Módulo de Telemetría Mud Pulse (Sirena de pulsos / Pulser sub) con anillo brillante
    const pulserRingGeo = new THREE.CylinderGeometry(0.71, 0.71, 0.15, 32);
    const pulserRing = new THREE.Mesh(pulserRingGeo, this.materials.mwdPulserGlow);
    pulserRing.position.y = height * 0.35;
    pulserRing.name = 'mwd_pulse_emitter';
    group.add(pulserRing);

    // Puertos de flujo de pulso acústico
    for (let p = 0; p < 4; p++) {
      const portGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.74, 16);
      const port = new THREE.Mesh(portGeo, this.materials.mwdInsulator);
      port.rotation.y = (p / 4) * Math.PI;
      port.position.y = height * 0.35;
      group.add(port);
    }

    return group;
  }

  /**
   * Portamechas No Magnético (NMDC): Acero austenítico P550 pulido liso
   */
  createNMDC(height) {
    const group = new THREE.Group();

    // Tubo masivo amagnético pulido
    const bodyGeo = new THREE.CylinderGeometry(0.68, 0.68, height, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.nmdcSteel);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Bandas de inspección ultrasónica grabadas
    for (let b = 0; b < 5; b++) {
      const bandGeo = new THREE.TorusGeometry(0.683, 0.008, 12, 32);
      const band = new THREE.Mesh(bandGeo, this.materials.chromeSteel);
      band.rotation.x = Math.PI / 2;
      band.position.y = -height / 2 + 0.3 + b * (height / 5);
      group.add(band);
    }

    // Relieve de alivio de esfuerzo en hombros
    const topRelief = new THREE.Mesh(
      new THREE.CylinderGeometry(0.71, 0.68, height * 0.08, 32),
      this.materials.nmdcSteel
    );
    topRelief.position.y = height * 0.46;
    group.add(topRelief);

    const btmRelief = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.71, height * 0.08, 32),
      this.materials.nmdcSteel
    );
    btmRelief.position.y = -height * 0.46;
    group.add(btmRelief);

    return group;
  }

  /**
   * Martillo de Perforación (Drilling Jar): Carcasa hidráulica, vástago cromado y estriado
   */
  createDrillingJar(height) {
    const group = new THREE.Group();

    // Sección 1: Cilindro hidráulico exterior inferior
    const lowerBodyH = height * 0.45;
    const lowerBodyGeo = new THREE.CylinderGeometry(0.7, 0.7, lowerBodyH, 32);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, this.materials.jarBody);
    lowerBody.position.y = -height / 2 + lowerBodyH / 2;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // Sección 2: Vástago cromado telescópico (Mandrel expuesto - simulación de carrera/stroke)
    const strokeH = height * 0.22;
    const mandrelGeo = new THREE.CylinderGeometry(0.52, 0.52, strokeH, 32);
    const mandrel = new THREE.Mesh(mandrelGeo, this.materials.jarMandrel);
    mandrel.position.y = -height / 2 + lowerBodyH + strokeH / 2;
    group.add(mandrel);

    // Anillo indicador de posición de disparo (Stroke position ring)
    const tripRingGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
    const tripRing = new THREE.Mesh(tripRingGeo, this.materials.pdcCutterPost);
    tripRing.position.y = mandrel.position.y;
    group.add(tripRing);

    // Sección 3: Camisa estriada de transmisión de torque (Spline Section)
    const splineH = height * 0.33;
    const splineGeo = new THREE.CylinderGeometry(0.7, 0.7, splineH, 32);
    const splineBody = new THREE.Mesh(splineGeo, this.materials.jarBody);
    splineBody.position.y = height / 2 - splineH / 2;
    group.add(splineBody);

    // Ranuras longitudinales estriadas visibles
    for (let s = 0; s < 8; s++) {
      const ribGeo = new THREE.BoxGeometry(0.035, splineH * 0.75, 0.73);
      const rib = new THREE.Mesh(ribGeo, this.materials.chromeSteel);
      rib.rotation.y = (s / 8) * Math.PI;
      rib.position.y = splineBody.position.y;
      group.add(rib);
    }

    return group;
  }

  /**
   * Portamechas Espiralados (Spiral Drill Collars): Cuerpo de pared gruesa con canales helicoidales
   */
  createSpiralDrillCollar(height) {
    const group = new THREE.Group();

    // Mandril cilíndrico central pesado
    const collarRadius = 0.68;
    const bodyGeo = new THREE.CylinderGeometry(collarRadius, collarRadius, height, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.drillCollarSteel);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Canales helicoidales maquinados (Spiral Grooves) simulados proceduralmente
    const numSpirals = 3;
    const steps = 28;
    const spiralHeight = height * 0.85;
    const stepH = spiralHeight / steps;

    for (let i = 0; i < numSpirals; i++) {
      const baseAngle = (i / numSpirals) * Math.PI * 2;

      for (let s = 0; s < steps; s++) {
        const progress = s / steps;
        const angle = baseAngle + progress * Math.PI * 3.2; // 3.2 vueltas completas
        const yPos = -spiralHeight / 2 + s * stepH;

        const cutGeo = new THREE.BoxGeometry(0.12, stepH * 1.1, 0.28);
        const cutMesh = new THREE.Mesh(cutGeo, this.materials.chromeSteel);
        cutMesh.position.set(
          Math.cos(angle) * (collarRadius - 0.03),
          yPos,
          Math.sin(angle) * (collarRadius - 0.03)
        );
        cutMesh.rotation.y = -angle;
        cutMesh.rotation.z = -0.25;
        group.add(cutMesh);
      }
    }

    // Juntas de conexión API con hardbanding
    const jointTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.71, 0.71, height * 0.08, 32),
      this.materials.toolJointHardband
    );
    jointTop.position.y = height * 0.46;
    group.add(jointTop);

    const jointBtm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.71, 0.71, height * 0.08, 32),
      this.materials.toolJointHardband
    );
    jointBtm.position.y = -height * 0.46;
    group.add(jointBtm);

    return group;
  }

  /**
   * Tubería Pesada (HWDP): Tubo intermedio de 5" con recalque central ensanchado (Center Upset)
   */
  createHWDP(height) {
    const group = new THREE.Group();

    // Tubo cilíndrico más esbelto (5 in OD)
    const pipeRadius = 0.52;
    const pipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, height, 32);
    const pipeMesh = new THREE.Mesh(pipeGeo, this.materials.hwdpSteel);
    pipeMesh.castShadow = true;
    group.add(pipeMesh);

    // Cojinete central ensanchado (Center Wear Upset - 5 ½ in OD)
    const upsetH = height * 0.25;
    const upsetGeo = new THREE.CylinderGeometry(0.62, 0.62, upsetH, 32);
    const upsetMesh = new THREE.Mesh(upsetGeo, this.materials.hwdpSteel);
    group.add(upsetMesh);

    // Bandas de Hardbanding antidesgaste en el recalque central
    for (let h = -1; h <= 1; h++) {
      const hbGeo = new THREE.TorusGeometry(0.625, 0.015, 12, 32);
      const hb = new THREE.Mesh(hbGeo, this.materials.toolJointHardband);
      hb.rotation.x = Math.PI / 2;
      hb.position.y = h * 0.18;
      group.add(hb);
    }

    // Tool Joints (Conexiones de extremos ensanchadas a 6 ⅝ in)
    const jointTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.6, height * 0.15, 32),
      this.materials.drillCollarSteel
    );
    jointTop.position.y = height / 2 - height * 0.075;
    group.add(jointTop);

    const jointBtm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.7, height * 0.15, 32),
      this.materials.drillCollarSteel
    );
    jointBtm.position.y = -height / 2 + height * 0.075;
    group.add(jointBtm);

    return group;
  }

  /**
   * Substituto de Cruce (X-Over) & Drill Pipe 5"
   */
  createXOverAndDrillPipe(height) {
    const group = new THREE.Group();

    // X-Over Sub (adaptador cónico)
    const xoverH = height * 0.45;
    const xoverGeo = new THREE.CylinderGeometry(0.62, 0.7, xoverH, 32);
    const xoverMesh = new THREE.Mesh(xoverGeo, this.materials.chromeSteel);
    xoverMesh.position.y = -height / 2 + xoverH / 2;
    group.add(xoverMesh);

    // Ranura de cuña (Elevator neck / slip recess)
    const neckGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.15, 32);
    const neck = new THREE.Mesh(neckGeo, this.materials.hwdpSteel);
    neck.position.y = xoverMesh.position.y;
    group.add(neck);

    // Tubo de perforación convencional (Drill Pipe)
    const dpH = height * 0.55;
    const dpGeo = new THREE.CylinderGeometry(0.5, 0.5, dpH, 32);
    const dpMesh = new THREE.Mesh(dpGeo, this.materials.hwdpSteel);
    dpMesh.position.y = height / 2 - dpH / 2;
    dpMesh.castShadow = true;
    group.add(dpMesh);

    // Tool Joint Box de la tubería
    const toolJointGeo = new THREE.CylinderGeometry(0.68, 0.62, 0.25, 32);
    const toolJoint = new THREE.Mesh(toolJointGeo, this.materials.toolJointHardband);
    toolJoint.position.y = height / 2 - 0.125;
    group.add(toolJoint);

    return group;
  }

  createGenericCollar(height) {
    const geo = new THREE.CylinderGeometry(0.68, 0.68, height, 32);
    return new THREE.Mesh(geo, this.materials.drillCollarSteel);
  }

  /**
   * Simula la rosca API Pin y hombro de sellado que se hace visible en vista explosionada
   */
  buildAPIJoint(height) {
    const jointGroup = new THREE.Group();
    jointGroup.name = 'api_threaded_pin';

    // Rosca macho cónica cónica (Tapered API Pin Thread)
    const pinGeo = new THREE.ConeGeometry(0.48, 0.35, 24);
    pinGeo.rotateX(Math.PI);
    const pinMesh = new THREE.Mesh(pinGeo, this.materials.threadedPin);
    pinMesh.position.y = -height / 2 - 0.175;
    jointGroup.add(pinMesh);

    // Filetes de rosca en espiral
    for (let f = 0; f < 5; f++) {
      const ringGeo = new THREE.TorusGeometry(0.44 - f * 0.05, 0.012, 8, 24);
      const ring = new THREE.Mesh(ringGeo, this.materials.chromeSteel);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -height / 2 - 0.06 - f * 0.06;
      jointGroup.add(ring);
    }

    return jointGroup;
  }

  /**
   * Crea un marcador 3D interactivo / baliza pulsante que indica el punto de selección
   */
  buildInteractiveBeacon(name, height) {
    const beacon = new THREE.Group();

    // Anillo flotante pulsante
    const ringGeo = new THREE.RingGeometry(0.88, 0.96, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0;
    beacon.add(ringMesh);

    // Esfera central brillante
    const orbGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(1.05, 0, 0);
    beacon.add(orb);

    beacon.visible = false; // Se activa al pasar el ratón o seleccionar
    return beacon;
  }

  /**
   * Crea el entorno del pozo (Wellbore): Formación geológica estratificada y zapata de casing
   */
  createWellbore(totalHeight) {
    const wellboreGroup = new THREE.Group();
    wellboreGroup.name = 'Wellbore_Environment';

    const holeRadius = 1.05; // Radio del pozo (8 ½" bit + sobrecalibre de 2 in anular)
    const wallThickness = 0.4;
    const wellH = totalHeight * 1.35;

    // Estratos geológicos: Lutita (Shale), Arenisca (Sandstone), Caliza (Limestone)
    const stratumLayers = [
      { name: 'Casing 9 5/8"', color: 0x334155, opacity: 0.45, h: wellH * 0.2 },
      { name: 'Lutita Marina', color: 0x1e293b, opacity: 0.35, h: wellH * 0.3 },
      { name: 'Arenisca Reservorio', color: 0x78350f, opacity: 0.38, h: wellH * 0.35 },
      { name: 'Caliza Compacta', color: 0x475569, opacity: 0.35, h: wellH * 0.15 }
    ];

    let currentWallY = wellH / 2;

    stratumLayers.forEach((layer) => {
      const geo = new THREE.CylinderGeometry(
        holeRadius + wallThickness,
        holeRadius + wallThickness,
        layer.h,
        36,
        1,
        true,
        Math.PI * 0.25,
        Math.PI * 1.5 // Corte transversal de 270 grados para ver el interior
      );

      const mat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.85,
        metalness: 0.1,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = currentWallY - layer.h / 2;
      wellboreGroup.add(mesh);

      currentWallY -= layer.h;
    });

    // Zapata de revestimiento (Casing Shoe)
    const shoeGeo = new THREE.CylinderGeometry(holeRadius + 0.05, holeRadius + 0.12, 0.4, 32);
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2
    });
    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.y = wellH / 2 - wellH * 0.2;
    wellboreGroup.add(shoe);

    return wellboreGroup;
  }

  /**
   * Crea el sistema de partículas que simula el fluido de perforación (Lodo circulando)
   */
  createMudParticleSystem(totalHeight) {
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(0x06b6d4); // Cyan fluido de perforación
    const cuttingColor = new THREE.Color(0xf59e0b); // Amarillo/ocre para partículas de recorte

    for (let i = 0; i < particleCount; i++) {
      const isInternal = i < particleCount * 0.45; // 45% lodo bajando por el interior
      const i3 = i * 3;

      if (isInternal) {
        // Bajando dentro de la sarta
        positions[i3] = (Math.random() - 0.5) * 0.35;
        positions[i3 + 1] = (Math.random() - 0.5) * totalHeight;
        positions[i3 + 2] = (Math.random() - 0.5) * 0.35;

        velocities[i3] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 1] = -0.22 - Math.random() * 0.15; // Velocidad descendente rápida
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

        colors[i3] = baseColor.r;
        colors[i3 + 1] = baseColor.g;
        colors[i3 + 2] = baseColor.b;
      } else {
        // Subiendo por el espacio anular (con recortes de roca)
        const radius = 0.82 + Math.random() * 0.35;
        const angle = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * totalHeight;
        positions[i3 + 2] = Math.sin(angle) * radius;

        velocities[i3] = -Math.sin(angle) * 0.015; // Remolino anular
        velocities[i3 + 1] = 0.08 + Math.random() * 0.08; // Flujo laminar ascendente
        velocities[i3 + 2] = Math.cos(angle) * 0.015;

        // Algunas partículas son recortes de roca
        const isCutting = Math.random() > 0.65;
        const col = isCutting ? cuttingColor : baseColor;
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.name = 'Mud_Particles';
    particles.userData = { velocities, totalHeight };

    return particles;
  }
}
