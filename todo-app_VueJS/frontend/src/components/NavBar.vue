<template>
  <nav class="bg-blue-900 xl:rounded-b-xl rounded-none p-4 container mx-auto">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/tasks" class="text-blue-200 mr-4 hover:text-blue-50">Liste des tâches</router-link>
      </div>
      <button @click="logout" class="text-red-50 bg-red-500 hover:bg-red-700 py-2 px-4 rounded">
        Déconnexion
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      // Supprimer le token du localStorage
      localStorage.removeItem('token');
      // Rediriger vers la page de login
      this.$router.push('/login');
    }
  }
}
</script>