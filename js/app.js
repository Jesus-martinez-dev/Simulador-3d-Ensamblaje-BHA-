/**
 * Controlador Principal de la Aplicación Three.js - BHA Digital Twin
 */

const THREE = window.THREE;
const OrbitControls = THREE.OrbitControls;
import { BHA_COMPONENTS, WELLBORE_INFO } from './bha-data.js';
import { BHAModelBuilder } from './bha-model.js';

class BHAApplication {
  constructor() {
    this.container = document.getElementById('webgl-container');
    
    // Configuración de la Escena 3D
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Modelos y Grupos
    this.bhaBuilder = new BHAModelBuilder();
    this.bhaRoot = null;
    this.wellboreGroup = null;
    this.mudParticles = null;
    this.componentMeshes = new Map();
    this.totalHeight = 0;

    // Estado de la Simulación
    this.isRotating = false;
    this.currentRPM = 60;
    this.isExploded = false;
    this.explodeFactor = 0; // 0 = Ensamblado, 1 = Explosionado
    this.targetExplodeFactor = 0;
    this.isMudActive = true;
    this.isWellboreVisible = false;
    this.selectedComponentId = null;

    // Raycasting e Interacción
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredComponentId = null;
    this.lastHoverBeacon = null;

    // Animación de Cámara (Tween / Lerp)
    this.cameraAnimation = {
      isAnimating: false,
      startPos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      startLook: new THREE.Vector3(),
      targetLook: new THREE.Vector3(),
      progress: 0,
      duration: 1.2
    };

    // Elementos DOM
    this.dom = {
      bhaListContainer: document.getElementById('bha-list-container'),
      specPanel: document.getElementById('spec-panel'),
      btnCloseSpec: document.getElementById('btn-close-spec'),
      btnFocusComponent: document.getElementById('btn-focus-component'),
      tooltip: document.getElementById('floating-tooltip'),
      tooltipTitle: document.getElementById('tooltip-title'),
      tooltipSub: document.getElementById('tooltip-sub'),
      wellboreHud: document.getElementById('wellbore-hud'),
      // Botones
      btnResetView: document.getElementById('btn-reset-view'),
      btnToggleExplode: document.getElementById('btn-toggle-explode'),
      btnToggleRotate: document.getElementById('btn-toggle-rotate'),
      btnToggleMud: document.getElementById('btn-toggle-mud'),
      btnToggleWellbore: document.getElementById('btn-toggle-wellbore'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      rpmSlider: document.getElementById('rpm-slider'),
      rpmDisplay: document.getElementById('rpm-display'),
      // Ficha Técnica
      specCatBadge: document.getElementById('spec-cat-badge'),
      specOrderBadge: document.getElementById('spec-order-badge'),
      specTitle: document.getElementById('spec-title'),
      specType: document.getElementById('spec-type'),
      specSummary: document.getElementById('spec-summary'),
      specTableBody: document.getElementById('spec-table-body'),
      operTableBody: document.getElementById('oper-table-body'),
      recommendationsList: document.getElementById('recommendations-list'),
      specFullDesc: document.getElementById('spec-full-desc'),
      telemetryGrid: document.getElementById('telemetry-grid-container')
    };

    this.init();
  }

  init() {
    this.initScene();
    this.initLighting();
    this.build3DScene();
    this.initControls();
    this.initEventListeners();
    this.renderSidebarList();
    this.startTelemetryJitter();

    // Render loop
    this.animate();
  }

  initScene() {
    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a12);
    this.scene.fog = new THREE.FogExp2(0x070a12, 0.015);

    // 2. Cámara
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);
    this.camera.position.set(22, 5, 26);

    // 3. Renderizador WebGL de alta fidelidad
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
  }

  initLighting() {
    // Iluminación de estudio industrial para resaltar acabados metálicos y cortes PBR
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.9);
    this.scene.add(ambientLight);

    // Luz principal direccional (Sol/Top Drive rig light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(18, 30, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Luz de relleno azul frío (simula ambiente petrolero / fluidos)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-18, 10, -15);
    this.scene.add(fillLight);

    // Luz de contorno cálida inferior (resalta la barrena de corte y cortadores PDC)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    rimLight.position.set(0, -25, 12);
    this.scene.add(rimLight);

    // Luz puntual puntual en la punta de corte
    const bitPointLight = new THREE.PointLight(0x00f0ff, 1.5, 15);
    bitPointLight.position.set(0, -12, 3);
    this.scene.add(bitPointLight);
  }

  build3DScene() {
    // 1. Construir ensamblaje de herramientas BHA
    const buildResult = this.bhaBuilder.buildBHA(BHA_COMPONENTS);
    this.bhaRoot = buildResult.bhaRoot;
    this.totalHeight = buildResult.totalHeight;
    this.componentMeshes = buildResult.componentMeshes;
    this.scene.add(this.bhaRoot);

    // 2. Construir entorno del pozo (Wellbore)
    this.wellboreGroup = this.bhaBuilder.createWellbore(this.totalHeight);
    this.wellboreGroup.visible = this.isWellboreVisible;
    this.scene.add(this.wellboreGroup);

    // 3. Construir partículas de lodo de perforación (Mud Circulation)
    this.mudParticles = this.bhaBuilder.createMudParticleSystem(this.totalHeight);
    this.mudParticles.visible = this.isMudActive;
    this.scene.add(this.mudParticles);

    // 4. Guía visual de fondo de pozo (Grid circular en base)
    const gridHelper = new THREE.PolarGridHelper(8, 16, 8, 32, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -this.totalHeight / 2 - 0.2;
    this.scene.add(gridHelper);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI - 0.05;
    this.controls.target.set(0, 0, 0);
  }

  initEventListeners() {
    // Redimensionamiento de ventana
    window.addEventListener('resize', () => this.onWindowResize());

    // Interacción con ratón en el Canvas
    this.container.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.container.addEventListener('pointerdown', (e) => this.onPointerDown(e));

    // Pestañas de la Ficha Técnica
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(btn.dataset.tab);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Cerrar Ficha Técnica
    this.dom.btnCloseSpec.addEventListener('click', () => {
      this.closeSpecPanel();
    });

    // Centrar en componente actual
    this.dom.btnFocusComponent.addEventListener('click', () => {
      if (this.selectedComponentId) {
        this.focusOnComponent(this.selectedComponentId);
      }
    });

    // Barra de herramientas: Vista General
    this.dom.btnResetView.addEventListener('click', () => {
      this.resetCameraView();
    });

    // Barra de herramientas: Vista Explosionada
    this.dom.btnToggleExplode.addEventListener('click', () => {
      this.isExploded = !this.isExploded;
      this.targetExplodeFactor = this.isExploded ? 1 : 0;
      this.dom.btnToggleExplode.classList.toggle('active', this.isExploded);
    });

    // Barra de herramientas: Rotación de Sarta
    this.dom.btnToggleRotate.addEventListener('click', () => {
      this.isRotating = !this.isRotating;
      this.dom.btnToggleRotate.classList.toggle('active', this.isRotating);
    });

    // Control de RPM
    this.dom.rpmSlider.addEventListener('input', (e) => {
      this.currentRPM = parseInt(e.target.value, 10);
      this.dom.rpmDisplay.textContent = `${this.currentRPM} RPM`;
    });

    // Barra de herramientas: Flujo de Lodo
    this.dom.btnToggleMud.addEventListener('click', () => {
      this.isMudActive = !this.isMudActive;
      this.mudParticles.visible = this.isMudActive;
      this.dom.btnToggleMud.classList.toggle('active', this.isMudActive);
    });

    // Barra de herramientas: Entorno del Pozo
    this.dom.btnToggleWellbore.addEventListener('click', () => {
      this.isWellboreVisible = !this.isWellboreVisible;
      this.wellboreGroup.visible = this.isWellboreVisible;
      this.dom.btnToggleWellbore.classList.toggle('active', this.isWellboreVisible);
    });

    // Pantalla Completa
    this.dom.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Actualizar posición de tooltip flotante
    this.dom.tooltip.style.left = `${event.clientX}px`;
    this.dom.tooltip.style.top = `${event.clientY}px`;

    // Raycast para hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.bhaRoot.children, true);

    if (intersects.length > 0) {
      // Ascender hasta el grupo de la herramienta
      const compGroup = this.getComponentGroupFromObject(intersects[0].object);
      if (compGroup && compGroup.userData.id) {
        if (this.hoveredComponentId !== compGroup.userData.id) {
          this.hoveredComponentId = compGroup.userData.id;
          this.highlightHovered(compGroup);
        }
        return;
      }
    }

    // Si no toca nada
    if (this.hoveredComponentId) {
      this.clearHover();
    }
  }

  onPointerDown(event) {
    // Si se hizo clic derecho o rueda, no seleccionar
    if (event.button !== 0) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.bhaRoot.children, true);

    if (intersects.length > 0) {
      const compGroup = this.getComponentGroupFromObject(intersects[0].object);
      if (compGroup && compGroup.userData.id) {
        this.selectComponent(compGroup.userData.id);
      }
    }
  }

  getComponentGroupFromObject(object) {
    let current = object;
    while (current && current.parent && current.parent !== this.bhaRoot) {
      current = current.parent;
    }
    return current;
  }

  highlightHovered(compGroup) {
    // Mostrar beacon luminoso
    const beacon = compGroup.getObjectByName('beacon_' + compGroup.userData.id);
    if (this.lastHoverBeacon && this.lastHoverBeacon !== beacon) {
      this.lastHoverBeacon.visible = false;
    }
    if (beacon) {
      beacon.visible = true;
      this.lastHoverBeacon = beacon;
    }

    // Mostrar tooltip flotante
    this.dom.tooltipTitle.textContent = compGroup.userData.name;
    this.dom.tooltipSub.textContent = `${compGroup.userData.category} • Clic para ver ficha`;
    this.dom.tooltip.classList.add('visible');
    this.container.style.cursor = 'pointer';
  }

  clearHover() {
    if (this.lastHoverBeacon && (!this.selectedComponentId || this.lastHoverBeacon.name !== 'beacon_' + this.selectedComponentId)) {
      this.lastHoverBeacon.visible = false;
    }
    this.hoveredComponentId = null;
    this.dom.tooltip.classList.remove('visible');
    this.container.style.cursor = 'grab';
  }

  selectComponent(id) {
    const compData = BHA_COMPONENTS.find(c => c.id === id);
    if (!compData) return;

    this.selectedComponentId = id;

    // Actualizar beacons
    this.componentMeshes.forEach((mesh, key) => {
      const beacon = mesh.getObjectByName('beacon_' + key);
      if (beacon) beacon.visible = (key === id);
    });

    // Actualizar lista en el navegador lateral
    document.querySelectorAll('.bha-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.id === id);
    });

    // Cargar datos en la Ficha Técnica Informativa y desplegarla
    this.populateSpecPanel(compData);
    this.dom.specPanel.classList.add('open');

    // Desplazar cámara suavemente hacia la herramienta
    this.focusOnComponent(id);
  }

  populateSpecPanel(comp) {
    this.dom.specCatBadge.textContent = comp.category;
    this.dom.specOrderBadge.textContent = `Posición ${comp.order} / 10 (${comp.tag})`;
    this.dom.specTitle.textContent = comp.name;
    this.dom.specType.textContent = comp.type;
    this.dom.specSummary.textContent = comp.summary;

    // Tabla de Especificaciones Mecánicas
    this.dom.specTableBody.innerHTML = '';
    for (const [key, val] of Object.entries(comp.specs)) {
      const row = document.createElement('tr');
      row.innerHTML = `<td class="table-key">${key}</td><td class="table-val">${val}</td>`;
      this.dom.specTableBody.appendChild(row);
    }

    // Tabla de Parámetros Operativos
    this.dom.operTableBody.innerHTML = '';
    for (const [key, val] of Object.entries(comp.operationalParams)) {
      const row = document.createElement('tr');
      row.innerHTML = `<td class="table-key">${key}</td><td class="table-val">${val}</td>`;
      this.dom.operTableBody.appendChild(row);
    }

    // Recomendaciones de Campo
    this.dom.recommendationsList.innerHTML = '';
    comp.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      this.dom.recommendationsList.appendChild(li);
    });

    // Descripción Completa y Principio Físico
    this.dom.specFullDesc.textContent = comp.description;

    // Cuadrícula de Telemetría
    this.dom.telemetryGrid.innerHTML = '';
    for (const [key, val] of Object.entries(comp.telemetry)) {
      const card = document.createElement('div');
      card.className = 'telemetry-card';
      const labelText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      card.innerHTML = `
        <span class="telemetry-label">${labelText}</span>
        <span class="telemetry-val">${val}</span>
      `;
      this.dom.telemetryGrid.appendChild(card);
    }
  }

  closeSpecPanel() {
    this.dom.specPanel.classList.remove('open');
    if (this.selectedComponentId) {
      const mesh = this.componentMeshes.get(this.selectedComponentId);
      if (mesh) {
        const beacon = mesh.getObjectByName('beacon_' + this.selectedComponentId);
        if (beacon) beacon.visible = false;
      }
      this.selectedComponentId = null;
    }
    document.querySelectorAll('.bha-item').forEach(item => item.classList.remove('selected'));
  }

  focusOnComponent(id) {
    const compGroup = this.componentMeshes.get(id);
    if (!compGroup) return;

    // Calcular posición del componente en el mundo
    const worldPos = new THREE.Vector3();
    compGroup.getWorldPosition(worldPos);

    // Distancia estética calculada según la altura de la herramienta
    const height = compGroup.userData.height || 2;
    const distance = Math.max(height * 2.8, 6.5);

    // Calcular dirección actual de la cámara respecto al objeto para una transición natural
    const offsetDir = new THREE.Vector3()
      .subVectors(this.camera.position, this.controls.target)
      .normalize();

    // Nueva posición de destino para la cámara
    const targetCameraPos = worldPos.clone().add(offsetDir.multiplyScalar(distance));
    targetCameraPos.y = worldPos.y + 1.2;

    this.startCameraTransition(targetCameraPos, worldPos);
  }

  resetCameraView() {
    // Vista general de todo el BHA
    const targetLook = new THREE.Vector3(0, 0, 0);
    const targetCam = new THREE.Vector3(22, 5, 26);
    this.startCameraTransition(targetCam, targetLook);
    this.closeSpecPanel();
  }

  startCameraTransition(targetPos, targetLook) {
    this.cameraAnimation.isAnimating = true;
    this.cameraAnimation.progress = 0;
    this.cameraAnimation.startPos.copy(this.camera.position);
    this.cameraAnimation.targetPos.copy(targetPos);
    this.cameraAnimation.startLook.copy(this.controls.target);
    this.cameraAnimation.targetLook.copy(targetLook);
  }

  renderSidebarList() {
    // Invertir lista para mostrar de arriba hacia abajo (orden de perforación estándar) o de fondo a superficie
    // Mostramos de 10 (superficie) a 1 (barrena en fondo) para una lectura intuitiva de la columna
    const reversed = [...BHA_COMPONENTS].reverse();

    this.dom.bhaListContainer.innerHTML = '';
    reversed.forEach(comp => {
      const item = document.createElement('div');
      item.className = 'bha-item';
      item.dataset.id = comp.id;
      item.title = `${comp.name} - ${comp.tag}`;

      item.innerHTML = `
        <div class="bha-order">${comp.order}</div>
        <div class="bha-info">
          <div class="bha-name">${comp.name}</div>
          <div class="bha-cat">${comp.category}</div>
        </div>
        <div class="bha-color-dot" style="color: ${comp.color};"></div>
      `;

      item.addEventListener('click', () => {
        this.selectComponent(comp.id);
      });

      this.dom.bhaListContainer.appendChild(item);
    });
  }

  startTelemetryJitter() {
    // Simula telemetría viva con variaciones sutiles y realistas
    setInterval(() => {
      const hudTemp = document.getElementById('hud-temp');
      const hudFlow = document.getElementById('hud-flow');
      if (hudTemp) {
        const tempBase = 118;
        const jitter = (Math.random() * 0.8 - 0.4).toFixed(1);
        hudTemp.textContent = `${(tempBase + parseFloat(jitter)).toFixed(1)} °C`;
      }
      if (hudFlow) {
        const flowBase = this.isMudActive ? 550 : 0;
        const jitter = Math.floor(Math.random() * 8 - 4);
        hudFlow.textContent = `${Math.max(0, flowBase + jitter)} GPM`;
      }
    }, 2500);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // 1. Rotación de Sarta
    if (this.isRotating && this.bhaRoot) {
      const radiansPerSecond = (this.currentRPM * 2 * Math.PI) / 60;
      this.bhaRoot.rotation.y += radiansPerSecond * delta;
    }

    // 2. Animación de Vista Explosionada (Smooth Lerp)
    if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
      this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.08;
      
      this.componentMeshes.forEach(compMesh => {
        const assembledY = compMesh.userData.assembledY;
        const explodedOffset = compMesh.userData.explodedOffset;
        compMesh.position.y = assembledY + explodedOffset * this.explodeFactor;
      });
    }

    // 3. Animación de Partículas de Lodo
    if (this.isMudActive && this.mudParticles) {
      const positions = this.mudParticles.geometry.attributes.position.array;
      const velocities = this.mudParticles.userData.velocities;
      const halfH = this.totalHeight / 2;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Límite inferior (fondo del pozo) -> reiniciar arriba o dispersar
        if (positions[i + 1] < -halfH) {
          if (velocities[i + 1] < 0) {
            positions[i + 1] = halfH;
          }
        }
        // Límite superior
        if (positions[i + 1] > halfH) {
          if (velocities[i + 1] > 0) {
            positions[i + 1] = -halfH + 0.5;
          }
        }
      }
      this.mudParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Pulso de Telemetría MWD (Anillo LED brillante)
    const pulserRing = this.scene.getObjectByName('mwd_pulse_emitter');
    if (pulserRing) {
      const pulse = 1.0 + Math.sin(this.clock.getElapsedTime() * 6) * 0.6;
      pulserRing.material.emissiveIntensity = pulse;
    }

    // 5. Animación de Transición de Cámara (Cubic Ease-Out)
    if (this.cameraAnimation.isAnimating) {
      this.cameraAnimation.progress += delta / this.cameraAnimation.duration;
      if (this.cameraAnimation.progress >= 1) {
        this.cameraAnimation.progress = 1;
        this.cameraAnimation.isAnimating = false;
      }

      // Función de aceleración suave (Ease-Out Cubic)
      const t = 1 - Math.pow(1 - this.cameraAnimation.progress, 3);

      this.camera.position.lerpVectors(this.cameraAnimation.startPos, this.cameraAnimation.targetPos, t);
      this.controls.target.lerpVectors(this.cameraAnimation.startLook, this.cameraAnimation.targetLook, t);
    }

    // Actualizar OrbitControls
    this.controls.update();

    // Renderizar
    this.renderer.render(this.scene, this.camera);
  }
}

// Iniciar aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  new BHAApplication();
});
