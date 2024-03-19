"use strict";

{
  const top = document.querySelector(".top");
  const bottom = document.querySelector(".bottom");
  const topImgContainer = document.querySelector(".top-img-container");
  const topQuoteContainer = document.querySelector(".top-quote-container");

  let scrollListenerAdded = false;

  // handleScroll 関数を定義
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const translateY = Math.max(scrollY - top.offsetTop, 0); // top がビューポート上端に達した後のスクロール量
    // ビューポートの高さに基づいて clipPath を動的に更新
    const viewportHeight = window.innerHeight;

    top.style.transform = `translate(0px, ${translateY}px)`;
    top.style.height = `calc((${viewportHeight}px) * 2)`;

    topImgContainer.style.clipPath = `polygon(0 0, 100% 0, 100% ${Math.max(viewportHeight - translateY, 0)}px, 0 ${Math.max(viewportHeight - translateY, 0)}px)`;
    topQuoteContainer.style.clipPath = `polygon(0 ${Math.max(viewportHeight - translateY, 0)}px, 100% ${Math.max(viewportHeight - translateY, 0)}px, 100% 100%, 0 100%)`;
  };

  // Intersection Observer のコールバック関数を定義
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === top && entry.isIntersecting && !scrollListenerAdded) {
        window.addEventListener("scroll", handleScroll);
        scrollListenerAdded = true;
      }
      else if (entry.target === bottom && entry.isIntersecting && scrollListenerAdded) {
        window.removeEventListener("scroll", handleScroll);
        scrollListenerAdded = false;
      }
    });
  };

  // Intersection Observer を初期化
  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: "-1px 0px 0px 0px", // top の上端がビューポートの上端にほんの少し入った瞬間に発火
    threshold: 0
  });

  // top と bottom を監視対象に追加
  observer.observe(top);
  observer.observe(bottom);
}
