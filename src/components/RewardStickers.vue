<script setup lang="ts">
import { rewardStickers, earnSticker, currentRole } from '../store';
import { computed } from 'vue';

const earnedCount = computed(() => rewardStickers.filter((s) => s.earned).length);
const progressPercent = computed(() => Math.round((earnedCount.value / rewardStickers.length) * 100));

function handleClick(id: string) {
  if (currentRole.value !== 'parent') {
    earnSticker(id);
  }
}
</script>

<template>
  <div class="reward-section anim-slide-up" style="animation-delay: 0.2s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">🎖️</span>
        <h2 class="section-title">奖励贴纸墙</h2>
      </div>
      <div class="reward-progress">
        <div class="prog-text">{{ earnedCount }}/{{ rewardStickers.length }} 枚</div>
        <div class="prog-bar">
          <div class="prog-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="sticker-board">
      <div class="board-bg">
        <div class="sparkle s1">✨</div>
        <div class="sparkle s2">⭐</div>
        <div class="sparkle s3">💫</div>
        <div class="sparkle s4">🌟</div>
      </div>

      <div class="sticker-grid">
        <div
          v-for="(sticker, idx) in rewardStickers"
          :key="sticker.id"
          class="sticker-card"
          :class="{ earned: sticker.earned, locked: !sticker.earned }"
          :style="{ animationDelay: `${0.2 + idx * 0.08}s` }"
          @click="handleClick(sticker.id)"
        >
          <div v-if="sticker.earned" class="sticker-glow"></div>
          <div class="sticker-icon-wrap">
            <span class="sticker-icon" :class="{ 'anim-wiggle': sticker.earned }">{{ sticker.icon }}</span>
          </div>
          <div class="sticker-name">{{ sticker.name }}</div>
          <div class="sticker-condition">{{ sticker.condition }}</div>
          <div v-if="sticker.earned" class="earned-badge">已获得</div>
          <div v-else class="lock-hint">🔒 待解锁</div>
        </div>
      </div>
    </div>

    <div v-if="currentRole !== 'parent'" class="role-hint">
      💡 医生/护士可点击贴纸手动奖励小朋友
    </div>
  </div>
</template>

<style scoped>
.reward-section {
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
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 24px;
}

.section-title {
  font-size: 20px;
}

.reward-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prog-text {
  font-weight: 600;
  font-size: 14px;
  color: var(--c-accent);
  background: var(--c-accent-soft);
  padding: 6px 14px;
  border-radius: 20px;
}

.prog-bar {
  width: 100px;
  height: 8px;
  background: #F0ECE8;
  border-radius: 8px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFC857 0%, #FF9F43 100%);
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sticker-board {
  position: relative;
  border-radius: var(--radius-md);
  padding: 24px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 100%);
  overflow: hidden;
}

.board-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 20px;
  opacity: 0.35;
  animation: sparkle-float 4s ease-in-out infinite;
}

.s1 { top: 10%; left: 5%; animation-delay: 0s; }
.s2 { top: 20%; right: 8%; animation-delay: 1s; }
.s3 { bottom: 15%; left: 10%; animation-delay: 2s; }
.s4 { bottom: 10%; right: 5%; animation-delay: 0.5s; }

@keyframes sparkle-float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-10px) rotate(15deg); opacity: 0.5; }
}

.sticker-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.sticker-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 10px;
  background: white;
  border-radius: var(--radius-md);
  border: 2px dashed var(--c-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: stickerIn 0.6s ease-out both;
  cursor: default;
}

.sticker-card.locked {
  filter: grayscale(0.6);
  opacity: 0.65;
}

.sticker-card.earned {
  border: 2px solid var(--c-accent);
  background: linear-gradient(135deg, #FFFCF5 0%, #FFFFFF 100%);
  transform: translateY(-2px);
}

.sticker-card.earned:hover {
  transform: translateY(-4px) rotate(-2deg);
  box-shadow: 0 12px 24px rgba(255, 200, 87, 0.25);
}

.sticker-glow {
  position: absolute;
  inset: -3px;
  border-radius: calc(var(--radius-md) + 3px);
  background: linear-gradient(135deg, rgba(255, 200, 87, 0.4), rgba(255, 159, 67, 0.3));
  z-index: 0;
  opacity: 0.6;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.75; }
}

.sticker-icon-wrap {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker-card.earned .sticker-icon-wrap {
  background: linear-gradient(135deg, #FFE88A 0%, #FFC857 100%);
}

.sticker-icon {
  font-size: 32px;
}

.sticker-name {
  position: relative;
  z-index: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text);
  text-align: center;
}

.sticker-condition {
  position: relative;
  z-index: 1;
  font-size: 11px;
  color: var(--c-text-muted);
  text-align: center;
  line-height: 1.4;
}

.earned-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 2;
  padding: 3px 10px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.35);
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lock-hint {
  font-size: 11px;
  color: var(--c-text-muted);
}

@keyframes stickerIn {
  0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.05) rotate(2deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.role-hint {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--c-text-muted);
}

@media (max-width: 1024px) {
  .sticker-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .reward-section { padding: 18px 16px; }
  .sticker-board { padding: 16px; }
  .sticker-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
