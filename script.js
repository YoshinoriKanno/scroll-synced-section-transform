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

    // translateYがviewportHeightを超えたら、それ以上の更新を停止
    if (translateY <= viewportHeight * (items.length - 1)) {
      items.forEach((item, index) => {
        const baseHeight = viewportHeight * (index + 1);
        const clipHeight = Math.max(baseHeight - translateY, 0);
        item.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight}px, 0 ${clipHeight}px)`;

        const zIndex = items.length - index;
        item.style.zIndex = zIndex;
      });

      itemsContainer.style.height = `${viewportHeight * items.length}px`;
      itemsContainer.style.transform = `translate(0px, ${translateY}px)`;
    } else {
      // translateYがviewportHeightを超えた場合、transformの更新を停止し、clip-pathの更新も停止
      itemsContainer.style.transform = `translate(0px, ${viewportHeight * (items.length - 1)}px)`;
    }

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
