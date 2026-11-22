// Posts, project calls, opportunities and canned chat replies.
import { P } from './commons'
import type { Message, Opportunity, Post, ProjectCall } from './types'

export const posts: Post[] = [
  { id: 'p1', authorId: 'tiago', text: 'Peacock lamp, first time lit. Four hundred pieces of glass and not one cracked.', picture: P.peacockLamp, tags: ['Light', 'Glass'], ago: 35 },
  { id: 'p2', authorId: 'helena', text: 'Armazém 9 just opened a call for one-night installations. Pay for production included. Sculpture third-years, look at this. Camille, this means you.', tags: ['Open call', 'Installation'], ago: 80 },
  { id: 'p3', authorId: 'sofia', text: 'Painted the view from my window at 4 am. Nobody will buy it, but it is the best thing I have done.', picture: P.starryNight, tags: ['Painting', 'Night'], ago: 140 },
  { id: 'p4', authorId: 'fio', text: 'Studio visits in Marvila this Saturday for the spring group show. Write to us if you want a slot.', picture: P.louvreGallery, tags: ['Group show', 'Marvila'], ago: 200 },
  { id: 'p5', authorId: 'rui', text: 'Took the ferry just to photograph the lower deck. Printing it this week.', picture: P.steerage, tags: ['Photography', 'Darkroom'], ago: 320 },
  { id: 'p6', authorId: 'beatriz', text: 'Spent the whole week on one hare. Worth it.', picture: P.hare, tags: ['Drawing', 'Nature'], ago: 460 },
  { id: 'p7', authorId: 'joao', text: 'Shooting the moon landing in the courtyard tonight. Come by after 9, bring a rocket.', picture: P.moonWorkshop, tags: ['Multimedia', 'Film'], ago: 600 },
  { id: 'p8', authorId: 'mariana', text: 'Residency applications close in three weeks. Happy to read your statement if you send it to me. Dancers welcome.', tags: ['Residency', 'Advice'], ago: 900 },
  { id: 'p9', authorId: 'nuno', text: 'Prof. Morris recommended The Kiss. Now looking for a café that wants a gold wall.', picture: P.kiss, tags: ['Gold leaf', 'Commission'], ago: 1300 },
]

export const projectCalls: ProjectCall[] = [
  {
    id: 'c1', authorId: 'joao', title: 'Looking for a sculptor for a projected object', lookingFor: 'Sculpture',
    description: 'I need a white object, about 1 m tall, to film and project on for the night of museums. Your form, my tricks.',
    tags: ['Projection', 'Collaboration'], area: 'Arroios', ago: 300, picture: P.moonColor,
    responses: [{ personId: 'duarte', text: 'I have a marble block that could work. Want to see it?' }],
  },
  {
    id: 'c2', authorId: 'clara', title: 'Looking for a photographer for a catalogue', lookingFor: 'Photography',
    description: 'Catalogue and posters for the third-year group show. Two days of shooting in December, paid.',
    tags: ['Catalogue', 'Paid'], area: 'Chiado', ago: 700, responses: [],
  },
  {
    id: 'c3', authorId: 'nuno', title: 'Looking for a designer to build frames for gold panels', lookingFor: 'Industrial Design',
    description: 'Six gold-leaf panels for a café wall, need someone who can make the frames and hang them.',
    tags: ['Gold leaf', 'Commission'], area: 'Alcântara', ago: 1500, responses: [],
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 'o1', providerId: 'fio', kind: 'exhibition', title: 'Spring group show: first five years',
    description: 'Six artists, one room, four weeks in March. We cover transport and the opening. Sculpture and installation welcome.',
    deadline: '15 Jan 2027', disciplines: ['Sculpture', 'Painting', 'Drawing'], area: 'Marvila', fee: '€300 per artist', picture: P.louvreGallery,
  },
  {
    id: 'o2', providerId: 'armazem', kind: 'open-call', title: 'One-night installations by the river',
    description: 'Three proposals chosen for one night in February. Production budget included.',
    deadline: '10 Dec 2026', disciplines: ['Sculpture', 'Multimedia'], area: 'Alcântara', fee: '€800 production', picture: P.fallingRocket,
  },
  {
    id: 'o3', providerId: 'oficina', kind: 'commission', title: 'Pendant lamps for a hotel lobby',
    description: 'We are looking for a young designer to develop three pendant lamps with our workshop.',
    deadline: '20 Dec 2026', disciplines: ['Industrial Design'], area: 'Marvila', fee: '€2,400', picture: P.lampDesign,
  },
  {
    id: 'o4', providerId: 'fio', kind: 'commission', title: 'Window piece for the gallery facade',
    description: 'A work for our street window, visible day and night, for three months.',
    deadline: '5 Jan 2027', disciplines: ['Sculpture', 'Communication Design', 'Multimedia'], area: 'Marvila', fee: '€600', picture: P.magnolias,
  },
  {
    id: 'o5', providerId: 'armazem', kind: 'open-call', title: 'Sound pieces for the warehouse',
    description: 'Short sound works for our listening nights.',
    deadline: '30 Jan 2027', disciplines: ['Multimedia'], area: 'Alcântara', picture: P.orchestra,
  },
]

/** Messages already in the app before the demo starts. */
export const seedMessages: Message[] = [
  { id: 'm1', from: 'helena', to: 'marta', text: 'I marked "The Mature Age" as recommended. Show it to people.', at: Date.now() - 1000 * 60 * 60 * 26 },
  { id: 'm2', from: 'marta', to: 'helena', text: 'Thank you! I will.', at: Date.now() - 1000 * 60 * 60 * 25 },
  { id: 'm3', from: 'mariana', to: 'tiago', text: 'Saw your lamp at open studios. Beautiful glass.', at: Date.now() - 1000 * 60 * 60 * 50 },
]

/** Fake replies, so chats feel alive. The demo uses the first reply of each person. */
export const cannedReplies: Record<string, string[]> = {
  tiago: [
    'Hi Camille! Your bronze is beautiful. A metal frame with warm light inside it — I can do that, glass too if you want. Coffee at the workshop on Thursday?',
    'I can bring a few glass samples so we test the colour on the bronze.',
    'Perfect, see you there.',
  ],
  fio: ['Thanks for writing. We will look at your portfolio and get back to you this week.'],
  helena: ['Good. Send me a photo when it is done.'],
  default: ['Thanks! Let me look and get back to you.', 'Sounds good to me.', 'Sure, send me more details.'],
}
