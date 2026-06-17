<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { gameState, checkGameStickerReward } from '../store';

type GameMode = 'bubbles' | 'stars' | 'memory';
const currentGame = ref<GameMode>('bubbles');

const games: { id: GameMode; name: string; icon: string }[] = [
  { id: 'bubbles', name: '戳泡泡', icon: '🫧' },
  { id: 'stars', name: '接星星', icon: '⭐' },
  { id: 'memory', name: '记忆翻牌', icon: '🃏' },
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  popped: boolean;
  emoji: string;
}

const bubbles = ref<Bubble[]>([]);
const bubbleEmojis = ['🦷', '🪥', '✨', '🌈', '🍓', '🍬', '🎈', '💎'];
const bubbleColors = ['#FFE5E0', '#D5F0E7', '#FFF3D6', '#DBEAFE', '#FCE7F3', '#EDE9FE'];

let bubbleId = 0;
let bubbleInterval: ReturnType<typeof setInterval> | null = null;

function spawnBubble() {
  const b: Bubble = {
    id: ++bubbleId,
    x: Math.random() * 90 + 5,
    y: 110,
    size: 48 + Math.random() * 32,
    speed: 0.4 + Math.random() * 0.6,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    popped: false,
    emoji: bubbleEmojis[Math.floor(Math.random() * bubbleEmojis.length)],
  };
  bubbles.value.push(b);
}

let rafId: number | null = null;
function animateBubbles() {
  bubbles.value = bubbles.value
    .map((b) => ({ ...b, y: b.y - b.speed }))
    .filter((b) => b.y > -20 && !b.popped);
  rafId = requestAnimationFrame(animateBubbles);
}

function popBubble(id: number) {
  const b = bubbles.value.find((x) => x.id === id);
  if (b && !b.popped) {
    b.popped = true;
    gameState.bubblesPopped++;
    setTimeout(() => {
      bubbles.value = bubbles.value.filter((x) => x.id !== id);
    }, 300);
  }
}

function startBubbles() {
  bubbles.value = [];
  for (let i = 0; i < 5; i++) {
    const b: Bubble = {
      id: ++bubbleId,
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: 48 + Math.random() * 32,
      speed: 0.4 + Math.random() * 0.6,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      popped: false,
      emoji: bubbleEmojis[Math.floor(Math.random() * bubbleEmojis.length)],
    };
    bubbles.value.push(b);
  }
  bubbleInterval = setInterval(spawnBubble, 1200);
  rafId = requestAnimationFrame(animateBubbles);
}

function stopBubbles() {
  if (bubbleInterval) clearInterval(bubbleInterval);
  if (rafId) cancelAnimationFrame(rafId);
  bubbles.value = [];
}

const stars = ref<{ id: number; x: number; delay: number }[]>([]);
const basketX = ref(50);
const catching = ref(false);

let starId = 0;
let starInterval: ReturnType<typeof setInterval> | null = null;

function spawnStar() {
  stars.value.push({
    id: ++starId,
    x: Math.random() * 80 + 10,
    delay: Math.random() * 0.5,
  });
  setTimeout(() => {
    stars.value = stars.value.filter((s) => s.id !== starId);
  }, 4500);
}

function startStars() {
  stars.value = [];
  gameState.starsCollected = 0;
  starInterval = setInterval(spawnStar, 1500);
}

function stopStars() {
  if (starInterval) clearInterval(starInterval);
  stars.value = [];
}

function moveBasket(e: MouseEvent | TouchEvent, rect: DOMRect) {
  const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const pct = ((x - rect.left) / rect.width) * 100;
  basketX.value = Math.max(5, Math.min(95, pct));
}

function tryCatch() {
  catching.value = true;
  tryCatchStar();
  setTimeout(() => (catching.value = false), 200);
}

interface MemoryCard {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const memoryEmojis = ['🦷', '🪥', '✨', '🌈', '🍓', '🎈'];
const memoryCards = ref<MemoryCard[]>([]);
const flippedCards = ref<number[]>([]);
const memoryMoves = ref(0);
const memoryLocked = ref(false);

function initMemory() {
  const pairs = [...memoryEmojis, ...memoryEmojis];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  memoryCards.value = shuffled.map((e, i) => ({
    id: i,
    emoji: e,
    flipped: false,
    matched: false,
  }));
  flippedCards.value = [];
  memoryMoves.value = 0;
  memoryLocked.value = false;
}

function flipCard(id: number) {
  if (memoryLocked.value) return;
  const card = memoryCards.value.find((c) => c.id === id);
  if (!card || card.flipped || card.matched) return;

  card.flipped = true;
  flippedCards.value.push(id);

  if (flippedCards.value.length === 2) {
    memoryMoves.value++;
    memoryLocked.value = true;
    const [a, b] = flippedCards.value;
    const ca = memoryCards.value.find((c) => c.id === a)!;
    const cb = memoryCards.value.find((c) => c.id === b)!;
    if (ca.emoji === cb.emoji) {
      ca.matched = true;
      cb.matched = true;
      flippedCards.value = [];
      memoryLocked.value = false;
    } else {
      setTimeout(() => {
        ca.flipped = false;
        cb.flipped = false;
        flippedCards.value = [];
        memoryLocked.value = false;
      }, 800);
    }
  }
}

const memoryWon = computed(() => memoryCards.value.length > 0 && memoryCards.value.every((c) => c.matched));

const newStickerToast = ref<{ show: boolean; sticker: any }>({ show: false, sticker: null });

watch(
  () => gameState.bubblesPopped,
  (newVal) => {
    if (newVal >= gameState.bubblesThreshold && currentGame.value === 'bubbles') {
      const sticker = checkGameStickerReward('bubbles');
      if (sticker) showStickerToast(sticker);
    }
  }
);

watch(
  () => gameState.starsCollected,
  (newVal) => {
    if (newVal >= gameState.starsThreshold && currentGame.value === 'stars') {
      const sticker = checkGameStickerReward('stars');
      if (sticker) showStickerToast(sticker);
    }
  }
);

watch(memoryWon, (won) => {
  if (won) {
    gameState.memoryCompleted = true;
    const sticker = checkGameStickerReward('memory');
    if (sticker) showStickerToast(sticker);
  }
});

function showStickerToast(sticker: any) {
  newStickerToast.value = { show: true, sticker };
  setTimeout(() => {
    newStickerToast.value.show = false;
  }, 3000);
}

function tryCatchStar() {
  gameState.starsCollected++;
}

function switchGame(g: GameMode) {
  stopBubbles();
  stopStars();
  currentGame.value = g;
  if (g === 'bubbles') startBubbles();
  if (g === 'stars') startStars();
  if (g === 'memory') initMemory();
}

const gameArea = ref<HTMLElement | null>(null);

function handleBasketMove(e: MouseEvent | TouchEvent) {
  if (!gameArea.value) return;
  moveBasket(e, gameArea.value.getBoundingClientRect());
}

onMounted(() => {
  startBubbles();
});

onUnmounted(() => {
  stopBubbles();
  stopStars();
});
</script>

<template>
  <div class="game-section anim-slide-up" style="animation-delay: 0.18s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">🎮</span>
        <h2 class="section-title">安抚小游戏</h2>
        <span class="subtitle">轻松一下吧！</span>
      </div>
      <div class="score-chips">
        <span class="score-chip bubble-chip">
          <span class="chip-icon">🫧</span> {{ gameState.bubblesPopped }}/{{ gameState.bubblesThreshold }}
          <span v-if="gameState.bubblesPopped >= gameState.bubblesThreshold" class="chip-badge">✓</span>
        </span>
        <span class="score-chip star-chip">
          <span class="chip-icon">⭐</span> {{ gameState.starsCollected }}/{{ gameState.starsThreshold }}
          <span v-if="gameState.starsCollected >= gameState.starsThreshold" class="chip-badge">✓</span>
        </span>
      </div>
    </div>

    <div class="game-tabs">
      <button
        v-for="g in games"
        :key="g.id"
        class="game-tab"
        :class="{ active: currentGame === g.id }"
        @click="switchGame(g.id)"
      >
        <span class="tab-icon">{{ g.icon }}</span>
        <span class="tab-name">{{ g.name }}</span>
      </button>
    </div>

    <div class="game-area-wrap">
      <!-- 戳泡泡 -->
      <div v-show="currentGame === 'bubbles'" class="game-area bubble-area scrollbar-thin">
        <div class="area-bg"></div>
        <div
          v-for="b in bubbles"
          :key="b.id"
          class="bubble"
          :class="{ popped: b.popped }"
          :style="{
            left: b.x + '%',
            top: b.y + '%',
            width: b.size + 'px',
            height: b.size + 'px',
            background: b.color,
          }"
          @click="popBubble(b.id)"
        >
          <span class="bubble-emoji">{{ b.emoji }}</span>
          <div class="bubble-shine"></div>
        </div>
        <div v-if="bubbles.length === 0" class="empty-hint">
          戳戳泡泡，赶走紧张 💗
        </div>
      </div>

      <!-- 接星星 -->
      <div
        v-show="currentGame === 'stars'"
        ref="gameArea"
        class="game-area star-area"
        @mousemove="handleBasketMove"
        @touchmove.prevent="handleBasketMove"
        @click="tryCatch"
      >
        <div class="star-bg"></div>
        <div
          v-for="s in stars"
          :key="s.id"
          class="falling-star"
          :style="{ left: s.x + '%', animationDelay: s.delay + 's' }"
        >
          <span class="star-emoji">⭐</span>
        </div>
        <div
          class="basket"
          :class="{ catching }"
          :style="{ left: basketX + '%' }"
        >
          <span class="basket-emoji">🧺</span>
        </div>
        <div class="tip-text">滑动移动篮子，点击接星星</div>
      </div>

      <!-- 记忆翻牌 -->
      <div v-show="currentGame === 'memory'" class="game-area memory-area">
        <div class="memory-stats">
          <span>步数：{{ memoryMoves }}</span>
          <button class="reset-btn" @click="initMemory">🔄 重新开始</button>
        </div>
        <div class="memory-grid">
          <div
            v-for="card in memoryCards"
            :key="card.id"
            class="mem-card"
            :class="{ flipped: card.flipped, matched: card.matched }"
            @click="flipCard(card.id)"
          >
            <div class="mem-inner">
              <div class="mem-front">
                <span class="mem-question">?</span>
              </div>
              <div class="mem-back">
                <span class="mem-emoji">{{ card.emoji }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="memoryWon" class="won-banner anim-pop-in">
          🎉 太棒了！全部配对成功！
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="newStickerToast.show" class="new-sticker-toast">
        <div class="toast-icon">{{ newStickerToast.sticker?.icon }}</div>
        <div class="toast-content">
          <div class="toast-title">🎉 获得新贴纸！</div>
          <div class="toast-name">{{ newStickerToast.sticker?.name }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.section-icon {
  font-size: 24px;
}

.section-title {
  font-size: 20px;
}

.subtitle {
  font-size: 13px;
  color: var(--c-purple);
  background: var(--c-purple-soft);
  padding: 4px 12px;
  border-radius: 20px;
}

.score-chips {
  display: flex;
  gap: 8px;
}

.score-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  position: relative;
}

.bubble-chip {
  background: var(--c-blue-soft);
  color: var(--c-blue);
}

.star-chip {
  background: var(--c-accent-soft);
  color: #B8860B;
}

.chip-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: var(--c-success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
  animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.game-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 4px;
  background: #FAFAFC;
  border-radius: var(--radius-md);
}

.game-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-soft);
  transition: all 0.3s ease;
}

.game-tab:hover {
  background: white;
  color: var(--c-text);
}

.game-tab.active {
  background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

.game-area-wrap {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.game-area {
  position: relative;
  height: 360px;
  overflow: hidden;
}

.bubble-area {
  background: linear-gradient(180deg, #DBEAFE 0%, #E0E7FF 50%, #FCE7F3 100%);
}

.area-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.4) 0%, transparent 40%);
  pointer-events: none;
}

.bubble {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: inset -6px -6px 16px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.bubble:hover {
  transform: translate(-50%, -50%) scale(1.08);
}

.bubble.popped {
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 0;
}

.bubble-emoji {
  font-size: 1.4em;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.bubble-shine {
  position: absolute;
  top: 15%;
  left: 20%;
  width: 30%;
  height: 25%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  filter: blur(2px);
}

.empty-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  font-size: 14px;
}

.star-area {
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%);
  cursor: none;
}

.star-bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 60px 80px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1.5px 1.5px at 120px 40px, white, transparent),
    radial-gradient(1px 1px at 200px 100px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 300px 60px, white, transparent);
  background-size: 350px 150px;
  opacity: 0.6;
  pointer-events: none;
}

.falling-star {
  position: absolute;
  top: -40px;
  transform: translateX(-50%);
  animation: fallStar 4s ease-in forwards;
}

.star-emoji {
  font-size: 36px;
  filter: drop-shadow(0 0 12px rgba(255, 200, 87, 0.8));
}

@keyframes fallStar {
  0% { top: -40px; transform: translateX(-50%) rotate(0deg); }
  100% { top: 100%; transform: translateX(-50%) rotate(360deg); }
}

.basket {
  position: absolute;
  bottom: 16px;
  transform: translateX(-50%);
  transition: left 0.12s ease-out;
}

.basket.catching {
  transform: translateX(-50%) scale(1.2);
}

.basket-emoji {
  font-size: 44px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.tip-text {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.memory-area {
  background: linear-gradient(135deg, #F5F3FF 0%, #FDF4FF 100%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: auto;
  min-height: 360px;
}

.memory-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-purple);
}

.reset-btn {
  padding: 6px 14px;
  background: white;
  border-radius: 14px;
  font-size: 12px;
  color: var(--c-text-soft);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--c-purple-soft);
  color: var(--c-purple);
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex: 1;
}

.mem-card {
  aspect-ratio: 1;
  perspective: 800px;
  cursor: pointer;
}

.mem-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.mem-card.flipped .mem-inner {
  transform: rotateY(180deg);
}

.mem-card.matched .mem-inner {
  transform: rotateY(180deg) scale(0.92);
}

.mem-front, .mem-back {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}

.mem-front {
  background: linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
}

.mem-question {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.mem-back {
  background: white;
  transform: rotateY(180deg);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
  border: 2px solid var(--c-purple-soft);
}

.mem-emoji {
  font-size: 32px;
}

.won-banner {
  text-align: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #FFC857 0%, #FF9F43 100%);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 6px 16px rgba(255, 200, 87, 0.4);
}

@keyframes anim-pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .game-section { padding: 18px 16px; }
  .game-area { height: 280px; }
  .memory-grid { gap: 6px; }
  .mem-question, .mem-emoji { font-size: 24px; }
  .tab-name { display: none; }
  .game-tab { padding: 10px; }
}

.new-sticker-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FFC857 0%, #FF9F43 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 32px rgba(255, 200, 87, 0.4);
  z-index: 1000;
}

.toast-icon {
  font-size: 40px;
  animation: bounce-soft 0.6s ease-in-out infinite;
}

@keyframes bounce-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.toast-content {
  color: white;
}

.toast-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.toast-name {
  font-size: 14px;
  font-weight: 500;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
