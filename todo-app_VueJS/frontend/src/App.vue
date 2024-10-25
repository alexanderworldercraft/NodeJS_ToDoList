<template>
  <div id="app2" class="flex flex-col h-full">
    <!-- Ajouter la barre de navigation ici -->
    <Navbar />
    <!-- Afficher les différentes vues ici -->
    <router-view />
    <!-- Ajouter le footer ici -->
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/NavBar.vue';
import Footer from './components/FooterBar.vue';

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>


<style>
@import 'tailwindcss/tailwind.css';
</style>