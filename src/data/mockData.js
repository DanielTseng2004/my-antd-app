// src/data/mockData.js

export const hierarchy = {
  資訊處: {
    開發部: ["前端組", "後端組", "架構組"],
    維運部: ["系統組", "網管組"],
    數據部: ["分析組", "AI組"],
  },
  行政處: {
    人事部: ["招募組", "考核組"],
    總務部: ["採購組", "資產組"],
  },
};

// 專案腳色 (Project Role)
export const projectRoles = [
  { value: "PG", label: "程式設計師 (PG)" },
  { value: "SA", label: "系統分析師 (SA)" },
  { value: "SD", label: "系統設計師 (SD)" },
  { value: "BA", label: "商業分析師 (BA)" },
  { value: "PM", label: "專案經理 (PM)" },
];

// 技術選項
export const techOptions = [
  { value: "Vue", label: "Vue.js" },
  { value: "React", label: "React" },
  { value: "Node", label: "Node.js" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Java", label: "Java" },
  { value: "TypeScript", label: "TypeScript" },
];

export const generateMockList = (count = 100) => {
  const names = [
    "王大明",
    "李小美",
    "張三峰",
    "趙敏",
    "林沖",
    "陳友亮",
    "周芷若",
    "孫悟空",
  ];
  const functions = ["前端", "後端", "測試", "維運"]; // 這是職能
  const levels = ["Junior", "Senior", "Expert"];
  const techs = ["Vue", "React", "Node", "Python", "Go", "Java", "TypeScript"];

  const data = [];
  for (let i = 1; i <= count; i++) {
    const divKeys = Object.keys(hierarchy);
    const randomDiv = divKeys[i % divKeys.length];
    const deptKeys = Object.keys(hierarchy[randomDiv]);
    const randomDept = deptKeys[Math.floor(Math.random() * deptKeys.length)];
    const secKeys = hierarchy[randomDiv][randomDept];
    const randomSec = secKeys[Math.floor(Math.random() * secKeys.length)];

    data.push({
      id: i,
      name: names[i % names.length] + i,
      division: randomDiv,
      department: randomDept,
      section: randomSec,
      role: functions[i % functions.length], // 職能 (原本的欄位名 role)
      projectRole: projectRoles[i % projectRoles.length].value, // 專案腳色 (新增欄位)
      level: levels[i % levels.length],
      tech: [techs[i % techs.length], techs[(i + 2) % techs.length]].filter(
        (v, k, a) => a.indexOf(v) === k,
      ),
      updateTime: "2026-04-17",
    });
  }
  return data;
};
