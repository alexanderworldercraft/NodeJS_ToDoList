import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Assure-toi que le routeur est bien importé
import './main.css'; // Assure-toi que Tailwind est bien inclus

createApp(App)
  .use(router)
  .mount('#app');