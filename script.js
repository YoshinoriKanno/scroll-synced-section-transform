"use strict";

{
  // 要素の選択
  const top = document.querySelector(".top");
  const bottom = document.querySelector(".bottom");
  const topImgContainer = document.querySelector(".top-img-container");
  const topQuoteContainer = document.querySelector(".top-quote-container");

  let scrollListenerAdded = false; // スクロールリスナーが追加されているかを追跡するフラグ

  // スクロールイベントのハンドラ
  const handleScroll = () => {
    const scrollY = window.scrollY; // 現在のスクロール位置
    const viewportHeight = window.innerHeight; // ビューポートの高さ

    // top がビューポート上端に達した後のスクロール量を計算し、ビューポートの高さを超えないように制限
    const translateY = Math.min(Math.max(scrollY - top.offsetTop, 0), viewportHeight);

    // .top 要素の変形と高さの設定
    top.style.transform = `translate(0px, ${translateY}px)`;
    top.style.height = `calc(${viewportHeight}px * 2)`;

    // .top-img-container と .top-quote-container のクリップパスを動的に更新
    const clipHeight = Math.max(viewportHeight - translateY, 0);
    topImgContainer.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight}px, 0 ${clipHeight}px)`;
    topQuoteContainer.style.clipPath = `polygon(0 ${clipHeight}px, 100% ${clipHeight}px, 100% 100%, 0 100%)`;
  };

  // Intersection Observer のコールバック関数
  // .top がビューポートに入るとスクロールイベントリスナーを追加し、.bottom がビューポートに入るとリスナーを削除
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === top && entry.isIntersecting && !scrollListenerAdded) {
        window.addEventListener("scroll", handleScroll);
        scrollListenerAdded = true; // スクロールリスナーを追加
      } else if (entry.target === bottom && entry.isIntersecting && scrollListenerAdded) {
        window.removeEventListener("scroll", handleScroll);
        scrollListenerAdded = false; // スクロールリスナーを削除
      }
    });
  };

  // Intersection Observer の初期化
  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: "-1px 0px 0px 0px", // .top の上端がビューポート上端に入る瞬間を検出
    threshold: 0
  });

  // .top と .bottom を監視対象に設定
  observer.observe(top);
  // bottom の監視はコメントアウトされていますが、必要に応じて有効化してください
  // observer.observe(bottom);
}
