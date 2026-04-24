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
      <!-- ======================== TAB 1: 3D 視差 ======================== -->
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
            @click="flipCard"
            :style="cardStyle"
          >
            <!-- 光澤高光層 -->
            <div
              class="card-shine"
              :style="shineStyle"
            ></div>

            <!-- 正面 -->
            <div
              class="card-inner card-front"
              :class="{ flipped: isFlipped }"
              style="transform-style: preserve-3d"
            >
              <h3
                style="
                  transform: translateZ(60px);
                  text-shadow: 0 10px 20px rgba(255, 255, 255, 0.3);
                "
              >
                MODERN
              </h3>
              <p style="transform: translateZ(30px); opacity: 0.8">
                UI EXPERIMENT
              </p>
              <small
                style="
                  transform: translateZ(20px);
                  opacity: 0.5;
                  margin-top: 8px;
                "
                >點擊翻轉卡片</small
              >
            </div>

            <!-- 背面 -->
            <div
              class="card-inner card-back"
              :class="{ flipped: isFlipped }"
              style="transform-style: preserve-3d"
            >
              <h3 style="transform: translateZ(60px)">✨ BACK SIDE</h3>
              <p style="transform: translateZ(30px); opacity: 0.8">
                互動超能力展示
              </p>
              <small
                style="
                  transform: translateZ(20px);
                  opacity: 0.5;
                  margin-top: 8px;
                "
                >點擊再翻回去</small
              >
            </div>
          </div>
        </a-card>
      </a-tab-pane>

      <!-- ======================== TAB 2: 逃跑按鈕 ======================== -->
      <a-tab-pane
        key="2"
        tab="逃跑按鈕"
      >
        <a-card
          title="抓不到我吧！"
          :bordered="false"
        >
          <a-space style="margin-bottom: 12px">
            <a-tag color="blue">難度：{{ difficultyLabel }}</a-tag>
            <a-tag color="green">捕獲次數：{{ score }}</a-tag>
            <a-tag
              color="orange"
              v-if="comboCount > 1"
              >🔥 連擊 x{{ comboCount }}</a-tag
            >
            <a-tag
              color="red"
              v-if="timerRunning"
              >⏱ {{ timeLeft }}s</a-tag
            >
            <a-button
              size="small"
              @click="startTimer"
              :disabled="timerRunning"
              type="primary"
              ghost
              >開始計時挑戰</a-button
            >
            <a-button
              size="small"
              @click="resetGame"
              danger
              ghost
              >重置</a-button
            >
          </a-space>

          <div class="speed-test-stage">
            <div class="score-board">最高分：{{ bestScore }}</div>

            <!-- 殘影軌跡 -->
            <div
              v-for="trail in trails"
              :key="trail.id"
              class="trail"
              :style="{
                top: trail.top,
                left: trail.left,
                opacity: trail.opacity,
              }"
            ></div>

            <a-button
              type="primary"
              shape="circle"
              class="target-btn"
              :style="[targetPos, targetSizeStyle]"
              @mouseenter="moveTarget"
              @click="hitTarget"
              >🎯</a-button
            >
          </div>

          <div
            v-if="timerFinished"
            style="margin-top: 10px; text-align: center"
          >
            <a-result
              status="success"
              :title="`挑戰結束！你抓到了 ${score} 次`"
              :sub-title="
                score >= bestScore
                  ? '🏆 新紀錄！'
                  : `最高紀錄是 ${bestScore} 次`
              "
              style="padding: 12px"
            />
          </div>
        </a-card>
      </a-tab-pane>

      <!-- ======================== TAB 3: 粒子爆裂 ======================== -->
      <a-tab-pane
        key="3"
        tab="粒子爆裂"
      >
        <a-card
          title="點擊按鈕產生物理噴射"
          :bordered="false"
        >
          <a-space style="margin-bottom: 12px; flex-wrap: wrap">
            <span>粒子主題：</span>
            <a-radio-group
              v-model:value="particleTheme"
              button-style="solid"
              size="small"
            >
              <a-radio-button value="fire">🔥 火焰</a-radio-button>
              <a-radio-button value="ice">❄️ 冰晶</a-radio-button>
              <a-radio-button value="star">⭐ 星光</a-radio-button>
              <a-radio-button value="emoji">🎉 彩虹</a-radio-button>
            </a-radio-group>
            <a-tag color="purple">累計粒子：{{ totalParticles }}</a-tag>
          </a-space>

          <div
            class="particle-stage"
            @click="explode"
            @mousemove="trackMouseSpeed"
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
            >
              {{ p.shape }}
            </div>
          </div>
        </a-card>
      </a-tab-pane>

      <!-- ======================== TAB 4: 影像實驗室 ======================== -->
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
              <div class="filter-preview">
                <img
                  :src="uploadedImage || 'https://picsum.photos/400/300'"
                  alt="Sample"
                  :style="filterStyle"
                />
              </div>
              <div style="margin-top: 10px; text-align: center">
                <a-upload
                  :before-upload="handleImageUpload"
                  :show-upload-list="false"
                  accept="image/*"
                >
                  <a-button size="small">📁 上傳自訂圖片</a-button>
                </a-upload>
              </div>
            </a-col>
            <a-col :span="12">
              <a-space
                direction="vertical"
                style="width: 100%"
              >
                <!-- 濾鏡預設 -->
                <div>
                  <span>快速預設：</span>
                  <a-space style="margin-top: 4px; flex-wrap: wrap">
                    <a-button
                      size="small"
                      v-for="preset in filterPresets"
                      :key="preset.name"
                      @click="applyPreset(preset)"
                      >{{ preset.name }}</a-button
                    >
                  </a-space>
                </div>
                <a-divider style="margin: 8px 0" />
                <span>模糊: {{ filters.blur }}px</span>
                <a-slider
                  v-model:value="filters.blur"
                  :max="15"
                />
                <span>色相: {{ filters.hue }}°</span>
                <a-slider
                  v-model:value="filters.hue"
                  :max="360"
                />
                <span>亮度: {{ filters.bright }}%</span>
                <a-slider
                  v-model:value="filters.bright"
                  :min="50"
                  :max="200"
                />
                <span>飽和度: {{ filters.saturate }}%</span>
                <a-slider
                  v-model:value="filters.saturate"
                  :min="0"
                  :max="300"
                />
                <span>對比度: {{ filters.contrast }}%</span>
                <a-slider
                  v-model:value="filters.contrast"
                  :min="50"
                  :max="200"
                />
                <a-space>
                  <a-checkbox v-model:checked="filters.sepia"
                    >懷舊(Sepia)</a-checkbox
                  >
                  <a-checkbox v-model:checked="filters.invert"
                    >反色(Invert)</a-checkbox
                  >
                </a-space>
                <a-divider style="margin: 8px 0" />
                <div>
                  <span style="font-size: 12px; color: #888">CSS 輸出：</span>
                  <div class="css-output">{{ filterCSSOutput }}</div>
                  <a-button
                    size="small"
                    @click="copyFilterCSS"
                    style="margin-top: 4px"
                    >📋 複製 CSS</a-button
                  >
                </div>
              </a-space>
            </a-col>
          </a-row>
        </a-card>
      </a-tab-pane>

      <!-- ======================== TAB 5: 氛圍控制 ======================== -->
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
            :style="{ background: ambientBgGradient }"
          >
            <div
              class="light-bulb"
              :class="{ breathing: breathingMode }"
              :style="bulbStyle"
            ></div>
          </div>
          <div style="margin-top: 20px">
            <a-space
              direction="vertical"
              style="width: 100%"
            >
              <div>
                <span>預設色彩：</span>
                <a-radio-group
                  v-model:value="ambientColor"
                  button-style="solid"
                  style="margin-top: 8px"
                >
                  <a-radio-button value="#1890ff">科技藍</a-radio-button>
                  <a-radio-button value="#52c41a">活力綠</a-radio-button>
                  <a-radio-button value="#f5222d">警戒紅</a-radio-button>
                  <a-radio-button value="#722ed1">幻影紫</a-radio-button>
                </a-radio-group>
              </div>
              <a-space>
                <span>自訂顏色：</span>
                <input
                  type="color"
                  v-model="ambientColor"
                  class="color-picker"
                />
                <span>第二色：</span>
                <input
                  type="color"
                  v-model="ambientColor2"
                  class="color-picker"
                />
                <a-checkbox v-model:checked="gradientMode">漸層模式</a-checkbox>
              </a-space>
              <a-space>
                <a-checkbox v-model:checked="breathingMode"
                  >呼吸燈效果</a-checkbox
                >
              </a-space>
            </a-space>
          </div>
        </a-card>
      </a-tab-pane>

      <!-- ======================== TAB 6: 數字噴泉 ======================== -->
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
              :percent="Math.abs(displayCount % 100)"
            />
          </div>

          <a-space style="margin-top: 15px; flex-wrap: wrap">
            <a-input-number
              v-model:value="stepValue"
              :min="1"
              :max="10000"
              style="width: 100px"
              size="small"
            />
            <a-button @click="count += stepValue">+{{ stepValue }}</a-button>
            <a-button
              @click="count -= stepValue"
              :disabled="count - stepValue < 0"
              >-{{ stepValue }}</a-button
            >
            <a-button
              @click="count = 0"
              danger
              >歸零</a-button
            >
            <a-button
              @click="setTarget"
              type="dashed"
              >🎯 設定目標</a-button
            >
          </a-space>

          <div
            v-if="targetValue > 0"
            style="margin-top: 12px"
          >
            <a-progress
              :percent="Math.min(100, Math.round((count / targetValue) * 100))"
              :status="count >= targetValue ? 'success' : 'active'"
            />
            <span style="font-size: 12px; color: #888"
              >目標：{{ targetValue }}，還差
              {{ Math.max(0, targetValue - count) }}</span
            >
          </div>

          <div
            v-if="history.length > 0"
            style="margin-top: 16px"
          >
            <a-divider
              orientation="left"
              style="font-size: 12px"
              >操作紀錄</a-divider
            >
            <div class="history-list">
              <a-tag
                v-for="(h, i) in history.slice().reverse()"
                :key="i"
                :color="h.delta > 0 ? 'green' : h.delta < 0 ? 'red' : 'default'"
                style="margin: 2px"
              >
                {{ h.delta > 0 ? "+" : "" }}{{ h.delta }} → {{ h.result }}
              </a-tag>
            </div>
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from "vue";
import { ExperimentOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const activeKey = ref("1");

// ======================== TAB 1: 3D 視差 + 翻轉 + 光澤 ========================
const rotX = ref(0);
const rotY = ref(0);
const isFlipped = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotX.value}deg) rotateY(${rotY.value + (isFlipped.value ? 180 : 0)}deg)`,
}));

const shineStyle = computed(() => ({
  background: `radial-gradient(circle at ${mouseX.value}% ${mouseY.value}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
  opacity: Math.abs(rotX.value) + Math.abs(rotY.value) > 0 ? 1 : 0,
}));

const handleCardMove = (e) => {
  const box = e.currentTarget.getBoundingClientRect();
  rotX.value = (box.height / 2 - (e.clientY - box.top)) / 10;
  rotY.value = (e.clientX - box.left - box.width / 2) / 10;
  mouseX.value = ((e.clientX - box.left) / box.width) * 100;
  mouseY.value = ((e.clientY - box.top) / box.height) * 100;
};
const resetCard = () => {
  rotX.value = 0;
  rotY.value = 0;
};
const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

// ======================== TAB 2: 逃跑按鈕 ========================
const score = ref(0);
const bestScore = ref(0);
const comboCount = ref(0);
const lastHitTime = ref(0);
const trails = ref([]);
const targetPos = reactive({ top: "50%", left: "50%" });
const timerRunning = ref(false);
const timerFinished = ref(false);
const timeLeft = ref(10);
let timerInterval = null;

const difficultyLabel = computed(() => {
  if (score.value < 3) return "新手";
  if (score.value < 8) return "普通";
  if (score.value < 15) return "困難";
  return "地獄";
});

const targetSizeStyle = computed(() => {
  const size = Math.max(28, 50 - score.value * 1.5);
  return {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.5}px`,
  };
});

const addTrail = () => {
  const id = Date.now() + Math.random();
  trails.value.push({
    id,
    top: targetPos.top,
    left: targetPos.left,
    opacity: 0.6,
  });
  setTimeout(() => {
    const idx = trails.value.findIndex((t) => t.id === id);
    if (idx !== -1) trails.value[idx].opacity = 0;
  }, 100);
  setTimeout(() => {
    trails.value = trails.value.filter((t) => t.id !== id);
  }, 600);
};

const moveTarget = () => {
  if (score.value >= 3) {
    addTrail();
    targetPos.top = `${Math.random() * 80 + 10}%`;
    targetPos.left = `${Math.random() * 80 + 10}%`;
  }
};

const hitTarget = () => {
  const now = Date.now();
  if (now - lastHitTime.value < 1000) {
    comboCount.value++;
    if (comboCount.value >= 3) message.success(`🔥 ${comboCount.value} 連擊！`);
  } else {
    comboCount.value = 1;
  }
  lastHitTime.value = now;
  score.value++;
  if (score.value > bestScore.value) bestScore.value = score.value;
  if (score.value === 3) message.info("它開始認真躲避了！");
  moveTarget();
};

const startTimer = () => {
  score.value = 0;
  timerRunning.value = true;
  timerFinished.value = false;
  timeLeft.value = 10;
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      timerRunning.value = false;
      timerFinished.value = true;
      if (score.value > bestScore.value) bestScore.value = score.value;
    }
  }, 1000);
};

const resetGame = () => {
  clearInterval(timerInterval);
  score.value = 0;
  comboCount.value = 0;
  timerRunning.value = false;
  timerFinished.value = false;
  timeLeft.value = 10;
  targetPos.top = "50%";
  targetPos.left = "50%";
};

// ======================== TAB 3: 粒子爆裂 ========================
const particles = ref([]);
const particleTheme = ref("fire");
const totalParticles = ref(0);
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = 0;

const themeConfig = {
  fire: {
    colors: ["#ff4d4f", "#fa8c16", "#fadb14", "#ff7a45"],
    shapes: ["●", "●", "●"],
  },
  ice: {
    colors: ["#91d5ff", "#bae7ff", "#e6f7ff", "#ffffff"],
    shapes: ["❄", "◆", "●"],
  },
  star: {
    colors: ["#fffbe6", "#fadb14", "#ffc53d", "#ffffff"],
    shapes: ["★", "✦", "✧"],
  },
  emoji: {
    colors: ["#ff4d4f", "#52c41a", "#1890ff", "#fadb14", "#722ed1"],
    shapes: ["🎉", "✨", "💥", "🌟", "🎊"],
  },
};

const trackMouseSpeed = (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastMouseTime = Date.now();
};

const explode = (e) => {
  const theme = themeConfig[particleTheme.value];
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  const dt = Date.now() - lastMouseTime + 1;
  const speed = Math.min((Math.sqrt(dx * dx + dy * dy) / dt) * 10, 3);
  const count = Math.round(8 + speed * 6);

  for (let i = 0; i < count; i++) {
    const id = Date.now() + i + Math.random();
    const angle = Math.random() * Math.PI * 2;
    const dist = (Math.random() * 80 + 40) * (1 + speed * 0.3);
    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    const shape = theme.shapes[Math.floor(Math.random() * theme.shapes.length)];
    const size = Math.random() * 10 + 6;

    const p = {
      id,
      shape,
      style: {
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        color,
        fontSize: `${size}px`,
        opacity: 1,
        transition: `0s`,
      },
    };
    particles.value.push(p);
    totalParticles.value++;

    setTimeout(() => {
      const idx = particles.value.findIndex((v) => v.id === id);
      if (idx !== -1) {
        const gravityY = Math.sin(angle) * dist + 60;
        particles.value[idx].style = {
          ...particles.value[idx].style,
          transform: `translate(${Math.cos(angle) * dist}px, ${gravityY}px) scale(0) rotate(${Math.random() * 720}deg)`,
          opacity: 0,
          transition: `0.8s cubic-bezier(0.165, 0.84, 0.44, 1)`,
        };
      }
    }, 30);

    setTimeout(() => {
      particles.value = particles.value.filter((v) => v.id !== id);
    }, 900);
  }
};

// ======================== TAB 4: 影像實驗室 ========================
const filters = reactive({
  blur: 0,
  hue: 0,
  bright: 100,
  saturate: 100,
  contrast: 100,
  sepia: false,
  invert: false,
});
const uploadedImage = ref(null);

const filterStyle = computed(() => ({
  filter: `blur(${filters.blur}px) hue-rotate(${filters.hue}deg) brightness(${filters.bright}%) saturate(${filters.saturate}%) contrast(${filters.contrast}%)${filters.sepia ? " sepia(1)" : ""}${filters.invert ? " invert(1)" : ""}`,
}));

const filterCSSOutput = computed(
  () =>
    `filter: blur(${filters.blur}px) hue-rotate(${filters.hue}deg) brightness(${filters.bright}%) saturate(${filters.saturate}%) contrast(${filters.contrast}%)${filters.sepia ? " sepia(1)" : ""}${filters.invert ? " invert(1)" : ""};`,
);

const filterPresets = [
  {
    name: "🌃 賽博龐克",
    values: {
      blur: 0,
      hue: 200,
      bright: 120,
      saturate: 250,
      contrast: 130,
      sepia: false,
      invert: false,
    },
  },
  {
    name: "📷 懷舊底片",
    values: {
      blur: 0,
      hue: 30,
      bright: 90,
      saturate: 60,
      contrast: 110,
      sepia: true,
      invert: false,
    },
  },
  {
    name: "🌸 夢幻粉",
    values: {
      blur: 1,
      hue: 320,
      bright: 115,
      saturate: 150,
      contrast: 90,
      sepia: false,
      invert: false,
    },
  },
  {
    name: "🎨 負片",
    values: {
      blur: 0,
      hue: 180,
      bright: 100,
      saturate: 100,
      contrast: 100,
      sepia: false,
      invert: true,
    },
  },
];

const applyPreset = (preset) => Object.assign(filters, preset.values);

const handleImageUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
  return false;
};

const copyFilterCSS = () => {
  navigator.clipboard.writeText(filterCSSOutput.value);
  message.success("CSS 已複製到剪貼簿！");
};

// ======================== TAB 5: 氛圍控制 ========================
const ambientColor = ref("#1890ff");
const ambientColor2 = ref("#722ed1");
const gradientMode = ref(false);
const breathingMode = ref(false);

const ambientBgGradient = computed(() =>
  gradientMode.value
    ? `linear-gradient(135deg, ${ambientColor.value}, ${ambientColor2.value})`
    : ambientColor.value,
);

const bulbStyle = computed(() => ({
  boxShadow: `0 0 50px ${ambientColor.value}, 0 0 20px ${ambientColor.value}`,
}));

// ======================== TAB 6: 數字噴泉 ========================
const count = ref(0);
const displayCount = ref(0);
const stepValue = ref(100);
const targetValue = ref(0);
const history = ref([]);

const setTarget = () => {
  const val = parseInt(prompt("設定目標數值：") || "0");
  if (!isNaN(val) && val > 0) targetValue.value = val;
};

watch(count, (newVal, oldVal) => {
  const delta = newVal - oldVal;
  history.value.push({ delta, result: newVal });
  if (history.value.length > 10) history.value.shift();

  if (targetValue.value > 0 && newVal >= targetValue.value) {
    message.success("🎉 達成目標！");
  }

  const animate = () => {
    if (Math.abs(displayCount.value - newVal) > 0.5) {
      displayCount.value += (newVal - displayCount.value) / 8;
      requestAnimationFrame(animate);
    } else {
      displayCount.value = newVal;
    }
  };
  animate();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.lab-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* ======================== 1. 3D Card ======================== */
.card-3d-wrap {
  width: 300px;
  height: 180px;
  margin: 40px auto;
  transition: transform 0.1s;
  transform-style: preserve-3d;
  cursor: pointer;
  position: relative;
}

.card-shine {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.2s;
}

.card-inner {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: opacity 0.2s;
}

.card-front {
  background: linear-gradient(45deg, #1890ff, #722ed1);
}

.card-back {
  background: linear-gradient(45deg, #722ed1, #eb2f96);
  transform: rotateY(180deg);
}

/* ======================== 2. Escape Button ======================== */
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
  transition:
    top 0.15s ease,
    left 0.15s ease;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.score-board {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: bold;
}
.trail {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1890ff44;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

/* ======================== 3. Particles ======================== */
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
  pointer-events: none;
  z-index: 1000;
  transform-origin: center;
  line-height: 1;
}

/* ======================== 4. Filters ======================== */
.filter-preview {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.filter-preview img {
  width: 100%;
  height: auto;
  display: block;
}
.css-output {
  background: #1a1a2e;
  color: #7ee8a2;
  font-family: "Courier New", monospace;
  font-size: 11px;
  padding: 8px;
  border-radius: 6px;
  word-break: break-all;
  margin-top: 4px;
}

/* ======================== 5. Ambient ======================== */
.ambient-light {
  height: 150px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s;
}
.light-bulb {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  transition: box-shadow 0.5s;
}
.light-bulb.breathing {
  animation: breathe 2s ease-in-out infinite;
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}

.color-picker {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
}

/* ======================== 6. Counter ======================== */
.counter-box {
  text-align: center;
  padding: 20px;
}
.counter-box h1 {
  font-size: 48px;
  margin-bottom: 0;
  transition: color 0.3s;
}
.history-list {
  max-height: 80px;
  overflow-y: auto;
}
</style>
