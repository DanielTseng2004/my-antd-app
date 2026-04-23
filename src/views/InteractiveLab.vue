<template>
  <div class="lab-container">
    <a-typography-title :level="2">
      <experiment-outlined style="margin-right: 12px; color: #722ed1" />
      Vue 3 互動超能力展示館
    </a-typography-title>

    <a-tabs
      v-model:activeKey="activeKey"
      type="card"
    >
      <a-tab-pane
        key="1"
        tab="3D 視差"
      >
        <a-card
          title="跟隨滑鼠的 3D 空間感"
          :bordered="false"
        >
          <div
            class="card-3d-wrap"
            @mousemove="handleCardMove"
            @mouseleave="resetCard"
            :style="cardStyle"
          >
            <div class="card-inner">
              <h3>MODERN</h3>
              <p>UI EXPERIMENT</p>
            </div>
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane
        key="2"
        tab="逃跑按鈕"
      >
        <a-card
          title="抓不到我吧！"
          :bordered="false"
        >
          <div class="speed-test-stage">
            <div class="score-board">捕獲次數：{{ score }}</div>
            <a-button
              type="primary"
              shape="circle"
              class="target-btn"
              :style="targetPos"
              @mouseenter="moveTarget"
              @click="hitTarget"
            >
              🎯
            </a-button>
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane
        key="3"
        tab="粒子爆裂"
      >
        <a-card
          title="點擊按鈕產生物理噴射"
          :bordered="false"
        >
          <div
            class="particle-stage"
            @click="explode"
          >
            <a-button
              type="primary"
              danger
              ghost
              >點擊任何地方產生粒子</a-button
            >
            <div
              v-for="p in particles"
              :key="p.id"
              class="particle"
              :style="p.style"
            ></div>
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane
        key="4"
        tab="影像實驗室"
      >
        <a-card
          title="CSS 渲染引擎測試"
          :bordered="false"
        >
          <a-row :gutter="20">
            <a-col :span="12">
              <div
                class="filter-preview"
                :style="filterStyle"
              >
                <img
                  src="https://picsum.photos/400/300?grayscale"
                  alt="Sample"
                />
              </div>
            </a-col>
            <a-col :span="12">
              <a-space
                direction="vertical"
                style="width: 100%"
              >
                <span>模糊: {{ filters.blur }}px</span
                ><a-slider
                  v-model:value="filters.blur"
                  :max="15"
                />
                <span>色相: {{ filters.hue }}°</span
                ><a-slider
                  v-model:value="filters.hue"
                  :max="360"
                />
                <span>亮點: {{ filters.bright }}%</span
                ><a-slider
                  v-model:value="filters.bright"
                  :min="50"
                  :max="200"
                />
              </a-space>
            </a-col>
          </a-row>
        </a-card>
      </a-tab-pane>

      <a-tab-pane
        key="5"
        tab="氛圍控制"
      >
        <a-card
          title="全域場景氛圍模擬"
          :bordered="false"
        >
          <div
            class="ambient-light"
            :style="{ background: ambientBg }"
          >
            <div
              class="light-bulb"
              :style="{ boxShadow: `0 0 50px ${ambientBg}` }"
            ></div>
          </div>
          <div style="margin-top: 20px">
            <a-radio-group
              v-model:value="ambientColor"
              button-style="solid"
            >
              <a-radio-button value="#1890ff">科技藍</a-radio-button>
              <a-radio-button value="#52c41a">活力綠</a-radio-button>
              <a-radio-button value="#f5222d">警戒紅</a-radio-button>
              <a-radio-button value="#722ed1">幻影紫</a-radio-button>
            </a-radio-group>
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane
        key="6"
        tab="數字噴泉"
      >
        <a-card
          title="響應式數值快速變化"
          :bordered="false"
        >
          <div class="counter-box">
            <h1 :style="{ color: ambientColor }">
              {{ displayCount.toFixed(0) }}
            </h1>
            <a-progress
              type="dashboard"
              :percent="displayCount % 100"
            />
          </div>
          <a-space style="margin-top: 15px">
            <a-button @click="count += 100">+100</a-button>
            <a-button
              @click="count = 0"
              danger
              >歸零</a-button
            >
          </a-space>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch } from "vue";
import { ExperimentOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const activeKey = ref("1");

// --- 1. 3D 卡片 ---
const rotX = ref(0);
const rotY = ref(0);
const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
}));
const handleCardMove = (e) => {
  const box = e.currentTarget.getBoundingClientRect();
  rotX.value = (box.height / 2 - (e.clientY - box.top)) / 10;
  rotY.value = (e.clientX - box.left - box.width / 2) / 10;
};
const resetCard = () => {
  rotX.value = 0;
  rotY.value = 0;
};

// --- 2. 逃跑按鈕 ---
const score = ref(0);
const targetPos = reactive({ top: "50%", left: "50%" });
const moveTarget = () => {
  if (score.value >= 3) {
    targetPos.top = `${Math.random() * 80 + 10}%`;
    targetPos.left = `${Math.random() * 80 + 10}%`;
  }
};
const hitTarget = () => {
  score.value++;
  if (score.value === 3) message.info("它開始認真躲避了！");
  moveTarget();
};

// --- 3. 粒子粉碎 ---
const particles = ref([]);
const explode = (e) => {
  for (let i = 0; i < 12; i++) {
    const id = Date.now() + i;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 100 + 50;
    const p = {
      id,
      style: { left: `${e.clientX}px`, top: `${e.clientY}px`, opacity: 1 },
    };
    particles.value.push(p);
    setTimeout(() => {
      const idx = particles.value.findIndex((v) => v.id === id);
      if (idx !== -1) {
        particles.value[idx].style.transform =
          `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
        particles.value[idx].style.opacity = 0;
      }
    }, 50);
    setTimeout(() => {
      particles.value = particles.value.filter((v) => v.id !== id);
    }, 800);
  }
};

// --- 4. 影像濾鏡 ---
const filters = reactive({ blur: 0, hue: 0, bright: 100 });
const filterStyle = computed(() => ({
  filter: `blur(${filters.blur}px) hue-rotate(${filters.hue}deg) brightness(${filters.bright}%)`,
}));

// --- 5. 氛圍控制 ---
const ambientColor = ref("#1890ff");
const ambientBg = computed(() => ambientColor.value);

// --- 6. 數字跳動 ---
const count = ref(0);
const displayCount = ref(0);
watch(count, (newVal) => {
  const step = () => {
    if (displayCount.value < newVal) {
      displayCount.value += Math.ceil((newVal - displayCount.value) / 10);
      requestAnimationFrame(step);
    } else {
      displayCount.value = newVal;
    }
  };
  step();
});
</script>
<style scoped>
.lab-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* 1. 3D Card */
.card-3d-wrap {
  width: 300px;
  height: 180px;
  margin: 40px auto;
  transition: transform 0.1s;
  transform-style: preserve-3d;
  cursor: pointer;
}
.card-inner {
  height: 100%;
  background: linear-gradient(45deg, #1890ff, #722ed1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

/* 2. Escape Button */
.speed-test-stage {
  height: 300px;
  background: #f5f5f5;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 2px dashed #ddd;
}
.target-btn {
  position: absolute;
  transition: 0.2s;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-size: 20px;
}
.score-board {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: bold;
}

/* 3. Particles */
.particle-stage {
  height: 300px;
  background: #141414;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: crosshair;
}
.particle {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  pointer-events: none;
  transition: 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1000;
}

/* 4. Filters */
.filter-preview {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.filter-preview img {
  width: 100%;
  height: auto;
}

/* 5. Ambient */
.ambient-light {
  height: 150px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
}
.light-bulb {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
}

/* 6. Counter */
.counter-box {
  text-align: center;
  padding: 20px;
}
.counter-box h1 {
  font-size: 48px;
  margin-bottom: 0;
}
</style>
