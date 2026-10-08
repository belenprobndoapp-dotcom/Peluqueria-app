/**
 * Visagism & Hair Color visual mapping utility
 * Connects AI-recommended haircuts and hair colors with high-resolution visual photography
 */

import { HAIRCUTS_DATABASE, HAIR_COLORS_DATABASE } from '../data/visagismDatabase';

// Generated High-Fidelity Studio Assets
export const STUDIO_VISUAL_ASSETS = {
  bobLob: '/src/assets/images/haircut_bob_1791243411820.jpg',
  butterflyLayers: '/src/assets/images/haircut_butterfly_1791243420594.jpg',
  goldenBalayage: '/src/assets/images/color_golden_honey_1791243429485.jpg',
  warmCopper: '/src/assets/images/color_warm_copper_1791243438444.jpg',
};

// Curated high-res portraits for hair colors
export const COLOR_PORTRAIT_CATALOG: Record<string, string> = {
  mielDorado: STUDIO_VISUAL_ASSETS.goldenBalayage,
  cobreVeneciano: STUDIO_VISUAL_ASSETS.warmCopper,
  chocolateAvellana: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  rubioChampan: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80',
  expressoGloss: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
  carameloToffee: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
  platinoPerla: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80',
  mokaCanela: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=700&q=80',
};

// Curated high-res portraits for haircuts
export const HAIRCUT_PORTRAIT_CATALOG: Record<string, string> = {
  bobLob: STUDIO_VISUAL_ASSETS.bobLob,
  butterfly: STUDIO_VISUAL_ASSETS.butterflyLayers,
  shaggy: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
  pixie: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
  frenchBob: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=700&q=80',
  fadeQuiff: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
  crop: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
  curlyMane: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
  classicSide: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  longWaves: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
};

/**
 * Finds the most accurate, flattering image for a recommended haircut
 */
export function getHaircutImage(name: string, category = '', index = 0): string {
  const n = name.toLowerCase();

  // 1. Direct keyword match to studio generated assets
  if (n.includes('bob') || n.includes('lob') || n.includes('desfilado')) {
    return STUDIO_VISUAL_ASSETS.bobLob;
  }
  if (n.includes('mariposa') || n.includes('butterfly') || (n.includes('capas') && n.includes('largo'))) {
    return STUDIO_VISUAL_ASSETS.butterflyLayers;
  }
  if (n.includes('shag') || n.includes('cortina') || n.includes('curtain') || n.includes('flequillo')) {
    return HAIRCUT_PORTRAIT_CATALOG.shaggy;
  }
  if (n.includes('pixie') || n.includes('garçon') || (n.includes('corto') && n.includes('volumen'))) {
    return HAIRCUT_PORTRAIT_CATALOG.pixie;
  }
  if (n.includes('french') || n.includes('mentón') || n.includes('menton') || n.includes('parisino')) {
    return HAIRCUT_PORTRAIT_CATALOG.frenchBob;
  }
  if (n.includes('fade') || n.includes('degradado') || n.includes('quiff') || n.includes('tupé')) {
    return HAIRCUT_PORTRAIT_CATALOG.fadeQuiff;
  }
  if (n.includes('crop') || n.includes('texturizado') || n.includes('cesar')) {
    return HAIRCUT_PORTRAIT_CATALOG.crop;
  }
  if (n.includes('rizado') || n.includes('curly') || n.includes('afro') || n.includes('ondas suaves')) {
    return HAIRCUT_PORTRAIT_CATALOG.curlyMane;
  }
  if (n.includes('raya') || n.includes('clásico') || n.includes('clasico') || n.includes('lado')) {
    return HAIRCUT_PORTRAIT_CATALOG.classicSide;
  }
  if (n.includes('largo') || n.includes('melena') || n.includes('ondas')) {
    return HAIRCUT_PORTRAIT_CATALOG.longWaves;
  }

  // 2. Database lookup
  const matchInDb = HAIRCUTS_DATABASE.find((cut) =>
    cut.name.toLowerCase().includes(n) || n.includes(cut.name.toLowerCase())
  );
  if (matchInDb && matchInDb.imageUrl) {
    return matchInDb.imageUrl;
  }

  // 3. Category fallback
  const cat = category.toLowerCase();
  if (cat.includes('corto')) {
    return [HAIRCUT_PORTRAIT_CATALOG.pixie, HAIRCUT_PORTRAIT_CATALOG.fadeQuiff, HAIRCUT_PORTRAIT_CATALOG.frenchBob][index % 3];
  }
  if (cat.includes('largo')) {
    return [STUDIO_VISUAL_ASSETS.butterflyLayers, HAIRCUT_PORTRAIT_CATALOG.longWaves, HAIRCUT_PORTRAIT_CATALOG.curlyMane][index % 3];
  }

  // Medium / Default fallback
  const fallbacks = [
    STUDIO_VISUAL_ASSETS.bobLob,
    STUDIO_VISUAL_ASSETS.butterflyLayers,
    HAIRCUT_PORTRAIT_CATALOG.shaggy,
    HAIRCUT_PORTRAIT_CATALOG.curlyMane,
  ];
  return fallbacks[index % fallbacks.length];
}

/**
 * Finds the most accurate, luminous image for a recommended hair color
 */
export function getHairColorImage(shadeName: string, dyeCode = '', hex = '', index = 0): string {
  const s = shadeName.toLowerCase();
  const d = dyeCode.toLowerCase();

  // 1. Direct keyword match
  if (s.includes('miel') || s.includes('dorado') || s.includes('ambar') || s.includes('ámbar') || d.includes('.3') || s.includes('balayage miel')) {
    return STUDIO_VISUAL_ASSETS.goldenBalayage;
  }
  if (s.includes('cobre') || s.includes('cobrizo') || s.includes('veneciano') || s.includes('pelirrojo') || s.includes('peach') || d.includes('.4')) {
    return STUDIO_VISUAL_ASSETS.warmCopper;
  }
  if (s.includes('chocolate') || s.includes('avellana') || s.includes('moka') || s.includes('cacao') || d.includes('.35') || d.includes('5.')) {
    return COLOR_PORTRAIT_CATALOG.chocolateAvellana;
  }
  if (s.includes('champan') || s.includes('champán') || s.includes('beige') || s.includes('nacarado') || d.includes('.13') || d.includes('8.')) {
    return COLOR_PORTRAIT_CATALOG.rubioChampan;
  }
  if (s.includes('expresso') || s.includes('cenizo') || s.includes('oscuro') || s.includes('negro') || d.includes('.1') || d.includes('3.') || d.includes('2.')) {
    return COLOR_PORTRAIT_CATALOG.expressoGloss;
  }
  if (s.includes('caramelo') || s.includes('toffee') || s.includes('nuez') || d.includes('.32') || d.includes('6.')) {
    return COLOR_PORTRAIT_CATALOG.carameloToffee;
  }
  if (s.includes('platino') || s.includes('perla') || s.includes('polar') || s.includes('nórdico') || d.includes('10.') || d.includes('.21')) {
    return COLOR_PORTRAIT_CATALOG.platinoPerla;
  }
  if (s.includes('canela') || s.includes('oliva') || s.includes('terracota') || d.includes('.34')) {
    return COLOR_PORTRAIT_CATALOG.mokaCanela;
  }

  // 2. Hex color proximity detection
  if (hex) {
    const cleanHex = hex.replace('#', '').toLowerCase();
    // Warm blonde / golden
    if (cleanHex.startsWith('c') || cleanHex.startsWith('d') || cleanHex.startsWith('e')) {
      return STUDIO_VISUAL_ASSETS.goldenBalayage;
    }
    // Copper / reddish
    if (cleanHex.startsWith('b') || cleanHex.startsWith('a')) {
      return STUDIO_VISUAL_ASSETS.warmCopper;
    }
    // Deep brown / espresso
    if (cleanHex.startsWith('2') || cleanHex.startsWith('1') || cleanHex.startsWith('3')) {
      return COLOR_PORTRAIT_CATALOG.expressoGloss;
    }
  }

  // 3. Database match
  const matchInDb = HAIR_COLORS_DATABASE.find((c) =>
    c.shadeName.toLowerCase().includes(s) || s.includes(c.shadeName.toLowerCase())
  );
  if (matchInDb && (matchInDb as any).imageUrl) {
    return (matchInDb as any).imageUrl;
  }

  const fallbacks = [
    STUDIO_VISUAL_ASSETS.goldenBalayage,
    STUDIO_VISUAL_ASSETS.warmCopper,
    COLOR_PORTRAIT_CATALOG.chocolateAvellana,
    COLOR_PORTRAIT_CATALOG.carameloToffee,
    COLOR_PORTRAIT_CATALOG.rubioChampan,
  ];
  return fallbacks[index % fallbacks.length];
}
