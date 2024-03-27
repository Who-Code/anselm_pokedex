<template>
  <div class="pokedex">
    <div class="head">
      <h1>Pokedex</h1>
      <div>
        <input type="text" v-model="searchQuery" placeholder="Suchen..." />
      </div>
    </div>
    <div class="grid">
      <div v-show="IsLoading">Lade Daten..</div>
      <div v-show="!IsLoading" v-for="pokemon in filteredPokemons" :key="pokemon.name" class="card">
        <router-link :to="`/stats/${pokemon.name}`">
          <p>{{ pokemon.name }}</p>
          <img :src="pokemon.sprites.front_default" alt="" />
        </router-link>
      </div>
    </div>
    <div class="foot">
      <div><button :disabled="IsLoading" @click="back" v-show="offset > 0">Zurück</button></div>
      <div>
        <button :disabled="IsLoading" @click="next" v-show="showNextButton">Nächste</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { PokeApiService, type Pokemon } from "@/services/PokeApiService";

const pokemons = ref<Array<Pokemon>>([]);
const searchQuery = ref("");
const Api = new PokeApiService();
const offset = ref(0);
const PageSize = ref(20);
const PokemonCount = ref(0);
const IsLoading = ref(false);

const showNextButton = computed(() => {
  return offset.value + PageSize.value < PokemonCount.value;
});

const next = () => {
  offset.value += PageSize.value;
  loadData();
};

const back = () => {
  offset.value -= PageSize.value;
  loadData();
};

const loadData = async () => {
  IsLoading.value = true;
  const response = await Api.Name(offset.value, PageSize.value);
  PokemonCount.value = response.count;
  pokemons.value = response.results;
  IsLoading.value = false;
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.head {
  width: 70%;
}

.head input {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  border: none;
  padding: 15px;
  border-radius: 5px;
  background-color: rgb(241, 238, 233);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.5rem;
  flex-grow: 1;
  padding: 40px;
  width: 100%;
  overflow: auto;
}

.foot {
  min-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
  width: 20vw;
}

.foot button {
  height: 100%;
}

.card {
  padding: 0.8rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  background-color: white;
  border-radius: 5px;
}
</style>
