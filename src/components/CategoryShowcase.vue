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
      <img class="img img-air" src="/imgs/airpods-max.png" alt="Apple AirPods Max" />
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
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  height: 76%;
}
.img-mac {
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  height: 82%;
}
.img-air {
  left: 4px;
  bottom: 0;
  height: 92%;
}
.img-vis {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 64%;
}

.ps5 {
  grid-area: ps5;
  background: #ffffff;
}
.ps5 .body {
  padding-left: 290px;
  padding-right: 40px;
  max-width: 620px;
}

.macbook {
  grid-area: macbook;
  background: var(--panel);
}
.macbook .body {
  padding-left: 48px;
  max-width: 360px;
}

.airpods {
  grid-area: airpods;
  background: var(--panel);
}
.airpods .body {
  padding-left: 150px;
  padding-right: 24px;
}

.vision {
  grid-area: vision;
  background: var(--dark-cell);
  color: var(--white);
}
.vision .body {
  padding-left: 150px;
  padding-right: 24px;
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
  .showcase {
    grid-template-columns: 1fr;
    grid-template-areas:
      'ps5'
      'macbook'
      'airpods'
      'vision';
  }
  .cell {
    min-height: 240px;
  }
  .body {
    padding: 28px 24px !important;
    max-width: none !important;
    width: 100%;
  }
  .desc {
    max-width: 60%;
  }
  /* Keep imagery clear of text: shrink and pin to an edge */
  .img-ps5 {
    left: auto;
    right: -16px;
    height: 52%;
  }
  .ps5 .desc {
    max-width: 64%;
  }
  .img-mac {
    right: -10px;
    height: 56%;
  }
  .macbook .desc {
    max-width: 60%;
  }
  .img-air {
    left: auto;
    right: 8px;
    height: 64%;
  }
  .airpods .desc {
    max-width: 58%;
  }
  .img-vis {
    left: auto;
    right: 0;
    height: 46%;
  }
  .vision .desc {
    max-width: 58%;
  }
  .title-lg {
    font-size: 28px;
  }
  .title-md {
    font-size: 22px;
  }
}
</style>
