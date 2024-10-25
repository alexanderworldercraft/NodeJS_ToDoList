<template>
  <main class="container mx-auto py-6 flex flex-col grow">
    <form @submit.prevent="login" class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-fit mx-auto">
      <div class="sm:col-span-6">
        <h1 class="text-blue-950 text-2xl font-bold mb-4">Connexion</h1>
      </div>
      <div class="sm:col-span-3">
        <div>
          <label for="username" class="block text-sm text-left italic font-bold leading-6 text-blue-900">Nom d'utilisateur</label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <input v-model="username" placeholder="Nom d'utilisateur" type="text" name="username" id="username" autocomplete="username"
              class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-blue-900 ring-1 ring-inset ring-blue-900 placeholder:text-blue-900 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 focus-visible:outline-sky-600">
          </div>
        </div>
      </div>
      <div class="sm:col-span-3">
        <div>
          <label for="password" class="block text-sm font-bold italic text-left leading-6 text-blue-900">Mot de passe</label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <input type="password" v-model="password" placeholder="Mot de passe" name="password" id="password"
              class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-blue-900 ring-1 ring-inset ring-blue-900 placeholder:text-blue-900 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 focus-visible:outline-sky-600">
          </div>
        </div>
      </div>
      <div class="mt-6 mb-3 flex items-center justify-end w-fit">
        <button type="submit"
          class="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-blue-50 shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800">Se connecter</button>
      </div>
    </form>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      axios.post('http://localhost:3000/api/auth/login', {
        username: this.username,
        password: this.password,
      })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          this.$router.push('/tasks'); // Rediriger vers la liste des tâches
        })
        .catch(error => {
          console.error('Erreur lors de la connexion :', error);
        });
    },
  },
};
</script>