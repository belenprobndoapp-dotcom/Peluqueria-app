export interface HaircutEntry {
  id: string;
  name: string;
  category: 'Corto' | 'Medio' | 'Largo';
  gender: 'femenino' | 'masculino' | 'unisex';
  compatibleFaceShapes: string[]; // ['Ovalado', 'Redondo', 'Cuadrado', 'Corazón', 'Diamante', 'Alargado']
  shapesToAvoid?: string[];
  visagismEffect: string; // Explicación geométrica de por qué favorece
  stylingTips: string;
  hairTexturesSuited: string[]; // ['Lacio', 'Ondulado', 'Rizado', 'Fino', 'Grueso']
  maintenanceLevel: 'Bajo' | 'Medio' | 'Alto';
  celebrityReference: string;
  imageUrl: string;
  tags: string[];
}

export interface HairColorEntry {
  id: string;
  shadeName: string;
  dyeCode: string; // Ej: "7.34", "5.35", "8.1"
  hexColor: string; // Swatch hex
  secondaryHex?: string; // Para reflejos / balayage
  category: 'Rubio' | 'Castaño' | 'Cobrizo' | 'Negro' | 'Fantasía / Pastel';
  enhancedSkinTones: string[]; // ['Muy Claro', 'Claro', 'Medio', 'Bronceado', 'Oscuro']
  enhancedUndertones: ('Cálido' | 'Frío' | 'Neutro' | 'Oliva')[];
  compatibleBaseHairColors: string[]; // Alturas de tono de partida o colores actuales
  luminosityEffect: string; // Cómo enciende la luz del rostro y ojos
  bestTechnique: string; // 'Balayage', 'Babylights', 'Face Framing / Money Piece', 'Color Global', 'Gloss Iluminador'
  maintenanceLevel: 'Bajo' | 'Medio' | 'Alto';
  seasonalHarmony: string[]; // ['Primavera Cálida', 'Otoño Cálido', 'Verano Suave', 'Invierno Brillante', etc.]
  tags: string[];
}

export const HAIRCUTS_DATABASE: HaircutEntry[] = [
  {
    id: 'cut-long-bob-layers',
    name: 'Long Bob (Lob) Desfilado con Puntas Texturizadas',
    category: 'Medio',
    gender: 'femenino',
    compatibleFaceShapes: ['Redondo', 'Cuadrado', 'Corazón', 'Ovalado'],
    shapesToAvoid: ['Alargado muy pronunciado sin flequillo'],
    visagismEffect: 'Cae justo debajo de la clavícula, creando líneas verticales que alargan visualmente el cuello y afinan mejillas redondeadas o mandíbulas angulares.',
    stylingTips: 'Secar con difusor o cepillo redondo creando ondas rotas suaves. La raya al lado o ligeramente descentrada maximiza la armonía.',
    hairTexturesSuited: ['Lacio', 'Ondulado', 'Fino', 'Medio'],
    maintenanceLevel: 'Medio',
    celebrityReference: 'Emma Stone / Margot Robbie',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    tags: ['Elegante', 'Estilizador', 'Versátil', 'Tendencia'],
  },
  {
    id: 'cut-butterfly-layers',
    name: 'Corte Mariposa (Butterfly Cut) en Capas Fluidas',
    category: 'Largo',
    gender: 'femenino',
    compatibleFaceShapes: ['Ovalado', 'Cuadrado', 'Diamante', 'Redondo'],
    shapesToAvoid: [],
    visagismEffect: 'Las capas que enmarcan la mandíbula y pómulos suavizan los ángulos duros del rostro y aportan movimiento sin perder longitud global.',
    stylingTips: 'Peinar con cepillo térmico hacia atrás para abrir las capas laterales y despejar los pómulos.',
    hairTexturesSuited: ['Ondulado', 'Lacio', 'Grueso', 'Medio'],
    maintenanceLevel: 'Bajo',
    celebrityReference: 'Jennifer Aniston / Matilda Djerf',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
    tags: ['Volumen', 'Capas', 'Juventud', 'Romántico'],
  },
  {
    id: 'cut-curtain-bangs-shag',
    name: 'Shaggy Moderno con Flequillo Cortina (Curtain Bangs)',
    category: 'Medio',
    gender: 'femenino',
    compatibleFaceShapes: ['Alargado', 'Corazón', 'Diamante', 'Ovalado'],
    shapesToAvoid: ['Redondo con cuello corto si el flequillo es muy denso'],
    visagismEffect: 'El flequillo cortina abierto en el centro acorta la frente visualmente y dirige la atención a los ojos y pómulos, equilibrando rostros alargados.',
    stylingTips: 'Rocío de spray de sal marina o texturizador, secado al aire o golpe suave de secador en el flequillo hacia afuera.',
    hairTexturesSuited: ['Ondulado', 'Rizado', 'Lacio texturizado'],
    maintenanceLevel: 'Bajo',
    celebrityReference: 'Alexa Chung / Dakota Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    tags: ['Flequillo', 'Despreocupado', 'Retro Chic', 'Textura'],
  },
  {
    id: 'cut-pixie-textured-volume',
    name: 'Pixie Texturizado con Volumen Superior',
    category: 'Corto',
    gender: 'femenino',
    compatibleFaceShapes: ['Redondo', 'Ovalado', 'Corazón'],
    shapesToAvoid: ['Alargado (a menos que tenga flequillo lateral denso)'],
    visagismEffect: 'El volumen vertical en la coronilla alarga rostros compactos o redondos, estilizando las facciones y destacando la mirada.',
    stylingTips: 'Pomada mate en las puntas para definir mechones y elevar la parte superior.',
    hairTexturesSuited: ['Lacio', 'Ondulado', 'Fino'],
    maintenanceLevel: 'Medio',
    celebrityReference: 'Zoë Kravitz / Michelle Williams',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    tags: ['Audaz', 'Fresco', 'Sofisticado', 'Luz Facial'],
  },
  {
    id: 'cut-french-bob-chin',
    name: 'French Bob Clásico a la Altura del Mentón',
    category: 'Corto',
    gender: 'femenino',
    compatibleFaceShapes: ['Ovalado', 'Corazón', 'Diamante', 'Alargado'],
    shapesToAvoid: ['Redondo (puede acentuar el ancho de mejillas)'],
    visagismEffect: 'El largo exacto a la mandíbula rellena visualmente el mentón afilado en rostros corazón y compensa la longitud vertical de rostros alargados.',
    stylingTips: 'Secado pulido con puntas ligeramente curvadas hacia adentro o con textura parisina desestructurada.',
    hairTexturesSuited: ['Lacio', 'Ondas suaves', 'Fino'],
    maintenanceLevel: 'Medio',
    celebrityReference: 'Taylor LaShae / Audrey Tautou',
    imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=80',
    tags: ['Clásico', 'Parisino', 'Mentón Equilibrado'],
  },
  {
    id: 'cut-fade-textured-quiff',
    name: 'Quiff Texturizado con Degradado (Fade) Lateral',
    category: 'Corto',
    gender: 'masculino',
    compatibleFaceShapes: ['Redondo', 'Ovalado', 'Cuadrado'],
    shapesToAvoid: ['Alargado muy estrecho'],
    visagismEffect: 'Los laterales pulidos y el copete con altura generan elongación vertical y transmiten estructura y dinamismo.',
    stylingTips: 'Secar hacia arriba con cepillo esqueleto y fijar con cera con acabado mate.',
    hairTexturesSuited: ['Lacio', 'Ondulado', 'Grueso'],
    maintenanceLevel: 'Medio',
    celebrityReference: 'David Beckham / Ryan Gosling',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    tags: ['Masculino', 'Pulido', 'Estructurado'],
  },
  {
    id: 'cut-french-crop-fringe',
    name: 'French Crop con Flequillo Texturizado Frontal',
    category: 'Corto',
    gender: 'masculino',
    compatibleFaceShapes: ['Alargado', 'Ovalado', 'Diamante', 'Corazón'],
    shapesToAvoid: ['Redondo'],
    visagismEffect: 'Cubre parcialmente la frente acortando rostros alargados y disimulando entradas, enfatizando la línea de la mandíbula.',
    stylingTips: 'Polvo texturizador o arcilla mate trabajada con los dedos en dirección frontal.',
    hairTexturesSuited: ['Lacio', 'Ondulado', 'Fino', 'Grueso'],
    maintenanceLevel: 'Bajo',
    celebrityReference: 'Cillian Murphy (Peaky Blinders) / Tom Holland',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    tags: ['Moderno', 'Bajo Mantenimiento', 'Equilibrio Frente'],
  },
  {
    id: 'cut-medium-curly-layers',
    name: 'Mane Rizado en Capas Redondeadas con Halo',
    category: 'Medio',
    gender: 'unisex',
    compatibleFaceShapes: ['Cuadrado', 'Alargado', 'Diamante', 'Ovalado'],
    shapesToAvoid: ['Redondo si el volumen máximo queda a la altura de las mejillas'],
    visagismEffect: 'La suavidad orgánica de los rizos difumina las líneas angulosas de mandíbulas cuadradas y pómulos muy marcados.',
    stylingTips: 'Método curly: crema de peinado en húmedo, scrunch y secado con difusor a temperatura media.',
    hairTexturesSuited: ['Rizado 3A-3C', 'Afro 4A'],
    maintenanceLevel: 'Medio',
    celebrityReference: 'Zendaya / Timothée Chalamet',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    tags: ['Rizos', 'Natural', 'Movimiento', 'Suavidad'],
  },
  {
    id: 'cut-side-part-classic',
    name: 'Corte Clásico con Raya Lateral y Textura Suave',
    category: 'Corto',
    gender: 'masculino',
    compatibleFaceShapes: ['Cuadrado', 'Ovalado', 'Corazón', 'Diamante'],
    shapesToAvoid: [],
    visagismEffect: 'La asimetría de la raya lateral rompe la rigidez de rostros simétricos o cuadrados, aportando sofisticación visual.',
    stylingTips: 'Peine de púas finas con crema ligera para un acabado natural sin rigidez.',
    hairTexturesSuited: ['Lacio', 'Ondulado'],
    maintenanceLevel: 'Bajo',
    celebrityReference: 'Henry Cavill / George Clooney',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    tags: ['Clásico', 'Ejecutivo', 'Atemporal'],
  },
  {
    id: 'cut-long-wavy-curtain',
    name: 'Melena Larga Desfilada con Mechones Contorno',
    category: 'Largo',
    gender: 'femenino',
    compatibleFaceShapes: ['Redondo', 'Cuadrado', 'Corazón'],
    shapesToAvoid: ['Alargado muy lacio sin volumen lateral'],
    visagismEffect: 'Los mechones que caen por delante del pecho crean un efecto de marco envolvente que adelgaza visualmente el contorno facial.',
    stylingTips: 'Ondas con tenacilla de barril ancho dejando los últimos centímetros de las puntas lisos.',
    hairTexturesSuited: ['Lacio', 'Ondulado', 'Medio', 'Grueso'],
    maintenanceLevel: 'Bajo',
    celebrityReference: 'Sofia Vergara / Blake Lively',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    tags: ['Glamour', 'Femenino', 'Estilizador'],
  },
];

export const HAIR_COLORS_DATABASE: HairColorEntry[] = [
  {
    id: 'color-miel-dorado',
    shadeName: 'Balayage Miel Dorado & Ámbar',
    dyeCode: '7.34 Miel Dorado Cobrizo',
    hexColor: '#c58b45',
    secondaryHex: '#e8b86d',
    category: 'Rubio',
    enhancedSkinTones: ['Medio', 'Claro', 'Bronceado'],
    enhancedUndertones: ['Cálido', 'Neutro'],
    compatibleBaseHairColors: ['Castaño Claro (5)', 'Rubio Oscuro (6)', 'Castaño Medio (4)'],
    luminosityEffect: 'Aporta una luz dorada tipo "golden hour" instantánea, atenuando ojeras cetrinas y avivando la mirada con calidez solar.',
    bestTechnique: 'Face Framing / Money Piece en mechones delanteros con transición balayage difuminada.',
    maintenanceLevel: 'Bajo',
    seasonalHarmony: ['Primavera Cálida', 'Otoño Cálido'],
    tags: ['Golden Hour', 'Luz Solar', 'Anti-edad', 'Tendencia'],
  },
  {
    id: 'color-chocolate-avellana',
    shadeName: 'Chocolate Avellana Iluminado',
    dyeCode: '5.35 Chocolate Moka Cálido',
    hexColor: '#4a2c1d',
    secondaryHex: '#804c2b',
    category: 'Castaño',
    enhancedSkinTones: ['Claro', 'Medio', 'Bronceado', 'Oscuro'],
    enhancedUndertones: ['Cálido', 'Neutro', 'Oliva'],
    compatibleBaseHairColors: ['Castaño Oscuro (3)', 'Castaño Medio (4)', 'Negro Natural (2)'],
    luminosityEffect: 'Profundiza las facciones sin endurecerlas; los reflejos avellana y canela actúan como un reflector sutil que despierta pieles apagadas.',
    bestTechnique: 'Babylights microfinas o Gloss de brillo espejado en raíces a puntas.',
    maintenanceLevel: 'Bajo',
    seasonalHarmony: ['Otoño Cálido', 'Otoño Profundo', 'Invierno Cálido'],
    tags: ['Elegante', 'Brillo Espejo', 'Bajo Mantenimiento', 'Natural'],
  },
  {
    id: 'color-rubio-beige-champan',
    shadeName: 'Rubio Beige Champán Frío',
    dyeCode: '8.13 Rubio Claro Beige Nacarado',
    hexColor: '#d6c19f',
    secondaryHex: '#ede1cd',
    category: 'Rubio',
    enhancedSkinTones: ['Muy Claro', 'Claro', 'Medio Frío'],
    enhancedUndertones: ['Frío', 'Neutro'],
    compatibleBaseHairColors: ['Rubio Ceniza (7)', 'Rubio Oscuro (6)'],
    luminosityEffect: 'Neutraliza rojeces en pieles rosadas o claras y proyecta un resplandor translúcido y nacarado que resalta ojos claros o marrones oscuros.',
    bestTechnique: 'Mechas veladas o Melting rubio nórdico con matizador nacarado.',
    maintenanceLevel: 'Medio',
    seasonalHarmony: ['Verano Suave', 'Verano Frío'],
    tags: ['Lujo Silencioso', 'Nacarado', 'Fresco', 'Sofisticado'],
  },
  {
    id: 'color-cobre-veneciano',
    shadeName: 'Cobre Veneciano Melocotón Suave',
    dyeCode: '7.43 Rubio Cobrizo Dorado',
    hexColor: '#bd5338',
    secondaryHex: '#df7c57',
    category: 'Cobrizo',
    enhancedSkinTones: ['Muy Claro', 'Claro', 'Medio con pecas'],
    enhancedUndertones: ['Cálido', 'Neutro'],
    compatibleBaseHairColors: ['Castaño Claro (5)', 'Rubio Oscuro (6)', 'Pelirrojo Natural'],
    luminosityEffect: 'Llena de energía y vivacidad rostros pálidos, creando un contraste magnético que potencia ojos verdes, avellana o marrones miel.',
    bestTechnique: 'Coloración global con reflejos dimensionales más claros en las puntas.',
    maintenanceLevel: 'Medio',
    seasonalHarmony: ['Primavera Brillante', 'Primavera Cálida', 'Otoño Cálido'],
    tags: ['Magnetismo', 'Pelirrojo Chic', 'Frescura', 'Alta Luminosidad'],
  },
  {
    id: 'color-expresso-gloss-frio',
    shadeName: 'Castaño Expresso Gloss con Reflejo Glaseado',
    dyeCode: '3.1 Castaño Oscuro Cenizo',
    hexColor: '#211714',
    secondaryHex: '#3b2b25',
    category: 'Castaño',
    enhancedSkinTones: ['Muy Claro', 'Claro Porcelana', 'Oscuro Ébano'],
    enhancedUndertones: ['Frío', 'Neutro'],
    compatibleBaseHairColors: ['Castaño Medio (4)', 'Castaño Oscuro (3)', 'Negro (1-2)'],
    luminosityEffect: 'Crea un contraste cinematográfico en pieles de subtono frío o de porcelana, haciendo que la piel se vea límpida y radiante.',
    bestTechnique: 'Baño de brillo demi-permanente (Acidic Gloss) sin aclaración agresiva.',
    maintenanceLevel: 'Bajo',
    seasonalHarmony: ['Invierno Brillante', 'Invierno Profundo'],
    tags: ['Contraste Puro', 'Acabado Espejado', 'Porcelana', 'Salud Capilar'],
  },
  {
    id: 'color-caramelo-toffee',
    shadeName: 'Caramelo Toffee & Nuez Miel',
    dyeCode: '6.32 Rubio Oscuro Irisado Dorado',
    hexColor: '#935e38',
    secondaryHex: '#b98150',
    category: 'Castaño',
    enhancedSkinTones: ['Medio', 'Bronceado', 'Trigueño Cálido'],
    enhancedUndertones: ['Cálido', 'Oliva', 'Neutro'],
    compatibleBaseHairColors: ['Castaño Oscuro (3)', 'Castaño Medio (4)', 'Castaño Claro (5)'],
    luminosityEffect: 'Contrarresta el tono cenizo o apagado de la piel oliva o trigueña, inyectando vibración de bronce saludable y brillo multidimensional.',
    bestTechnique: 'Contour Hair Stabbing / Mechas internas y frontales para iluminar pómulos.',
    maintenanceLevel: 'Bajo',
    seasonalHarmony: ['Otoño Cálido', 'Primavera Cálida'],
    tags: ['Piel Morena', 'Bronce Saludable', 'Efecto Vacaciones'],
  },
  {
    id: 'color-platino-perla',
    shadeName: 'Platino Perla Glacial Luminoso',
    dyeCode: '10.21 Rubio Platino Irisado Ceniza',
    hexColor: '#e7ded4',
    secondaryHex: '#f5f0e9',
    category: 'Rubio',
    enhancedSkinTones: ['Muy Claro', 'Oscuro Profundo (Contraste Máximo)'],
    enhancedUndertones: ['Frío', 'Neutro'],
    compatibleBaseHairColors: ['Rubio Claro (8)', 'Rubio Medio (7)'],
    luminosityEffect: 'Efecto halo puro. En pieles frías muy claras o muy oscuras, ilumina los ojos y pómulos con un aura futurista de alto impacto.',
    bestTechnique: 'Decoloración global cuidada con plex y matiz perla glacial.',
    maintenanceLevel: 'Alto',
    seasonalHarmony: ['Invierno Brillante', 'Verano Frío'],
    tags: ['Vanguardia', 'Aura Polar', 'Alto Impacto'],
  },
  {
    id: 'color-moka-canela-oliva',
    shadeName: 'Moka Canela con Destellos Ámbar (Especial Piel Oliva)',
    dyeCode: '5.34 Castaño Claro Dorado Cobrizo',
    hexColor: '#5c3928',
    secondaryHex: '#885135',
    category: 'Castaño',
    enhancedSkinTones: ['Medio', 'Trigueño', 'Bronceado'],
    enhancedUndertones: ['Oliva', 'Cálido'],
    compatibleBaseHairColors: ['Castaño Oscuro (3)', 'Castaño Medio (4)'],
    luminosityEffect: 'Especialmente formulado para pieles oliva: el toque sutil de canela neutraliza los tintes verdosos/grises del cutis y devuelve lozanía.',
    bestTechnique: 'Balayage difuminado a mano alzada con matices ámbar en medios y puntas.',
    maintenanceLevel: 'Bajo',
    seasonalHarmony: ['Otoño Profundo', 'Otoño Cálido'],
    tags: ['Anti-Cetrino', 'Piel Oliva', 'Armonía Natural'],
  },
];

/**
 * Consulta la base de datos de cortes para encontrar coincidencias óptimas según rostro, género y longitud
 */
export function queryHaircuts(filters: {
  faceShape?: string;
  gender?: string;
  category?: string;
  texture?: string;
  searchTerm?: string;
}): { item: HaircutEntry; matchScore: number; matchReasons: string[] }[] {
  return HAIRCUTS_DATABASE.map((item) => {
    let score = 70;
    const reasons: string[] = [];

    // Face shape match
    if (filters.faceShape) {
      const normalizedShape = filters.faceShape.toLowerCase();
      const isCompatible = item.compatibleFaceShapes.some((s) =>
        normalizedShape.includes(s.toLowerCase()) || s.toLowerCase().includes(normalizedShape)
      );
      const isAvoid = item.shapesToAvoid?.some((s) =>
        normalizedShape.includes(s.toLowerCase()) || s.toLowerCase().includes(normalizedShape)
      );

      if (isCompatible) {
        score += 20;
        reasons.push(`Ideal para rostro ${filters.faceShape}`);
      } else if (isAvoid) {
        score -= 30;
      }
    }

    // Gender match
    if (filters.gender && filters.gender !== 'todos') {
      if (item.gender === filters.gender || item.gender === 'unisex') {
        score += 10;
        reasons.push(`Estilo adaptado para ${filters.gender}`);
      } else {
        score -= 25;
      }
    }

    // Category / Length match
    if (filters.category && filters.category !== 'todos') {
      if (item.category.toLowerCase() === filters.category.toLowerCase()) {
        score += 10;
        reasons.push(`Longitud ${item.category} deseada`);
      }
    }

    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        item.visagismEffect.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term));
      if (matchesSearch) {
        score += 15;
      }
    }

    return {
      item,
      matchScore: Math.min(Math.max(score, 40), 99),
      matchReasons: reasons,
    };
  })
    .filter((res) => res.matchScore >= 50)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Consulta la base de datos de tintes para encontrar colores que potencian la luz de la piel y armonizan con el cabello actual
 */
export function queryHairColors(filters: {
  skinTone?: string;
  undertone?: string;
  currentHair?: string;
  category?: string;
  searchTerm?: string;
}): { item: HairColorEntry; matchScore: number; matchReasons: string[] }[] {
  return HAIR_COLORS_DATABASE.map((item) => {
    let score = 70;
    const reasons: string[] = [];

    // Undertone match (the most critical colorimetry factor)
    if (filters.undertone) {
      const normalizedUndertone = filters.undertone.toLowerCase();
      const hasUndertone = item.enhancedUndertones.some((u) =>
        normalizedUndertone.includes(u.toLowerCase())
      );
      if (hasUndertone) {
        score += 20;
        reasons.push(`Realza el subtono ${filters.undertone}`);
      }
    }

    // Skin Tone depth match
    if (filters.skinTone) {
      const normalizedTone = filters.skinTone.toLowerCase();
      const hasTone = item.enhancedSkinTones.some((t) =>
        normalizedTone.includes(t.toLowerCase())
      );
      if (hasTone) {
        score += 10;
        reasons.push(`Complementa la tez ${filters.skinTone}`);
      }
    }

    // Category
    if (filters.category && filters.category !== 'todos') {
      if (item.category.toLowerCase() === filters.category.toLowerCase()) {
        score += 10;
      }
    }

    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      if (
        item.shadeName.toLowerCase().includes(term) ||
        item.luminosityEffect.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term))
      ) {
        score += 15;
      }
    }

    return {
      item,
      matchScore: Math.min(Math.max(score, 40), 99),
      matchReasons: reasons,
    };
  })
    .filter((res) => res.matchScore >= 50)
    .sort((a, b) => b.matchScore - a.matchScore);
}
