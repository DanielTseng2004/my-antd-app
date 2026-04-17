// src/mockData.js

// 1. 組織架構定義
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

// 2. 技術選項
export const techOptions = [
  { value: "Vue", label: "Vue.js" },
  { value: "React", label: "React" },
  { value: "Node", label: "Node.js" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Java", label: "Java" },
  { value: "TypeScript", label: "TypeScript" },
];

// 3. 隨機生成 100 筆模擬數據
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
  const roles = ["前端", "後端", "全端", "測試"];
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
      role: roles[i % roles.length],
      level: levels[i % levels.length],
      tech: [techs[i % techs.length], techs[(i + 2) % techs.length]].filter(
        (v, k, a) => a.indexOf(v) === k,
      ),
      updateTime: "2026-04-17",
    });
  }
  return data;
};
