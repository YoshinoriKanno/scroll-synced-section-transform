"use strict";

{
  const top = document.querySelector(".scroll-reveal-items");
  const bottom = document.querySelector(".bottom");
  const containers = document.querySelectorAll(".scroll-reveal-item");

  let scrollListenerAdded = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const translateY = Math.max(scrollY - top.offsetTop, 0);

    containers.forEach((container, index) => {
      const baseHeight = viewportHeight * (index + 1);
      const clipHeight = Math.max(baseHeight - translateY, 0);

      container.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight}px, 0 ${clipHeight}px)`;
    });

    // .top 要素の高さを設定し、すべてのコンテナの処理が終了したら transform を停止
    const totalHeight = viewportHeight * containers.length;
    top.style.height = `${totalHeight}px`;
    if (translateY < totalHeight) {
      top.style.transform = `translate(0px, ${translateY}px)`;
    } else {
      top.style.transform = `translate(0px, ${totalHeight}px)`;
    }
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === top && entry.isIntersecting && !scrollListenerAdded) {
        window.addEventListener("scroll", handleScroll);
        scrollListenerAdded = true;
      } else if (entry.target === bottom && entry.isIntersecting && scrollListenerAdded) {
        window.removeEventListener("scroll", handleScroll);
        scrollListenerAdded = false;
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: "-1px 0px 0px 0px",
    threshold: 0
  });

  observer.observe(top);

}
