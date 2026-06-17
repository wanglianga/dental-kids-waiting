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
  StickerSource,
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
  {
    id: '1',
    step: 1,
    title: '坐上小椅子',
    description: '护士会帮孩子调整到舒适的治疗位置，请家长在旁陪伴安抚',
    childDescription: '小椅子会像小飞机一样慢慢调整到舒服的位置哦 ✈️',
    icon: '🪑',
    animationType: 'sit',
    completed: false,
    active: false,
    estimatedDuration: 2,
    precautions: {
      parent: [
        '让孩子自己爬上椅子，增加参与感和控制感',
        '可以握着孩子的手给予安全感',
        '避免说"不会痛"，改为"会有点痒痒的感觉"',
      ],
      child: '你真棒！坐上小椅子就像小飞行员准备起飞啦~',
    },
  },
  {
    id: '2',
    step: 2,
    title: '戴小围兜',
    description: '佩戴防水围兜保护衣物，准备开始口腔检查',
    childDescription: '漂漂亮亮的小围兜来保护你的衣服不弄脏 🎽',
    icon: '🎽',
    animationType: 'bib',
    completed: false,
    active: false,
    estimatedDuration: 1,
    precautions: {
      parent: ['让孩子自己选择喜欢的围兜颜色', '可以称赞围兜很漂亮'],
      child: '哇，这个小围兜好漂亮，像小厨师一样！',
    },
  },
  {
    id: '3',
    step: 3,
    title: '拍牙片检查',
    description: '通过X光片观察牙齿和颌骨的发育情况，判断是否有隐藏问题',
    childDescription: '我们来给小牙齿拍张照片，看看它们是不是都很健康 📷',
    icon: '📷',
    animationType: 'xray',
    completed: false,
    active: false,
    estimatedDuration: 5,
    precautions: {
      parent: [
        '辐射剂量极低，相当于晒30分钟太阳，请放心',
        '帮助孩子保持静止，让图像更清晰',
        '可以告诉孩子这是在给小牙齿拍照',
      ],
      child: '别动哦，咔嚓！小牙齿的照片马上就好啦~',
    },
  },
  {
    id: '4',
    step: 4,
    title: '口腔检查',
    description: '医生用小镜子仔细检查每颗牙齿，排查龋齿和发育问题',
    childDescription: '医生用小镜子看看每颗小牙齿是不是都很健康 🪞',
    icon: '�',
    animationType: 'mirror',
    completed: false,
    active: false,
    estimatedDuration: 10,
    precautions: {
      parent: ['保持放松，你的情绪会影响孩子', '可以给孩子描述检查过程'],
      child: '张开小嘴巴，让医生看看你的小白牙~',
    },
  },
  {
    id: '5',
    step: 5,
    title: '洁牙抛光',
    description: '用软毛刷和抛光膏清洁牙齿表面，去除菌斑和色素',
    childDescription: '小毛刷会轻轻给小牙齿洗香香的澡哦 🪥',
    icon: '🪥',
    animationType: 'brush',
    completed: false,
    active: false,
    estimatedDuration: 15,
    precautions: {
      parent: ['告诉孩子会有痒痒的感觉和沙沙的声音', '可以握着孩子的手给予支持'],
      child: '小牙刷在给小牙齿洗澡呢，沙沙沙~',
    },
  },
  {
    id: '6',
    step: 6,
    title: '漱口清洁',
    description: '用温水漱口，清洁口腔内残留的抛光膏',
    childDescription: '咕噜咕噜，把小嘴巴漱得干干净净 🥛',
    icon: '🥛',
    animationType: 'rinse',
    completed: false,
    active: false,
    estimatedDuration: 2,
    precautions: {
      parent: ['提醒孩子不要吞漱口水', '准备好纸巾给孩子擦嘴'],
      child: '咕噜咕噜，噗~ 小嘴巴真干净！',
    },
  },
  {
    id: '7',
    step: 7,
    title: '涂氟保护',
    description: '在牙齿表面涂布氟保护漆，增强牙齿抗龋能力',
    childDescription: '水果味的保护漆来给小牙齿穿上透明的防护衣 🍓',
    icon: '🍓',
    animationType: 'fluoride',
    completed: false,
    active: false,
    estimatedDuration: 5,
    precautions: {
      parent: [
        '涂氟后2小时内不要进食',
        '4小时内避免过硬、过黏食物',
        '当晚无需刷牙，第二天正常清洁即可',
      ],
      child: '香香的草莓味保护漆，小牙齿穿上铠甲啦！',
    },
  },
]);

export const rewardStickers = reactive<RewardSticker[]>([
  {
    id: '1',
    name: '泡泡小达人',
    icon: '�',
    color: 'blue',
    earned: false,
    condition: '完成戳泡泡小游戏',
    autoEarnTrigger: 'game_bubbles',
    behaviorFeedback: '孩子在候诊期间能够专注于游戏，展现了良好的注意力和耐心',
  },
  {
    id: '2',
    name: '星星收集家',
    icon: '⭐',
    color: 'accent',
    earned: false,
    condition: '完成接星星小游戏',
    autoEarnTrigger: 'game_stars',
    behaviorFeedback: '孩子手眼协调能力出色，能够快速反应接住掉落的星星',
  },
  {
    id: '3',
    name: '记忆小天才',
    icon: '🧠',
    color: 'purple',
    earned: false,
    condition: '完成记忆翻牌游戏',
    autoEarnTrigger: 'game_memory',
    behaviorFeedback: '孩子展现了出色的短期记忆能力，能够快速配对相同的图案',
  },
  {
    id: '4',
    name: '勇敢小狮子',
    icon: '🦁',
    color: 'primary',
    earned: false,
    condition: '乖乖配合坐上牙椅',
    source: 'cooperation',
    behaviorFeedback: '孩子勇敢地坐上牙椅，展现了对医护人员的信任和配合度',
  },
  {
    id: '5',
    name: '闪亮小明星',
    icon: '🌟',
    color: 'yellow',
    earned: false,
    condition: '全程配合检查',
    source: 'cooperation',
    behaviorFeedback: '孩子在整个检查过程中表现出色，能够听从指令保持配合',
  },
  {
    id: '6',
    name: '微笑小海豚',
    icon: '🐬',
    color: 'secondary',
    earned: false,
    condition: '全程保持好心情',
    source: 'cooperation',
    behaviorFeedback: '孩子情绪稳定，全程保持积极态度，为治疗顺利进行创造了良好条件',
  },
  {
    id: '7',
    name: '彩虹小勇士',
    icon: '🌈',
    color: 'purple',
    earned: false,
    condition: '完成全部治疗步骤',
    autoEarnTrigger: 'all_steps',
    behaviorFeedback: '孩子完成了全部治疗流程，展现了坚韧的毅力和对医护工作的尊重',
  },
  {
    id: '8',
    name: '超级小牙医',
    icon: '🦷',
    color: 'primary',
    earned: false,
    condition: '获得医生特别表扬',
    source: 'manual',
    behaviorFeedback: '医生对孩子的表现给予了高度评价，是所有小朋友学习的榜样',
  },
  {
    id: '9',
    name: '守时小天使',
    icon: '⏰',
    color: 'accent',
    earned: false,
    condition: '按时复诊',
    autoEarnTrigger: 'followup',
    behaviorFeedback: '家长和孩子非常重视口腔健康，能够按时复诊，值得表扬',
  },
  {
    id: '10',
    name: '护牙小卫士',
    icon: '🛡️',
    color: 'secondary',
    earned: false,
    condition: '坚持每日刷牙',
    source: 'manual',
    behaviorFeedback: '良好的口腔卫生习惯是保持牙齿健康的基础，继续保持！',
  },
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
  memoryCompleted: false,
  bubblesThreshold: 30,
  starsThreshold: 15,
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

  const allCompleted = chairSteps.every((s) => s.completed);
  if (allCompleted) {
    const rainbowSticker = rewardStickers.find((s) => s.autoEarnTrigger === 'all_steps');
    if (rainbowSticker && !rainbowSticker.earned) {
      earnSticker(rainbowSticker.id, 'cooperation', '太棒了！你完成了全部治疗，真是个勇敢的小朋友！');
    }
  }
}

export function resetStep() {
  chairSteps.forEach((s, i) => {
    s.completed = i === 0;
    s.active = i === 0;
  });
}

export function earnSticker(
  id: string,
  source?: StickerSource,
  encouragement?: string,
  feedback?: string
) {
  const s = rewardStickers.find((x) => x.id === id);
  if (s && !s.earned) {
    s.earned = true;
    s.earnedAt = new Date().toISOString();
    if (source) s.source = source;
    if (encouragement) s.encouragement = encouragement;
    if (feedback) s.behaviorFeedback = feedback;
  }
  return s;
}

export function updateStickerEncouragement(id: string, encouragement: string) {
  const s = rewardStickers.find((x) => x.id === id);
  if (s) {
    s.encouragement = encouragement;
  }
}

export function checkGameStickerReward(gameType: 'bubbles' | 'stars' | 'memory') {
  let sticker: ReturnType<typeof earnSticker> | null = null;

  if (gameType === 'bubbles' && gameState.bubblesPopped >= gameState.bubblesThreshold) {
    const s = rewardStickers.find((x) => x.autoEarnTrigger === 'game_bubbles');
    if (s && !s.earned) {
      sticker = earnSticker(s.id, 'game', '哇！你戳破了这么多泡泡，真是个泡泡小达人！');
    }
  }

  if (gameType === 'stars' && gameState.starsCollected >= gameState.starsThreshold) {
    const s = rewardStickers.find((x) => x.autoEarnTrigger === 'game_stars');
    if (s && !s.earned) {
      sticker = earnSticker(s.id, 'game', '太棒了！你接住了这么多星星，真是星星收集家！');
    }
  }

  if (gameType === 'memory' && gameState.memoryCompleted) {
    const s = rewardStickers.find((x) => x.autoEarnTrigger === 'game_memory');
    if (s && !s.earned) {
      sticker = earnSticker(s.id, 'game', '你的记忆力真好！全部配对成功，真是记忆小天才！');
    }
  }

  return sticker;
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
