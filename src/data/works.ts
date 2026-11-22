// Portfolio projects. Each project is a small museum room: a label plus content blocks.
import { art } from '../art/generateArt'
import { P } from './commons'
import type { Discipline, Work } from './types'

// ---- Camille Claudel (id 'marta'; filled in when she imports her portfolio) ----
const marta: Work[] = [
  {
    id: 'marta-trace',
    ownerId: 'marta',
    title: 'The Mature Age',
    year: 1899,
    technique: 'Bronze',
    materials: ['Bronze', 'Light'],
    dimensions: '114 × 163 × 72 cm',
    edition: 'Cast',
    exhibited: 'Salon, Paris',
    discipline: 'Sculpture',
    topics: ['Body', 'Memory', 'Time'],
    picture: P.ageMur,
    recommendedBy: 'helena',
    fromImport: true,
    blocks: [
      {
        type: 'text',
        title: 'About the work',
        body: 'Three figures: a kneeling young woman reaching out, a man walking away, an old woman taking him. People say it is about my life. It is about time. For my graduation show I want to light it from inside, so the figures change as you walk around it.',
      },
      {
        type: 'process',
        title: 'How it was made',
        steps: [
          { picture: P.claudelDrawing, note: 'Drawings first: faces, hands, the weight of a body leaning forward.' },
          { picture: P.clotho, note: 'Studies in the studio. Clotho taught me how to make age visible in a body.' },
          { picture: P.vertumnus, note: 'Light tests on a marble group. The metal structure for the light is the weak part: I need help here.' },
          { picture: P.ageMur, note: 'Cast in bronze.' },
        ],
      },
      {
        type: 'video',
        title: 'Making of',
        caption: 'Modelling and first light test, 1 min 40 s',
        poster: P.vague,
      },
      { type: 'quote', text: 'Camille lets the material decide how much of the body stays. I showed her where to find gold; the gold she finds is her own.', by: 'Prof. Auguste Rodin' },
      { type: 'list', title: 'Materials and references', items: ['Bronze cast', 'Plaster model', 'Warm light, 2700 K', 'Photo: Wikimedia Commons, public domain'] },
    ],
  },
  {
    id: 'marta-casts',
    ownerId: 'marta', title: 'The Waltz', year: 1893, technique: 'Bronze',
    materials: ['Bronze'], dimensions: '43 × 23 × 34 cm', discipline: 'Sculpture',
    topics: ['Body', 'Movement'], picture: P.valse, fromImport: true,
    blocks: [
      { type: 'text', title: 'About the work', body: 'Two dancers who are about to fall, held only by the movement. The skirt was too much for the committee: they asked me to dress them.' },
    ],
  },
  {
    id: 'marta-steel',
    ownerId: 'marta', title: 'The Wave', year: 1903, technique: 'Onyx and bronze', materials: ['Onyx', 'Bronze'],
    dimensions: '62 × 56 × 50 cm', discipline: 'Sculpture', topics: ['Water', 'Body'],
    picture: P.vague, fromImport: true,
    blocks: [{ type: 'text', title: 'About the work', body: 'Three small bathers under a huge wave of green onyx. I looked at Hokusai a lot that year.' }],
  },
  {
    id: 'marta-drawings',
    ownerId: 'marta', title: 'The Little Chatelaine', year: 1895, technique: 'Marble', materials: ['Marble'],
    dimensions: '33 × 28 × 23 cm', discipline: 'Sculpture', topics: ['Portrait', 'Childhood'],
    picture: P.chatelaine, fromImport: true,
    blocks: [{ type: 'text', title: 'About the work', body: 'A girl from the castle where I stayed. I carved the marble myself, no assistants.' }],
  },
]

// ---- Louis Comfort Tiffany (id 'tiago') ----------------------------------
const tiago: Work[] = [
  {
    id: 'tiago-arc',
    ownerId: 'tiago',
    title: 'Peacock Table Lamp',
    year: 1905,
    technique: 'Leaded glass, bronze',
    materials: ['Glass', 'Bronze', 'Metal', 'Light'],
    dimensions: '68 × 47 cm',
    edition: 'Tiffany Studios',
    discipline: 'Industrial Design',
    topics: ['Light', 'Objects', 'Craft'],
    picture: P.peacockLamp,
    recommendedBy: 'vasco',
    blocks: [
      { type: 'text', title: 'About the work', body: 'A lamp made of hundreds of pieces of coloured glass held in a bronze frame. Designed with Clara Driscoll and the glass-cutters of my studio: the shade is a peacock\'s tail, the base is cast bronze.' },
      {
        type: 'process',
        title: 'How it was made',
        steps: [
          { picture: P.lampDesign, note: 'Watercolour design for a client, before any glass is cut.' },
          { picture: P.favrileVase, note: 'Choosing the glass. We blow our own, Favrile, so the colour is inside it.' },
          { picture: P.peacockLamp, note: 'First light. Bronze base cast in the studio foundry.' },
        ],
      },
      { type: 'video', title: 'Making of', caption: 'Leading the glass, 58 s', poster: P.magnolias },
      { type: 'list', title: 'Materials', items: ['Favrile glass', 'Copper foil and lead', 'Cast bronze base', 'Photo: Cleveland Museum of Art, CC0'] },
    ],
  },
  {
    id: 'tiago-frame',
    ownerId: 'tiago', title: 'Window for the Bella Apartment', year: 1880, technique: 'Leaded glass', materials: ['Glass', 'Metal', 'Light'],
    dimensions: '157 × 108 cm', discipline: 'Industrial Design', topics: ['Light', 'Objects'],
    picture: P.bellaWindow,
    blocks: [
      { type: 'text', title: 'About the work', body: 'A window that holds light like a painting holds colour. Made for an apartment in New York. Photo: The Metropolitan Museum of Art.' },
    ],
  },
  {
    id: 'tiago-stool',
    ownerId: 'tiago', title: 'Design for a Window', year: 1890, technique: 'Watercolour and pencil', materials: ['Paper'],
    dimensions: '—', discipline: 'Industrial Design', topics: ['Objects', 'Nature'],
    picture: P.windowDesign,
    blocks: [{ type: 'text', title: 'About the work', body: 'Every window starts as a painting on paper. This one never got built.' }],
  },
]

// ---- Everyone else: shorter projects -----------------------------------
type Short = [string, string, number, string, string[], string, Discipline, string[], ReturnType<typeof art>, string, string?]
const short: Short[] = [
  ['ines', 'Impression, Sunrise', 1872, 'Oil on canvas', ['Oil', 'Canvas'], '48 × 63 cm', 'Painting', ['Landscape', 'Water'], P.impression, 'The harbour at 7 am. A critic used the title to make fun of us, and the name stuck.'],
  ['ines', 'Water Lilies', 1920, 'Oil on canvas', ['Oil', 'Canvas'], '200 × 1276 cm', 'Painting', ['Water', 'Time'], P.waterLilies, 'My pond, again. Clouds reflected in the water.'],
  ['rui', 'The Steerage', 1907, 'Photogravure', ['Film'], '33 × 26 cm', 'Photography', ['City', 'Water'], P.steerage, 'Shot on a ship, looking down at the lower deck. Shapes first, people second.'],
  ['beatriz', 'Praying Hands', 1508, 'Brush and ink on blue paper', ['Ink', 'Paper'], '29 × 20 cm', 'Drawing', ['Body', 'Portrait'], P.prayingHands, 'A study for an altarpiece. The hands became more famous than the altarpiece.', 'helena'],
  ['beatriz', 'Young Hare', 1502, 'Watercolour and gouache', ['Watercolour', 'Paper'], '25 × 23 cm', 'Drawing', ['Nature'], P.hare, 'Every hair, one by one.'],
  ['joao', 'A Trip to the Moon (set design)', 1902, 'Drawing for film', ['Paper', 'Video'], '14 min film', 'Multimedia', ['Technology', 'Play'], P.moonDrawing, 'Design for the moon scene. The rocket lands in its eye.'],
  ['clara', 'Moulin Rouge: La Goulue', 1891, 'Colour lithograph poster', ['Paper', 'Lithograph ink'], '191 × 117 cm', 'Communication Design', ['Typography', 'Print', 'Night'], P.laGoulue, 'My first poster, for the cabaret. Printed in four colours and pasted all over the city.'],
  ['duarte', 'Study for the Libyan Sibyl', 1511, 'Red chalk', ['Chalk', 'Paper'], '29 × 21 cm', 'Drawing', ['Body', 'Anatomy'], P.sibyl, 'Drawn from a male model for a female figure on a ceiling.'],
  ['sofia', 'The Starry Night', 1889, 'Oil on canvas', ['Oil', 'Canvas'], '74 × 92 cm', 'Painting', ['Night', 'Colour'], P.starryNight, 'The view from my window before sunrise, with a village I added.'],
  ['sofia', 'Sunflowers', 1889, 'Oil on canvas', ['Oil', 'Canvas'], '95 × 73 cm', 'Painting', ['Colour', 'Nature'], P.sunflowers, 'Painted to decorate a friend\'s room. He did not stay long.'],
  ['miguel', 'Vitruvian Man', 1490, 'Pen and ink on paper', ['Ink', 'Paper'], '35 × 26 cm', 'Drawing', ['Body', 'Technology'], P.vitruvian, 'The proportions of the human body, in a circle and a square.'],
  ['miguel', 'Lady with an Ermine', 1490, 'Oil on walnut panel', ['Oil', 'Wood panel'], '54 × 39 cm', 'Painting', ['Portrait'], P.ermine, 'A commission. The ermine was the hard part.'],
  ['leonor', 'The Calling of Saint Matthew', 1600, 'Oil on canvas', ['Oil', 'Canvas'], '322 × 340 cm', 'Painting', ['Light', 'City'], P.calling, 'A beam of light in a tavern. My first big public commission.'],
  ['andre', 'Girl with a Pearl Earring', 1665, 'Oil on canvas', ['Oil', 'Canvas'], '44 × 39 cm', 'Painting', ['Portrait', 'Light'], P.pearl, 'Not a portrait: a study of a face, a turban and a pearl.'],
  ['andre', 'The Milkmaid', 1658, 'Oil on canvas', ['Oil', 'Canvas'], '46 × 41 cm', 'Painting', ['Domestic', 'Light'], P.milkmaid, 'Milk, bread and window light.'],
  ['mariana', 'Little Dancer Aged Fourteen', 1881, 'Bronze, tulle and silk', ['Bronze', 'Fabric'], '98 cm high', 'Sculpture', ['Body', 'Dance'], P.littleDancer, 'First shown in wax with a real skirt. The critics were horrified.'],
  ['pedro', 'Imaginary Prisons, title plate', 1761, 'Etching', ['Ink', 'Paper', 'Copper plate'], '55 × 41 cm', 'Drawing', ['Architecture', 'Time'], P.carceri, 'Prisons that will never be built, sixteen plates.', 'helena'],
  ['carolina', 'The Great Wave off Kanagawa', 1831, 'Woodblock print', ['Paper', 'Woodblock'], '26 × 38 cm', 'Communication Design', ['Print', 'Water'], P.greatWave, 'From my series Thirty-six Views of Mount Fuji. Printed in thousands of copies.'],
  ['carolina', 'Fine Wind, Clear Morning', 1831, 'Woodblock print', ['Paper', 'Woodblock'], '26 × 38 cm', 'Communication Design', ['Print', 'Landscape'], P.redFuji, 'Red Fuji at dawn, same series.'],
  ['nuno', 'The Kiss', 1908, 'Oil and gold leaf on canvas', ['Oil', 'Gold leaf', 'Canvas'], '180 × 180 cm', 'Painting', ['Love', 'Pattern'], P.kiss, 'Two lovers wrapped in gold.', 'vasco'],
  ['nuno', 'Portrait of Adele Bloch-Bauer I', 1907, 'Oil, silver and gold on canvas', ['Oil', 'Gold leaf', 'Canvas'], '138 × 138 cm', 'Painting', ['Portrait', 'Pattern'], P.adele, 'A commission that took three years.'],
  ['rita', 'The Birth of Venus', 1485, 'Tempera on canvas', ['Tempera', 'Canvas'], '172 × 278 cm', 'Painting', ['Myth', 'Colour'], P.venus, 'Venus arrives on a shell, pushed by the wind.'],
  ['rita', 'Primavera', 1482, 'Tempera on panel', ['Tempera', 'Wood panel'], '207 × 319 cm', 'Painting', ['Myth', 'Nature'], P.primavera, 'A garden with five hundred kinds of plants.'],
  ['rembrandt', 'The Night Watch', 1642, 'Oil on canvas', ['Oil', 'Canvas'], '379 × 453 cm', 'Painting', ['Portrait', 'City', 'Light'], P.nightWatch, 'A group portrait of the city guard, caught in the middle of moving.'],
  ['rembrandt', 'The Anatomy Lesson of Dr Tulp', 1632, 'Oil on canvas', ['Oil', 'Canvas'], '170 × 217 cm', 'Painting', ['Portrait', 'Body'], P.anatomy, 'My first big commission, at 26.'],
]

const shortWorks: Work[] = short.map(([ownerId, title, year, technique, materials, dimensions, discipline, topics, picture, body, recommendedBy], i) => ({
  id: `${ownerId}-${i}`,
  ownerId, title, year, technique, materials, dimensions, discipline, topics, picture, recommendedBy,
  blocks: [
    { type: 'text', title: 'About the work', body },
    ...('src' in picture ? [{ type: 'list' as const, title: 'Image', items: ['Wikimedia Commons, public domain'] }] : []),
    ...(i % 3 === 0 && 'art' in picture ? [{ type: 'gallery' as const, title: 'Details', pictures: [{ art: { ...('art' in picture ? picture.art : { style: 'orbs' as const, seed: 1, ratio: 1 }), seed: 900 + i, ratio: 1 } }, { art: { style: 'sketch' as const, seed: 950 + i, ratio: 1 } }] }] : []),
  ],
}))

export const works: Work[] = [...marta, ...tiago, ...shortWorks]
