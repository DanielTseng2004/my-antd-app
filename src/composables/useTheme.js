import { computed, ref, watch } from "vue";

const STORAGE_KEY = "app-theme";
const themeMode = ref("light");

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (mode) => {
  document.documentElement.setAttribute("data-theme", mode);
};

let initialized = false;

export const useTheme = () => {
  if (!initialized && typeof window !== "undefined") {
    themeMode.value = getPreferredTheme();
    applyTheme(themeMode.value);

    watch(
      themeMode,
      (mode) => {
        applyTheme(mode);
        localStorage.setItem(STORAGE_KEY, mode);
      },
      { immediate: true },
    );

    initialized = true;
  }

  const isDarkMode = computed({
    get: () => themeMode.value === "dark",
    set: (value) => {
      themeMode.value = value ? "dark" : "light";
    },
  });

  return {
    themeMode,
    isDarkMode,
    setTheme: (mode) => {
      themeMode.value = mode;
    },
    toggleTheme: () => {
      themeMode.value = themeMode.value === "dark" ? "light" : "dark";
    },
  };
};
