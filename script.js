"use strict";

{
  const top = document.querySelector(".scroll-reveal-items");
  const bottom = document.querySelector(".bottom");
  const containers = document.querySelectorAll(".scroll-reveal-item");

  let scrollListenerAdded = false;
  let lastKnownScrollPosition = 0;
  let ticking = false;

  const updateElements = () => {
    const scrollY = lastKnownScrollPosition;
    const viewportHeight = window.innerHeight;
    const translateY = Math.max(scrollY - top.offsetTop, 0);

    containers.forEach((container, index) => {
      const baseHeight = viewportHeight * (index + 1);
      const clipHeight = Math.max(baseHeight - translateY, 0);
      container.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipHeight}px, 0 ${clipHeight}px)`;
    });

    const totalHeight = viewportHeight * containers.length;
    top.style.height = `${totalHeight}px`;
    top.style.transform = translateY < totalHeight ? `translate(0px, ${translateY}px)` : `translate(0px, ${totalHeight}px)`;

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
