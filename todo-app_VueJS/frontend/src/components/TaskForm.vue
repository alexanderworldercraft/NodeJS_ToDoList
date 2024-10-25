<template>
  <article class="container mx-auto mb-5 px-5">
    <h2 class="text-3xl text-left font-bold mb-4 text-blue-900 italic">Ajouter une nouvelle tâche</h2>
    <form @submit.prevent="addTask" class="flex flex-col max-w-96 mx-auto">
      <input v-model="description" placeholder="Description de la tâche"
        class="border-2 rounded-lg border-blue-500 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 p-2 mb-4 block w-full shadow-md" />
      <button type="submit"
        class="bg-blue-500 text-blue-50 hover:bg-blue-700 py-2 px-4 rounded-lg shadow-lg w-fit hover:italic place-self-end">Ajouter
        la tâche</button>
    </form>
  </article>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      description: '',
    };
  },
  methods: {
    addTask() {
      axios.post('http://localhost:3000/api/tasks', {
        description: this.description,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(() => {
          this.$emit('taskAdded'); // Émettre un événement pour signaler qu'une tâche a été ajoutée
          this.description = ''; // Réinitialiser le champ de saisie
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de la tâche :', error);
        });
    },
  },
};
</script>