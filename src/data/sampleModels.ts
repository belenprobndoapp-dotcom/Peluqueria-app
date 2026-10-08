import { SampleModel } from '../types/visagism';
import laliImg from '../assets/images/modelo_lali_esposito_1791483129602.jpg';
import tiniImg from '../assets/images/modelo_tini_stoessel_1791483145538.jpg';
import darinImg from '../assets/images/modelo_ricardo_darin_1791483162288.jpg';
import mariaImg from '../assets/images/modelo_maria_becerra_1791483186169.jpg';
import nickiImg from '../assets/images/modelo_nicki_nicole_1791483200750.jpg';
import pampitaImg from '../assets/images/modelo_pampita_ardohain_1791483220508.jpg';

export const SAMPLE_MODELS: SampleModel[] = [
  {
    id: 'sample-lali',
    name: 'Lali Espósito (Cantante y Actriz • Rostro Ovalado Armónico)',
    tag: 'Ovalado • Cálido Dorado',
    imageUrl: laliImg,
    expectedShape: 'Ovalado',
    gender: 'femenino',
  },
  {
    id: 'sample-tini',
    name: 'Tini Stoessel (Cantante y Modelo • Rostro Alargado Estilizado)',
    tag: 'Alargado • Neutro Luminoso',
    imageUrl: tiniImg,
    expectedShape: 'Alargado',
    gender: 'femenino',
  },
  {
    id: 'sample-darin',
    name: 'Ricardo Darín (Actor de Cine • Rostro Cuadrado Angular)',
    tag: 'Cuadrado • Masculino',
    imageUrl: darinImg,
    expectedShape: 'Cuadrado',
    gender: 'masculino',
  },
  {
    id: 'sample-maria-becerra',
    name: 'María Becerra (Cantante • Rostro Corazón / Pómulos Definidos)',
    tag: 'Corazón • Cálido Trigueño',
    imageUrl: mariaImg,
    expectedShape: 'Corazón',
    gender: 'femenino',
  },
  {
    id: 'sample-nicki-nicole',
    name: 'Nicki Nicole (Cantante • Rostro Redondo Juvenil)',
    tag: 'Redondo • Neutro Claro',
    imageUrl: nickiImg,
    expectedShape: 'Redondo',
    gender: 'femenino',
  },
  {
    id: 'sample-pampita',
    name: 'Pampita Ardohain (Top Model • Rostro Diamante / Pómulos Altos)',
    tag: 'Diamante • Dorado Balayage',
    imageUrl: pampitaImg,
    expectedShape: 'Diamante',
    gender: 'femenino',
  },
];
