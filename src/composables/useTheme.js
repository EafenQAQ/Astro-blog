// composables/useTheme.js (修订版)
import { ref, onMounted, computed } from "vue";

export function useTheme() {
  const theme = ref("default");

  const applyTheme = (newTheme) => {
    console.log("Applying theme:", newTheme); // 添加日志，方便调试
    try {
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (e) {
      console.error("Failed to set data-theme attribute:", e);
    }
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "default";
    if (theme.value !== savedTheme) {
      theme.value = savedTheme;
    }
    // 确保 DOM 与 ref 一致（即使内联脚本已设置）
    applyTheme(theme.value);
  };

  const toggleTheme = () => {
    const newTheme = theme.value === "default" ? "synthwave" : "default";
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const isDark = computed(() => theme.value === "synthwave");

  onMounted(() => {
    initTheme();
    // 可选: 添加 storage 事件监听器
    window.addEventListener("storage", (event) => {
      if (event.key === "theme") {
        const newTheme = event.newValue || "default";
        if (theme.value !== newTheme) {
          theme.value = newTheme;
          applyTheme(newTheme);
        }
      }
    });
  });

  return { theme, isDark, toggleTheme };
}
