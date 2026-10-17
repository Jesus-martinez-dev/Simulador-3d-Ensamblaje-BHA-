/**
 * Datos Técnicos y Especificaciones de los Componentes del BHA
 * Ensamblaje de Fondo de Pozo (Bottom Hole Assembly)
 */

export const BHA_COMPONENTS = [
  {
    id: 'drill-bit',
    name: 'Barrena PDC 8 ½"',
    category: 'Herramienta de Corte',
    type: 'PDC Matrix Body (Polycrystalline Diamond Compact)',
    order: 1, // Base (más profundo)
    height: 1.2, // unidades 3D
    color: '#d97706', // Oro/bronce técnico
    metalness: 0.85,
    roughness: 0.25,
    tag: 'Base / Cortador',
    summary: 'Elemento primario de corte que destruye la roca por cizallamiento mediante cortadores de diamante sintético.',
    specs: {
      'Diámetro Nominal': '8 ½ in (215.9 mm)',
      'Tipo de Cuerpo': 'Matriz de Carburo de Tungsteno',
      'Número de Aletas': '5 aletas parabólicas espiraladas',
      'Tamaño de Cortadores': '16 mm PDC Premium cutters (42 uds)',
      'Conexión API': '4 ½" API REG Pin',
      'Área Total de Flujo (TFA)': '0.58 in² (5 boquillas intercambiables #12)',
      'Peso en el Aire': '145 lbs (65.8 kg)',
      'Longitud Total': '1.2 ft (0.36 m)'
    },
    operationalParams: {
      'Peso sobre Barrena (WOB)': '12,000 - 32,000 lbs (5.4 - 14.5 ton)',
      'Velocidad de Rotación (RPM)': '90 - 160 RPM',
      'Caudal de Lodo (Flow Rate)': '450 - 620 GPM',
      'Caída de Presión en Boquillas': '950 - 1,400 PSI',
      'Tasa de Penetración Típica (ROP)': '18 - 45 m/h según litología',
      'HHP Hidráulico': '4.5 - 7.0 HSI (HP/in²)'
    },
    description: `La barrena PDC es la punta activa del BHA. Sus cortadores de diamante policristalino termosellados sobre postes de carburo de tungsteno rompen la formación por esfuerzo de cizalladura continuo.
    
    Cuenta con 5 aletas de diseño optimizado para flujo hidráulico con boquillas orientadas que limpian instantáneamente los recortes de perforación (cuttings), evitando el embolamiento (bit balling) y refrigerando los diamantes.`,
    recommendations: [
      'Iniciar perforación con asentamiento de fondo (break-in) a 30% del WOB durante los primeros 30 cm.',
      'Monitorear torque de fondo para detectar transición litológica o desgaste prematuro de cortadores.',
      'Mantener caudal de lodo suficiente para evitar sobrecalentamiento térmico de la cara de corte.'
    ],
    telemetry: {
      temperature: '118 °C',
      vibrationRMS: '1.8 G (Normal)',
      hydraulicEfficiency: '94.2%',
      wearIndex: '1-1-NO-A-X-I-NO-TD'
    }
  },
  {
    id: 'mud-motor',
    name: 'Motor de Fondo PDM 6 ¾"',
    category: 'Potencia & Direccional',
    type: 'Motor de Desplazamiento Positivo (PDM / Moineau)',
    order: 2,
    height: 3.8,
    color: '#0284c7', // Azul petróleo técnico
    metalness: 0.9,
    roughness: 0.2,
    tag: 'Fuerza Hidráulica',
    summary: 'Convierte la energía hidráulica del lodo en torque y rotación mecánica directa a la barrena, permitiendo perforación dirigida.',
    specs: {
      'Diámetro Externo (OD)': '6 ¾ in (171.5 mm)',
      'Configuración Lóbulos Rotor/Estator': '7:8 (Alto torque, velocidad media)',
      'Ángulo de Bent Housing': 'Ajustable 0° a 3.0° (Calibrado a 1.5°)',
      'Conexión Superior': '4 ½" IF (NC46) Box',
      'Conexión Inferior': '4 ½" REG Box',
      'Relación de Flujo': '0.34 Rev/Galón (RPG)',
      'Longitud Total': '28.5 ft (8.68 m)',
      'Peso Total': '2,450 lbs (1,111 kg)'
    },
    operationalParams: {
      'Caudal Operativo': '400 - 650 GPM',
      'Velocidad de Salida': '135 - 220 RPM',
      'Presión Diferencial Máx.': '1,250 PSI',
      'Torque Máximo Disponible': '9,600 ft-lbs (13,015 N·m)',
      'Potencia Mecánica': '280 HP a máximo caudal',
      'Límite de Temperatura': '150 °C (Elastómero NBR Hard)'
    },
    description: `El motor de fondo (Mud Motor) aprovecha el principio Moineau. El lodo a presión circula entre un rotor helicoidal de acero cromado y un estator de elastómero moldeado, forzando la rotación del rotor.
    
    Su sección doblada (Bent Housing) a 1.5° permite orientar la cara de la barrena (Toolface) deslizando la sarta sin rotarla desde superficie para construir ángulo o cambiar el azimut del pozo, o bien rotar toda la sarta para perforar en modo rotatorio continuo.`,
    recommendations: [
      'No superar la presión diferencial máxima para evitar el estancamiento del motor (motor stall).',
      'Evitar rotación desde superficie por encima de 60 RPM cuando se perfore en formaciones abrasivas con bent sub > 1.5°.',
      'Controlar el contenido de sólidos en el lodo para maximizar la vida útil del elastómero.'
    ],
    telemetry: {
      temperature: '112 °C',
      vibrationRMS: '2.4 G',
      hydraulicEfficiency: '89.5%',
      differentialPressure: '820 PSI'
    }
  },
  {
    id: 'near-bit-stab',
    name: 'Estabilizador Inferior 8 7/16"',
    category: 'Estabilización & Calibre',
    type: 'Near-Bit Spiral Blade Stabilizer',
    order: 3,
    height: 1.6,
    color: '#0d9488', // Teal técnico
    metalness: 0.95,
    roughness: 0.15,
    tag: 'Control Trayectoria',
    summary: 'Asegura la centralización del conjunto justo encima de la barrena, controlando la tendencia direccional y vibraciones.',
    specs: {
      'Diámetro de Aletas (Gauge)': '8 7/16 in (214.3 mm)',
      'Diámetro del Mandril (OD)': '6 ½ in (165.1 mm)',
      'Diámetro Interior (ID)': '2 13/16 in (71.4 mm)',
      'Número de Aletas': '3 Aletas espirales (cobertura 360°)',
      'Ángulo de Hélice': '35° espiral derecha',
      'Material de Revestimiento': 'HF3000 (Pastillas carburo de tungsteno en matriz)',
      'Conexión': '4 ½" IF Box x Pin',
      'Longitud Total': '5.8 ft (1.76 m)'
    },
    operationalParams: {
      'Holgura con el Pozo': '1/16 in bajo calibre respecto a barrena',
      'Capacidad Torsional': '44,000 ft-lbs',
      'Resistencia a Tensión': '780,000 lbs',
      'Área de Flujo Libre en Espirales': '74% del espacio anular'
    },
    description: `El estabilizador inferior (Near-Bit Stabilizer) es un componente crítico en ensamblajes direccionales. Proporciona el punto de apoyo fulcro que define si la barrena tiende a construir, mantener o tumbar ángulo.
    
    Sus aletas helicoidales con blindaje de alta resistencia evitan el desgaste por abrasión contra la pared de formación y permiten una circulación anular continua del fluido de perforación.`,
    recommendations: [
      'Inspeccionar el diámetro de calibre (gauge ring test) en cada viaje de tubería.',
      'Verificar que las aletas no presenten fracturas por impacto en formaciones con intercalaciones duras.'
    ],
    telemetry: {
      temperature: '109 °C',
      vibrationRMS: '2.1 G',
      wearIndex: 'Calibre 8.42" (Dentro de norma)'
    }
  },
  {
    id: 'mwd-lwd',
    name: 'Herramienta MWD / LWD 6 ½"',
    category: 'Medición & Telemetría',
    type: 'Measurement & Logging While Drilling System',
    order: 4,
    height: 3.2,
    color: '#6366f1', // Índigo moderno
    metalness: 0.9,
    roughness: 0.18,
    tag: 'Cerebro Electrónico',
    summary: 'Adquiere y transmite datos geofísicos y direccionales en tiempo real mediante pulsos de presión en el lodo.',
    specs: {
      'Diámetro Exterior': '6 ½ in (165.1 mm)',
      'Sensores Direccionales': 'Magnetómetros y acelerómetros triaxiales',
      'Sensores Geofísicos': 'Rayos Gamma (GR), Resistividad por propagación (2 MHz / 400 kHz)',
      'Sensor de Dinámica': 'Presión anular APWD, Choque axial y radial',
      'Tipo de Telemetría': 'Pulsos continuos de presión de lodo (Mud Pulse)',
      'Velocidad de Transmisión': '1.5 a 3.0 bits por segundo (bps)',
      'Material del Collar': 'Acero No Magnético Austenítico',
      'Alimentación': 'Turbogenerador hidráulico con respaldo de litio'
    },
    operationalParams: {
      'Temperatura Máxima de Trabajo': '165 °C (329 °F)',
      'Presión Hidrostática Máxima': '20,000 PSI',
      'Precisión de Inclinación': '± 0.1°',
      'Precisión de Azimut': '± 0.35°',
      'Rango de Detección Gamma': '0 - 500 API',
      'Rango de Resistividad': '0.1 - 2,000 ohm-m'
    },
    description: `El módulo MWD/LWD es el "cerebro" electrónico del BHA. Mide continuamente la inclinación del pozo, la orientación magnética respecto al norte (azimut) y las propiedades de la roca que se está perforando.
    
    A través de una válvula oscilante (poppet/sirena) modula ondas acústicas en la columna de lodo que viajan a la velocidad del sonido hasta sensores en superficie, permitiendo a los geólogos e ingenieros dirigir el pozo hacia el objetivo reservorio en tiempo real.`,
    recommendations: [
      'Mantener desgasificado el lodo; el gas libre atenúa las ondas de pulsos de lodo.',
      'Realizar prueba de encuesta (survey) con sarta inmóvil durante cada conexión de tubería.',
      'Calibrar línea base de fondo de rayos gamma antes de ingresar a la formación objetivo.'
    ],
    telemetry: {
      temperature: '105 °C',
      inclination: '34.8°',
      azimuth: '182.4° (Sur)',
      gammaRay: '68 API (Arenisca Limpia)',
      annularPressure: '4,850 PSI',
      batteryStatus: 'Alimentación por Turbina Activa'
    }
  },
  {
    id: 'nmdc',
    name: 'Portamechas No Magnético (NMDC)',
    category: 'Estructural & Aislamiento',
    type: 'Non-Magnetic Drill Collar (Monel / P550)',
    order: 5,
    height: 3.0,
    color: '#94a3b8', // Titanio / plata brillante
    metalness: 0.98,
    roughness: 0.12,
    tag: 'Aislamiento Magnético',
    summary: 'Aísla magnéticamente los sensores del MWD de las interferencias generadas por el resto de la sarta de perforación.',
    specs: {
      'Material': 'Acero Inoxidable Austenítico Forjado P550',
      'Permeabilidad Magnética Relativa (μr)': '< 1.005 (Totalmente amagnético)',
      'Diámetro Externo (OD)': '6 ½ in (165.1 mm)',
      'Diámetro Interno (ID)': '2 13/16 in (71.4 mm)',
      'Longitud Total': '30.0 ft (9.14 m)',
      'Peso Lineal': '98.5 lbs/ft (146.6 kg/m)',
      'Conexión': 'NC46 (4" IF) Box x Pin con alivio de esfuerzos',
      'Tratamiento Superficial': 'Shot-peened con acabado liso satinado'
    },
    operationalParams: {
      'Límite Elástico (Yield Strength)': '140,000 PSI mín.',
      'Resistencia a Tensión': '155,000 PSI',
      'Torque Recomendado de Conexión': '28,000 - 31,000 ft-lbs',
      'Resistencia a Corrosión por Cloruros': 'Superior a aceros al carbono estándar'
    },
    description: `Los portamechas no magnéticos (NMDC) son tubos de pared extremadamente gruesa fabricados con aleaciones especiales de cromo-manganeso-nitrógeno.
    
    Su función es proporcionar un ambiente magnéticamente "limpio" de al menos 9 metros de longitud alrededor de los magnetómetros del MWD, eliminando la interferencia del acero ferromagnético de la sarta para que el rumbo azimutal del pozo sea 100% confiable.`,
    recommendations: [
      'Proteger la superficie contra golpes o marcas de cuñas ferrosas que puedan inducir puntos de magnetismo local.',
      'Efectuar chequeo de "Hot-Spot" con magnetómetro de campo antes de cada bajada al pozo.'
    ],
    telemetry: {
      temperature: '102 °C',
      magneticInterference: '< 0.05 microTesla (Óptimo)',
      yieldIntegrity: '100% Nominal'
    }
  },
  {
    id: 'drilling-jar',
    name: 'Martillo de Perforación 6 ½"',
    category: 'Seguridad & Contingencia',
    type: 'Hydraulic-Mechanical Drilling Jar (Double Acting)',
    order: 6,
    height: 2.8,
    color: '#ea580c', // Naranja seguridad industrial
    metalness: 0.9,
    roughness: 0.22,
    tag: 'Dispositivo Antiatascamiento',
    summary: 'Herramienta de impacto hidromecánica de doble acción para desatorar la sarta en caso de aprisionamiento en el pozo.',
    specs: {
      'Diámetro Exterior': '6 ½ in (165.1 mm)',
      'Diámetro Interior': '2 ¼ in (57.2 mm)',
      'Carrera Telescópica (Stroke)': '10.5 in (266.7 mm)',
      'Tipo de Disparo': 'Hidráulico hacia arriba / Mecánico hacia abajo',
      'Carga Máxima de Disparo': 'Hasta 110,000 lbs de sobretensión',
      'Carga Estructura Máx. en Tensión': '520,000 lbs',
      'Conexión': 'NC46 Box x Pin',
      'Mandril de Deslizamiento': 'Acero aleado cromado de alta dureza'
    },
    operationalParams: {
      'Tiempo de Retardo Hidráulico': '40 a 90 segundos a 100°C',
      'Temperatura Máxima de Operación': '175 °C (347 °F)',
      'Torsión Máxima Admisible': '38,000 ft-lbs',
      'Posición en el Ensamblaje': 'Colocado en zona de tensión por encima del punto neutro'
    },
    description: `El martillo de perforación (Drilling Jar) almacena energía elástica en la sarta tensionada y la libera de forma instantánea cuando el pistón hidráulico cruza la cámara de restricción.
    
    El impacto súbito genera una onda de choque axial masiva hacia arriba o hacia abajo que sacude los collares atascados, desprendiéndolos de la roca o liberándolos de la pega diferencial.`,
    recommendations: [
      'Colocar siempre acelerador de martillo (Jar Accelerator) en pozos profundos para amplificar el impacto.',
      'Nunca situar el martillo en el punto neutro de flexión para evitar disparos accidentales durante la rotación ordinaria.',
      'Verificar sellos y vástago cromado antes de ensamblar en mesa rotaria.'
    ],
    telemetry: {
      temperature: '98 °C',
      jarStatus: 'Enclavado / Listo para disparo',
      tripsPerformed: '0 ciclos en viaje actual',
      hydraulicSealHealth: '98%'
    }
  },
  {
    id: 'string-stab',
    name: 'Estabilizador de Sarta 8 ⅜"',
    category: 'Estabilización & Calibre',
    type: 'Integral Blade String Stabilizer',
    order: 7,
    height: 1.6,
    color: '#059669', // Verde esmeralda industrial
    metalness: 0.95,
    roughness: 0.16,
    tag: 'Control de Armónicos',
    summary: 'Mantiene la alineación del tren superior del BHA y absorbe vibraciones laterales inducidas por la rotación.',
    specs: {
      'Diámetro de Aletas': '8 ⅜ in (212.7 mm)',
      'Diámetro del Mandril': '6 ½ in (165.1 mm)',
      'Diámetro de Flujo (ID)': '2 13/16 in (71.4 mm)',
      'Número de Aletas': '3 Aletas espirales integrales de acero forjado 4145H',
      'Longitud de Cuello': '24 in superior / 24 in inferior',
      'Conexión': 'NC46 Box x Pin',
      'Revestimiento': 'Insertos de carburo TC Trapedoidales'
    },
    operationalParams: {
      'Espacio con Formación': '1/8 in respecto a la barrena',
      'Reducción de Pandeo': 'Disminuye el pandeo de primer orden en un 85%',
      'Caudal Permisible': 'Sin restricción significativa'
    },
    description: `El estabilizador de sarta (String Stabilizer) se ubica entre las secciones de portamechas para dividir la longitud libre de pandeo (buckling length).
    
    Al amortiguar las oscilaciones radiales violentas (whirl), protege las juntas roscadas y los componentes electrónicos del MWD contra fallas catastróficas por fatiga cíclica.`,
    recommendations: [
      'Verificar que el desgaste en aletas no sea asimétrico.',
      'Realizar ensayo no destructivo (MPI / Líquidos penetrantes) en las conexiones.'
    ],
    telemetry: {
      temperature: '94 °C',
      lateralVibration: '0.8 G (Bajo)',
      gaugeDiameter: '8.375 in'
    }
  },
  {
    id: 'spiral-dc',
    name: 'Portamechas Espiralados (SDC) 6 ½"',
    category: 'Peso & Rigidez',
    type: 'Spiral Heavy Drill Collars (3 tramos en tándem)',
    order: 8,
    height: 4.2,
    color: '#475569', // Acero oscuro mecanizado
    metalness: 0.92,
    roughness: 0.28,
    tag: 'Peso sobre Barrena',
    summary: 'Suministran peso concentrado (WOB) sobre la barrena; sus ranuras espirales reducen el área de contacto para evitar pegaduras.',
    specs: {
      'Diámetro Exterior (OD)': '6 ½ in (165.1 mm)',
      'Diámetro Interior (ID)': '2 ¼ in (57.2 mm)',
      'Peso Unitario': '91.8 lbs/ft (136.6 kg/m)',
      'Configuración': '3 secciones ensambladas (longitud total ~90 ft)',
      'Canales Espirales': '3 ranuras fresadas con ángulo de 45°',
      'Área de Contacto Reducida': '~40% menos superficie contra la pared del pozo',
      'Material': 'Acero al cromo-molibdeno templado AISI 4145H Modificado',
      'Conexión': 'NC46 (4" IF) con receso de alivio de esfuerzo API'
    },
    operationalParams: {
      'Peso Total Aportado al BHA': '~8,300 lbs en lodo de perforación',
      'Límite de Torque': '34,500 ft-lbs',
      'Resistencia a Tensión': '890,000 lbs',
      'Punto Neutro': 'Calculado para permanecer en esta sección o en el HWDP'
    },
    description: `Los portamechas espiralados (Spiral Drill Collars) son cilindros de acero macizo con perforación central para el lodo. Son los encargados de aplicar peso vertical masivo sobre la barrena para forzar la penetración en la roca.
    
    Las ranuras helicoidales maquinadas a lo largo de su cuerpo crean canales para que el fluido y el revoque de lodo circulen libremente, reduciendo drásticamente el peligro de pegadura diferencial cuando se perfora a través de formaciones permeables sobrepresionadas.`,
    recommendations: [
      'Grasar adecuadamente las roscas con compuesto de zinc / cobre certificado API.',
      'Controlar el torque de apriete exacto con llaves de potencia para evitar sobretensión de hombros.'
    ],
    telemetry: {
      temperature: '91 °C',
      axialCompression: '22,400 lbs WOB transmitido',
      differentialStickingRisk: 'Bajo (< 15%)'
    }
  },
  {
    id: 'hwdp',
    name: 'Tubería Pesada (HWDP) 5"',
    category: 'Transición & Flexibilidad',
    type: 'Heavy Weight Drill Pipe (Integral Spiral / Center Wear Upset)',
    order: 9,
    height: 3.6,
    color: '#334155', // Pizarra metálica
    metalness: 0.88,
    roughness: 0.3,
    tag: 'Transición Estructural',
    summary: 'Zona de amortiguación gradual de rigidez entre los rígidos portamechas y la flexible tubería de perforación.',
    specs: {
      'Diámetro del Tubo': '5 in (127.0 mm)',
      'Espesor de Pared': '1 in (Pared extra gruesa)',
      'Diámetro del Cojinete Central': '5 ½ in (139.7 mm)',
      'Diámetro de Tool Joints (Juntas)': '6 ⅝ in (168.3 mm)',
      'Peso Lineal': '49.3 lbs/ft (73.4 kg/m)',
      'Conexión': 'NC50 (4 ½" IF) Box x Pin con hardbanding en juntas',
      'Material': 'Acero forjado AISI 1340 / 4145H',
      'Longitud Típica': '30 ft por tramo (Representado en escala)'
    },
    operationalParams: {
      'Capacidad Torsional': '41,000 ft-lbs',
      'Capacidad en Tensión': '670,000 lbs',
      'Límite de Fatiga': '250% superior a tubería de perforación estándar',
      'Uso en Pozos Direccionales': 'Ideal para empujar en pozos horizontales sin pandear'
    },
    description: `La tubería pesada (Heavy Weight Drill Pipe - HWDP) cumple la función primordial de absorber la transición drástica de momento de inercia entre los collares rígidos y la sarta superior más flexible.
    
    Posee un recrecimiento central (wear upset) que mantiene el tubo alejado de la pared del pozo, reduciendo el desgaste abrasivo por fricción y previniendo el pandeo por fatiga en la zona donde se desplaza el punto neutro durante la operación.`,
    recommendations: [
      'Inspeccionar el desgaste del cojinete central y las zonas de hardbanding con galga de calibración.',
      'Evitar rotación sostenida a frecuencias resonantes identificadas en la consola de superficie.'
    ],
    telemetry: {
      temperature: '87 °C',
      bendingStress: 'Dentro de envolvente elástica segura',
      tensionLoad: '42,000 lbs'
    }
  },
  {
    id: 'drill-pipe-xover',
    name: 'Substituto de Cruce (X-Over) & Drill Pipe 5"',
    category: 'Conexión a Superficie',
    type: 'Crossover Sub & S-135 Drill Pipe Tool Joint',
    order: 10,
    height: 2.4,
    color: '#64748b', // Gris acero
    metalness: 0.9,
    roughness: 0.22,
    tag: 'Enlace a Sarta',
    summary: 'Conecta el BHA con la sarta de perforación principal que se extiende hasta la mesa rotaria en superficie.',
    specs: {
      'Diámetro Exterior': '6 ⅝ in (Tool Joint) / 5 in (Tubo)',
      'Diámetro Interior': '3 ¼ in (82.5 mm)',
      'Grado del Tubo': 'API S-135 (Ultra alta resistencia)',
      'Conexión Inferior': 'NC50 Box',
      'Conexión Superior': '4 ½" IF Pin a sarta de perforación',
      'Banda Antidesgaste': 'Hardbanding ARNCO 100XT de bajo daño al casing',
      'Longitud del X-Over': '3.5 ft (1.07 m)'
    },
    operationalParams: {
      'Torsión de Conexión': '36,000 ft-lbs',
      'Resistencia a Tensión del Tubo': '560,000 lbs',
      'Presión Interna de Reventón': '14,200 PSI',
      'Presión de Colapso': '12,800 PSI'
    },
    description: `El substituto de cruce (Crossover Sub) adapta las diferentes roscas y diámetros entre el BHA inferior y la tubería de perforación convencional que continúa hasta la plataforma de superficie.
    
    A través de esta unión se transmite el torque rotacional desde el Top Drive y se inyecta el caudal total de fluido de perforación a alta presión para limpiar y estabilizar el pozo.`,
    recommendations: [
      'Garantizar alineación perfecta de rosca antes de enroscar para no dañar los hombros de sello.',
      'Controlar el torque de apriete con registro computarizado de llaves hidráulicas.'
    ],
    telemetry: {
      temperature: '82 °C',
      standpipePressure: '3,850 PSI',
      topDriveTorque: '18,500 ft-lbs'
    }
  }
];

export const WELLBORE_INFO = {
  wellName: 'Pozo Exploratorio ANT-104',
  field: 'Bloque Perforación Marina / Cuenca Terciaria',
  targetDepth: '3,450 m MD / 2,890 m TVD',
  currentDepth: '2,820 m MD',
  holeDiameter: '8 ½ in (215.9 mm)',
  casingShoe: '9 ⅝ in Casing a 2,400 m MD',
  mudType: 'Lodo Base Aceite (OBM) Sintético',
  mudDensity: '12.4 PPG (1.49 SG)',
  formation: 'Formación Arenisca / Lutita Intercalada'
};
