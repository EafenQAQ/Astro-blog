
import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const theme = ref('default');
  const isDark = ref(false);

  // 应用主题到dom
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.add('theme-transition');
  };

  // 初始化主题
  const initTheme = () => {
    // 从localStorage获取保存的主题，如果没有则使用默认主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    theme.value = savedTheme;
    isDark.value = savedTheme === 'synthwave';
    applyTheme(savedTheme);
  };

  // 切换主题
  const toggleTheme = () => {
    theme.value = isDark.value ? 'synthwave' : 'default';
    localStorage.setItem('theme', theme.value);
    applyTheme(theme.value);
  };

  // 监听isDark的变化并切换主题
  watch(isDark, () => {
    theme.value = isDark.value ? 'synthwave' : 'default';
    localStorage.setItem('theme', theme.value);
    applyTheme(theme.value);
  });

  // 组件挂载时初始化主题
  onMounted(() => {
    initTheme();
  });

  return {
    theme,
    isDark,
    toggleTheme
  };
}