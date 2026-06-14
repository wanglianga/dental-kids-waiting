<script setup lang="ts">
import { checkItems, toggleCheckItem, currentRole } from '../store';
import { computed } from 'vue';

const colorMap: Record<string, { bg: string; soft: string; text: string }> = {
  primary: { bg: '#FF7B6B', soft: '#FFE5E0', text: '#FF7B6B' },
  secondary: { bg: '#6BC5A8', soft: '#D5F0E7', text: '#3D9970' },
  accent: { bg: '#FFC857', soft: '#FFF3D6', text: '#B8860B' },
  purple: { bg: '#A78BFA', soft: '#EDE9FE', text: '#7C3AED' },
};

const totalDuration = computed(() => checkItems.reduce((s, c) => s + c.duration, 0));
const completedCount = computed(() => checkItems.filter((c) => c.completed).length);
</script>

<template>
  <div class="check-section anim-slide-up" style="animation-delay: 0.1s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">✅</span>
        <h2 class="section-title">今日检查项目</h2>
      </div>
      <div class="summary">
        <span class="sum-count">{{ completedCount }}/{{ checkItems.length }}</span>
        <span class="sum-time">共约 {{ totalDuration }} 分钟</span>
      </div>
    </div>

    <div class="check-grid">
      <div
        v-for="(item, idx) in checkItems"
        :key="item.id"
        class="check-card"
        :class="{ completed: item.completed }"
        :style="{ animationDelay: `${0.1 + idx * 0.05}s` }"
        @click="currentRole !== 'parent' && toggleCheckItem(item.id)"
      >
        <div
          class="check-icon"
          :style="{ background: colorMap[item.color].soft, color: colorMap[item.color].text }"
        >
          <span class="icon-emoji">{{ item.icon }}</span>
        </div>
        <div class="check-body">
          <div class="check-name-row">
            <h3 class="check-name">{{ item.name }}</h3>
            <span class="check-time">{{ item.duration }}分钟</span>
          </div>
          <p class="check-desc">{{ item.description }}</p>
        </div>
        <div
          class="check-mark"
          :class="{ on: item.completed }"
          :style="item.completed ? { background: colorMap[item.color].bg } : {}"
        >
          <span v-if="item.completed" class="mark-check">✓</span>
          <span v-else class="mark-ring"></span>
        </div>
        <div v-if="currentRole !== 'parent'" class="tap-hint">点击切换</div>
      </div>
    </div>

    <div class="tip-bar">
      <span class="tip-icon">💡</span>
      <span>每完成一项都可以获得一枚奖励贴纸哦，勇敢的小朋友最棒了！</span>
    </div>
  </div>
</template>

<style scoped>
.check-section {
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

.summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sum-count {
  padding: 6px 14px;
  background: var(--c-secondary-soft);
  color: var(--c-secondary);
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
}

.sum-time {
  font-size: 13px;
  color: var(--c-text-muted);
}

.check-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.check-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #FAFAFC;
  border-radius: var(--radius-md);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
  animation: slide-up 0.5s ease-out both;
  border: 2px solid transparent;
  overflow: hidden;
}

.check-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(107, 197, 168, 0.2), transparent);
  transition: width 0.5s ease;
}

.check-card.completed::before {
  width: 50%;
}

.check-card.completed {
  background: linear-gradient(135deg, #F0FBF6 0%, #FFFFFF 100%);
  border-color: var(--c-secondary-soft);
}

.check-card:not(.completed):hover {
  transform: translateX(4px);
  background: #FFF5EE;
  border-color: var(--c-primary-soft);
}

.check-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.check-card:hover .check-icon {
  transform: scale(1.1) rotate(-5deg);
}

.icon-emoji {
  font-size: 26px;
}

.check-body {
  flex: 1;
  min-width: 0;
}

.check-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.check-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}

.check-card.completed .check-name {
  text-decoration: line-through;
  text-decoration-color: var(--c-secondary);
  color: var(--c-text-soft);
}

.check-time {
  font-size: 12px;
  color: var(--c-text-muted);
  background: white;
  padding: 3px 10px;
  border-radius: 20px;
}

.check-desc {
  font-size: 13px;
  color: var(--c-text-soft);
  line-height: 1.5;
}

.check-mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: white;
  border: 2px solid var(--c-border);
}

.check-mark.on {
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mark-check {
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.mark-ring {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--c-border);
}

.tap-hint {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  color: var(--c-text-muted);
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 10px;
}

.tip-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #7C5D1F;
}

.tip-icon {
  font-size: 18px;
}

@keyframes slide-up {
  0% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes pop-in {
  0% { transform: scale(0.5); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@media (max-width: 640px) {
  .check-section { padding: 18px 16px; }
  .check-card { padding: 14px; gap: 12px; }
  .check-icon { width: 44px; height: 44px; border-radius: 14px; }
  .icon-emoji { font-size: 22px; }
}
</style>
