import { reactive, ref } from 'vue';
import type {
  ChildInfo,
  QueueItem,
  CheckItem,
  ChairStep,
  RewardSticker,
  DoctorInfo,
  PostCareItem,
  TreatmentMark,
  CallStatus,
  TreatmentType,
  UserRole,
  GameState,
} from './types';

export const currentRole = ref<UserRole>('parent');

export const childInfo = reactive<ChildInfo>({
  name: '小明',
  age: 6,
  avatar: '🦊',
  queueNumber: 'A018',
});

export const queueList = reactive<QueueItem[]>([
  { number: 'A015', name: '朵朵', status: 'in-treatment', estimatedTime: 15 },
  { number: 'A016', name: '豆豆', status: 'called', estimatedTime: 3 },
  { number: 'A017', name: '乐乐', status: 'waiting', estimatedTime: 18 },
  { number: 'A018', name: '小明', status: 'waiting', estimatedTime: 35 },
  { number: 'A019', name: '圆圆', status: 'waiting', estimatedTime: 50 },
  { number: 'A020', name: '欢欢', status: 'waiting', estimatedTime: 65 },
]);

export const checkItems = reactive<CheckItem[]>([
  { id: '1', name: '口腔检查', description: '医生看看小牙齿的健康状况', icon: '🔍', color: 'primary', completed: false, duration: 10 },
  { id: '2', name: '洁牙抛光', description: '给小牙齿洗个香喷喷的澡', icon: '✨', color: 'secondary', completed: false, duration: 15 },
  { id: '3', name: '涂氟保护', description: '给牙齿穿上透明的防护衣', icon: '🛡️', color: 'accent', completed: false, duration: 5 },
  { id: '4', name: '窝沟封闭', description: '填平深沟挡住小细菌', icon: '🏰', color: 'purple', completed: false, duration: 20 },
]);

export const chairSteps = reactive<ChairStep[]>([
  { id: '1', step: 1, title: '坐上小椅子', description: '我们会把椅子慢慢调舒服哦', icon: '🪑', completed: false, active: false },
  { id: '2', step: 2, title: '戴小围兜', description: '漂亮的小围兜保护你的衣服', icon: '🎽', completed: false, active: false },
  { id: '3', step: 3, title: '照小镜子', description: '看看今天要检查哪颗小牙', icon: '🪞', completed: false, active: false },
  { id: '4', step: 4, title: '小毛刷清洁', description: '软毛刷轻轻给小牙洗澡', icon: '🪥', completed: false, active: false },
  { id: '5', step: 5, title: '涂保护漆', description: '水果味的保护漆香香的', icon: '🍓', completed: false, active: false },
  { id: '6', step: 6, title: '漱口小杯子', description: '咕噜咕噜把小嘴巴漱干净', icon: '🥛', completed: false, active: false },
]);

export const rewardStickers = reactive<RewardSticker[]>([
  { id: '1', name: '勇敢小狮子', icon: '🦁', color: 'accent', earned: false, condition: '乖乖坐上小椅子' },
  { id: '2', name: '闪亮小明星', icon: '⭐', color: 'yellow', earned: false, condition: '配合医生检查' },
  { id: '3', name: '微笑小海豚', icon: '🐬', color: 'blue', earned: false, condition: '全程不哭不闹' },
  { id: '4', name: '彩虹小勇士', icon: '🌈', color: 'purple', earned: false, condition: '完成全部检查项目' },
  { id: '5', name: '超级小牙医', icon: '🦷', color: 'primary', earned: false, condition: '获得医生的表扬' },
]);

export const doctors = reactive<DoctorInfo[]>([
  {
    id: '1',
    name: '李医生',
    title: '儿童牙科主治医师',
    avatar: '👩‍⚕️',
    specialty: '擅长儿童行为引导',
    greeting: '小朋友好呀！今天我们一起给小牙齿做个健康检查好不好？',
  },
]);

export const postCareItems = reactive<PostCareItem[]>([
  { id: '1', title: '进食注意', content: '涂氟后2小时内不要吃东西，4小时内避免食用过硬、过黏的食物', icon: '🍎', type: 'warning' },
  { id: '2', title: '口腔清洁', content: '今天晚上可以正常刷牙，使用软毛牙刷轻轻清洁即可', icon: '🪥', type: 'normal' },
  { id: '3', title: '不适反应', content: '轻微酸胀感属于正常现象，通常1-2天会自然消失，如有剧烈疼痛请及时联系我们', icon: '💗', type: 'tip' },
  { id: '4', title: '复诊提醒', content: '建议每3-6个月进行一次常规口腔检查和涂氟保护', icon: '📅', type: 'tip' },
  { id: '5', title: '饮食建议', content: '减少糖果、碳酸饮料的摄入，多吃富含钙质的食物帮助牙齿更坚固', icon: '🥛', type: 'normal' },
]);

export const treatmentMarks = reactive<TreatmentMark[]>([
  { type: 'filling', name: '补牙治疗', marked: false, note: '' },
  { type: 'fluoride', name: '涂氟保护', marked: false, note: '' },
  { type: 'sealant', name: '窝沟封闭', marked: false, note: '' },
  { type: 'cleaning', name: '洁牙抛光', marked: false, note: '' },
]);

export const needFollowUp = ref(false);
export const followUpDate = ref('');
export const parentConfirmed = ref(false);

export const gameState = reactive<GameState>({
  bubblesPopped: 0,
  starsCollected: 0,
  currentGame: 'bubbles',
});

export function setRole(role: UserRole) {
  currentRole.value = role;
}

export function updateCallStatus(number: string, status: CallStatus) {
  const item = queueList.find((q) => q.number === number);
  if (item) item.status = status;
}

export function toggleCallStatus() {
  const myItem = queueList.find((q) => q.number === childInfo.queueNumber);
  if (!myItem) return;
  const order: CallStatus[] = ['waiting', 'called', 'in-treatment', 'finished'];
  const idx = order.indexOf(myItem.status);
  myItem.status = order[(idx + 1) % order.length];
}

export function toggleCheckItem(id: string) {
  const item = checkItems.find((c) => c.id === id);
  if (item) item.completed = !item.completed;
}

export function setActiveStep(stepId: string) {
  chairSteps.forEach((s) => {
    s.active = s.id === stepId;
    if (s.active) {
      s.completed = true;
      const idx = chairSteps.findIndex((x) => x.id === stepId);
      for (let i = 0; i < idx; i++) chairSteps[i].completed = true;
    }
  });
}

export function resetStep() {
  chairSteps.forEach((s, i) => {
    s.completed = i === 0;
    s.active = i === 0;
  });
}

export function earnSticker(id: string) {
  const s = rewardStickers.find((x) => x.id === id);
  if (s) s.earned = true;
}

export function toggleTreatment(type: TreatmentType, note?: string) {
  const t = treatmentMarks.find((x) => x.type === type);
  if (t) {
    t.marked = !t.marked;
    if (note) t.note = note;
  }
}

export function confirmParent() {
  parentConfirmed.value = true;
}

export function getMyQueueStatus(): CallStatus {
  const me = queueList.find((q) => q.number === childInfo.queueNumber);
  return me?.status ?? 'waiting';
}

export function getAheadCount(): number {
  const meIdx = queueList.findIndex((q) => q.number === childInfo.queueNumber);
  if (meIdx <= 0) return 0;
  return queueList.slice(0, meIdx).filter((q) => q.status !== 'finished').length;
}
