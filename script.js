"use strict";

{
  function adjustContainerClass() {
    const breakpoint = 768;
    const containerSP = document.querySelector(".js-scroll-reveal-container--sp");
    const containerPC = document.querySelector(".js-scroll-reveal-container--pc");

    if (window.innerWidth >= breakpoint) {
      // 768px 以上の場合
      if (containerSP.classList.contains("js-scroll-reveal-container")) {
        containerSP.classList.remove("js-scroll-reveal-container");
      }
      containerPC.classList.add("js-scroll-reveal-container");
    } else {
      // 768px 未満の場合
      if (containerPC.classList.contains("js-scroll-reveal-container")) {
        containerPC.classList.remove("js-scroll-reveal-container");
      }
      containerSP.classList.add("js-scroll-reveal-container");
    }
  }

  // ページロード時に adjustContainerClass を実行し、その後スクロール関連の処理をセットアップ
  document.addEventListener('DOMContentLoaded', (event) => {
    adjustContainerClass(); // 最初にクラスの調整を実行

    // adjustContainerClass 実行後に itemsContainer の選択を更新
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

    // adjustContainerClass 実行後にスクロールイベントリスナーを追加
    window.addEventListener("scroll", handleScroll);
  });
}
