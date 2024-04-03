import { createWebHashHistory, createRouter } from "vue-router";

import Pokedex from "../components/Pokedex.vue";
import Stats from "../components/Stats.vue";

const routes = [
  { path: "/", redirect: { path: "/pokedex" } },
  { path: "/pokedex", name: "Pokedex", component: Pokedex },
  { path: "/stats/:name", name: "Stats", component: Stats },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
