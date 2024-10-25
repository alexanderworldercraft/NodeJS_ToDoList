<template>
  <article class="container mx-auto px-6">
    <h1 class="text-3xl text-left text-blue-900 italic font-bold mb-4">Liste des tâches</h1>

    <!-- Liste des tâches -->
    <ul class="divide-y divide-blue-200">
      <li v-for="task in tasks" :key="task.TaskID" class="py-4 flex justify-between items-center">
        <!-- Titre et description de la tâche -->
        <div>
          <div class="flex items-center space-x-2 me-2">
            <h3 class="text-lg text-left text-blue-950 font-bold line-clamp-1">{{ task.Description }}</h3>
            <span :class="{
              'bg-green-100 border border-green-800 text-green-800': task.Status === 1,
              'bg-gray-100 border border-gray-800 text-gray-800': task.Status === 0
            }" class="px-2 py-1 text-xs font-medium rounded-lg line-clamp-1">
              {{ task.Status === 1 ? 'Compléter' : 'En cours' }}
            </span>
          </div>
          <div>
            <p class="text-sm text-left text-gray-500">
            Créer le {{ formatDate(task.CreatedAt) }}
            </p>
          </div>
        </div>

        <!-- Bouton d'actions -->
        <div class="relative">
          <div class="flex flex-row">
            <!-- Bouton Terminé -->
          <button @click="toggleTaskStatus(task)"
            class="px-2 py-1 bg-white border border-blue-950 text-blue-950 hover:bg-blue-100 rounded-md line-clamp-1">
            {{ task.Status === 1 ? 'Je n\'ai pas fini' : 'Terminé la tâche' }}
          </button>

          <!-- Dropdown -->
          <button @click="toggleDropdown(task.TaskID)" class="ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" stroke="currentColor">
              <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
            </svg>
          </button>
          </div>

          <div v-if="isDropdownOpen(task.TaskID)"
            class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
            <button @click="editTask(task)"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Éditer
            </button>
            <button @click="deleteTask(task.TaskID)"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Supprimer
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Pagination -->
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchTasks" />
  </article>
</template>

<script>
import axios from 'axios';
import Pagination from './PaginationList.vue'; // Assume we are using the Pagination component created earlier

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      tasks: [],
      currentPage: 1,
      totalPages: 1,
      limit: 5,
      dropdownOpenTaskID: null, // Pour gérer l'ouverture du dropdown
    };
  },
  created() {
    this.fetchTasks(this.currentPage);
  },
  methods: {
    fetchTasks(page = 1) {
      this.currentPage = page;
      axios
        .get('http://localhost:3000/api/tasks', {
          params: {
            page: this.currentPage,
            limit: this.limit,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          this.tasks = response.data.tasks;
          this.totalPages = Math.ceil(response.data.total / this.limit);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des tâches :', error);
        });
    },
    toggleTaskStatus(task) {
      const updatedStatus = task.Status === 1 ? 0 : 1;
      axios
        .put(`http://localhost:3000/api/tasks/${task.TaskID}`, { status: updatedStatus }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
          this.fetchTasks(this.currentPage);
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour du statut de la tâche :', error);
        });
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    toggleDropdown(taskID) {
      if (this.dropdownOpenTaskID === taskID) {
        this.dropdownOpenTaskID = null;
      } else {
        this.dropdownOpenTaskID = taskID;
      }
    },
    isDropdownOpen(taskID) {
      return this.dropdownOpenTaskID === taskID;
    },
    editTask(task) {
      // Logique pour éditer la tâche (peut être un modal ou une redirection vers une page d'édition)
      console.log('Edit task:', task);
    },
    deleteTask(taskID) {
      axios
        .delete(`http://localhost:3000/api/tasks/${taskID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
          this.fetchTasks(this.currentPage);
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de la tâche :', error);
        });
    },
  },
};
</script>

<style scoped>
/* Style du dropdown */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>