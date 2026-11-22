// Shared types for all sample data. Change the data in the other files of this folder.

export type Role = 'student' | 'alumni' | 'teacher' | 'provider' | 'spectator'

export type Discipline =
  | 'Sculpture'
  | 'Drawing'
  | 'Painting'
  | 'Industrial Design'
  | 'Photography'
  | 'Multimedia'
  | 'Communication Design'

export type Area =
  | 'Marvila'
  | 'Chiado'
  | 'Alfama'
  | 'Arroios'
  | 'Alcântara'
  | 'Penha de França'
  | 'Graça'
  | 'Cais do Sodré'

/** Settings for one procedurally generated artwork image (see src/art/generateArt.ts). */
export type ArtStyle =
  | 'stone'    // a sculpted form on a plinth
  | 'strata'   // layered painted bands
  | 'orbs'     // soft gradient circles
  | 'blocks'   // geometric collage
  | 'flow'     // flowing ink lines
  | 'hatch'    // pencil hatching on paper
  | 'horizon'  // photograph-like landscape
  | 'lamp'     // a designed object / light
  | 'screen'   // multimedia: scanlines and glitch
  | 'poster'   // communication design: type blocks
  | 'sketch'   // working sketch on squared paper

export interface ArtSpec {
  style: ArtStyle
  seed: number
  /** Aspect ratio as width / height, e.g. 0.8 for a portrait */
  ratio: number
  /** Optional palette override (3–4 hex colours) */
  palette?: string[]
}

/** A picture is either generated art or a real image URL (uploaded or replaced later). */
export type Picture = { art: ArtSpec } | { src: string; ratio: number }

export interface Person {
  id: string
  name: string
  role: Role
  discipline?: Discipline
  /** e.g. "Sculpture, BA · 3rd year" or for providers "Gallery" */
  programme?: string
  year?: number
  bio: string
  skills: string[]
  topics: string[]
  materials: string[]
  area: Area
  avatar: ArtSpec
  /** Optional real picture used as avatar instead of the generated one */
  photo?: Picture
  /** Students and teachers: confirmed @ulisboa.pt email */
  uniConfirmed?: boolean
  /** Opportunity providers: verified by the HYPHA team */
  checked?: boolean
  openToCommissions?: boolean
  openToCollab?: boolean
  /** Providers: what kind of place */
  orgType?: string
  website?: string
}

export type Block =
  | { type: 'text'; title: string; body: string }
  | { type: 'process'; title: string; steps: { picture: Picture; note: string }[] }
  | { type: 'video'; title: string; caption: string; poster: Picture; url?: string; file?: string }
  | { type: 'gallery'; title: string; pictures: Picture[] }
  | { type: 'quote'; text: string; by: string }
  | { type: 'list'; title: string; items: string[] }

export interface Work {
  id: string
  ownerId: string
  title: string
  year: number
  technique: string
  materials: string[]
  dimensions: string
  edition?: string
  exhibited?: string
  discipline: Discipline
  topics: string[]
  picture: Picture
  blocks: Block[]
  /** Teacher id who marked the work "Recommended" */
  recommendedBy?: string
  /** Marta's works appear only after she imports her portfolio */
  fromImport?: boolean
}

export interface Post {
  id: string
  authorId: string
  text: string
  picture?: Picture
  tags: string[]
  /** minutes ago, for sample data */
  ago: number
}

export interface ProjectCall {
  id: string
  authorId: string
  title: string
  lookingFor: Discipline
  description: string
  tags: string[]
  area: Area
  picture?: Picture
  ago: number
  responses: { personId: string; text: string }[]
}

export type OpportunityKind = 'open-call' | 'commission' | 'exhibition'

export interface Opportunity {
  id: string
  providerId: string
  kind: OpportunityKind
  title: string
  description: string
  deadline: string
  disciplines: Discipline[]
  area: Area
  picture: Picture
  fee?: string
}

export interface Message {
  id: string
  from: string
  to: string
  text: string
  at: number
}

export interface Connection {
  from: string
  to: string
  status: 'pending' | 'accepted'
}

export interface Shortlist {
  id: string
  ownerId: string
  name: string
  items: { kind: 'person' | 'work'; id: string }[]
}
