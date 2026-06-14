<script setup lang="ts">
import HeaderNav from './components/HeaderNav.vue';
import QueueProgress from './components/QueueProgress.vue';
import CheckItems from './components/CheckItems.vue';
import ChairSteps from './components/ChairSteps.vue';
import RewardStickers from './components/RewardStickers.vue';
import DoctorCard from './components/DoctorCard.vue';
import MiniGame from './components/MiniGame.vue';
import PostCareList from './components/PostCareList.vue';
import ParentConfirm from './components/ParentConfirm.vue';
import { currentRole } from './store';
</script>

<template>
  <div class="app-wrap">
    <HeaderNav />

    <main class="main-content">
      <div class="decor decor-1">🫧</div>
      <div class="decor decor-2">✨</div>
      <div class="decor decor-3">🌈</div>
      <div class="decor decor-4">🦷</div>
      <div class="decor decor-5">💗</div>

      <div class="layout-grid">
        <div class="left-col">
          <QueueProgress />
          <DoctorCard v-if="currentRole !== 'nurse'" />
          <MiniGame />
        </div>

        <div class="right-col">
          <CheckItems />
          <ChairSteps />
          <RewardStickers />
          <PostCareList />
          <ParentConfirm v-if="currentRole !== 'nurse'" />
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span class="foot-logo">🦷 小牙医乐园</span>
        <span class="foot-text">让每一次看牙都充满勇气与微笑</span>
        <span class="foot-hint">
          <template v-if="currentRole === 'parent'">📱 家长/儿童视图</template>
          <template v-else-if="currentRole === 'nurse'">📣 护士叫号视图</template>
          <template v-else>🩺 医生操作视图</template>
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  position: relative;
  flex: 1;
  padding: 0 32px 40px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.decor {
  position: fixed;
  font-size: 28px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.decor-1 {
  top: 15%;
  left: 2%;
  animation: float 6s ease-in-out infinite;
}

.decor-2 {
  top: 35%;
  right: 3%;
  font-size: 32px;
  animation: float-slow 8s ease-in-out infinite;
}

.decor-3 {
  top: 60%;
  left: 1%;
  font-size: 36px;
  animation: float 7s ease-in-out infinite 1s;
}

.decor-4 {
  bottom: 20%;
  right: 2%;
  font-size: 30px;
  animation: float-slow 9s ease-in-out infinite 0.5s;
}

.decor-5 {
  bottom: 10%;
  left: 5%;
  font-size: 24px;
  animation: float 5s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(5deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-24px) rotate(-6deg); }
}

.layout-grid {
  position: relative;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 24px;
  z-index: 1;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer {
  margin-top: auto;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--c-border);
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.foot-logo {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-primary);
}

.foot-text {
  font-size: 13px;
  color: var(--c-text-muted);
}

.foot-hint {
  font-size: 12px;
  padding: 5px 14px;
  background: var(--c-purple-soft);
  color: var(--c-purple);
  border-radius: 20px;
  font-weight: 500;
}

@media (max-width: 1100px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
  .main-content {
    padding: 0 20px 32px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 0 14px 24px;
  }
  .left-col, .right-col {
    gap: 16px;
  }
  .footer {
    padding: 16px 20px;
  }
}
</style>
