<template>
  <div style="padding: 16px">
    <a-card
      :bordered="false"
      body-style="padding: 0"
    >
      <a-tabs
        v-model:activeKey="dashboardTab"
        type="card"
        @change="clearDetail"
      >
        <a-tab-pane
          key="role"
          tab="專案角色人力分布"
        >
          <a-table
            :columns="roleColumns"
            :data-source="roleData"
            :pagination="false"
            bordered
            size="middle"
            class="main-table"
            row-key="roleValue"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'roleLabel'">
                <div class="role-cell">
                  <div :class="['role-indicator', record.roleValue]"></div>
                  <span class="role-text">{{ record.roleLabel }}</span>
                </div>
              </template>
              <template v-else-if="allDepartments.includes(column.key)">
                <div
                  :class="[
                    'clickable-count',
                    { 'has-value': record[column.key] > 0 },
                  ]"
                  @click="handleMainClick('role', record.roleValue, column.key)"
                >
                  {{ record[column.key] > 0 ? record[column.key] : "-" }}
                </div>
              </template>
            </template>

            <template #expandedRowRender="{ record: roleRecord }">
              <div class="expand-box level-bg">
                <div class="expand-title">
                  階層分佈 (Jr/Sr/Exp)：{{ roleRecord.roleLabel }}
                </div>
                <a-table
                  :columns="levelSubColumns"
                  :data-source="getRoleLevelData(roleRecord.roleValue)"
                  :pagination="false"
                  size="small"
                  bordered
                >
                  <template #bodyCell="{ column, record: subRecord }">
                    <template v-if="column.key === 'level'"
                      ><a-tag :color="getLevelColor(subRecord.level)">{{
                        subRecord.level
                      }}</a-tag></template
                    >
                    <template v-else-if="allDepartments.includes(column.key)">
                      <div
                        :class="[
                          'clickable-sub-count',
                          { active: subRecord[column.key] > 0 },
                        ]"
                        @click="
                          handleSubClick(
                            'role',
                            roleRecord.roleValue,
                            column.key,
                            'level',
                            subRecord.level,
                          )
                        "
                      >
                        {{
                          subRecord[column.key] > 0
                            ? subRecord[column.key]
                            : "-"
                        }}
                      </div>
                    </template>
                  </template>
                </a-table>
              </div>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane
          key="tech"
          tab="技術人才庫"
        >
          <a-table
            :columns="techColumns"
            :data-source="techData"
            :pagination="false"
            bordered
            size="middle"
            class="main-table"
            row-key="techValue"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'techLabel'"
                ><span class="tech-text">{{ record.techLabel }}</span></template
              >
              <template v-else-if="allDepartments.includes(column.key)">
                <div
                  :class="[
                    'clickable-count',
                    { 'has-value': record[column.key] > 0 },
                  ]"
                  @click="handleMainClick('tech', record.techValue, column.key)"
                >
                  {{ record[column.key] > 0 ? record[column.key] : "-" }}
                </div>
              </template>
            </template>
            <template #expandedRowRender="{ record: techRecord }">
              <div class="expand-box job-bg">
                <div class="expand-title">
                  職能應用分佈：{{ techRecord.techLabel }}
                </div>
                <a-table
                  :columns="jobSubColumns"
                  :data-source="getTechJobData(techRecord.techValue)"
                  :pagination="false"
                  size="small"
                  bordered
                >
                  <template #bodyCell="{ column, record: subRecord }">
                    <template v-if="column.key === 'job'"
                      ><a-badge
                        status="processing"
                        :text="subRecord.job"
                    /></template>
                    <template v-else-if="allDepartments.includes(column.key)">
                      <div
                        :class="[
                          'clickable-sub-count',
                          { active: subRecord[column.key] > 0 },
                        ]"
                        @click="
                          handleSubClick(
                            'tech',
                            techRecord.techValue,
                            column.key,
                            'role',
                            subRecord.job,
                          )
                        "
                      >
                        {{
                          subRecord[column.key] > 0
                            ? subRecord[column.key]
                            : "-"
                        }}
                      </div>
                    </template>
                  </template>
                </a-table>
              </div>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-card
      v-if="detailList.length >= 0"
      title="篩選人才清單"
      style="margin-top: 24px"
      class="detail-card"
    >
      <template #extra>
        <span class="filter-tag">篩選：{{ activeFilterText }}</span>
        <a-button
          type="link"
          danger
          @click="clearDetail"
          >重置</a-button
        >
      </template>
      <a-table
        :columns="detailColumns"
        :data-source="detailList"
        row-key="id"
        size="small"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tech'">
            <a-tag
              v-for="t in record.tech"
              :key="t"
              color="blue"
              style="font-size: 11px"
              >{{ t }}</a-tag
            >
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  generateMockList,
  hierarchy,
  projectRoles,
  techOptions,
} from "../data/mockData";

const allRawData = generateMockList(100);
const dashboardTab = ref("role");
const detailList = ref([]);
const activeFilterText = ref("");

const levels = ["Junior", "Senior", "Expert"];
const jobs = ["前端", "後端", "測試", "維運"];
const allDepartments = computed(() => {
  const depts = [];
  Object.values(hierarchy).forEach((div) => depts.push(...Object.keys(div)));
  return depts;
});

// 通用 Column 生成
const createCols = (title, key, width = 160) => {
  const c = [{ title, dataIndex: key, key, width, fixed: "left" }];
  allDepartments.value.forEach((d) =>
    c.push({ title: d, dataIndex: d, key: d, align: "center" }),
  );
  return c;
};

// 數據定義
const roleColumns = computed(() => createCols("專案角色", "roleLabel"));
const roleData = computed(() =>
  projectRoles.map((r) => {
    const row = { roleValue: r.value, roleLabel: r.label };
    allDepartments.value.forEach(
      (d) =>
        (row[d] = allRawData.filter(
          (i) => i.department === d && i.projectRole === r.value,
        ).length),
    );
    return row;
  }),
);

const techColumns = computed(() => createCols("技術名稱", "techLabel", 140));
const techData = computed(() =>
  techOptions.map((t) => {
    const row = { techValue: t.value, techLabel: t.label };
    allDepartments.value.forEach(
      (d) =>
        (row[d] = allRawData.filter(
          (i) => i.department === d && i.tech.includes(t.value),
        ).length),
    );
    return row;
  }),
);

const levelSubColumns = computed(() => createCols("熟練等級", "level", 120));
const getRoleLevelData = (rv) =>
  levels.map((lv) => {
    const row = { level: lv };
    allDepartments.value.forEach(
      (d) =>
        (row[d] = allRawData.filter(
          (i) => i.department === d && i.projectRole === rv && i.level === lv,
        ).length),
    );
    return row;
  });

const jobSubColumns = computed(() => createCols("應用職能", "job", 120));
const getTechJobData = (tv) =>
  jobs.map((j) => {
    const row = { job: j };
    allDepartments.value.forEach(
      (d) =>
        (row[d] = allRawData.filter(
          (i) => i.department === d && i.tech.includes(tv) && i.role === j,
        ).length),
    );
    return row;
  });

// 點擊事件
const handleMainClick = (type, val, dept) => {
  const isRole = type === "role";
  detailList.value = allRawData.filter(
    (i) =>
      i.department === dept &&
      (isRole ? i.projectRole === val : i.tech.includes(val)),
  );
  const label = isRole
    ? projectRoles.find((r) => r.value === val).label
    : techOptions.find((t) => t.value === val).label;
  activeFilterText.value = `${dept} > ${label}`;
};

const handleSubClick = (type, mVal, dept, subF, subV) => {
  const isRole = type === "role";
  detailList.value = allRawData.filter(
    (i) =>
      i.department === dept &&
      (isRole ? i.projectRole === mVal : i.tech.includes(mVal)) &&
      i[subF] === subV,
  );
  const label = isRole
    ? projectRoles.find((r) => r.value === mVal).label
    : techOptions.find((t) => t.value === mVal).label;
  activeFilterText.value = `${dept} > ${label} > ${subV}`;
};

const clearDetail = () => {
  detailList.value = [];
  activeFilterText.value = "";
};
const getLevelColor = (lv) =>
  ({ Expert: "purple", Senior: "orange", Junior: "blue" })[lv];

const detailColumns = [
  { title: "姓名", dataIndex: "name", key: "name", width: 90 },
  { title: "部門", dataIndex: "department", key: "department" },
  { title: "專案角色", dataIndex: "projectRole", key: "projectRole" },
  { title: "等級", dataIndex: "level", key: "level" },
  { title: "技術技能", dataIndex: "tech", key: "tech" },
];
</script>

<style scoped>
.main-table :deep(.ant-table) {
  font-size: 14px !important;
}
.main-table :deep(th),
.main-table :deep(td) {
  padding: 12px 8px !important;
}

/* 角色色標 */
.role-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.role-indicator {
  width: 4px;
  height: 18px;
  border-radius: 2px;
}
.role-indicator.PM {
  background: var(--role-indicator-pm);
}
.role-indicator.SA {
  background: var(--role-indicator-sa);
}
.role-indicator.SD {
  background: var(--role-indicator-sd);
}
.role-indicator.PG {
  background: var(--role-indicator-pg);
}
.role-indicator.BA {
  background: var(--role-indicator-ba);
}
.role-text {
  font-weight: 600;
  color: var(--role-text-color);
}

.tech-text {
  font-weight: bold;
  color: var(--tech-text-color);
}

/* 點擊與數值樣式 */
.clickable-count,
.clickable-sub-count {
  cursor: pointer;
  transition: 0.2s;
  border-radius: 4px;
  color: var(--clickable-disabled-color);
}
.clickable-count.has-value {
  color: var(--icon-info-color);
  font-weight: bold;
}
.clickable-count:hover {
  background: var(--clickable-hover-bg);
  text-decoration: underline;
}
.clickable-sub-count.active {
  color: var(--clickable-active-color);
  font-weight: bold;
}
.clickable-sub-count.active:hover {
  background: var(--clickable-active-hover-bg);
  box-shadow: 0 0 0 1px var(--clickable-active-shadow);
}

/* 展開容器 */
.expand-box {
  padding: 12px;
  border-radius: 4px;
  margin: -8px;
}
.level-bg {
  background: var(--expand-level-bg);
}
.job-bg {
  background: var(--expand-job-bg);
}
.expand-title {
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 13px;
  color: var(--expand-title-color);
}

.filter-tag {
  background: var(--filter-tag-bg);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
}
</style>
