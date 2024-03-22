"use strict";

{
  const itemsContainer = document.querySelector(".js-scroll-reveal-container");
  const afterContent = document.querySelector(".js-scroll-reveal-after-content");
  const items = document.querySelectorAll(".js-scroll-reveal-item");

  let scrollListenerAdded = false;
  let lastKnownScrollPosition = 0;
  let ticking = false;

  const updateElements = () => {
    const scrollY = lastKnownScrollPosition;
    const viewportHeight = window.innerHeight;
    const translateY = Math.max(scrollY - itemsContainer.offsetTop, 0);

    items.forEach((item, index) => {
      const baseHeight = viewportHeight * (index + 1);
      const clipHeight = Math.max(baseHeight - translateY, 0);
      item.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight}px, 0 ${clipHeight}px)`;
      // z-index を逆順に設定
      const zIndex = items.length - index; // 配列は0から始まるため、items.length - index とする
      item.style.zIndex = zIndex;
    });


    const totalHeight = viewportHeight * items.length;
    itemsContainer.style.height = `${totalHeight}px`;
    itemsContainer.style.transform = translateY < totalHeight ? `translate(0px, ${translateY}px)` : `translate(0px, ${totalHeight}px)`;

    ticking = false;
  };

  const handleScroll = () => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(updateElements);
      ticking = true;
    }
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === itemsContainer && entry.isIntersecting && !scrollListenerAdded) {
        window.addEventListener("scroll", handleScroll);
        scrollListenerAdded = true;
      } else if (entry.target === afterContent && entry.isIntersecting && scrollListenerAdded) {
        window.removeEventListener("scroll", handleScroll);
        scrollListenerAdded = false;
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: "-1px 0px 0px 0px",
    threshold: 0
  });

  observer.observe(itemsContainer);

  // ページロード時に updateElements を呼び出す
  document.addEventListener('DOMContentLoaded', (event) => {
    updateElements();
  });
}
