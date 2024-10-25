import { createRouter, createWebHistory } from 'vue-router';
import TaskManagement from '../views/TaskManagement.vue';
import LoginPage from '../components/LoginPage.vue';

const routes = [
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', component: TaskManagement },
  { path: '/login', component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),  // Utilise le mode history pour gérer les routes côté client
  routes,
});

// Ajouter la garde d'authentification ici
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifier si le token est présent dans le localStorage

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  } else {
    next(); // Continuer la navigation
  }
});

export default router;