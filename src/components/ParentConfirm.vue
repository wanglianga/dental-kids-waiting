<script setup lang="ts">
import { parentConfirmed, confirmParent, treatmentMarks, needFollowUp, followUpDate, childInfo, currentRole } from '../store';
import { computed, ref } from 'vue';

const showConfirmModal = ref(false);

const completedTreatments = computed(() => treatmentMarks.filter((t) => t.marked));

function handleConfirm() {
  showConfirmModal.value = true;
}

function finalConfirm() {
  confirmParent();
  showConfirmModal.value = false;
}
</script>

<template>
  <div class="confirm-section anim-slide-up" style="animation-delay: 0.25s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">🤝</span>
        <h2 class="section-title">家长确认</h2>
      </div>
      <span
        class="status-badge"
        :class="{ confirmed: parentConfirmed }"
      >
        {{ parentConfirmed ? '✓ 已确认' : '待确认' }}
      </span>
    </div>

    <div class="summary-card">
      <div class="summary-row">
        <div class="summary-item">
          <span class="sum-label">儿童姓名</span>
          <span class="sum-value">{{ childInfo.name }}</span>
        </div>
        <div class="summary-item">
          <span class="sum-label">儿童年龄</span>
          <span class="sum-value">{{ childInfo.age }} 岁</span>
        </div>
        <div class="summary-item">
          <span class="sum-label">就诊号码</span>
          <span class="sum-value chip">{{ childInfo.queueNumber }}</span>
        </div>
      </div>

      <div v-if="completedTreatments.length > 0" class="summary-section">
        <div class="sec-label">本次治疗项目</div>
        <div class="treatments-row">
          <span
            v-for="t in completedTreatments"
            :key="t.type"
            class="treatment-tag"
          >
            ✓ {{ t.name }}
          </span>
        </div>
      </div>
      <div v-else class="summary-empty">暂无治疗项目记录</div>

      <div v-if="needFollowUp && followUpDate" class="summary-section">
        <div class="sec-label">复诊安排</div>
        <div class="followup-box">
          <span class="followup-icon">📅</span>
          <span>复诊日期：<strong>{{ followUpDate }}</strong></span>
        </div>
      </div>

      <div class="summary-section">
        <div class="sec-label">注意事项</div>
        <ul class="care-points">
          <li>我已阅读并理解术后注意事项</li>
          <li>如出现异常反应将及时联系医院</li>
          <li>将按医嘱进行日常口腔护理</li>
        </ul>
      </div>
    </div>

    <div class="confirm-actions">
      <button
        v-if="!parentConfirmed"
        class="confirm-btn primary"
        :disabled="currentRole === 'nurse'"
        @click="handleConfirm"
      >
        <span class="btn-icon">✍️</span>
        家长确认签字
      </button>
      <div v-else class="confirmed-note anim-pop-in">
        <span class="note-icon">🎉</span>
        <div>
          <div class="note-title">确认完成！</div>
          <div class="note-sub">{{ childInfo.name }}小朋友今天表现真棒！</div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-mask" @click.self="showConfirmModal = false">
        <div class="modal-card anim-pop-in">
          <div class="modal-emoji">📝</div>
          <h3 class="modal-title">家长确认</h3>
          <p class="modal-desc">
            请确认已阅读并理解以上所有内容，<br />
            同意本次治疗及术后护理安排。
          </p>
          <div class="sign-area">
            <div class="sign-placeholder">
              <span>点击下方按钮即代表电子签名</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showConfirmModal = false">取消</button>
            <button class="modal-btn confirm" @click="finalConfirm">
              ✓ 确认并签名
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.confirm-section {
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

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: var(--c-accent-soft);
  color: #B8860B;
}

.status-badge.confirmed {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
}

.summary-card {
  background: linear-gradient(135deg, #FAFAFC 0%, #FFF5EE 100%);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--c-border);
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--c-border);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sum-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.sum-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}

.sum-value.chip {
  display: inline-block;
  padding: 4px 12px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 20px;
  width: fit-content;
  font-size: 14px;
}

.summary-section {
  margin-bottom: 14px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.sec-label {
  font-size: 12px;
  color: var(--c-text-muted);
  margin-bottom: 8px;
}

.treatments-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.treatment-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: var(--c-secondary-soft);
  color: var(--c-secondary);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.summary-empty {
  padding: 10px 14px;
  background: white;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--c-text-muted);
  margin-bottom: 14px;
}

.followup-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--c-text-soft);
  border: 1px solid var(--c-blue-soft);
}

.followup-icon {
  font-size: 18px;
}

.followup-box strong {
  color: var(--c-purple);
}

.care-points {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.care-points li {
  font-size: 13px;
  color: var(--c-text-soft);
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirm-btn.primary {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(255, 123, 107, 0.35);
}

.confirm-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 123, 107, 0.45);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #D1D5DB;
  box-shadow: none;
}

.btn-icon {
  font-size: 20px;
}

.confirmed-note {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #D5F0E7 0%, #E8F8F1 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--c-secondary);
}

.note-icon {
  font-size: 36px;
}

.note-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-secondary);
}

.note-sub {
  font-size: 13px;
  color: var(--c-text-soft);
}

/* Modal */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(61, 61, 78, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  text-align: center;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
}

.modal-emoji {
  font-size: 56px;
  margin-bottom: 12px;
  animation: bounce-soft 2s ease-in-out infinite;
}

@keyframes bounce-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 10px;
}

.modal-desc {
  font-size: 14px;
  color: var(--c-text-soft);
  line-height: 1.7;
  margin-bottom: 20px;
}

.sign-area {
  padding: 24px;
  background: linear-gradient(135deg, #FAFAFC 0%, #FFF5EE 100%);
  border-radius: var(--radius-md);
  border: 2px dashed var(--c-primary-soft);
  margin-bottom: 20px;
}

.sign-placeholder {
  font-size: 13px;
  color: var(--c-text-muted);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: var(--c-border);
  color: var(--c-text-soft);
}

.modal-btn.cancel:hover {
  background: #E5E7EB;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 6px 16px rgba(255, 123, 107, 0.35);
}

.modal-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255, 123, 107, 0.45);
}

@keyframes anim-pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .confirm-section { padding: 18px 16px; }
  .summary-row { grid-template-columns: 1fr; gap: 12px; }
  .confirm-btn { width: 100%; justify-content: center; }
}
</style>
