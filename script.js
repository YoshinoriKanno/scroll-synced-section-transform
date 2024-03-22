"use strict";

{
  const top = document.querySelector(".top");
  const bottom = document.querySelector(".bottom");
  const topImgContainer1 = document.querySelector(".top-img-container-1");
  const topImgContainer2 = document.querySelector(".top-img-container-2");
  const topImgContainer3 = document.querySelector(".top-img-container-3");

  let scrollListenerAdded = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const translateY = Math.max(scrollY - top.offsetTop, 0);

    // スクロールに応じて各要素のクリップ高さを計算
    const clipHeight1 = Math.max(-translateY + viewportHeight, 0);

    let clipHeight2 = viewportHeight
    clipHeight2 = viewportHeight ? Math.max(-translateY + viewportHeight * 2, 0) : 0;

    let clipHeight3 = viewportHeight * 2
    clipHeight3 = viewportHeight ? Math.max(-translateY + viewportHeight * 3, 0) : 0;

    // クリップパスの設定
    topImgContainer1.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight1}px, 0 ${clipHeight1}px)`;
    topImgContainer2.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight2}px, 0 ${clipHeight2}px)`;
    topImgContainer3.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight3}px, 0 ${clipHeight3}px)`;

    // .top 要素の高さを設定し、3つの要素の処理が終了したら transform を停止
    top.style.height = `${viewportHeight * 3}px`;
    if (translateY < viewportHeight * 3) {
      top.style.transform = `translate(0px, ${translateY}px)`;
    } else {
      top.style.transform = `translate(0px, ${viewportHeight * 3}px)`;
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
