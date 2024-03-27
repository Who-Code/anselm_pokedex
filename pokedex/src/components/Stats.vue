<template>
  <div>
    <h1>Stats von: {{ pokemonName }}</h1>
    <router-link to="/">Zurück zum Pokedex</router-link>
    <div v-if="pokemon?.stats">
      <h2>Stats</h2>
      <ul>
        <li v-for="stat in pokemon?.stats" :key="stat.stat.name">
          {{ stat.stat.name }}: {{ stat.base_stat }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Lade Daten...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, Ref } from "vue";
import { PokeApiService, type Pokemon } from "@/services/PokeApiService";

const route = useRoute();
const pokemonName = route.params.name;
const pokemon: Ref<Pokemon | null> = ref(null);
const Api = new PokeApiService();

const loadData = async () => {
  pokemon.value = await Api.get(pokemonName as string);
};

onMounted(loadData);
</script>
