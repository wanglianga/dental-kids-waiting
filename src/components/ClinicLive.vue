<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import {
  myLiveStatus,
  myLiveRoom,
  myActiveLiveRecord,
  startLiveView,
  stopLiveView,
  isChildMode,
} from '../store';

const showLiveModal = ref(false);
const liveElapsed = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const statusText = computed(() => {
  const map: Record<string, { text: string; color: string; icon: string }> = {
    off: { text: '暂未开放', color: '#9B9BAA', icon: '📺' },
    preparing: { text: '准备中', color: '#FFC857', icon: '⏳' },
    live: { text: '直播中', color: '#10B981', icon: '🔴' },
    'in-treatment': { text: '治疗中', color: '#6BC5A8', icon: '🩺' },
  };
  return map[myLiveStatus.value];
});

const canStartLive = computed(() => {
  return (
    myLiveStatus.value === 'preparing' ||
    myLiveStatus.value === 'live'
  );
});

const formattedTime = computed(() => {
  const mins = Math.floor(liveElapsed.value / 60);
  const secs = liveElapsed.value % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

function openLive() {
  if (!canStartLive.value) return;
  startLiveView();
  showLiveModal.value = true;
  startTimer();
}

function closeLive() {
  stopLiveView();
  showLiveModal.value = false;
  stopTimer();
  liveElapsed.value = 0;
}

function startTimer() {
  if (timer) clearInterval(timer);
  if (myActiveLiveRecord.value) {
    const start = new Date(myActiveLiveRecord.value.startTime).getTime();
    liveElapsed.value = Math.floor((Date.now() - start) / 1000);
  }
  timer = setInterval(() => {
    liveElapsed.value++;
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

watch(myLiveStatus, (newStatus) => {
  if (newStatus === 'in-treatment' && showLiveModal.value) {
    stopTimer();
  }
  if (newStatus === 'live' && showLiveModal.value && !timer) {
    startTimer();
  }
});

watch(showLiveModal, (val) => {
  if (!val) {
    stopTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});

const delaySeconds = 2.8;
</script>

<template>
  <div
    v-if="!isChildMode"
    class="clinic-live-section anim-slide-up"
    style="animation-delay: 0.1s"
  >
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">📺</span>
        <h2 class="section-title">诊室直播</h2>
        <span
          class="status-chip"
          :style="{ background: statusText.color + '20', color: statusText.color }"
        >
          <span class="status-dot" :style="{ background: statusText.color }"></span>
          {{ statusText.text }}
        </span>
      </div>
    </div>

    <div class="live-card" :class="{ disabled: !canStartLive }">
      <div class="live-preview">
        <div class="preview-placeholder">
          <div class="placeholder-room">
            <div class="room-bg">
              <div class="room-wall"></div>
              <div class="room-floor"></div>
              <div class="chair-icon">🪑</div>
              <div class="tools-icon">🧰</div>
              <div class="light-icon">💡</div>
            </div>
          </div>
          <div v-if="myLiveStatus === 'in-treatment'" class="treatment-overlay">
            <div class="treatment-content">
              <span class="treatment-icon">🩺</span>
              <span class="treatment-text">治疗进行中</span>
              <span class="treatment-sub">为保护隐私，直播已暂停</span>
            </div>
          </div>
          <div v-else-if="!canStartLive" class="off-overlay">
            <div class="off-content">
              <span class="off-icon">📺</span>
              <span class="off-text">直播暂未开放</span>
            </div>
          </div>
          <div v-else class="live-badge-overlay">
            <span class="live-badge">
              <span class="live-dot"></span>
              LIVE
            </span>
            <span class="delay-badge">延迟约 {{ delaySeconds }}s</span>
          </div>
        </div>
      </div>

      <div class="live-info">
        <div class="info-row">
          <span class="info-label">诊室</span>
          <span class="info-value">{{ myLiveRoom?.name || '暂未分配' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">状态</span>
          <span class="info-value" :style="{ color: statusText.color }">
            {{ statusText.icon }} {{ statusText.text }}
          </span>
        </div>
      </div>

      <button
        class="start-live-btn"
        :class="{ disabled: !canStartLive }"
        :disabled="!canStartLive"
        @click="openLive"
      >
        <span class="btn-icon">▶️</span>
        <span>查看诊室直播</span>
      </button>
    </div>

    <!-- 直播弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showLiveModal" class="live-modal-overlay" @click.self="closeLive">
          <div class="live-modal">
            <div class="modal-header">
              <div class="modal-title">
                <span class="title-icon">📺</span>
                <span>{{ myLiveRoom?.name }} - 诊室直播</span>
              </div>
              <div class="header-info">
                <span v-if="myLiveStatus === 'live'" class="live-indicator">
                  <span class="live-dot"></span>
                  直播中
                </span>
                <span v-else class="treatment-indicator">
                  🩺 治疗中
                </span>
                <span class="time-badge">⏱ {{ formattedTime }}</span>
              </div>
              <button class="close-btn" @click="closeLive">✕</button>
            </div>

            <div class="modal-body">
              <div class="video-container">
                <div class="video-content">
                  <div class="simulated-room">
                    <div class="room-scene">
                      <div class="ceiling-light">💡</div>
                      <div class="dental-chair">
                        <span class="chair-emoji">🪑</span>
                        <div class="chair-base"></div>
                      </div>
                      <div class="tool-tray">
                        <span class="tray-emoji">🧰</span>
                      </div>
                      <div class="doctor-figure" v-if="myLiveStatus === 'live'">
                        <span class="doctor-emoji">👨‍⚕️</span>
                      </div>
                      <div class="scan-line"></div>
                    </div>
                    <div class="video-overlay">
                      <div class="overlay-top">
                        <span class="room-tag">{{ myLiveRoom?.name }}</span>
                        <span class="delay-tag">延迟 {{ delaySeconds }}s</span>
                      </div>
                      <div class="overlay-bottom">
                        <span class="time-text">{{ new Date().toLocaleTimeString() }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="myLiveStatus === 'in-treatment'" class="treatment-cover">
                    <div class="cover-content anim-pop-in">
                      <div class="cover-icon">🩺</div>
                      <div class="cover-title">治疗进行中</div>
                      <div class="cover-desc">
                        为保护患者隐私，治疗期间直播已自动暂停
                      </div>
                      <div class="cover-tip">
                        <span>💗</span>
                        <span>请耐心等待治疗结束</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="live-details">
                <div class="detail-card">
                  <div class="detail-icon">👶</div>
                  <div class="detail-info">
                    <div class="detail-label">就诊儿童</div>
                    <div class="detail-value">{{ myLiveRoom?.currentChildName || '-' }}</div>
                  </div>
                </div>
                <div class="detail-card">
                  <div class="detail-icon">🔢</div>
                  <div class="detail-info">
                    <div class="detail-label">排队号码</div>
                    <div class="detail-value">{{ myLiveRoom?.currentQueueNumber || '-' }}</div>
                  </div>
                </div>
                <div class="detail-card">
                  <div class="detail-icon">⏱</div>
                  <div class="detail-info">
                    <div class="detail-label">已观看</div>
                    <div class="detail-value">{{ formattedTime }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div class="footer-hint">
                <span class="hint-icon">🔒</span>
                <span>直播仅限本患者家长查看，画面延迟约 {{ delaySeconds }} 秒</span>
              </div>
              <button class="close-live-btn" @click="closeLive">
                关闭直播
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.clinic-live-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
}

.section-head {
  margin-bottom: 16px;
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
  color: var(--c-text);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.live-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.live-card.disabled {
  opacity: 0.6;
}

.live-preview {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #1a1a2e;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.placeholder-room {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-bg {
  position: relative;
  width: 80%;
  height: 80%;
  background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
  border-radius: 8px;
  overflow: hidden;
}

.room-wall {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
}

.room-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, #c4b5a0 0%, #a89880 100%);
}

.chair-icon {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36px;
}

.tools-icon {
  position: absolute;
  bottom: 25%;
  right: 15%;
  font-size: 24px;
}

.light-icon {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  animation: flicker 3s ease-in-out infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.treatment-overlay,
.off-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
}

.treatment-content,
.off-content {
  text-align: center;
  color: white;
}

.treatment-icon,
.off-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.treatment-text {
  font-size: 18px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.treatment-sub {
  font-size: 13px;
  opacity: 0.8;
}

.off-text {
  font-size: 16px;
  font-weight: 500;
}

.live-badge-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #EF4444;
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: live-pulse 1.5s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.delay-badge {
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.live-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: #FAFAFC;
  border-radius: var(--radius-sm);
}

.info-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
}

.start-live-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 123, 107, 0.3);
}

.start-live-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 123, 107, 0.4);
}

.start-live-btn.disabled {
  background: #E5E7EB;
  color: #9CA3AF;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
}

/* Modal */
.live-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.live-modal {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFFFFF 100%);
  border-bottom: 1px solid var(--c-border);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text);
  flex: 1;
}

.title-icon {
  font-size: 24px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-indicator,
.treatment-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.live-indicator {
  background: #FEE2E2;
  color: #DC2626;
}

.live-indicator .live-dot {
  background: #DC2626;
}

.treatment-indicator {
  background: #D1FAE5;
  color: #059669;
}

.time-badge {
  padding: 6px 14px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F3F4F6;
  color: var(--c-text-soft);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #E5E7EB;
  color: var(--c-text);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.video-container {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #0f0f1a;
  margin-bottom: 20px;
  aspect-ratio: 16 / 9;
  position: relative;
}

.video-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.simulated-room {
  width: 100%;
  height: 100%;
  position: relative;
}

.room-scene {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%);
  overflow: hidden;
}

.ceiling-light {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 200, 0.6));
  animation: light-glow 3s ease-in-out infinite;
}

@keyframes light-glow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 255, 200, 0.6)); }
  50% { filter: drop-shadow(0 0 30px rgba(255, 255, 200, 0.8)); }
}

.dental-chair {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chair-emoji {
  font-size: 64px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.tool-tray {
  position: absolute;
  bottom: 20%;
  right: 15%;
}

.tray-emoji {
  font-size: 36px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.doctor-figure {
  position: absolute;
  bottom: 25%;
  left: 25%;
  animation: doctor-move 4s ease-in-out infinite;
}

.doctor-emoji {
  font-size: 48px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

@keyframes doctor-move {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(10px) rotate(3deg); }
}

.scan-line {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.video-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.overlay-top,
.overlay-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-tag,
.delay-tag,
.time-text {
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.treatment-cover {
  position: absolute;
  inset: 0;
  background: rgba(16, 185, 129, 0.15);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-content {
  text-align: center;
  color: white;
  padding: 40px;
}

.cover-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce-soft 2s ease-in-out infinite;
}

.cover-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.cover-desc {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.cover-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 13px;
}

.live-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FAFAFC;
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border);
}

.detail-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.detail-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: #FAFAFC;
  border-top: 1px solid var(--c-border);
  flex-wrap: wrap;
}

.footer-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--c-text-soft);
}

.hint-icon {
  font-size: 16px;
}

.close-live-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%);
  color: white;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.close-live-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .live-modal,
.modal-leave-to .live-modal {
  transform: scale(0.95) translateY(20px);
}

@keyframes anim-pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@media (max-width: 640px) {
  .clinic-live-section {
    padding: 18px 16px;
  }

  .live-info {
    grid-template-columns: 1fr;
  }

  .modal-header {
    padding: 16px;
    flex-wrap: wrap;
  }

  .modal-body {
    padding: 16px;
  }

  .live-details {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 16px;
    flex-direction: column-reverse;
    align-items: stretch;
  }
}
</style>
