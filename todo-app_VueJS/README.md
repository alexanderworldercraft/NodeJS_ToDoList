# Ajout de VueJS
## ***Sommaire***
- [**Restructuration pour ajouter le Front end**](#restructuration-pour-ajouter-le-front-end)
- [**Explication des étapes de la réalisation du projet coté Front end**](#explication-des-étapes-de-la-réalisation-du-projet-coté-front-end)
## ***Restructuration pour ajouter le Front end***
```
todo-app_VueJS/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── taskModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
└── frontend
    ├── dist/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── router/
    │   ├── views/
    │   ├── App.vue/
    │   ├── main.css/
    │   └── main.js/
    ├── babel.config.js
    ├── jsconfig.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vue.config.js
```
## ***Explication des étapes de la réalisation du projet coté Front end***
### ***Étape 1 : Configurer le projet Vue.js***
1. **Créer un projet Vue.js avec Vue CLI**

Créer un porjet avec Vue CLI :
```bash
vue create frontend # crée un dossier frontend
```
Cela lancera un assistant pour configurer ton projet Vue.js. Voici quelques suggestions :

- **Manuel configuration** : Si tu veux sélectionner les outils comme Vue Router ou Vuex.
- **ESLint + Prettier** : Pour garder ton code propre et bien formaté.
- **Vue 3** : Par défaut, il utilisera la dernière version (Vue 3).

Tu peux choisir les options qui te conviennent en fonction de ce que tu souhaites utiliser dans ton projet (ici nous allons utilsier Vue 3).
### ***Installer Axios pour les requêtes HTTP***

Dans le projet Vue.js, installe **Axios** pour communiquer avec ton API Node.js :
```bash
npm install axios
```
3. **Configurer TailwindCSS**

Si TailwindCSS est déjà initialisé, il devrait être dans ton fichier `tailwind.config.js`. Assure-toi que le fichier est correctement configuré pour Vue.js. Voici un exemple de ce que tu dois avoir dans ton fichier `tailwind.config.js` :
```JS
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Si nécessaire, vérifie que TailwindCSS est bien importé dans ton fichier `src/main.js` :
```JS
import { createApp } from 'vue';
import App from './App.vue';
import './main.css'; // Assure-toi que Tailwind est bien inclus

createApp(App).mount('#app');
```
4. **Organiser les composants Vue.js**

Dans le dossier `src/components`, crée des composants pour gérer l'affichage des tâches. Par exemple, un composant pour afficher la liste des tâches (`TaskList.vue`) et un formulaire pour ajouter/modifier une tâche (`TaskForm.vue`).

Exemple d'un composant `TaskList.vue` :
```VUE
<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Liste des tâches</h1>
    <ul>
      <li v-for="task in tasks" :key="task.TaskID" class="mb-2">
        <div class="flex justify-between items-center">
          <span :class="{ 'line-through': task.Status }">{{ task.Description }}</span>
          <button class="ml-4 text-blue-500" @click="toggleTaskStatus(task)">Terminé</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    fetchTasks() {
      axios.get('http://localhost:3000/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        this.tasks = response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des tâches :', error);
      });
    },
    toggleTaskStatus(task) {
      const updatedStatus = task.Status === 1 ? 0 : 1;
      axios.put(`http://localhost:3000/tasks/${task.TaskID}`, { status: updatedStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => {
        this.fetchTasks(); // Recharger la liste des tâches
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du statut de la tâche :', error);
      });
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
```
### ***Étape 2 : Relier le frontend Vue.js au backend Node.js***
1. **Configurer le proxy dans Vue.js**
Pour éviter les problèmes de **CORS**, tu peux configurer un proxy dans Vue.js pour rediriger les appels vers l'API Node.js. Ajoute un fichier `vue.config.js` à la racine du projet Vue.js avec ce contenu :
```JS
module.exports = {
  devServer: {
    proxy: {
      '/tasks': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
```
Cela permet d'envoyer les requêtes à l'API via le serveur de développement Vue.js sans problème de CORS.

2. Authentification dans Vue.js

Tu peux gérer l'authentification avec le **localStorage** pour stocker le token JWT reçu lors de la connexion. Dans un composant `Login.vue`, tu peux ajouter un formulaire de connexion qui communique avec ton backend.

Exemple :
```VUE
<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Connexion</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Nom d'utilisateur" class="border p-2 mb-4 block w-full" />
      <input type="password" v-model="password" placeholder="Mot de passe" class="border p-2 mb-4 block w-full" />
      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Se connecter</button>
    </form>
  </div>
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
      axios.post('http://localhost:3000/auth/login', {
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
```
### ***Étape 3 : Organiser les routes avec Vue Router***
Si tu veux gérer plusieurs pages comme la page de connexion et la page des tâches, configure Vue Router. Dans ton fichier `src/router/index.js`, tu peux définir les routes comme suit :
```JS
import { createRouter, createWebHistory } from 'vue-router';
import TaskList from '../components/TaskList.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/tasks', component: TaskList },
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
```
### ***Étape 4 : Démarrer et tester les deux projets***
1. **Démarrer le backend (Node.js) :**

Depuis ton dossier backend, lance le serveur :
```JS
npm start
```
2. **Démarrer le frontend (Vue.js) :**

Depuis ton dossier frontend, lance le serveur de développement :
```JS
npm run serve
```
3. **Tester l'application :**
- Accède à `http://localhost:8080` pour ouvrir ton application Vue.js.
- Teste les différentes fonctionnalités, comme la connexion, l'affichage des tâches et la mise à jour de leur statut.