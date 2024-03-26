import { createMemoryHistory, createRouter } from 'vue-router'

import Pokedex from '../components/Pokedex.vue';
import Stats from '../components/Stats.vue';

const routes = [
    { path: '/', component: Pokedex },
    { path: '/stats/:name', component: Stats },
  ];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;