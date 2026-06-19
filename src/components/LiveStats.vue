<script setup lang="ts">
import { computed, ref } from 'vue';
import { liveRecords, clinicRooms, getLiveStats, assignPatientToRoom, queueList } from '../store';

const stats = computed(() => getLiveStats());

const selectedRoom = ref('');
const selectedQueue = ref('');

const roomStatusMap: Record<string, { text: string; color: string; icon: string }> = {
  available: { text: '空闲', color: '#10B981', icon: '✅' },
  preparing: { text: '准备中', color: '#FFC857', icon: '⏳' },
  'in-treatment': { text: '治疗中', color: '#6BC5A8', icon: '🩺' },
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}秒`;
  return `${mins}分${secs}秒`;
}

const waitingPatients = computed(() => {
  return queueList.filter((q) => q.status === 'waiting');
});

function handleAssign() {
  if (!selectedRoom.value || !selectedQueue.value) return;
  const patient = queueList.find((q) => q.number === selectedQueue.value);
  if (!patient) return;
  assignPatientToRoom(selectedRoom.value, selectedQueue.value, patient.name);
  selectedRoom.value = '';
  selectedQueue.value = '';
}

const showRecords = ref(10);
</script>

<template>
  <div class="live-stats-section anim-slide-up" style="animation-delay: 0.1s">
    <div class="section-head">
      <div class="section-title-wrap">
        <span class="section-icon">📊</span>
        <h2 class="section-title">直播使用统计</h2>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📺</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalSessions }}</div>
          <div class="stat-label">总直播次数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔴</div>
        <div class="stat-info">
          <div class="stat-value live">{{ stats.activeSessions }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏱</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatDuration(stats.totalDurationSeconds) }}</div>
          <div class="stat-label">总观看时长</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatDuration(stats.averageDurationSeconds) }}</div>
          <div class="stat-label">平均时长</div>
        </div>
      </div>
    </div>

    <div class="rooms-section">
      <div class="subsection-title">
        <span>🏥</span>
        <span>诊室状态</span>
      </div>
      <div class="rooms-list">
        <div
          v-for="room in clinicRooms"
          :key="room.id"
          class="room-item"
        >
          <div class="room-main">
            <div class="room-name">{{ room.name }}</div>
            <div class="room-status" :style="{ color: roomStatusMap[room.status].color }">
              {{ roomStatusMap[room.status].icon }} {{ roomStatusMap[room.status].text }}
            </div>
          </div>
          <div class="room-detail" v-if="room.currentQueueNumber">
            <span class="patient-num">{{ room.currentQueueNumber }}</span>
            <span class="patient-name">{{ room.currentChildName }}小朋友</span>
          </div>
          <div class="room-live" v-if="room.liveEnabled">
            <span class="live-tag">
              <span class="live-dot"></span>
              直播中
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="assign-section">
      <div class="subsection-title">
        <span>📋</span>
        <span>分配诊室</span>
      </div>
      <div class="assign-form">
        <select v-model="selectedRoom" class="form-select">
          <option value="">选择诊室</option>
          <option
            v-for="room in clinicRooms.filter((r) => r.status === 'available')"
            :key="room.id"
            :value="room.id"
          >
            {{ room.name }}
          </option>
        </select>
        <select v-model="selectedQueue" class="form-select">
          <option value="">选择患者</option>
          <option
            v-for="patient in waitingPatients"
            :key="patient.number"
            :value="patient.number"
          >
            {{ patient.number }} - {{ patient.name }}小朋友
          </option>
        </select>
        <button
          class="assign-btn"
          :disabled="!selectedRoom || !selectedQueue"
          @click="handleAssign"
        >
          分配诊室
        </button>
      </div>
    </div>

    <div class="records-section">
      <div class="subsection-title">
        <span>📝</span>
        <span>直播记录</span>
      </div>
      <div class="records-list">
        <div
          v-for="record in liveRecords.slice(0, showRecords)"
          :key="record.id"
          class="record-item"
          :class="{ active: record.status === 'active' }"
        >
          <div class="record-main">
            <div class="record-patient">
              <span class="record-num">{{ record.queueNumber }}</span>
              <span class="record-name">{{ record.childName }}小朋友</span>
            </div>
            <span
              class="record-status"
              :class="record.status === 'active' ? 'active' : 'ended'"
            >
              <span class="status-dot"></span>
              {{ record.status === 'active' ? '进行中' : '已结束' }}
            </span>
          </div>
          <div class="record-info">
            <span class="info-item">
              <span class="info-label">开始：</span>
              <span class="info-value">{{ record.startTime }}</span>
            </span>
            <span class="info-item" v-if="record.endTime">
              <span class="info-label">结束：</span>
              <span class="info-value">{{ record.endTime }}</span>
            </span>
            <span class="info-item" v-if="record.duration">
              <span class="info-label">时长：</span>
              <span class="info-value">{{ formatDuration(record.duration) }}</span>
            </span>
            <span class="info-item">
              <span class="info-label">诊室：</span>
              <span class="info-value">{{ clinicRooms.find((r) => r.id === record.roomId)?.name || '-' }}</span>
            </span>
          </div>
        </div>
      </div>
      <button
        v-if="liveRecords.length > showRecords"
        class="load-more-btn"
        @click="showRecords += 10"
      >
        加载更多 ↓
      </button>
    </div>
  </div>
</template>

<style scoped>
.live-stats-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--c-border);
}

.section-head {
  margin-bottom: 20px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFFFFF 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-text);
}

.stat-value.live {
  color: #EF4444;
}

.stat-label {
  font-size: 12px;
  color: var(--c-text-muted);
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 12px;
}

.rooms-section {
  margin-bottom: 24px;
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: #FAFAFC;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border);
  transition: all 0.3s ease;
}

.room-item:hover {
  background: #FFF5EE;
}

.room-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.room-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
}

.room-status {
  font-size: 13px;
  font-weight: 500;
}

.room-detail {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--c-text-soft);
}

.patient-num {
  padding: 2px 10px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.patient-name {
  font-size: 13px;
}

.room-live {
  flex-shrink: 0;
}

.live-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.live-tag .live-dot {
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.assign-section {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-blue-soft);
}

.assign-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.form-select {
  flex: 1;
  min-width: 140px;
  padding: 10px 14px;
  background: white;
  border: 2px solid var(--c-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--c-text);
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.form-select:focus {
  border-color: var(--c-purple);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

.assign-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.assign-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
}

.assign-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.records-section {
  border-top: 1px solid var(--c-border);
  padding-top: 20px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.record-item {
  padding: 14px 16px;
  background: #FAFAFC;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.record-item:hover {
  background: #FFF5EE;
}

.record-item.active {
  background: linear-gradient(135deg, #FEF2F2 0%, #FFF5EE 100%);
  border-color: #FEE2E2;
}

.record-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.record-patient {
  display: flex;
  align-items: center;
  gap: 10px;
}

.record-num {
  padding: 3px 10px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.record-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
}

.record-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.record-status.active {
  background: #FEE2E2;
  color: #DC2626;
}

.record-status.ended {
  background: #D1FAE5;
  color: #059669;
}

.record-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.record-status.active .status-dot {
  background: #EF4444;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.record-status.ended .status-dot {
  background: #10B981;
}

.record-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-label {
  color: var(--c-text-muted);
}

.info-value {
  color: var(--c-text-soft);
  font-weight: 500;
}

.load-more-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: var(--c-purple);
  color: white;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .room-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .room-detail {
    width: 100%;
  }

  .assign-form {
    flex-direction: column;
  }

  .form-select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
