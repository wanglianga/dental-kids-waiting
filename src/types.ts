export type CallStatus = 'waiting' | 'called' | 'in-treatment' | 'finished';
export type TreatmentType = 'filling' | 'fluoride' | 'sealant' | 'checkup' | 'cleaning';
export type UserRole = 'parent' | 'nurse' | 'doctor';

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

export interface ChairStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

export interface RewardSticker {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
  condition: string;
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
}
