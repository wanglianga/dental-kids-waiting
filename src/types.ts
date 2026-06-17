export type CallStatus = 'waiting' | 'called' | 'in-treatment' | 'finished';
export type TreatmentType = 'filling' | 'fluoride' | 'sealant' | 'checkup' | 'cleaning';
export type UserRole = 'parent' | 'nurse' | 'doctor';
export type StickerSource = 'game' | 'cooperation' | 'followup' | 'manual';
export type StepAnimationType = 'xray' | 'rinse' | 'check' | 'fluoride' | 'sit' | 'bib' | 'mirror' | 'brush' | 'paint';

export interface ChildInfo {
  name: string;
  age: number;
  avatar: string;
  queueNumber: string;
}

export interface QueueItem {
  number: string;
  name: string;
  status: CallStatus;
  estimatedTime?: number;
}

export interface CheckItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
  duration: number;
}

export interface StepPrecautions {
  parent: string[];
  child: string;
}

export interface ChairStep {
  id: string;
  step: number;
  title: string;
  description: string;
  childDescription: string;
  icon: string;
  animationType: StepAnimationType;
  completed: boolean;
  active: boolean;
  precautions: StepPrecautions;
  estimatedDuration: number;
}

export interface RewardSticker {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: string;
  condition: string;
  source?: StickerSource;
  encouragement?: string;
  behaviorFeedback?: string;
  autoEarnTrigger?: 'game_bubbles' | 'game_stars' | 'game_memory' | 'all_steps' | 'followup';
}

export interface DoctorInfo {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: string;
  greeting: string;
}

export interface PostCareItem {
  id: string;
  title: string;
  content: string;
  icon: string;
  type: 'normal' | 'warning' | 'tip';
}

export interface TreatmentMark {
  type: TreatmentType;
  name: string;
  marked: boolean;
  note?: string;
}

export interface GameState {
  bubblesPopped: number;
  starsCollected: number;
  currentGame: 'bubbles' | 'stars' | 'memory';
  memoryCompleted: boolean;
  bubblesThreshold: number;
  starsThreshold: number;
}
