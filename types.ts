
export interface Chapter {
  id: string;
  title: string;
  content: string;
  summary?: string;
  lastUpdated: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  tone: string;
  language?: string; // e.g. 'en', 'mr', 'hi'
  targetAudience?: string;
  coverImage?: string; // Base64 data URL
  chapters: Chapter[];
  createdAt: number;
  currentStep: 1 | 2 | 3 | 4 | 5; // 1: Concept, 2: Outline, 3: Secure, 4: Draft, 5: Publish
}

export interface GenerationConfig {
  tone: string;
  perspective: 'first_person' | 'third_person_limited' | 'third_person_omniscient';
  creativity: number; // 0.0 to 1.0
}

export enum AIActionType {
  GENERATE_OUTLINE = 'GENERATE_OUTLINE',
  WRITE_CHAPTER = 'WRITE_CHAPTER',
  WRITE_WHOLE_CHAPTER = 'WRITE_WHOLE_CHAPTER',
  CONTINUE_WRITING = 'CONTINUE_WRITING',
  REWRITE_SELECTION = 'REWRITE_SELECTION',
  REWRITE_CHAPTER = 'REWRITE_CHAPTER',
  BRAINSTORM = 'BRAINSTORM',
  BRAINSTORM_CHAT = 'BRAINSTORM_CHAT',
  // 2026 Features
  CHARACTER_PROFILE = 'CHARACTER_PROFILE',
  WORLD_LORE = 'WORLD_LORE',
  STORYBOARD_SCENE = 'STORYBOARD_SCENE',
  PLOT_HOLE_CHECK = 'PLOT_HOLE_CHECK',
  PACING_HEATMAP = 'PACING_HEATMAP',
  DIALOGUE_DOCTOR = 'DIALOGUE_DOCTOR',
  SENSORY_ENHANCER = 'SENSORY_ENHANCER',
  SHOW_DONT_TELL = 'SHOW_DONT_TELL',
  STYLE_MIMIC = 'STYLE_MIMIC',
  BETA_READER_SIM = 'BETA_READER_SIM',
  VOICE_SWITCHER = 'VOICE_SWITCHER',
  TITLE_GEN_PRO = 'TITLE_GEN_PRO',
  CLIFFHANGER_GEN = 'CLIFFHANGER_GEN',
  EMOTION_ARC = 'EMOTION_ARC',
  FACT_CHECKER = 'FACT_CHECKER',
  THEME_WEAVER = 'THEME_WEAVER',
  SYNOPSIS_GEN = 'SYNOPSIS_GEN',
  AUDIO_DRAMA_SCRIPT = 'AUDIO_DRAMA_SCRIPT',
  TRANSLATION_PREVIEW = 'TRANSLATION_PREVIEW',
  MARKETING_BLURB = 'MARKETING_BLURB',
  READABILITY_ANALYZER = 'READABILITY_ANALYZER'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
