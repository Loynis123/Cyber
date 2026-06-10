<script setup>
// Image (iPhone) intentionally left as empty space — to be filled later.
</script>

<template>
  <section class="hero">
    <img class="hero-img" src="/imgs/iphone-hero.png" alt="iPhone 14 Pro" />
    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">Pro.Beyond.</p>
        <h1 class="title">IPhone 14 Pro</h1>
        <p class="sub">Created to change everything for the better. For everyone</p>
        <router-link to="/products" class="btn-outline on-dark hero-btn">Shop Now</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: var(--hero);
  color: var(--white);
}
.hero-inner {
  display: flex;
  align-items: center;
  min-height: 632px;
}
.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 600px;
}
.hero-img {
  position: absolute;
  right: max(0px, calc((100% - 1180px) / 2));
  bottom: 0;
  height: 86%;
  width: auto;
  object-fit: contain;
  z-index: 1;
  pointer-events: none;
}
.eyebrow {
  font-size: 16px;
  font-style: italic;
  color: #8a8a8f;
  margin-bottom: 12px;
}
.title {
  font-size: 72px;
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.01em;
  white-space: nowrap;
  margin-bottom: 16px;
}
.sub {
  font-size: 16px;
  font-style: italic;
  color: #9c9c9f;
  margin-bottom: 30px;
}
.hero-btn {
  border-color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 860px) {
  .hero-inner {
    min-height: 460px;
  }
  .title {
    font-size: 48px;
    white-space: normal;
  }
}

@media (max-width: 600px) {
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-inner {
    order: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    min-height: 0;
    padding-top: 44px;
  }
  .hero-copy {
    max-width: 100%;
  }
  .hero-img {
    position: static;
    order: 2;
    height: auto;
    width: auto;
    max-width: 86%;
    max-height: 320px;
    margin: 8px 0 36px;
  }
  .title {
    font-size: 38px;
  }
  .hero-btn {
    margin-top: 4px;
  }
}
</style>
