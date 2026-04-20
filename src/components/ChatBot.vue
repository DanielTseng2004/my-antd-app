<template>
  <a-float-button
    type="primary"
    :style="{ right: '24px', bottom: '24px', width: '60px', height: '60px' }"
    @click="open = !open"
  >
    <template #icon><MessageOutlined /></template>
  </a-float-button>

  <a-card
    v-if="open"
    title="AI 網站導遊"
    :bordered="false"
    class="chat-card"
  >
    <template #extra>
      <a
        @click="open = false"
        class="close-btn"
        ><CloseOutlined
      /></a>
    </template>

    <div
      class="message-container"
      ref="scrollBox"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['msg-wrapper', msg.role]"
      >
        <a-avatar
          v-if="msg.role === 'ai'"
          :size="32"
          class="avatar"
        >
          <template #icon><RobotOutlined /></template>
        </a-avatar>
        <div class="bubble">
          {{ msg.content }}
          <span
            v-if="msg.isTyping"
            class="cursor"
            >|</span
          >
        </div>
      </div>

      <div
        v-if="isThinking"
        class="msg-wrapper ai"
      >
        <a-avatar
          :size="32"
          class="avatar"
          ><template #icon><RobotOutlined /></template
        ></a-avatar>
        <div class="bubble thinking"><a-spin size="small" /></div>
      </div>

      <div
        v-if="!isThinking && !isTyping"
        class="options-area"
      >
        <a-tag
          v-for="opt in currentOptions"
          :key="opt"
          class="quick-opt"
          @click="handleOptionClick(opt)"
        >
          {{ opt }}
        </a-tag>
      </div>
    </div>

    <template #actions>
      <div class="input-box">
        <div
          v-if="!showCustomInput"
          class="guide-menu"
        >
          <a-divider style="margin: 4px 0 12px; font-size: 12px"
            >想去哪裡逛逛？</a-divider
          >
          <a-space
            wrap
            style="justify-content: center; width: 100%"
          >
            <a-button
              v-for="item in guideMenu"
              :key="item.key"
              size="small"
              shape="round"
              type="primary"
              ghost
              @click="handleOptionClick(item.label)"
            >
              {{ item.icon }} {{ item.label }}
            </a-button>
            <a-button
              size="small"
              shape="circle"
              @click="showCustomInput = true"
            >
              <EditOutlined />
            </a-button>
          </a-space>
        </div>

        <a-input
          v-else
          v-model:value="userInput"
          placeholder="請輸入您的問題..."
          @pressEnter="handleSend"
          :disabled="isThinking || isTyping"
        >
          <template #prefix>
            <RollbackOutlined
              @click="showCustomInput = false"
              style="cursor: pointer; margin-right: 4px"
            />
          </template>
          <template #suffix>
            <SendOutlined
              @click="handleSend"
              :style="sendIconStyle"
            />
          </template>
        </a-input>
      </div>
    </template>
  </a-card>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { message as antMessage } from "ant-design-vue";
import {
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
  CloseOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons-vue";

const router = useRouter();
const open = ref(false);
const userInput = ref("");
const isThinking = ref(false);
const isTyping = ref(false);
const showCustomInput = ref(false);
const scrollBox = ref(null);

// 1. 導覽選單定義
const guideMenu = [
  { key: "home", label: "返回首頁", icon: "🏠" },
  { key: "posts", label: "技術文章", icon: "📚" },
  { key: "stats", label: "數據看板", icon: "📊" },
  { key: "form", label: "人才資料", icon: "📝" },
  { key: "about", label: "關於作者", icon: "👤" },
];

// 2. 知識庫對接路由表 (對應您 index.js 的路徑)
const MOCK_DB = {
  返回首頁: {
    ans: "沒問題，這就帶您回到首頁看最新動態！",
    options: ["技術文章", "關於作者"],
    path: "/",
  },
  技術文章: {
    ans: "這裡是作者的技術累積，包含 Vue 3 與 Vite 的實戰心得。正在跳轉...",
    options: ["最新文章", "返回首頁"],
    path: "/posts",
  },
  數據看板: {
    ans: "正在為您載入數據視覺化看板，請稍候...",
    options: ["人才資料", "返回首頁"],
    path: "/staticdashboard",
  },
  人才資料: {
    ans: "正在前往人才資料管理頁面...",
    options: ["數據看板", "返回首頁"],
    path: "/form",
  },
  關於作者: {
    ans: "想認識 Manus 嗎？這就帶您去個人簡介頁面。",
    options: ["技術棧", "聯絡方式"],
    path: "/about",
  },
  系統設定: {
    ans: "正在進入系統偏好設置...",
    options: ["返回首頁"],
    path: "/systemsettings",
  },
  default: {
    ans: "抱歉，這超出了導覽範圍。您可以點選下方選單前往主要景點！",
    options: ["返回首頁", "技術文章", "關於作者"],
  },
};

const messages = ref([
  {
    role: "ai",
    content:
      "您好！我是網站導遊。您可以點擊下方選單，我會直接帶您去想看的頁面！",
    isTyping: false,
  },
]);

// 3. 核心處理邏輯
const handleSend = async (manualInput = null) => {
  const text = typeof manualInput === "string" ? manualInput : userInput.value;
  if (!text.trim() || isThinking.value || isTyping.value) return;

  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  scrollToBottom();

  isThinking.value = true;

  setTimeout(async () => {
    isThinking.value = false;
    const matchKey = Object.keys(MOCK_DB).find((k) => text.includes(k));
    const result = matchKey ? MOCK_DB[matchKey] : MOCK_DB.default;

    await typeWrite(result.ans);

    // 執行路由跳轉
    if (result.path) {
      setTimeout(() => {
        router.push(result.path);
        antMessage.info(`導遊帶路：已到達 ${text}`);
      }, 500);
    }
  }, 600);
};

// 打字效果與滾動 (略，同之前邏輯)
const typeWrite = async (text) => {
  isTyping.value = true;
  const newMsg = { role: "ai", content: "", isTyping: true };
  messages.value.push(newMsg);
  const targetMsg = messages.value[messages.value.length - 1];
  let currentText = "";
  for (let i = 0; i < text.length; i++) {
    currentText += text.charAt(i);
    targetMsg.content = currentText;
    if (i % 3 === 0) await scrollToBottom();
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  targetMsg.isTyping = false;
  isTyping.value = false;
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (scrollBox.value) scrollBox.value.scrollTop = scrollBox.value.scrollHeight;
};

const handleOptionClick = (opt) => handleSend(opt);

const currentOptions = computed(() => {
  const lastAiMsg = [...messages.value]
    .reverse()
    .find((m) => m.role === "ai" && !m.isTyping);
  if (!lastAiMsg) return ["返回首頁", "技術文章"];
  const match = Object.values(MOCK_DB).find(
    (item) => item.ans === lastAiMsg.content,
  );
  return match ? match.options : MOCK_DB.default.options;
});

const sendIconStyle = computed(() => ({
  color: userInput.value.trim()
    ? "var(--color-primary)"
    : "var(--input-disabled-color)",
  cursor: "pointer",
}));
</script>

<style scoped>
.guide-menu {
  padding: 8px;
  background: var(--bg-primary);
  border-radius: 8px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-opt {
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-opt:hover {
  background: var(--color-primary);
  color: white;
}
/* 聊天視窗主體 */
.chat-card {
  position: fixed;
  right: 24px;
  bottom: 100px;
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  z-index: 1001;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: var(--surface-bg);
}
/* 修改頭像尺寸與對齊 */
.avatar {
  width: 40px !important; /* 從 32px 加大到 40px */
  height: 40px !important;
  min-width: 40px; /* 防止 flex 擠壓 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ai-avatar-bg);
}

/* 讓內部的機器人圖示也跟著變大 */
.avatar :deep(.anticon) {
  font-size: 20px; /* 加大圖示本體 */
  color: var(--ai-avatar-icon-color);
}

/* 修正訊息包裹器，確保頭像跟氣泡頂部對齊 */
.msg-wrapper.ai {
  align-self: flex-start;
  align-items: flex-start; /* 確保對齊頂部 */
  margin-bottom: 4px; /* 增加一點下方間距防止太擠 */
}
/* 訊息區域 */
.message-container {
  height: 380px;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--surface-bg);
}

/* 訊息包裹器 */
.msg-wrapper {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.msg-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-wrapper.ai {
  align-self: flex-start;
}

/* 對話氣泡 */
.bubble {
  font-size: medium;
  font-weight: bold;
  padding: 10px 14px;
  border-radius: 15px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
  color: var(--text);
}

.user .bubble {
  background: var(--chat-message-user-bg);
  color: var(--chat-message-user-text);
  border-bottom-right-radius: 2px;
}

.ai .bubble {
  background: var(--chat-message-ai-bg);
  color: var(--text-primary);
  border-bottom-left-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 選項按鈕區域 */
.options-area {
  padding-left: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: -8px;
  margin-bottom: 8px;
}

.quick-opt {
  cursor: pointer;
  border-radius: 20px;
  padding: 4px 12px;
  background: var(--surface-bg);
  border: 1px solid var(--quick-option-border);
  color: var(--quick-option-text);
  transition: all 0.3s;
  user-select: none;
}

.quick-opt:hover {
  background: var(--quick-option-border);
  color: #fff;
}

/* 其他小組件樣式 */
.thinking {
  display: flex;
  align-items: center;
  background: transparent !important;
  box-shadow: none !important;
}

.input-box {
  padding: 8px 12px;
}

.cursor {
  animation: blink 1s infinite;
  font-weight: bold;
  color: var(--color-primary);
}

.close-btn:hover {
  color: var(--color-error);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 滾動條樣式優化 */
.message-container::-webkit-scrollbar {
  width: 4px;
}
.message-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

:deep(:root[data-theme="dark"]) .chat-card {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  color: var(--text);
}

:deep(:root[data-theme="dark"]) .message-container {
  background-color: rgba(255, 255, 255, 0.15);
}

:deep(:root[data-theme="dark"]) .ai .bubble {
  background: rgba(255, 255, 255, 0.18);
  color: var(--text);
}

:deep(:root[data-theme="dark"]) .avatar {
  background: rgba(255, 255, 255, 0.12);
}

:deep(:root[data-theme="dark"]) .quick-opt {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--text);
}

:deep(:root[data-theme="dark"]) .message-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
}

:deep(:root[data-theme="dark"]) .message-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
}
</style>
