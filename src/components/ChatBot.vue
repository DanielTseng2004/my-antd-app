<template>
  <a-float-button
    type="primary"
    :style="{ right: '24px', bottom: '24px', width: '60px', height: '60px' }"
    @click="open = !open"
  >
    <template #icon><MessageOutlined /></template>
  </a-float-button>

  <transition name="fade">
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
        >
          <CloseOutlined />
        </a>
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
            :size="40"
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
            :size="40"
            class="avatar"
          >
            <template #icon><RobotOutlined /></template>
          </a-avatar>
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
  </transition>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { MOCK_DB } from "../data/botResponses";
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

// 1. 導覽快捷鍵
const guideMenu = [
  { key: "home", label: "返回首頁", icon: "🏠" },
  { key: "posts", label: "技術文章", icon: "📚" },
  { key: "stats", label: "數據看板", icon: "📊" },
  { key: "about", label: "關於作者", icon: "👤" },
];

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

  // 使用者訊息
  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  scrollToBottom();

  isThinking.value = true;

  // 模擬思考延遲
  setTimeout(async () => {
    isThinking.value = false;

    // 關鍵字匹配邏輯
    const matchKey = Object.keys(MOCK_DB).find((k) => text.includes(k));
    const result = matchKey ? MOCK_DB[matchKey] : MOCK_DB.default;

    await typeWrite(result.ans);

    // 路由跳轉處理
    if (result.path) {
      setTimeout(() => {
        router.push(result.path);
        antMessage.success(`已導航至：${matchKey || "目標頁面"}`);
      }, 500);
    }
  }, 800);
};

// 打字機特效
const typeWrite = async (text) => {
  isTyping.value = true;
  const newMsg = { role: "ai", content: "", isTyping: true };
  messages.value.push(newMsg);
  const targetMsg = messages.value[messages.value.length - 1];

  for (let i = 0; i < text.length; i++) {
    targetMsg.content += text.charAt(i);
    if (i % 3 === 0) await scrollToBottom();
    await new Promise((resolve) => setTimeout(resolve, 40));
  }

  targetMsg.isTyping = false;
  isTyping.value = false;
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (scrollBox.value) {
    scrollBox.value.scrollTo({
      top: scrollBox.value.scrollHeight,
      behavior: "smooth",
    });
  }
};

const handleOptionClick = (opt) => handleSend(opt);

// 計算當前推薦選項
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
  color: userInput.value.trim() ? "#1890ff" : "#d9d9d9",
  cursor: "pointer",
}));
</script>

<style scoped>
/* 視窗進場動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-card {
  position: fixed;
  right: 24px;
  bottom: 100px;
  width: 380px;
  height: 550px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  z-index: 1001;
  overflow: hidden;
  background: #fff;
}

:deep(.ant-card-body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.message-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-wrapper {
  display: flex;
  gap: 10px;
  max-width: 85%;
}

.msg-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-wrapper.ai {
  align-self: flex-start;
}

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-all;
}

.user .bubble {
  background: #1890ff;
  color: #fff;
  border-bottom-right-radius: 2px;
}

.ai .bubble {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.avatar {
  background: #e6f7ff;
  color: #1890ff;
  flex-shrink: 0;
}

.options-area {
  padding-left: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quick-opt {
  cursor: pointer;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.quick-opt:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.thinking {
  background: transparent !important;
  box-shadow: none !important;
}

.input-box {
  padding: 12px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.cursor {
  animation: blink 1s infinite;
  color: #1890ff;
  margin-left: 2px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 自定義捲軸 */
.message-container::-webkit-scrollbar {
  width: 5px;
}
.message-container::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-radius: 10px;
}
</style>
