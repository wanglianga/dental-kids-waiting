<script setup lang="ts">
import { doctors, currentRole, myLiveStatus, startTreatment, finishTreatment } from '../store';
import { ref, computed } from 'vue';

const doctor = doctors[0];
const showSpeak = ref(true);

const isTreating = computed(() => {
  return myLiveStatus.value === 'in-treatment';
});

function handleStartTreatment() {
  startTreatment();
}

function handleFinishTreatment() {
  finishTreatment();
}
</script>

<template>
  <div class="doctor-section anim-slide-up" style="animation-delay: 0.12s">
    <div class="doctor-card">
      <div class="doctor-wave">
        <svg viewBox="0 0 200 100" class="wave-svg" preserveAspectRatio="none">
          <path d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50 L200,100 L0,100 Z" fill="rgba(255, 229, 224, 0.5)" />
        </svg>
      </div>

      <div class="doctor-body">
        <div class="avatar-col">
          <div class="avatar-ring anim-pulse-ring">
            <div class="doctor-avatar anim-float-slow">
              <span class="avatar-emoji">{{ doctor.avatar }}</span>
              <div class="stethoscope">🩺</div>
            </div>
          </div>
          <div class="doctor-info">
            <h3 class="doctor-name">{{ doctor.name }}</h3>
            <p class="doctor-title">{{ doctor.title }}</p>
            <p class="doctor-specialty">{{ doctor.specialty }}</p>
          </div>
        </div>

        <div class="speak-col">
          <button class="speak-toggle" @click="showSpeak = !showSpeak">
            {{ showSpeak ? '收起' : '展开' }} 💬
          </button>
          <div v-if="showSpeak" class="speech-bubble anim-pop-in">
            <div class="bubble-tail"></div>
            <div class="bubble-header">
              <span class="bubble-emoji">👋</span>
              <span class="bubble-title">医生阿姨说：</span>
            </div>
            <p class="bubble-text">{{ doctor.greeting }}</p>
            <div class="bubble-tips">
              <span class="tip-chip">🎮 可以玩小游戏</span>
              <span class="tip-chip">🏆 完成有奖励</span>
              <span class="tip-chip">📺 看动画片</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentRole === 'doctor'" class="doctor-panel">
      <div class="panel-title">👨‍⚕️ 医生快速操作</div>
      <div class="panel-tips">点击下方标记已完成的治疗项目</div>

      <div class="treatment-control">
        <div class="control-label">治疗状态控制</div>
        <div class="control-status">
          <span class="status-label">当前状态：</span>
          <span
            class="status-value"
            :style="{ color: isTreating ? '#10B981' : '#FFC857' }"
          >
            {{ isTreating ? '🩺 治疗中' : '⏳ 准备中' }}
          </span>
        </div>
        <div class="control-hint" v-if="!isTreating">
          💡 点击「开始治疗」将自动关闭诊室直播
        </div>
        <div class="control-hint" v-else>
          🔒 直播已自动关闭，保护患者隐私
        </div>
        <div class="control-buttons">
          <button
            v-if="!isTreating"
            class="control-btn start-btn"
            @click="handleStartTreatment"
          >
            <span class="btn-icon">▶️</span>
            开始治疗
          </button>
          <button
            v-else
            class="control-btn finish-btn"
            @click="handleFinishTreatment"
          >
            <span class="btn-icon">✅</span>
            结束治疗
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doctor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doctor-card {
  position: relative;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
  overflow: hidden;
}

.doctor-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  pointer-events: none;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

.doctor-body {
  position: relative;
  padding: 24px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  align-items: flex-start;
}

.avatar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.avatar-ring {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
}

.doctor-avatar {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFE5E0 0%, #FFF3D6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(255, 123, 107, 0.18);
}

.avatar-emoji {
  font-size: 48px;
}

.stethoscope {
  position: absolute;
  bottom: -4px;
  right: -4px;
  font-size: 24px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doctor-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text);
}

.doctor-title {
  font-size: 12px;
  color: var(--c-primary);
  font-weight: 500;
}

.doctor-specialty {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-top: 2px;
}

.speak-col {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.speak-toggle {
  align-self: flex-end;
  padding: 6px 14px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.speak-toggle:hover {
  background: var(--c-purple);
  color: white;
}

.speech-bubble {
  position: relative;
  padding: 18px 20px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--c-primary-soft);
}

.bubble-tail {
  position: absolute;
  left: -12px;
  top: 24px;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 12px solid var(--c-primary-soft);
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 26px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #FFF8F0;
  z-index: 1;
}

.bubble-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bubble-emoji {
  font-size: 20px;
}

.bubble-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-primary);
}

.bubble-text {
  font-size: 14px;
  color: var(--c-text);
  line-height: 1.7;
  margin-bottom: 12px;
}

.bubble-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tip-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: white;
  border-radius: 20px;
  font-size: 12px;
  color: var(--c-text-soft);
  border: 1px solid var(--c-border);
}

.doctor-panel {
  padding: 16px 20px;
  background: linear-gradient(135deg, #D5F0E7 0%, #C8E6DA 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-secondary);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #2E7D60;
  margin-bottom: 4px;
}

.panel-tips {
  font-size: 12px;
  color: #3D9970;
}

.treatment-control {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed rgba(46, 125, 96, 0.3);
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: #2E7D60;
  margin-bottom: 10px;
}

.control-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-label {
  font-size: 13px;
  color: #3D9970;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
}

.control-hint {
  font-size: 12px;
  color: #52796F;
  margin-bottom: 12px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
}

.start-btn {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 123, 107, 0.3);
}

.start-btn:hover {
  box-shadow: 0 6px 16px rgba(255, 123, 107, 0.4);
}

.finish-btn {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.finish-btn:hover {
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-icon {
  font-size: 16px;
}

@keyframes anim-pop-in {
  0% { transform: scale(0.8) translateY(8px); opacity: 0; }
  70% { transform: scale(1.02) translateY(-2px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .doctor-body {
    grid-template-columns: 1fr;
    padding: 20px 16px;
  }
  .avatar-col {
    flex-direction: row;
    text-align: left;
  }
  .bubble-tail, .speech-bubble::before { display: none; }
}
</style>
