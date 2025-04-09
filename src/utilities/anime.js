import anime from "animejs";

export const renderingAnime = () => {
  anime({
    targets: ".renderIn",
    easing: "easeInOutExpo",
    translateY: [15, 0],
    duration: 1500,
    opacity: [0, 1],
    begin: function (anim) {
        anim.animatables.forEach((animatable)=>{
            animatable.target.classList.remove('beforeRenderIn')
        })
    }
  });
};
