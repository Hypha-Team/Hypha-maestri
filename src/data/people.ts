// Students, alumni and teachers are great artists from art history, reimagined as FBAUL students in Lisbon today.
// Their pictures are their real works (public domain, see commons.ts). Organisations and the collector are fictional.
import { P } from './commons'
import type { Person } from './types'

const av = (seed: number) => ({ style: 'orbs' as const, seed, ratio: 1 })

export const people: Person[] = [
  // ---- The story ----------------------------------------------------------
  {
    id: 'marta',
    name: 'Camille Claudel',
    role: 'student',
    discipline: 'Sculpture',
    programme: 'Sculpture, BA',
    year: 3,
    bio: 'I carve marble and cast bronze, and I am tired of being called "Rodin\'s student". For my graduation show I want to light The Mature Age from inside, so the figures move when you walk past.',
    skills: ['Marble carving', 'Bronze casting', 'Onyx', 'Modelling in clay'],
    topics: ['Body', 'Memory', 'Light', 'Movement'],
    materials: ['Marble', 'Bronze', 'Plaster', 'Light'],
    area: 'Penha de França',
    avatar: av(31),
    photo: P.valse,
    uniConfirmed: true,
    openToCollab: true,
    openToCommissions: true,
  },
  {
    id: 'tiago',
    name: 'Louis Comfort Tiffany',
    role: 'student',
    discipline: 'Industrial Design',
    programme: 'Industrial Design, BA',
    year: 2,
    bio: 'Lamps, windows and anything where glass meets metal. If your idea needs to stand up and light up, I can build the part that holds the light.',
    skills: ['Leaded glass', 'Metalwork', 'Lighting', 'Bronze bases', 'Mosaic'],
    topics: ['Light', 'Craft', 'Objects', 'Nature'],
    materials: ['Metal', 'Light', 'Glass', 'Bronze'],
    area: 'Marvila',
    avatar: av(12),
    photo: P.peacockLamp,
    uniConfirmed: true,
    openToCollab: true,
    openToCommissions: true,
  },
  {
    id: 'helena',
    name: 'Prof. Auguste Rodin',
    role: 'teacher',
    discipline: 'Sculpture',
    programme: 'Sculpture department, FBAUL',
    bio: 'I teach sculpture and modelling. I share open calls I hear about and point people to students whose work deserves a room, especially the ones who are better than me.',
    skills: ['Sculpture', 'Bronze', 'Mentoring'],
    topics: ['Body', 'Material', 'Public space'],
    materials: ['Bronze', 'Marble'],
    area: 'Chiado',
    avatar: av(44),
    photo: P.thinker,
    uniConfirmed: true,
  },
  {
    id: 'fio',
    name: 'Galeria Fio',
    role: 'provider',
    orgType: 'Gallery',
    programme: 'Contemporary gallery',
    bio: 'A small gallery in a former thread factory in Marvila. We open two group shows a year for artists in their first five years of practice.',
    skills: ['Group shows', 'Commissions', 'Artist talks'],
    topics: ['Emerging artists', 'Installation', 'Craft'],
    materials: [],
    area: 'Marvila',
    avatar: av(3),
    checked: true,
    website: 'galeriafio.example',
  },

  // ---- Other students and alumni ----------------------------------------
  {
    id: 'ines', name: 'Claude Monet', role: 'alumni', discipline: 'Painting', programme: 'Painting, MA',
    bio: 'Painter of light on water. I paint the same pond at every hour of the day. I mentor first-years on how to price their work (and how to survive a bad review).',
    skills: ['Oil painting', 'Painting outdoors', 'Series', 'Pricing work'], topics: ['Landscape', 'Water', 'Light', 'Time'], materials: ['Oil', 'Canvas'],
    area: 'Alcântara', avatar: av(5), photo: P.waterLilies, openToCommissions: true,
  },
  {
    id: 'rui', name: 'Alfred Stieglitz', role: 'student', discipline: 'Photography', programme: 'Photography, BA', year: 3,
    bio: 'Photography is art, not a hobby. I shoot ferries, crowds and the city at night, and I document exhibitions too.',
    skills: ['Analogue', 'Darkroom', 'Exhibition photography'], topics: ['City', 'Night', 'Water'], materials: ['Film', 'Silver gelatin'],
    area: 'Cais do Sodré', avatar: av(6), photo: P.steerage, uniConfirmed: true, openToCommissions: true, openToCollab: true,
  },
  {
    id: 'beatriz', name: 'Albrecht Dürer', role: 'student', discipline: 'Drawing', programme: 'Drawing, BA', year: 2,
    bio: 'Brush, pen and engraving. Mostly hands, animals and very patient details. Slow drawings.',
    skills: ['Brush drawing', 'Engraving', 'Watercolour'], topics: ['Body', 'Nature', 'Portrait'], materials: ['Ink', 'Paper', 'Copper plate'],
    area: 'Graça', avatar: av(7), photo: P.hare, uniConfirmed: true, openToCollab: true,
  },
  {
    id: 'joao', name: 'Georges Méliès', role: 'student', discipline: 'Multimedia', programme: 'Multimedia Art, BA', year: 3,
    bio: 'Film, stage tricks and special effects. I can send your sculpture to the moon without touching it.',
    skills: ['Special effects', 'Set design', 'Film editing'], topics: ['Light', 'Technology', 'Play'], materials: ['Video', 'Light', 'Paint'],
    area: 'Arroios', avatar: av(8), photo: P.moonDrawing, uniConfirmed: true, openToCollab: true, openToCommissions: true,
  },
  {
    id: 'clara', name: 'Henri de Toulouse-Lautrec', role: 'student', discipline: 'Communication Design', programme: 'Communication Design, BA', year: 3,
    bio: 'Posters, identities and nightlife. I design the posters for student parties and I am always at the party.',
    skills: ['Lithography', 'Posters', 'Typography'], topics: ['Typography', 'Print', 'Night'], materials: ['Paper', 'Lithograph ink'],
    area: 'Arroios', avatar: av(9), photo: P.laGoulue, uniConfirmed: true, openToCommissions: true,
  },
  {
    id: 'duarte', name: 'Michelangelo Buonarroti', role: 'student', discipline: 'Sculpture', programme: 'Sculpture, BA', year: 2,
    bio: 'Marble first, painting only if someone insists. I draw every figure before I carve it.',
    skills: ['Marble carving', 'Figure drawing', 'Anatomy'], topics: ['Body', 'Anatomy', 'Public space'], materials: ['Marble', 'Chalk', 'Paper'],
    area: 'Alcântara', avatar: av(10), photo: P.sibyl, uniConfirmed: true, openToCollab: true,
  },
  {
    id: 'sofia', name: 'Vincent van Gogh', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 3,
    bio: 'Colour, night skies and sunflowers. I paint fast, sell little and write long letters to my brother.',
    skills: ['Oil painting', 'Impasto', 'Drawing'], topics: ['Colour', 'Night', 'Nature'], materials: ['Oil', 'Canvas'],
    area: 'Alfama', avatar: av(11), photo: P.sunflowers, uniConfirmed: true, openToCommissions: true,
  },
  {
    id: 'miguel', name: 'Leonardo da Vinci', role: 'alumni', discipline: 'Industrial Design', programme: 'Industrial Design, BA',
    bio: 'Machines, anatomy, painting, flying devices. I start more projects than I finish. Ask me about production and suppliers in Lisbon.',
    skills: ['Engineering', 'Anatomy', 'Prototyping', 'Painting'], topics: ['Technology', 'Body', 'Objects'], materials: ['Wood', 'Metal', 'Ink'],
    area: 'Marvila', avatar: av(13), photo: P.vitruvian, openToCollab: true,
  },
  {
    id: 'leonor', name: 'Caravaggio', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 1,
    bio: 'Strong light, deep shadow, real people as models. Looking for a studio with one good window.',
    skills: ['Oil painting', 'Chiaroscuro', 'Painting from life'], topics: ['Light', 'Portrait', 'City'], materials: ['Oil', 'Canvas'],
    area: 'Penha de França', avatar: av(14), photo: P.calling, uniConfirmed: true,
  },
  {
    id: 'andre', name: 'Johannes Vermeer', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 2,
    bio: 'Quiet rooms, light from a window on the left, expensive blue. Two paintings a year, if it goes well.',
    skills: ['Oil painting', 'Glazing', 'Camera obscura'], topics: ['Light', 'Domestic', 'Portrait'], materials: ['Oil', 'Canvas', 'Ultramarine'],
    area: 'Arroios', avatar: av(15), photo: P.pearl, uniConfirmed: true, openToCollab: true,
  },
  {
    id: 'mariana', name: 'Edgar Degas', role: 'alumni', discipline: 'Sculpture', programme: 'Painting and Sculpture, MA',
    bio: 'Dancers, in pastel, oil and wax. People know my paintings; my sculptures are the secret. Happy to tell you how I got my first show.',
    skills: ['Wax modelling', 'Pastel', 'Bronze casting'], topics: ['Body', 'Movement', 'Dance'], materials: ['Wax', 'Bronze', 'Fabric'],
    area: 'Graça', avatar: av(16), photo: P.littleDancer, openToCommissions: true,
  },
  {
    id: 'pedro', name: 'Giovanni Battista Piranesi', role: 'student', discipline: 'Drawing', programme: 'Drawing, BA', year: 3,
    bio: 'Etchings of ruins and of prisons that do not exist. Architecture is more fun when it cannot be built.',
    skills: ['Etching', 'Perspective', 'Architectural drawing'], topics: ['City', 'Architecture', 'Time'], materials: ['Ink', 'Paper', 'Copper plate'],
    area: 'Chiado', avatar: av(17), photo: P.carceri, uniConfirmed: true, openToCommissions: true,
  },
  {
    id: 'carolina', name: 'Katsushika Hokusai', role: 'student', discipline: 'Communication Design', programme: 'Communication Design, BA', year: 2,
    bio: 'Woodblock prints, series and sketchbooks. Thirty-six views of the same mountain and I am not done.',
    skills: ['Woodblock printing', 'Series', 'Illustration'], topics: ['Print', 'Landscape', 'Water'], materials: ['Paper', 'Woodblock', 'Prussian blue'],
    area: 'Cais do Sodré', avatar: av(18), photo: P.greatWave, uniConfirmed: true, openToCollab: true,
  },
  {
    id: 'nuno', name: 'Gustav Klimt', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 3,
    bio: 'Gold leaf, patterns and couples. I also design murals and decorative panels for buildings.',
    skills: ['Gold leaf', 'Decorative painting', 'Murals'], topics: ['Love', 'Pattern', 'Colour'], materials: ['Oil', 'Gold leaf', 'Canvas'],
    area: 'Alcântara', avatar: av(19), photo: P.kiss, uniConfirmed: true, openToCommissions: true,
  },
  {
    id: 'rita', name: 'Sandro Botticelli', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 1,
    bio: 'Tempera on panel and canvas, myths and gardens. I take commissions from rich families.',
    skills: ['Egg tempera', 'Gilding', 'Large panels'], topics: ['Myth', 'Nature', 'Colour'], materials: ['Tempera', 'Wood panel', 'Canvas'],
    area: 'Graça', avatar: av(20), photo: P.primavera, uniConfirmed: true,
  },
  {
    id: 'rembrandt', name: 'Rembrandt van Rijn', role: 'student', discipline: 'Painting', programme: 'Painting, BA', year: 3,
    bio: 'Group portraits, self-portraits and a lot of brown. I paint the city guards and the anatomy lessons nobody else wants to paint.',
    skills: ['Oil painting', 'Etching', 'Group portraits'], topics: ['Portrait', 'Light', 'City'], materials: ['Oil', 'Canvas', 'Copper plate'],
    area: 'Chiado', avatar: av(26), photo: P.nightWatch, uniConfirmed: true, openToCommissions: true,
  },

  // ---- Teachers ----------------------------------------------------------
  {
    id: 'vasco', name: 'Prof. William Morris', role: 'teacher', discipline: 'Industrial Design', programme: 'Design department, FBAUL',
    bio: 'Design, craft and textiles. Have nothing in your house that you do not know to be useful or believe to be beautiful. I recommend students who finish what they prototype.',
    skills: ['Textiles', 'Wallpaper', 'Craft'], topics: ['Craft', 'Pattern', 'Nature'], materials: ['Wood', 'Textile'],
    area: 'Chiado', avatar: av(21), photo: P.strawberryThief, uniConfirmed: true,
  },
  {
    id: 'ana', name: 'Prof. Eadweard Muybridge', role: 'teacher', discipline: 'Photography', programme: 'Photography and Multimedia, FBAUL',
    bio: 'Photography and moving image. I proved a horse can fly. I forward festival calls every week.',
    skills: ['Photography', 'Motion studies'], topics: ['Movement', 'Technology'], materials: ['Glass plate', 'Film'],
    area: 'Chiado', avatar: av(22), photo: P.horse, uniConfirmed: true,
  },

  // ---- Opportunity providers --------------------------------------------
  {
    id: 'armazem', name: 'Armazém 9', role: 'provider', orgType: 'Venue', programme: 'Event and project space',
    bio: 'A riverside warehouse that hosts installations, concerts and one-night shows. We pay for production.',
    skills: ['Large installations', 'One-night shows'], topics: ['Installation', 'Sound', 'Light'], materials: [],
    area: 'Alcântara', avatar: av(23), checked: true,
  },
  {
    id: 'oficina', name: 'Oficina Lume', role: 'provider', orgType: 'Studio', programme: 'Design and production studio',
    bio: 'Lighting and furniture studio. We commission young designers for hotel and restaurant pieces.',
    skills: ['Commissions', 'Production'], topics: ['Light', 'Objects'], materials: [],
    area: 'Marvila', avatar: av(24), checked: true,
  },

  // ---- Spectator --------------------------------------------------------
  {
    id: 'joana', name: 'Joana Frade', role: 'spectator', programme: 'Collector',
    bio: 'I collect works on paper by young Lisbon artists.',
    skills: [], topics: ['Drawing', 'Print'], materials: [], area: 'Chiado', avatar: av(25),
  },
]

export const personById = (id: string) => people.find((p) => p.id === id)
