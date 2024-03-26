<template>
  <div class="pokedex">
    <h1>Pokedex</h1>
    <router-link to="/stats">Zu Stats</router-link>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Suchen..." />
    </div>
    <div class="grid">
        <div v-for="pokemon in filteredPokemons" :key="pokemon.name" class="card">
          <router-link :to="`/stats/${pokemon.name}`">
          <p>{{ pokemon.name }}</p>
        </router-link>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const pokemons = ref<Array<{ name: string }>>([]);
const searchQuery = ref("");

fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
  .then((response) => response.json())
  .then((data) => {
    pokemons.value = data.results;
  });
const filteredPokemons = computed(() => {
  return pokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style>
.pokedex {
  max-width: 600px;
  margin: 0 auto;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}
.card {
  border: 1px solid #ccc;
  padding: 0.8rem;
  text-align: center;
}
</style>
