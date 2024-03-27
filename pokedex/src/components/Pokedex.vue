<template>
  <div class="pokedex">
    <h1>Pokedex</h1>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Suchen..." />
    </div>
    <div class="grid">
      <p v-show="IsLoading">Lade Daten..</p>
      <div v-show="!IsLoading" v-for="pokemon in filteredPokemons" :key="pokemon.name" class="card">
        <router-link :to="`/stats/${pokemon.name}`">
          <p>{{ pokemon.name }}</p>
        </router-link>
      </div>
    </div>
    <button @click="Zurück" v-show="offset > 0">Zurück</button>
    <button @click="Nächste" v-show="showNextButton">Nächste</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { PokeApiService, type searchItem } from "@/services/PokeApiService";

const pokemons = ref<Array<searchItem>>([]);
const searchQuery = ref("");
const Api = new PokeApiService();
const offset = ref(1280);
const PageSize = ref(20);
const PokemonCount = ref(0);
const IsLoading = ref(false)

const showNextButton = computed(()=>{
  return offset.value + PageSize.value < PokemonCount.value
})  

const Nächste = () => {
  offset.value += PageSize.value;
  loadData();
};

const Zurück = () => {
  offset.value -= PageSize.value;
  loadData();
};

const loadData = async () => {
  IsLoading.value = true
  const response =  await Api.Name(offset.value, PageSize.value)
  PokemonCount.value = response.count
  pokemons.value = response.results
  IsLoading.value = false
};

onMounted(loadData);

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
