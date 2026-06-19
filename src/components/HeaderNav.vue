<script setup lang="ts">
import { computed } from 'vue';
import { currentRole, setRole, childInfo, getMyQueueStatus, toggleCallStatus, isChildMode, toggleChildMode } from '../store';
import type { CallStatus, UserRole } from '../types';

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: 'parent', label: '家长/儿童', icon: '👨‍👩‍👧' },
  { value: 'nurse', label: '护士台', icon: '👩‍⚕️' },
  { value: 'doctor', label: '医生工作站', icon: '🩺' },
];

const statusConfig: Record<CallStatus, { text: string; color: string; bg: string }> = {
  waiting: { text: '排队候诊中', color: '#FF7B6B', bg: '#FFE5E0' },
  called: { text: '请前往诊室', color: '#FFC857', bg: '#FFF3D6' },
  'in-treatment': { text: '治疗中', color: '#6BC5A8', bg: '#D5F0E7' },
  finished: { text: '治疗完成', color: '#A78BFA', bg: '#EDE9FE' },
};

const myStatus = computed(() => getMyQueueStatus());
const statusInfo = computed(() => statusConfig[myStatus.value]);
</script>

<template>
  <header class="header">
    <div class="header-bg"></div>
    <div class="header-inner">
      <div class="brand">
        <div class="logo anim-float">🦷</div>
        <div class="brand-text">
          <h1>小牙医乐园</h1>
          <p>让看牙变成快乐的冒险</p>
        </div>
      </div>

      <div class="child-card anim-slide-up">
        <div class="child-avatar">{{ childInfo.avatar }}</div>
        <div class="child-info">
          <div class="child-name">
            {{ childInfo.name }}小朋友
            <span class="child-age">{{ childInfo.age }}岁</span>
          </div>
          <div class="queue-chip" :style="{ background: statusInfo.bg, color: statusInfo.color }">
            <span class="queue-num">号码 {{ childInfo.queueNumber }}</span>
            <span class="queue-status anim-pulse-ring" v-if="myStatus === 'called'">{{ statusInfo.text }}</span>
            <span class="queue-status" v-else>{{ statusInfo.text }}</span>
          </div>
        </div>
      </div>

      <div class="role-switcher">
        <span class="role-label">视图：</span>
        <div class="role-tabs">
          <button
            v-for="r in roles"
            :key="r.value"
            class="role-tab"
            :class="{ active: currentRole === r.value }"
            @click="setRole(r.value)"
          >
            <span class="role-icon">{{ r.icon }}</span>
            <span class="role-text">{{ r.label }}</span>
          </button>
        </div>
        <button v-if="currentRole === 'nurse'" class="call-btn anim-bounce-soft" @click="toggleCallStatus">
          🔔 切换叫号状态
        </button>
        <button
          v-if="currentRole === 'parent'"
          class="child-mode-btn"
          :class="{ active: isChildMode }"
          @click="toggleChildMode"
        >
          <span class="child-mode-icon">{{ isChildMode ? '👶' : '👨‍👩‍👧' }}</span>
          <span class="child-mode-text">{{ isChildMode ? '儿童模式' : '家长模式' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  padding: 24px 32px 40px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 300px 200px at 10% 20%, rgba(255, 200, 87, 0.25), transparent),
    radial-gradient(ellipse 250px 180px at 90% 30%, rgba(167, 139, 250, 0.2), transparent),
    radial-gradient(ellipse 200px 150px at 50% 100%, rgba(107, 197, 168, 0.2), transparent);
  pointer-events: none;
}

.header-inner {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 8px 24px rgba(255, 123, 107, 0.3);
}

.brand-text h1 {
  font-size: 26px;
  background: linear-gradient(135deg, #FF7B6B 0%, #A78BFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2px;
}

.brand-text p {
  font-size: 13px;
  color: var(--c-text-muted);
}

.child-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--c-primary-soft);
}

.child-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF3D6 0%, #FFE5E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.child-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.child-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--c-text);
}

.child-age {
  font-size: 13px;
  font-weight: 400;
  color: var(--c-text-soft);
  margin-left: 4px;
  background: var(--c-accent-soft);
  padding: 2px 10px;
  border-radius: 20px;
}

.queue-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.queue-status {
  padding: 2px 10px;
  background: white;
  border-radius: 12px;
  font-size: 12px;
}

.role-switcher {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.role-label {
  font-size: 13px;
  color: var(--c-text-muted);
}

.role-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.role-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  transition: all 0.3s ease;
  color: var(--c-text-soft);
}

.role-tab:hover {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}

.role-tab.active {
  background: linear-gradient(135deg, #FF7B6B 0%, #FF9F8F 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 123, 107, 0.3);
}

.role-icon {
  font-size: 16px;
}

.call-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #FFC857 0%, #FFB347 100%);
  color: #5D4037;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 6px 16px rgba(255, 200, 87, 0.35);
  transition: all 0.3s ease;
}

.call-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 200, 87, 0.45);
}

.child-mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-text-soft);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--c-border);
  transition: all 0.3s ease;
}

.child-mode-btn:hover {
  background: var(--c-accent-soft);
  color: #92661F;
  border-color: var(--c-accent-soft);
}

.child-mode-btn.active {
  background: linear-gradient(135deg, #FFC857 0%, #FFB347 100%);
  color: #5D4037;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(255, 200, 87, 0.3);
}

.child-mode-icon {
  font-size: 16px;
}

.child-mode-text {
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .header {
    padding: 20px 16px 32px;
  }
  .header-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .brand {
    justify-content: center;
  }
  .child-card {
    justify-content: center;
  }
  .role-switcher {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .role-text {
    display: none;
  }
  .role-tab {
    padding: 8px 10px;
  }
}
</style>
