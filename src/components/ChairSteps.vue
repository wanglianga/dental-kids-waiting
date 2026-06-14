<script setup lang="ts">
import { chairSteps, setActiveStep, resetStep, currentRole } from '../store';
import { computed } from 'vue';

const activeIndex = computed(() => chairSteps.findIndex((s) => s.active));

function handleStepClick(id: string) {
  if (currentRole.value !== 'parent') {
    setActiveStep(id);
  }
}
</script>

<template>
  <div class="steps-section anim-slide-up" style="animation-delay: 0.15s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">🪑</span>
        <h2 class="section-title">牙椅小冒险</h2>
        <span class="subtitle">和小牙齿一起闯关吧！</span>
      </div>
      <button
        v-if="currentRole !== 'parent'"
        class="reset-btn"
        @click="resetStep"
      >
        🔄 重置步骤
      </button>
    </div>

    <div class="steps-timeline">
      <div class="steps-line">
        <div
          class="steps-fill"
          :style="{ width: chairSteps.length > 1 ? `${(activeIndex / (chairSteps.length - 1)) * 100}%` : '0%' }"
        ></div>
      </div>

      <div class="steps-nodes">
        <div
          v-for="step in chairSteps"
          :key="step.id"
          class="step-node"
          :class="{
            done: step.completed,
            active: step.active,
          }"
        >
          <button
            class="node-btn"
            :disabled="currentRole === 'parent'"
            @click="handleStepClick(step.id)"
          >
            <span v-if="step.completed" class="node-check">✓</span>
            <span v-else class="node-num">{{ step.step }}</span>
            <span v-if="step.active" class="node-pulse"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="steps-cards">
      <div
        v-for="(step, idx) in chairSteps"
        :key="step.id"
        class="step-card"
        :class="{
          done: step.completed && !step.active,
          active: step.active,
          pending: !step.completed && !step.active,
        }"
        :style="{ animationDelay: `${0.15 + idx * 0.05}s` }"
        @click="handleStepClick(step.id)"
      >
        <div class="card-step-num">第 {{ step.step }} 关</div>
        <div class="card-icon">
          <span class="card-emoji">{{ step.icon }}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ step.title }}</h3>
          <p class="card-desc">{{ step.description }}</p>
        </div>
        <div class="card-status">
          <span v-if="step.active" class="status-tag status-active">进行中</span>
          <span v-else-if="step.completed" class="status-tag status-done">已完成</span>
          <span v-else class="status-tag status-pending">待挑战</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.steps-section {
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
  color: var(--c-primary);
  background: var(--c-primary-soft);
  padding: 4px 12px;
  border-radius: 20px;
}

.reset-btn {
  padding: 8px 16px;
  background: var(--c-blue-soft);
  color: var(--c-blue);
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--c-blue);
  color: white;
}

.steps-timeline {
  position: relative;
  padding: 0 8px 16px;
  margin-bottom: 24px;
}

.steps-line {
  position: absolute;
  left: 28px;
  right: 28px;
  top: 20px;
  height: 4px;
  background: #F0ECE8;
  border-radius: 4px;
  overflow: hidden;
}

.steps-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7B6B 0%, #FFC857 100%);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.steps-nodes {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 3px solid #F0ECE8;
  font-weight: 700;
  color: var(--c-text-muted);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.step-node.done .node-btn {
  background: var(--c-secondary);
  border-color: var(--c-secondary);
  color: white;
}

.step-node.active .node-btn {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  border-color: var(--c-primary);
  color: white;
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(255, 123, 107, 0.35);
}

.node-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 3px solid var(--c-primary);
  opacity: 0;
  animation: nodePulse 1.8s ease-out infinite;
}

@keyframes nodePulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}

.steps-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.step-card {
  position: relative;
  padding: 16px;
  background: #FAFAFC;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: cardIn 0.5s ease-out both;
  cursor: default;
  overflow: hidden;
}

.step-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 200, 87, 0.08), rgba(255, 123, 107, 0.08));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.step-card.active {
  background: linear-gradient(135deg, #FFF5EE 0%, #FFFFFF 100%);
  border-color: var(--c-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(255, 123, 107, 0.18);
}

.step-card.active::after {
  opacity: 1;
}

.step-card.done {
  background: linear-gradient(135deg, #F0FBF6 0%, #FFFFFF 100%);
  border-color: var(--c-secondary-soft);
  opacity: 0.85;
}

.step-card.pending {
  opacity: 0.7;
}

.step-card:not(.pending):hover {
  transform: translateY(-2px);
}

.card-step-num {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-purple);
  background: var(--c-purple-soft);
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.step-card.done .card-step-num {
  background: var(--c-secondary-soft);
  color: var(--c-secondary);
}

.step-card.active .card-step-num {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.step-card.done .card-icon {
  background: linear-gradient(135deg, #D5F0E7 0%, #C8E6DA 100%);
}

.step-card.active .card-icon {
  background: linear-gradient(135deg, #FFE5E0 0%, #FFD4CC 100%);
  animation: bounce-soft 2s ease-in-out infinite;
}

.card-emoji {
  font-size: 26px;
}

.card-body {
  margin-bottom: 10px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 12px;
  color: var(--c-text-soft);
  line-height: 1.5;
}

.card-status {
  position: relative;
  z-index: 1;
}

.status-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.status-active {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(255, 123, 107, 0.25);
}

.status-done {
  background: var(--c-secondary-soft);
  color: var(--c-secondary);
}

.status-pending {
  background: #F0ECE8;
  color: var(--c-text-muted);
}

@keyframes cardIn {
  0% { transform: translateY(16px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes bounce-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@media (max-width: 1024px) {
  .steps-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .steps-section { padding: 18px 16px; }
  .steps-cards { grid-template-columns: 1fr; }
}
</style>
