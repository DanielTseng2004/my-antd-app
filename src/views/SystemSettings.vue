<template>
  <div style="padding: 24px; background: #fff; border-radius: 8px">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="1"
        tab="個人資料"
      >
        <a-form
          layout="vertical"
          style="max-width: 600px"
        >
          <a-form-item label="頭像">
            <a-avatar :size="64">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <a-button type="link">更換頭像</a-button>
          </a-form-item>
          <a-form-item label="使用者名稱">
            <a-input value="Manus Admin" />
          </a-form-item>
          <a-form-item label="電子郵件">
            <a-input value="admin@manus.blog" />
          </a-form-item>
          <a-button type="primary">更新資料</a-button>
        </a-form>
      </a-tab-pane>

      <a-tab-pane
        key="2"
        tab="偏好設置"
      >
        <a-list item-layout="horizontal">
          <a-list-item>
            <a-list-item-meta
              title="深色模式"
              description="切換系統視覺主題"
            />
            <a-switch
              checked-children="開"
              un-checked-children="關"
            />
          </a-list-item>
          <a-list-item>
            <a-list-item-meta
              title="新通知提醒"
              description="當有人才資料異動時通知我"
            />
            <a-switch default-checked />
          </a-list-item>
        </a-list>
      </a-tab-pane>

      <a-tab-pane
        key="3"
        tab="安全日誌"
      >
        <a-table
          :columns="logColumns"
          :data-source="logData"
          size="small"
          :pagination="{ pageSize: 5 }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";

const activeKey = ref("1");

const logColumns = [
  { title: "時間", dataIndex: "time", key: "time" },
  { title: "動作", dataIndex: "action", key: "action" },
  { title: "狀態", dataIndex: "status", key: "status" },
];

const logData = [
  { key: 1, time: "2026-04-17 09:15", action: "登入系統", status: "成功" },
  {
    key: 2,
    time: "2026-04-17 09:20",
    action: "修改人才資料: 王大明",
    status: "成功",
  },
  {
    key: 3,
    time: "2026-04-17 09:45",
    action: "刪除人才資料: 李小美",
    status: "成功",
  },
  { key: 4, time: "2026-04-16 18:00", action: "導出 Excel", status: "失敗" },
];
</script>
