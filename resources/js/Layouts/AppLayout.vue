<script>
import Sidemenu from "./Admin/Sidemenu.vue";
import TopNav from "./Admin/TopNav.vue";
import Footer from "./Admin/Footer.vue";

export default {
  components: {
    Sidemenu,
    TopNav,
    Footer,
  },
};
</script>

<template>
  <div>
    <!-- loader Start -->
    <!-- <div id="loading">
         <div id="loading-center">
         </div>
      </div> -->
    <!-- loader END -->
    <!-- Wrapper Start -->
    <div class="wrapper">
      <Sidemenu />
      <TopNav />

      <slot />
    </div>
    <!-- Wrapper END -->
    <Footer />
  </div>
</template>
