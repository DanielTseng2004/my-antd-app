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
    title="AI 智能助理"
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
        >
          <template #icon><RobotOutlined /></template>
        </a-avatar>
        <div class="bubble thinking">
          <a-spin size="small" />
        </div>
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
        <a-input
          v-model:value="userInput"
          placeholder="輸入問題或點選上方標籤..."
          @pressEnter="handleSend"
          :disabled="isThinking || isTyping"
        >
          <template #suffix>
            <SendOutlined
              @click="handleSend"
              :style="{
                color: userInput.trim()
                  ? 'var(--color-primary)'
                  : 'var(--input-disabled-color)',
                cursor: 'pointer',
              }"
            />
          </template>
        </a-input>
      </div>
    </template>
  </a-card>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import {
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

// 1. 配置：模擬資料庫（含回覆與推薦選項）
const MOCK_DB = {
  系統介紹: {
    ans: "本系統提供個人部落格管理、人才查詢與統計數據展示，並支援深色模式切換。",
    options: ["功能亮點", "如何聯繫你？"],
  },
  功能亮點: {
    ans: "亮點包含：Ant Design Vue 精美組件、Vite 極速開發體驗、以及現在您看到的模擬 AI 助理！",
    options: ["價格方案", "系統介紹"],
  },
  價格方案: {
    ans: "這套系統目前為專案展示使用，完全免費！如果您需要商業授權，歡迎來信洽詢。",
    options: ["如何聯繫你？", "系統介紹"],
  },
  "如何聯繫你？": {
    ans: "您可以寄信至 support@manus.admin，或是在 GitHub 上給我們一個 Star！",
    options: ["系統介紹"],
  },
  default: {
    ans: "感謝您的提議！這超出了我的模擬範圍。您可以試試點擊下方的常用快捷鍵：",
    options: ["系統介紹", "功能亮點", "價格方案"],
  },
};

const open = ref(false);
const userInput = ref("");
const isThinking = ref(false);
const isTyping = ref(false);
const scrollBox = ref(null);

// 初始化訊息
const messages = ref([
  {
    role: "ai",
    content: "您好！我是您的專屬助理，請問有什麼我可以幫您的？",
    isTyping: false,
  },
]);

// 動態判斷當前要顯示哪些選項按鈕
const currentOptions = computed(() => {
  // 取得最後一則 AI 訊息
  const lastAiMsg = [...messages.value]
    .reverse()
    .find((m) => m.role === "ai" && !m.isTyping);
  if (!lastAiMsg) return MOCK_DB.default.options;

  // 根據 AI 回覆內容找到對應的選項，找不到就給 default
  const match = Object.values(MOCK_DB).find(
    (item) => item.ans === lastAiMsg.content,
  );
  return match ? match.options : MOCK_DB.default.options;
});

// 自動滾動到底部
const scrollToBottom = async () => {
  await nextTick();
  if (scrollBox.value) {
    scrollBox.value.scrollTop = scrollBox.value.scrollHeight;
  }
};

// 模擬打字效果
const typeWrite = async (text) => {
  if (!text) return;

  isTyping.value = true;
  const newMsg = { role: "ai", content: "", isTyping: true };
  messages.value.push(newMsg);

  // 取得該訊息的引用
  const targetMsg = messages.value[messages.value.length - 1];

  let currentText = "";
  const speed = 40; // 每個字的毫秒數

  for (let i = 0; i < text.length; i++) {
    currentText += text.charAt(i);
    targetMsg.content = currentText; // 觸發 Vue 響應式更新

    // 性能優化：每 3 個字才觸發一次滾動計算，減少 Reflow 次數
    if (i % 3 === 0) {
      await scrollToBottom();
    }

    await new Promise((resolve) => setTimeout(resolve, speed));
  }

  targetMsg.isTyping = false;
  isTyping.value = false;
  await scrollToBottom(); // 最後確認滾動到底部
};

// 發送訊息邏輯
const handleSend = async (manualInput = null) => {
  const text = typeof manualInput === "string" ? manualInput : userInput.value;
  if (!text.trim() || isThinking.value || isTyping.value) return;

  // 使用者訊息
  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  scrollToBottom();

  // 模擬思考中
  isThinking.value = true;

  setTimeout(async () => {
    isThinking.value = false;
    // 關鍵字比對
    const matchKey = Object.keys(MOCK_DB).find((k) => text.includes(k));
    const result = matchKey ? MOCK_DB[matchKey] : MOCK_DB.default;
    await typeWrite(result.ans);
  }, 800);
};

// 點擊快捷標籤
const handleOptionClick = (opt) => {
  handleSend(opt);
};
</script>

<style scoped>
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
