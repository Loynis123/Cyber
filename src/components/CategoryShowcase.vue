<script setup>
// Product photos intentionally left as empty space — filled later.
</script>

<template>
  <section class="showcase">
    <article class="cell ps5">
      <img class="img img-ps5" src="/imgs/playstation.png" alt="PlayStation 5" />
      <div class="body">
        <h3 class="title-lg">Playstation 5</h3>
        <p class="desc">
          Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your
          PlayStation experience.
        </p>
      </div>
    </article>

    <article class="cell macbook">
      <img class="img img-mac" src="/imgs/macbook.png" alt="MacBook Air" />
      <div class="body">
        <h3 class="title-lg">Macbook <em>Air</em></h3>
        <p class="desc">
          The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid
          Retina display.
        </p>
        <router-link to="/products" class="btn-outline mac-btn">Shop Now</router-link>
      </div>
    </article>

    <article class="cell airpods">
      <img class="img img-air" src="/imgs/airpods-max.webp" alt="Apple AirPods Max" />
      <div class="body">
        <h3 class="title-md">Apple<br />AirPods<br />Max</h3>
        <p class="desc">Computational audio. Listen, it's powerful</p>
      </div>
    </article>

    <article class="cell vision">
      <img class="img img-vis" src="/imgs/vision-pro.png" alt="Apple Vision Pro" />
      <div class="body">
        <h3 class="title-md">Apple<br />Vision Pro</h3>
        <p class="desc">An immersive way to experience entertainment</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.showcase {
  display: grid;
  grid-template-columns: 370fr 393fr 677fr;
  grid-template-rows: 321px 321px;
  grid-template-areas:
    'ps5 ps5 macbook'
    'airpods vision macbook';
}

.cell {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.body {
  position: relative;
  z-index: 1;
}
.img {
  position: absolute;
  z-index: 0;
  object-fit: contain;
  pointer-events: none;
}
.img-ps5 {
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 88%;
  max-width: 300px;
}
.img-mac {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  height: 82%;
  max-width: 360px;
}
.img-air {
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  height: 98%;
  max-width: 190px;
}
.img-vis {
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 86%;
  max-width: 210px;
}

.ps5 {
  grid-area: ps5;
  background: #ffffff;
}
.ps5 .body {
  padding-left: 330px;
  padding-right: 40px;
  max-width: 640px;
}

.macbook {
  grid-area: macbook;
  background: var(--panel);
}
.macbook .body {
  padding-left: 48px;
  max-width: 250px;
}

.airpods {
  grid-area: airpods;
  background: var(--panel);
}
.airpods .body {
  padding-left: 210px;
  padding-right: 20px;
}

.vision {
  grid-area: vision;
  background: var(--dark-cell);
  color: var(--white);
}
.vision .body {
  padding-left: 230px;
  padding-right: 20px;
}

.title-lg {
  font-size: 36px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.1;
  margin-bottom: 14px;
  color: inherit;
}
.title-lg em {
  font-style: italic;
}
.macbook .title-lg {
  font-style: normal;
}
.macbook .title-lg em {
  font-style: italic;
}

.title-md {
  font-size: 26px;
  font-weight: 500;
  line-height: 1.14;
  margin-bottom: 12px;
  color: inherit;
}

.desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 300px;
}
.vision .desc {
  color: #b9b9b9;
}

.mac-btn {
  margin-top: 22px;
}

@media (max-width: 900px) {
  .showcase {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'ps5 ps5'
      'macbook macbook'
      'airpods vision';
  }
  .cell {
    min-height: 280px;
  }
  .ps5 .body {
    padding-left: 40px;
  }
  .airpods .body,
  .vision .body {
    padding-left: 40px;
  }
}

@media (max-width: 600px) {
  /* Stack full-width cells, image on top, centered text (matches mobile mockup). */
  .showcase {
    grid-template-columns: 1fr;
    grid-template-areas:
      'airpods'
      'vision'
      'ps5'
      'macbook';
  }
  .cell {
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 0;
    padding: 44px 24px 48px;
  }
  /* Images become normal flow elements, centered above the text. */
  .img {
    position: static;
    transform: none;
    height: auto;
    width: auto;
    max-width: 72%;
    max-height: 230px;
    margin: 0 auto 26px;
  }
  .body {
    padding: 0 !important;
    max-width: 420px !important;
    width: 100%;
  }
  .desc {
    max-width: 100%;
    margin: 0 auto;
  }
  .title-lg {
    font-size: 30px;
  }
  .title-md {
    font-size: 24px;
  }
  .mac-btn {
    width: 100%;
    margin-top: 26px;
  }
}
</style>
