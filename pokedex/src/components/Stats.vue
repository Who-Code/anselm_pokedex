<template>
  <div class="Stats">
    <div class="headStats">
      <h1>Stats von:</h1>
      <h2 class="Name">{{ pokemonName }}</h2>
      <router-link to="/">Zurück zum Pokedex</router-link>
    </div>
    <div class="midle" v-if="pokemon?.stats">
      <h2>Stats</h2>
      <div>
        <li class="listeStats" v-for="stat in pokemon?.stats" :key="stat.stat.name">
          <div class="Sorte">{{ stat.stat.name }}:</div>
          <div class="Nummer">{{ stat.base_stat }}</div>
        </li>
      </div>
    </div>
    <div v-else>
      <p>Lade Daten...</p>
    </div>
    <img class="bild" :src="pokemon?.sprites.front_default" alt="" />
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

<style>
.Stats {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.Name {
  font-size: 20px;
}

.listeStats {
  list-style: circle;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 20vw;
}

.Sorte {
  margin: 5px;
}

.Nummer {
  margin: 5px;
}

.bild {
  position: relative;
  left: -300px;
  top: -350px;
  display: block;
  width: 100px;
  height: 100px;
}
</style>
