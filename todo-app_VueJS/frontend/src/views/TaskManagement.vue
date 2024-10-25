<template>
    <main class="container mx-auto py-6 flex flex-col grow">
      <TaskForm @taskAdded="fetchTasks" />
      <TaskList ref="taskList" />
    </main>
  </template>
  
  <script>
  import TaskList from '../components/TaskList.vue';
  import TaskForm from '../components/TaskForm.vue';
  
  export default {
    components: {
      TaskList,
      TaskForm
    },
    methods: {
      fetchTasks() {
        // Appeler la méthode de TaskList pour rafraîchir les tâches après l'ajout d'une nouvelle tâche
        this.$refs.taskList.fetchTasks();
      }
    }
  }
  </script>
  