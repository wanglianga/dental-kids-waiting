<script setup lang="ts">
import { rewardStickers, earnSticker, currentRole, updateStickerEncouragement } from '../store';
import { computed, ref } from 'vue';

const earnedCount = computed(() => rewardStickers.filter((s) => s.earned).length);
const progressPercent = computed(() => Math.round((earnedCount.value / rewardStickers.length) * 100));
const expandedSticker = ref<string | null>(null);
const editingSticker = ref<string | null>(null);
const encouragementText = ref('');
const newStickerToast = ref<{ show: boolean; sticker: any }>({ show: false, sticker: null });

const milestones = [
  { count: 3, name: '初出茅庐', icon: '🌱' },
  { count: 5, name: '渐入佳境', icon: '🌟' },
  { count: 8, name: '小有所成', icon: '🏆' },
  { count: 10, name: '护牙大师', icon: '👑' },
];

const currentMilestone = computed(() => {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (earnedCount.value >= milestones[i].count) {
      return milestones[i];
    }
  }
  return null;
});

const nextMilestone = computed(() => {
  for (const m of milestones) {
    if (earnedCount.value < m.count) {
      return m;
    }
  }
  return null;
});

const sourceLabels: Record<string, { label: string; color: string }> = {
  game: { label: '游戏奖励', color: '#60A5FA' },
  cooperation: { label: '配合奖励', color: '#10B981' },
  followup: { label: '复诊奖励', color: '#8B5CF6' },
  manual: { label: '特别表扬', color: '#FF7B6B' },
};

function handleClick(id: string) {
  if (currentRole.value === 'parent') {
    expandedSticker.value = expandedSticker.value === id ? null : id;
    return;
  }

  if (currentRole.value === 'doctor') {
    expandedSticker.value = expandedSticker.value === id ? null : id;
  } else {
    const sticker = rewardStickers.find((s) => s.id === id);
    if (sticker && !sticker.earned) {
      earnSticker(id, 'manual', '小朋友表现真棒！继续加油哦~');
      showNewStickerToast(sticker);
    }
  }
}

function startEditing(sticker: any) {
  if (currentRole.value !== 'doctor') return;
  editingSticker.value = sticker.id;
  encouragementText.value = sticker.encouragement || '';
}

function saveEncouragement(id: string) {
  if (encouragementText.value.trim()) {
    updateStickerEncouragement(id, encouragementText.value.trim());
  }
  editingSticker.value = null;
  encouragementText.value = '';
}

function cancelEditing() {
  editingSticker.value = null;
  encouragementText.value = '';
}

function showNewStickerToast(sticker: any) {
  newStickerToast.value = { show: true, sticker };
  setTimeout(() => {
    newStickerToast.value.show = false;
  }, 3000);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function earnedBySource(source: string) {
  return rewardStickers.filter((s) => s.earned && s.source === source).length;
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

    <div class="milestones-strip">
      <div class="milestone-track">
        <div
          class="milestone-progress"
          :style="{ width: `${Math.min(100, (earnedCount / milestones[milestones.length - 1].count) * 100)}%` }"
        ></div>
        <div
          v-for="m in milestones"
          :key="m.count"
          class="milestone-node"
          :class="{ achieved: earnedCount >= m.count, current: currentMilestone?.count === m.count }"
        >
          <div class="milestone-icon">{{ m.icon }}</div>
          <div class="milestone-info">
            <div class="milestone-name">{{ m.name }}</div>
            <div class="milestone-count">{{ m.count }} 枚</div>
          </div>
        </div>
      </div>
      <div v-if="nextMilestone" class="next-milestone-hint">
        再获得 <strong>{{ nextMilestone.count - earnedCount }}</strong> 枚贴纸即可解锁「{{ nextMilestone.name }}」！
      </div>
    </div>

    <div v-if="currentRole === 'parent'" class="feedback-summary">
      <div class="feedback-title">📊 行为反馈总览</div>
      <div class="feedback-stats">
        <div class="stat-item">
          <span class="stat-icon">🎮</span>
          <span class="stat-label">游戏奖励</span>
          <span class="stat-value">{{ earnedBySource('game') }} 枚</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🤝</span>
          <span class="stat-label">配合奖励</span>
          <span class="stat-value">{{ earnedBySource('cooperation') }} 枚</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-label">复诊奖励</span>
          <span class="stat-value">{{ earnedBySource('followup') }} 枚</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🌟</span>
          <span class="stat-label">特别表扬</span>
          <span class="stat-value">{{ earnedBySource('manual') }} 枚</span>
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
          :class="{
            earned: sticker.earned,
            locked: !sticker.earned,
            expanded: expandedSticker === sticker.id,
          }"
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

          <div
            v-if="sticker.earned && sticker.source && sourceLabels[sticker.source]"
            class="sticker-source"
            :style="{ background: sourceLabels[sticker.source].color + '20', color: sourceLabels[sticker.source].color }"
          >
            {{ sourceLabels[sticker.source].label }}
          </div>

          <div v-if="sticker.earned && expandedSticker === sticker.id" class="sticker-details">
            <div v-if="sticker.earnedAt" class="detail-row">
              <span class="detail-label">获得时间：</span>
              <span class="detail-value">{{ formatDate(sticker.earnedAt) }}</span>
            </div>

            <div v-if="sticker.encouragement" class="encouragement-box">
              <div class="encouragement-label">💝 医生的鼓励</div>
              <p class="encouragement-text">{{ sticker.encouragement }}</p>
            </div>

            <div v-if="currentRole === 'doctor' && editingSticker !== sticker.id" class="edit-actions">
              <button class="edit-btn" @click.stop="startEditing(sticker)">
                ✏️ 编辑鼓励语
              </button>
            </div>

            <div v-if="currentRole === 'doctor' && editingSticker === sticker.id" class="edit-form" @click.stop>
              <textarea
                v-model="encouragementText"
                class="encouragement-input"
                placeholder="输入对小朋友的鼓励话语..."
                rows="3"
              ></textarea>
              <div class="edit-buttons">
                <button class="cancel-btn" @click="cancelEditing">取消</button>
                <button class="save-btn" @click="saveEncouragement(sticker.id)">保存</button>
              </div>
            </div>

            <div v-if="currentRole === 'parent' && sticker.behaviorFeedback" class="feedback-box">
              <div class="feedback-label">📋 行为反馈</div>
              <p class="feedback-text">{{ sticker.behaviorFeedback }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="role-hint">
      <template v-if="currentRole === 'doctor'">
        💡 点击已获得的贴纸可以添加或编辑鼓励语
      </template>
      <template v-else-if="currentRole === 'nurse'">
        💡 点击未获得的贴纸可以手动奖励小朋友
      </template>
      <template v-else>
        💡 点击已获得的贴纸查看详细信息和医生鼓励
      </template>
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
.reward-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
  position: relative;
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

.milestones-strip {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-accent-soft);
}

.milestone-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 12px;
}

.milestone-progress {
  position: absolute;
  left: 40px;
  right: 40px;
  top: 50%;
  height: 4px;
  background: linear-gradient(90deg, #FFC857 0%, #FF9F43 100%);
  border-radius: 4px;
  transform: translateY(-50%);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
}

.milestone-track::before {
  content: '';
  position: absolute;
  left: 40px;
  right: 40px;
  top: 50%;
  height: 4px;
  background: #F0ECE8;
  border-radius: 4px;
  transform: translateY(-50%);
  z-index: 0;
}

.milestone-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.milestone-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 3px solid #F0ECE8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.milestone-node.achieved .milestone-icon {
  border-color: var(--c-accent);
  background: linear-gradient(135deg, #FFE88A 0%, #FFC857 100%);
  box-shadow: 0 4px 12px rgba(255, 200, 87, 0.3);
}

.milestone-node.current .milestone-icon {
  transform: scale(1.15);
  animation: milestonePulse 2s ease-in-out infinite;
}

@keyframes milestonePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 200, 87, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(255, 200, 87, 0); }
}

.milestone-info {
  text-align: center;
}

.milestone-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-muted);
  transition: color 0.3s ease;
}

.milestone-node.achieved .milestone-name {
  color: var(--c-accent);
}

.milestone-count {
  font-size: 11px;
  color: var(--c-text-muted);
}

.next-milestone-hint {
  text-align: center;
  font-size: 13px;
  color: var(--c-text-soft);
}

.next-milestone-hint strong {
  color: var(--c-accent);
  font-weight: 700;
}

.feedback-summary {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #F0FBF6 0%, #FFFFFF 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-secondary-soft);
}

.feedback-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-secondary);
  margin-bottom: 12px;
}

.feedback-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: white;
  border-radius: var(--radius-sm);
  text-align: center;
}

.stat-icon {
  font-size: 20px;
}

.stat-label {
  font-size: 11px;
  color: var(--c-text-muted);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
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
  cursor: pointer;
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

.sticker-card.expanded {
  grid-column: span 2;
  padding-bottom: 16px;
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

.anim-wiggle {
  animation: wiggle 3s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg) scale(1); }
  25% { transform: rotate(3deg) scale(1.05); }
  50% { transform: rotate(-3deg) scale(1); }
  75% { transform: rotate(3deg) scale(1.05); }
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

.sticker-source {
  position: relative;
  z-index: 1;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.sticker-details {
  width: 100%;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--c-border);
  position: relative;
  z-index: 1;
  animation: expandIn 0.3s ease-out;
}

@keyframes expandIn {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
}

.detail-label {
  color: var(--c-text-muted);
}

.detail-value {
  color: var(--c-text);
  font-weight: 500;
}

.encouragement-box {
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin-bottom: 8px;
}

.encouragement-label {
  font-size: 11px;
  font-weight: 600;
  color: #DB2777;
  margin-bottom: 4px;
}

.encouragement-text {
  font-size: 12px;
  color: var(--c-text);
  line-height: 1.5;
  margin: 0;
}

.feedback-box {
  background: linear-gradient(135deg, #F0FBF6 0%, #D5F0E7 100%);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin-top: 8px;
}

.feedback-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-secondary);
  margin-bottom: 4px;
}

.feedback-text {
  font-size: 12px;
  color: var(--c-text-soft);
  line-height: 1.5;
  margin: 0;
}

.edit-actions {
  margin-top: 8px;
}

.edit-btn {
  width: 100%;
  padding: 6px 12px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: var(--c-purple);
  color: white;
}

.edit-form {
  margin-top: 8px;
}

.encouragement-input {
  width: 100%;
  padding: 8px 10px;
  border: 2px solid var(--c-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: inherit;
  color: var(--c-text);
  background: white;
  outline: none;
  resize: vertical;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.encouragement-input:focus {
  border-color: var(--c-purple);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

.edit-buttons {
  display: flex;
  gap: 8px;
}

.cancel-btn, .save-btn {
  flex: 1;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #F0ECE8;
  color: var(--c-text-muted);
}

.cancel-btn:hover {
  background: #E5E0DB;
}

.save-btn {
  background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);
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

@media (max-width: 1024px) {
  .sticker-grid { grid-template-columns: repeat(3, 1fr); }
  .sticker-card.expanded { grid-column: span 3; }
  .feedback-stats { grid-template-columns: repeat(2, 1fr); }
  .milestone-track { flex-wrap: wrap; gap: 12px; }
  .milestone-node { flex: 1; min-width: 70px; }
}

@media (max-width: 640px) {
  .reward-section { padding: 18px 16px; }
  .sticker-board { padding: 16px; }
  .sticker-grid { grid-template-columns: repeat(2, 1fr); }
  .sticker-card.expanded { grid-column: span 2; }
  .feedback-stats { grid-template-columns: repeat(2, 1fr); }
  .milestone-track { padding: 10px 0; }
  .milestone-icon { width: 40px; height: 40px; font-size: 20px; }
  .milestone-name { font-size: 10px; }
  .milestone-count { font-size: 9px; }
  .milestone-progress, .milestone-track::before { left: 30px; right: 30px; }
}
</style>
