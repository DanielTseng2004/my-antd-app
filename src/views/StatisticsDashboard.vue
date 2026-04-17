<template>
  <div style="padding: 24px">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="總人才數"
            :value="allRawData.length"
            suffix="人"
            :value-style="{ color: '#3f51b5' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Vue 開發者"
            :value="vueCount"
            suffix="人"
            :value-style="{ color: '#42b983' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="資深(Senior+) 佔比"
            :value="seniorPercent"
            suffix="%"
            :precision="1"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="系統健康度"
            value="99.9"
            suffix="%"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-row
      :gutter="16"
      style="margin-top: 24px"
    >
      <a-col :span="12">
        <a-card title="各處室人力分佈">
          <div
            v-for="(count, div) in divisionStats"
            :key="div"
            style="margin-bottom: 16px"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              "
            >
              <span>{{ div }}</span>
              <span>{{ count }} 人</span>
            </div>
            <a-progress
              :percent="(count / allRawData.length) * 100"
              :show-info="false"
            />
          </div>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="技術熱點排名">
          <a-list
            item-layout="horizontal"
            :data-source="techRanking"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-badge
                  :count="index + 1"
                  :number-style="{
                    backgroundColor: index < 3 ? '#f5222d' : '#bfbfbf',
                  }"
                />
                <span style="margin-left: 16px; flex: 1">{{ item.name }}</span>
                <a-tag color="blue">{{ item.count }} 位使用者</a-tag>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { generateMockList } from "../data/mockData"; // 引用你的模擬數據

const allRawData = generateMockList(100);

// 統計邏輯
const vueCount = computed(
  () => allRawData.filter((i) => i.tech.includes("Vue")).length,
);
const seniorPercent = computed(
  () =>
    (allRawData.filter((i) => i.level !== "Junior").length /
      allRawData.length) *
    100,
);

const divisionStats = computed(() => {
  return allRawData.reduce((acc, cur) => {
    acc[cur.division] = (acc[cur.division] || 0) + 1;
    return acc;
  }, {});
});

const techRanking = computed(() => {
  const counts = {};
  allRawData.forEach((i) =>
    i.tech.forEach((t) => (counts[t] = (counts[t] || 0) + 1)),
  );
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});
</script>
