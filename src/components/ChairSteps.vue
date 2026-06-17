<script setup lang="ts">
import { chairSteps, setActiveStep, resetStep, currentRole } from '../store';
import { computed, ref } from 'vue';

const activeIndex = computed(() => chairSteps.findIndex((s) => s.active));
const expandedPrecautions = ref<string | null>(null);
const transitioning = ref(false);
const lastActiveIndex = ref(0);

function handleStepClick(id: string) {
  if (currentRole.value !== 'parent') {
    const newIdx = chairSteps.findIndex((s) => s.id === id);
    if (newIdx !== activeIndex.value) {
      transitioning.value = true;
      lastActiveIndex.value = activeIndex.value;
      setTimeout(() => {
        setActiveStep(id);
        setTimeout(() => {
          transitioning.value = false;
        }, 300);
      }, 300);
    }
  }
}

function togglePrecautions(id: string) {
  expandedPrecautions.value = expandedPrecautions.value === id ? null : id;
}

function getAnimationKey(stepId: string) {
  return `${stepId}-${Date.now()}`;
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

    <div class="active-step-panel" :class="{ transitioning }">
      <div
        v-for="step in chairSteps"
        v-show="step.active"
        :key="getAnimationKey(step.id)"
        class="active-step-content"
        :class="`anim-${step.animationType}`"
      >
        <div class="step-hero">
          <div class="hero-animation">
            <div v-if="step.animationType === 'sit'" class="anim-sit-container">
              <div class="anim-chair">🪑</div>
              <div class="anim-child">🧒</div>
            </div>
            <div v-else-if="step.animationType === 'bib'" class="anim-bib-container">
              <div class="anim-bib-float">🎽</div>
              <div class="anim-child-static">🧒</div>
            </div>
            <div v-else-if="step.animationType === 'xray'" class="anim-xray-container">
              <div class="xray-machine">📷</div>
              <div class="xray-tooth">🦷</div>
              <div class="xray-flash"></div>
            </div>
            <div v-else-if="step.animationType === 'mirror'" class="anim-mirror-container">
              <div class="anim-mouth">👄</div>
              <div class="anim-mirror">🪞</div>
            </div>
            <div v-else-if="step.animationType === 'brush'" class="anim-brush-container">
              <div class="anim-tooth-brush">🦷</div>
              <div class="anim-brush-tool">🪥</div>
              <div class="anim-sparkles">✨</div>
            </div>
            <div v-else-if="step.animationType === 'rinse'" class="anim-rinse-container">
              <div class="anim-cup">🥛</div>
              <div class="anim-water">💧</div>
              <div class="anim-bubbles-rinse">🫧</div>
            </div>
            <div v-else-if="step.animationType === 'fluoride'" class="anim-fluoride-container">
              <div class="anim-shield">🛡️</div>
              <div class="anim-tooth-fluoride">🦷</div>
              <div class="anim-sparkles-fluoride">✨</div>
            </div>
            <div v-else class="anim-default-container">
              <span class="hero-emoji">{{ step.icon }}</span>
            </div>
          </div>

          <div class="hero-info">
            <div class="hero-step-badge">第 {{ step.step }} 关 · 约 {{ step.estimatedDuration }} 分钟</div>
            <h3 class="hero-title">{{ step.title }}</h3>

            <div v-if="currentRole === 'parent'" class="hero-desc-parent">
              {{ step.description }}
            </div>
            <div v-else class="hero-desc-child">
              <div class="child-bubble">
                <span class="bubble-icon">💬</span>
                <p class="child-text">{{ step.childDescription }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentRole === 'parent'" class="precautions-section">
          <button
            class="precautions-toggle"
            :class="{ expanded: expandedPrecautions === step.id }"
            @click="togglePrecautions(step.id)"
          >
            <span class="toggle-icon">📋</span>
            <span class="toggle-text">查看家长注意事项</span>
            <span class="toggle-arrow">{{ expandedPrecautions === step.id ? '−' : '+' }}</span>
          </button>

          <div
            class="precautions-content"
            :class="{ expanded: expandedPrecautions === step.id }"
          >
            <div class="precautions-list">
              <div
                v-for="(tip, idx) in step.precautions.parent"
                :key="idx"
                class="precaution-item"
              >
                <span class="precaution-bullet">•</span>
                <span class="precaution-text">{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentRole !== 'parent'" class="child-prompt-box">
          <div class="prompt-icon">💡</div>
          <p class="prompt-text">{{ step.precautions.child }}</p>
        </div>

        <div class="step-nav-buttons" v-if="currentRole !== 'parent'">
          <button
            class="nav-btn prev-btn"
            :disabled="activeIndex === 0"
            @click="handleStepClick(chairSteps[activeIndex - 1]?.id)"
          >
            ← 上一步
          </button>
          <button
            class="nav-btn next-btn"
            :disabled="activeIndex === chairSteps.length - 1"
            @click="handleStepClick(chairSteps[activeIndex + 1]?.id)"
          >
            下一步 →
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
          <p class="card-desc" v-if="currentRole === 'parent'">{{ step.description }}</p>
          <p class="card-desc child-desc" v-else>{{ step.childDescription }}</p>
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

.active-step-panel {
  position: relative;
  margin-bottom: 24px;
  min-height: 200px;
  overflow: hidden;
}

.active-step-panel.transitioning .active-step-content {
  opacity: 0;
  transform: translateX(20px);
}

.active-step-content {
  position: relative;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFFFFF 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--c-primary);
  padding: 20px;
  animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
}

.step-hero {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.hero-animation {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.hero-emoji {
  font-size: 64px;
  animation: bounce-soft 2s ease-in-out infinite;
}

@keyframes bounce-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.anim-sit-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anim-chair {
  font-size: 56px;
  animation: chairSit 3s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes chairSit {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-8deg); }
}

.anim-child {
  position: absolute;
  font-size: 36px;
  bottom: 20px;
  animation: childSit 3s ease-in-out infinite;
}

@keyframes childSit {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.anim-bib-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anim-bib-float {
  position: absolute;
  font-size: 40px;
  top: 15px;
  animation: bibFloat 2.5s ease-in-out infinite;
}

@keyframes bibFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(10px) rotate(5deg); }
}

.anim-child-static {
  font-size: 48px;
  margin-top: 30px;
}

.anim-xray-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xray-machine {
  position: absolute;
  top: 15px;
  font-size: 36px;
  animation: xrayMove 3s ease-in-out infinite;
}

@keyframes xrayMove {
  0%, 100% { transform: translateX(-20px); }
  50% { transform: translateX(20px); }
}

.xray-tooth {
  font-size: 48px;
  margin-top: 20px;
  animation: toothGlow 3s ease-in-out infinite;
}

@keyframes toothGlow {
  0%, 100% { filter: brightness(1); }
  45%, 55% { filter: brightness(1.5) drop-shadow(0 0 10px #60A5FA); }
}

.xray-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  opacity: 0;
  animation: xrayFlash 3s ease-in-out infinite;
}

@keyframes xrayFlash {
  0%, 40%, 60%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.anim-mirror-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.anim-mouth {
  font-size: 48px;
  animation: mouthOpen 2s ease-in-out infinite;
}

@keyframes mouthOpen {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.3); }
}

.anim-mirror {
  font-size: 40px;
  animation: mirrorMove 2s ease-in-out infinite;
}

@keyframes mirrorMove {
  0%, 100% { transform: rotate(-15deg) translateX(0); }
  50% { transform: rotate(15deg) translateX(10px); }
}

.anim-brush-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anim-tooth-brush {
  font-size: 48px;
  animation: toothShine 2s ease-in-out infinite;
}

@keyframes toothShine {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

.anim-brush-tool {
  position: absolute;
  font-size: 36px;
  right: 25px;
  animation: brushMove 0.8s ease-in-out infinite;
}

@keyframes brushMove {
  0%, 100% { transform: translateX(0) rotate(-20deg); }
  50% { transform: translateX(-15px) rotate(20deg); }
}

.anim-sparkles {
  position: absolute;
  font-size: 24px;
  top: 25px;
  left: 25px;
  animation: sparkleAppear 2s ease-in-out infinite;
}

@keyframes sparkleAppear {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}

.anim-rinse-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anim-cup {
  font-size: 48px;
  animation: cupTilt 2s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes cupTilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-20deg); }
}

.anim-water {
  position: absolute;
  font-size: 28px;
  top: 35px;
  left: 35px;
  animation: waterDrop 2s ease-in-out infinite;
}

@keyframes waterDrop {
  0%, 30%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(0); }
  80% { opacity: 0; transform: translateY(30px); }
}

.anim-bubbles-rinse {
  position: absolute;
  font-size: 24px;
  bottom: 20px;
  right: 30px;
  animation: bubblesRise 2s ease-in-out infinite;
}

@keyframes bubblesRise {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-15px); }
}

.anim-fluoride-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anim-shield {
  position: absolute;
  font-size: 64px;
  animation: shieldRotate 4s linear infinite;
  opacity: 0.4;
}

@keyframes shieldRotate {
  0% { transform: rotate(0deg) scale(0.8); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(0.8); }
}

.anim-tooth-fluoride {
  font-size: 48px;
  position: relative;
  z-index: 1;
  animation: toothProtected 2s ease-in-out infinite;
}

@keyframes toothProtected {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50% { filter: drop-shadow(0 0 15px #6BC5A8); }
}

.anim-sparkles-fluoride {
  position: absolute;
  font-size: 28px;
  animation: sparkleCircle 3s linear infinite;
}

@keyframes sparkleCircle {
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); opacity: 0; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); opacity: 0; }
}

.hero-info {
  flex: 1;
  min-width: 200px;
}

.hero-step-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-purple);
  background: var(--c-purple-soft);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 10px;
}

.hero-desc-parent {
  font-size: 14px;
  line-height: 1.7;
  color: var(--c-text-soft);
}

.child-bubble {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  border-radius: var(--radius-md);
  border: 2px dashed var(--c-accent);
}

.bubble-icon {
  font-size: 24px;
  flex-shrink: 0;
  animation: wiggle 1s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.child-text {
  font-size: 15px;
  font-weight: 500;
  color: #92400E;
  line-height: 1.6;
}

.precautions-section {
  margin-top: 16px;
}

.precautions-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--c-blue-soft);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  text-align: left;
}

.precautions-toggle:hover {
  background: #DBEAFE;
}

.precautions-toggle.expanded {
  background: var(--c-blue-soft);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.toggle-icon {
  font-size: 20px;
}

.toggle-text {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-blue);
}

.toggle-arrow {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--c-blue);
}

.precautions-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
  background: #EFF6FF;
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.precautions-content.expanded {
  max-height: 300px;
}

.precautions-list {
  padding: 16px;
}

.precaution-item {
  display: flex;
  gap: 10px;
  padding: 6px 0;
}

.precaution-bullet {
  color: var(--c-blue);
  font-weight: 700;
  flex-shrink: 0;
}

.precaution-text {
  font-size: 13px;
  color: var(--c-text-soft);
  line-height: 1.6;
}

.child-prompt-box {
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--c-accent-soft);
}

.prompt-icon {
  font-size: 28px;
  animation: bounce-soft 2s ease-in-out infinite;
  flex-shrink: 0;
}

.prompt-text {
  font-size: 15px;
  font-weight: 500;
  color: #92400E;
  line-height: 1.7;
}

.step-nav-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.nav-btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prev-btn {
  background: #F0ECE8;
  color: var(--c-text-muted);
}

.prev-btn:not(:disabled):hover {
  background: #E5E0DB;
}

.next-btn {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 123, 107, 0.3);
}

.next-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 123, 107, 0.4);
}

.steps-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.child-desc {
  color: #92400E;
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

@media (max-width: 1024px) {
  .steps-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .steps-section { padding: 18px 16px; }
  .step-hero { flex-direction: column; }
  .hero-animation { width: 100%; height: 120px; }
  .steps-cards { grid-template-columns: 1fr; }
}
</style>
