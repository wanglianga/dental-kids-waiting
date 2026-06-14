<script setup lang="ts">
import { postCareItems, currentRole, treatmentMarks, toggleTreatment, needFollowUp, followUpDate } from '../store';
import type { TreatmentType } from '../types';
import { ref } from 'vue';

const typeConfig: Record<TreatmentType, { icon: string; color: string }> = {
  filling: { icon: '🦷', color: 'primary' },
  fluoride: { icon: '🛡️', color: 'secondary' },
  sealant: { icon: '🏰', color: 'purple' },
  cleaning: { icon: '✨', color: 'accent' },
  checkup: { icon: '🔍', color: 'blue' },
};

const colorMap: Record<string, { bg: string; text: string; soft: string }> = {
  primary: { bg: '#FF7B6B', text: '#FF7B6B', soft: '#FFE5E0' },
  secondary: { bg: '#6BC5A8', text: '#3D9970', soft: '#D5F0E7' },
  purple: { bg: '#A78BFA', text: '#7C3AED', soft: '#EDE9FE' },
  accent: { bg: '#FFC857', text: '#B8860B', soft: '#FFF3D6' },
  blue: { bg: '#60A5FA', text: '#2563EB', soft: '#DBEAFE' },
};

const typeIcons: Record<string, string> = {
  normal: '📝',
  warning: '⚠️',
  tip: '💡',
};

const expandedId = ref<string | null>(null);
</script>

<template>
  <div class="postcare-section anim-slide-up" style="animation-delay: 0.22s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">📋</span>
        <h2 class="section-title">术后注意事项</h2>
        <span class="badge-important" v-if="postCareItems.some(i => i.type === 'warning')">重要</span>
      </div>
    </div>

    <div v-if="currentRole === 'doctor'" class="doctor-marks-panel">
      <div class="marks-title">🩺 医生标记已完成治疗</div>
      <div class="marks-grid">
        <button
          v-for="t in treatmentMarks"
          :key="t.type"
          class="mark-btn"
          :class="{ marked: t.marked }"
          :style="t.marked ? { background: colorMap[typeConfig[t.type].color].soft, borderColor: colorMap[typeConfig[t.type].color].bg } : {}"
          @click="toggleTreatment(t.type)"
        >
          <span class="mark-icon">{{ typeConfig[t.type].icon }}</span>
          <span class="mark-name" :style="t.marked ? { color: colorMap[typeConfig[t.type].color].text } : {}">{{ t.name }}</span>
          <span v-if="t.marked" class="mark-check">✓</span>
        </button>
      </div>

      <div class="followup-panel">
        <div class="followup-row">
          <label class="followup-label">
            <input type="checkbox" v-model="needFollowUp" />
            <span>📅 设置复诊提醒</span>
          </label>
          <input
            v-if="needFollowUp"
            type="date"
            v-model="followUpDate"
            class="date-input"
          />
        </div>
        <div v-if="needFollowUp && followUpDate" class="followup-banner anim-pop-in">
          复诊日期：<strong>{{ followUpDate }}</strong>
        </div>
      </div>
    </div>

    <div class="care-list">
      <div
        v-for="(item, idx) in postCareItems"
        :key="item.id"
        class="care-card"
        :class="[`type-${item.type}`, { expanded: expandedId === item.id }]"
        :style="{ animationDelay: `${0.22 + idx * 0.06}s` }"
        @click="expandedId = expandedId === item.id ? null : item.id"
      >
        <div class="care-head">
          <div class="care-icon-wrap">
            <span class="care-type-icon">{{ typeIcons[item.type] }}</span>
            <span class="care-emoji">{{ item.icon }}</span>
          </div>
          <div class="care-title-row">
            <h3 class="care-title">{{ item.title }}</h3>
            <span v-if="item.type === 'warning'" class="care-warn-tag">需注意</span>
          </div>
          <span class="care-expand">{{ expandedId === item.id ? '−' : '+' }}</span>
        </div>
        <div class="care-body">
          <p class="care-content">{{ item.content }}</p>
        </div>
      </div>
    </div>

    <div v-if="needFollowUp && followUpDate && currentRole !== 'doctor'" class="followup-reminder anim-pop-in">
      <div class="reminder-icon">📅</div>
      <div class="reminder-body">
        <div class="reminder-title">复诊提醒已设置</div>
        <div class="reminder-date">下次就诊：<strong>{{ followUpDate }}</strong></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.postcare-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
}

.section-head {
  display: flex;
  align-items: center;
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

.badge-important {
  padding: 4px 12px;
  background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(239, 68, 68, 0.3);
}

.doctor-marks-panel {
  padding: 16px 18px;
  background: linear-gradient(135deg, #D5F0E7 0%, #E8F8F1 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-secondary);
  margin-bottom: 18px;
}

.marks-title {
  font-size: 14px;
  font-weight: 600;
  color: #2E7D60;
  margin-bottom: 12px;
}

.marks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.mark-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: white;
  border: 2px solid var(--c-border);
  border-radius: var(--radius-sm);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.mark-btn:hover {
  transform: translateY(-2px);
  border-color: var(--c-secondary);
}

.mark-btn.marked {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(16, 185, 129, 0.2);
}

.mark-icon {
  font-size: 24px;
}

.mark-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-soft);
}

.mark-check {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--c-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
  animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.followup-panel {
  padding-top: 12px;
  border-top: 1px dashed rgba(46, 125, 96, 0.3);
}

.followup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.followup-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2E7D60;
  cursor: pointer;
}

.followup-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--c-secondary);
}

.date-input {
  padding: 8px 14px;
  border: 2px solid var(--c-secondary-soft);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--c-text);
  background: white;
  outline: none;
  transition: all 0.3s ease;
}

.date-input:focus {
  border-color: var(--c-secondary);
  box-shadow: 0 0 0 3px rgba(107, 197, 168, 0.15);
}

.followup-banner {
  margin-top: 12px;
  padding: 10px 16px;
  background: white;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--c-text);
  border: 1px solid var(--c-secondary-soft);
}

.followup-banner strong {
  color: var(--c-secondary);
}

.care-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.care-card {
  background: #FAFAFC;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: care-in 0.5s ease-out both;
}

.care-card:hover {
  background: #FFF5EE;
}

.care-card.expanded {
  border-color: var(--c-border);
  background: white;
  box-shadow: var(--shadow-sm);
}

.care-card.type-warning {
  background: linear-gradient(135deg, #FEF2F2 0%, #FFF5EE 100%);
  border-color: rgba(239, 68, 68, 0.2);
}

.care-card.type-warning.expanded {
  border-color: rgba(239, 68, 68, 0.4);
}

.care-card.type-tip {
  background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%);
}

@keyframes care-in {
  0% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.care-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
}

.care-icon-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.care-type-icon {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 14px;
}

.care-emoji {
  font-size: 22px;
}

.care-title-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.care-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
}

.care-warn-tag {
  padding: 3px 10px;
  background: rgba(239, 68, 68, 0.15);
  color: #DC2626;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.care-expand {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text-muted);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.care-card.expanded .care-expand {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}

.care-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.care-card.expanded .care-body {
  max-height: 200px;
}

.care-content {
  padding: 0 16px 16px 74px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--c-text-soft);
}

.care-card.type-warning .care-content {
  color: #92400E;
}

.followup-reminder {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%);
  border: 2px solid var(--c-blue-soft);
  border-radius: var(--radius-md);
}

.reminder-icon {
  font-size: 32px;
}

.reminder-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-blue);
  margin-bottom: 2px;
}

.reminder-date {
  font-size: 13px;
  color: var(--c-text-soft);
}

.reminder-date strong {
  color: var(--c-purple);
}

@keyframes anim-pop-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .postcare-section { padding: 18px 16px; }
  .marks-grid { grid-template-columns: repeat(2, 1fr); }
  .care-content { padding-left: 60px; padding-right: 12px; }
}
</style>
