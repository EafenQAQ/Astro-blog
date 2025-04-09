// 切换主题
const toggleTheme = (e) => {
  const newTheme = e.target.checked ? "synthwave" : "default";

  let body = document.querySelector("body");
  body.classList.add("theme-transition");
  body.setAttribute("data-theme", newTheme);

  localStorage.setItem("userTheme", newTheme);
};



export { toggleTheme };
