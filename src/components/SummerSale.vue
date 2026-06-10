<script setup>
// Floating device photos intentionally left as empty space — filled later.
</script>

<template>
  <section class="sale">
    <img class="float float-ipad" src="/imgs/ipad.png" alt="" />
    <img class="float float-fold" src="/imgs/galaxy-fold.png" alt="" />
    <img class="float float-phone" src="/imgs/iphone-purple.png" alt="" />
    <img class="float float-watch" src="/imgs/watch-apple.png" alt="" />
    <div class="inner">
      <h2 class="title">Big Summer <em>Sale</em></h2>
      <p class="sub">Commodo fames vitae vitae leo mauris in. Eu consequat.</p>
      <router-link to="/products" class="btn-outline on-dark">Shop Now</router-link>
    </div>
  </section>
</template>

<style scoped>
.sale {
  position: relative;
  overflow: hidden;
  background: radial-gradient(120% 140% at 50% 50%, #36343a 0%, #2c2c2c 45%, #1c1b1f 100%);
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 60px 24px;
  text-align: center;
}
.inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.float {
  position: absolute;
  z-index: 1;
  object-fit: contain;
  pointer-events: none;
}
.float-ipad {
  left: -70px;
  bottom: -50px;
  height: 78%;
  transform: rotate(-14deg);
}
.float-fold {
  left: 130px;
  bottom: -70px;
  height: 52%;
  transform: rotate(8deg);
}
.float-phone {
  right: 20px;
  top: 24px;
  height: 80%;
  transform: rotate(14deg);
}
.float-watch {
  right: -40px;
  bottom: 10px;
  height: 40%;
  transform: rotate(10deg);
}

@media (max-width: 860px) {
  .float {
    display: none;
  }
}
.title {
  font-size: 56px;
  font-weight: 400;
  margin-bottom: 12px;
}
.title em {
  font-style: italic;
}
.sub {
  font-size: 14px;
  color: #a5a5a5;
  margin-bottom: 26px;
}

@media (max-width: 560px) {
  .title {
    font-size: 40px;
  }
}
</style>
