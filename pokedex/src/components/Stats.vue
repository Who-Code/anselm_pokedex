<template>
    <div>
      <h1>Stats von: {{ pokemonName }}</h1>
      <router-link to="/">Zurück zum Pokedex</router-link>
      <div v-if="stats">
      <h2>Stats</h2>
      <ul>
        <li v-for="stat in stats" :key="stat.stat.name">{{ stat.stat.name }}: {{ stat.base_stat }}</li>
      </ul>
    </div>
    <div v-else>
      <p>Lade Daten...</p>
    </div>
    </div>
  </template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from "vue";

const route = useRoute();
const pokemonName = route.params.name;
const stats = ref(null);


onMounted(() => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json();
    })
    .then(data => {
      stats.value = data.stats;
    })
    .catch(error => console.error('Fehler beim Fetchen der Pokémon-Daten:', error));
});
</script>