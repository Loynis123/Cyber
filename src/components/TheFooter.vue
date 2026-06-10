<script setup>
import TheIcon from './TheIcon.vue'

const services = [
  'Bonus program',
  'Gift cards',
  'Credit and payment',
  'Service contracts',
  'Non-cash account',
  'Payment',
]
const assistance = [
  'Find an order',
  'Terms of delivery',
  'Exchange and return of goods',
  'Guarantee',
  'Frequently asked questions',
  'Terms of use of the site',
]
const socials = ['twitter', 'facebook', 'tiktok', 'instagram']
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="brand">
        <a href="#" class="logo">
          <img src="/icons/logo-white.png" alt="cyber" />
        </a>
        <p class="about">
          We are a residential interior design firm located in Portland. Our boutique-studio offers
          more than
        </p>
      </div>

      <nav class="col col-services">
        <h4 class="col-title">Services</h4>
        <ul>
          <li v-for="item in services" :key="item"><a href="#">{{ item }}</a></li>
        </ul>
      </nav>

      <nav class="col col-assist">
        <h4 class="col-title">Assistance to the buyer</h4>
        <ul>
          <li v-for="item in assistance" :key="item"><a href="#">{{ item }}</a></li>
        </ul>
      </nav>

      <div class="socials">
        <a v-for="s in socials" :key="s" href="#" class="social" :aria-label="s">
          <TheIcon :name="s" :size="20" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--black);
  color: var(--white);
  padding: 64px 0 72px;
}
.footer-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  grid-template-areas:
    'brand services assist'
    'socials services assist';
  gap: 40px;
  align-items: start;
}

.brand {
  grid-area: brand;
}
.col-services {
  grid-area: services;
}
.col-assist {
  grid-area: assist;
}
.socials {
  grid-area: socials;
  display: flex;
  gap: 22px;
}

.logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 22px;
}
.logo img {
  height: 28px;
  width: auto;
}
.about {
  font-size: 14px;
  font-style: italic;
  line-height: 1.6;
  color: #b3b3b3;
  max-width: 270px;
}
.social {
  color: var(--white);
  transition: opacity 0.15s ease;
}
.social:hover {
  opacity: 0.6;
}

.col-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 22px;
}
.col ul {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.col a {
  font-size: 14px;
  color: #cfcfcf;
  transition: color 0.15s ease;
}
.col a:hover {
  color: var(--white);
}

@media (max-width: 760px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'brand brand'
      'services assist'
      'socials socials';
  }
}

@media (max-width: 600px) {
  .footer {
    padding: 48px 0 44px;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    grid-template-areas:
      'brand'
      'services'
      'assist'
      'socials';
    gap: 36px;
    text-align: center;
    justify-items: center;
  }
  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .about {
    max-width: 330px;
  }
  .col ul {
    align-items: center;
  }
  .socials {
    justify-content: center;
  }
}
</style>
