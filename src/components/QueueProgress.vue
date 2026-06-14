<script setup lang="ts">
import { computed } from 'vue';
import { queueList, childInfo, getAheadCount } from '../store';
import type { QueueItem } from '../types';

const myIndex = computed(() => queueList.findIndex((q) => q.number === childInfo.queueNumber));
const aheadCount = computed(() => getAheadCount());
const estimatedMinutes = computed(() => {
  const me = queueList[myIndex.value];
  return me?.estimatedTime ?? 30;
});

const statusDot: Record<QueueItem['status'], string> = {
  waiting: '#9B9BAA',
  called: '#FFC857',
  'in-treatment': '#6BC5A8',
  finished: '#A78BFA',
};

const statusLabel: Record<QueueItem['status'], string> = {
  waiting: '等待中',
  called: '已叫号',
  'in-treatment': '就诊中',
  finished: '完成',
};

const progressPercent = computed(() => {
  if (aheadCount.value === 0) return 100;
  const total = aheadCount.value + 1;
  return Math.round(((total - aheadCount.value) / total) * 100);
});
</script>

<template>
  <div class="queue-section anim-slide-up">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">📋</span>
        <h2 class="section-title">排队进度</h2>
      </div>
      <div class="est-badge" v-if="aheadCount > 0">
        <span class="est-icon">⏰</span>
        预计等待 <strong>{{ estimatedMinutes }}</strong> 分钟
      </div>
    </div>

    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }">
          <div class="progress-shine"></div>
        </div>
        <div class="progress-mascot" :style="{ left: `calc(${progressPercent}% - 20px)` }">
          <span class="mascot-icon anim-float">🦊</span>
        </div>
      </div>
      <div class="progress-info">
        <div class="info-item">
          <span class="info-num highlight">{{ aheadCount }}</span>
          <span class="info-label">前面还有</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-num">{{ myIndex + 1 }}</span>
          <span class="info-label">您的位置</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-num">{{ queueList.length }}</span>
          <span class="info-label">总候诊人数</span>
        </div>
      </div>
    </div>

    <div class="queue-list scrollbar-thin">
      <div
        v-for="(item, idx) in queueList"
        :key="item.number"
        class="queue-item"
        :class="{
          mine: item.number === childInfo.queueNumber,
          called: item.status === 'called',
          active: item.status === 'in-treatment',
        }"
      >
        <div class="item-rank">
          <span v-if="item.status === 'in-treatment'" class="rank-badge active-badge">👨‍⚕️</span>
          <span v-else-if="item.status === 'called'" class="rank-badge called-badge">🔔</span>
          <span v-else-if="item.status === 'finished'" class="rank-badge done-badge">✓</span>
          <span v-else class="rank-num">{{ idx + 1 }}</span>
        </div>
        <div class="item-content">
          <div class="item-main">
            <span class="item-number">{{ item.number }}</span>
            <span class="item-name">{{ item.name }}小朋友</span>
            <span class="item-status-dot" :style="{ background: statusDot[item.status] }"></span>
            <span class="item-status-label">{{ statusLabel[item.status] }}</span>
          </div>
          <div class="item-est" v-if="item.status === 'waiting' && item.estimatedTime">
            约 <strong>{{ item.estimatedTime }}</strong> 分钟后
          </div>
        </div>
        <div class="item-arrow" v-if="item.status === 'called'">
          <span class="arrow-pulse">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.queue-section {
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
  color: var(--c-text);
}

.est-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-accent-soft);
  color: #92661F;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.est-badge strong {
  color: #B8860B;
  font-weight: 700;
}

.progress-wrap {
  background: linear-gradient(135deg, #FFFAF5 0%, #FFF5EE 100%);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 20px;
}

.progress-bar {
  position: relative;
  height: 14px;
  background: #F0ECE8;
  border-radius: 14px;
  overflow: visible;
  margin-bottom: 28px;
}

.progress-fill {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #FF7B6B 0%, #FFC857 100%);
  border-radius: 14px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shine 2s linear infinite;
}

.progress-mascot {
  position: absolute;
  top: -22px;
  transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mascot-icon {
  display: inline-block;
  font-size: 28px;
  filter: drop-shadow(0 2px 8px rgba(255, 123, 107, 0.3));
}

.progress-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: var(--radius-sm);
}

.info-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--c-text);
}

.info-num.highlight {
  color: var(--c-primary);
}

.info-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.info-divider {
  display: none;
}

.queue-list {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #FAFAFC;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.queue-item:hover {
  background: #FFF5EE;
}

.queue-item.mine {
  background: linear-gradient(135deg, #FFE5E0 0%, #FFF3D6 100%);
  border-color: var(--c-primary);
}

.queue-item.called {
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5B4 100%);
  border-color: var(--c-accent);
  animation: pulse-ring 2s ease-out infinite;
}

.queue-item.active {
  background: linear-gradient(135deg, #D5F0E7 0%, #C8E6DA 100%);
  border-color: var(--c-secondary);
}

.item-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  color: var(--c-text-soft);
  font-weight: 600;
  font-size: 14px;
  box-shadow: var(--shadow-sm);
}

.rank-badge {
  font-size: 24px;
}

.item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item-number {
  padding: 4px 12px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.item-name {
  font-weight: 500;
  color: var(--c-text);
  font-size: 14px;
}

.item-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.item-status-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.item-est {
  font-size: 12px;
  color: var(--c-text-soft);
}

.item-est strong {
  color: var(--c-primary);
  font-weight: 600;
}

.item-arrow {
  font-size: 24px;
  color: var(--c-accent);
  font-weight: 700;
}

.arrow-pulse {
  display: inline-block;
  animation: slideArrow 1s ease-in-out infinite;
}

@keyframes slideArrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(8px); }
}

@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (max-width: 640px) {
  .queue-section {
    padding: 18px 16px;
  }
  .progress-wrap {
    padding: 16px;
  }
  .info-num {
    font-size: 22px;
  }
}
</style>
