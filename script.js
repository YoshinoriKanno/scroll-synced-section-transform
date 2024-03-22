"use strict";

{
  const top = document.querySelector(".top");
  const bottom = document.querySelector(".bottom");
  const topImgContainer = document.querySelector(".top-img-container");
  const topImgContainer2 = document.querySelector(".top-img-container-2");
  const topQuoteContainer = document.querySelector(".top-quote-container");

  let scrollListenerAdded = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const translateY = Math.max(scrollY - top.offsetTop, 0);

    // スクロールに応じて各要素のクリップ高さを計算
    const clipHeight1 = Math.max(-translateY + viewportHeight, 0);
    // const clipHeight2 = Math.max(-translateY + viewportHeight, 0);
    console.log('translateY : ' + translateY + '/' + 'viewportHeight : ' + viewportHeight);
    let clipHeight2 = viewportHeight
    clipHeight2 = viewportHeight ? Math.max(-translateY + viewportHeight * 2, 0) : 0; // translateYがviewportHeightを超えたら開始


    // const clipHeight3 = translateY > viewportHeight * 2 ? Math.max(-translateY + viewportHeight * 2, 0) : 0; // translateYがviewportHeightの2倍を超えたら開始

    let clipHeight3 = viewportHeight * 2
    clipHeight3 = viewportHeight ? Math.max(-translateY + viewportHeight * 3, 0) : 0; // translateYがviewportHeightを超えたら開始



    // クリップパスの設定
    topImgContainer.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight1}px, 0 ${clipHeight1}px)`;
    topImgContainer2.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight2}px, 0 ${clipHeight2}px)`;
    topQuoteContainer.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight3}px, 0 ${clipHeight3}px)`;

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
