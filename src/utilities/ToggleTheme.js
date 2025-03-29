// 切换主题
const toggleTheme = (e) => {
  const newTheme = e.target.checked ? "synthwave" : "default";

  let body = document.querySelector("body");
  body.setAttribute("data-theme", newTheme);

  // 根据主题切换背景图片
  if (newTheme === "synthwave") {
    body.style.backgroundImage = "url('/assets/backdrop_dark.svg')";
  } else {
    body.style.backgroundImage = "url('/assets/backdrop.svg')";
  }
};

export default toggleTheme;
