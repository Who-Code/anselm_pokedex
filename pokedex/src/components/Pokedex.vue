<template>
  <div class="pokedex">
    <div class="head">
      <h1>Pokedex</h1>
      <div>
        <input type="text" @keyup="RunSearch" v-model="searchQuery" placeholder="Suchen..." />
      </div>
    </div>
    <div class="grid">
      <div v-show="IsLoading">Lade Daten..</div>
      <div v-show="!IsLoading" v-for="pokemon in pokemons" :key="pokemon.name" class="card">
        <router-link :to="`/stats/${pokemon.name}`">
          <p>{{ pokemon.name }}</p>
          <img :src="pokemon.sprites.front_default" alt="" />
        </router-link>
      </div>
    </div>
    <div class="foot">
      <div>
        <button :disabled="IsLoading" @click="back" v-show="offset > 0">Zurück</button>
      </div>
      {{ aktuelleSeite }}
      <div>
        <button :disabled="IsLoading" @click="next" v-show="showNextButton">Nächste</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { PokeApiService, type Pokemon } from "@/services/PokeApiService";
import { useRouter, useRoute } from "vue-router";
import { searchItem } from "@/services/PokeApiService";

const router = useRouter();
const route = useRoute();
const pokemons = ref<Array<Pokemon>>([]);
const AllPokemons = ref<Array<searchItem>>([]);
const searchQuery = ref("");
const Api = PokeApiService.getInstance();
const offset = ref(0);
const PageSize = ref(20);
const PokemonCount = ref(0);
const IsLoading = ref(false);

const searchDebounceTimer = ref(-1);

const RunSearch = async () => {
  clearTimeout(searchDebounceTimer.value);
  searchDebounceTimer.value = setTimeout(async () => {
    Api.search(searchQuery.value);
    const queryOffset = offsetFromQuery();
    if (queryOffset > Api.filteredPokemonList.length) {
      offset.value = 0;
    }
    await generateRoute();
    init();
    loadData();
  }, 1000);
};

/**
 * Erzeugt anhand eines Offset Wertes die zugehörige Seitenzahl.
 *
 * @param inputoffset
 */
const pageByOffset = (inputoffset: number) => {
  return inputoffset / PageSize.value + 1;
};

/**
 * Erzeugt anhand einer Seitenzahl den zugehörigen Offset Wert
 * @param page
 */
const offsetByPage = (inputPage: number) => {
  return inputPage * PageSize.value - PageSize.value;
};

const showNextButton = computed(() => {
  return offset.value + PageSize.value < PokemonCount.value;
});

const aktuelleSeite = computed(() => {
  const aktuelleSeite = pageByOffset(offset.value);
  return aktuelleSeite;
});

const next = () => {
  changePage(PageSize.value);
};

const back = () => {
  changePage(-1 * PageSize.value);
};

const generateRoute = async () => {
  console.log("Generate Route");
  await router.push(`/pokedex?page=${pageByOffset(offset.value)}&search=${searchQuery.value}`);
};

const changePage = async (changeValue: number) => {
  offset.value += changeValue;
  await generateRoute();
  init();
};

const loadData = async () => {
  IsLoading.value = true;
  AllPokemons.value = await Api.all();
  const response = await Api.List(offset.value, PageSize.value);
  PokemonCount.value = response.count;
  pokemons.value = response.results;
  IsLoading.value = false;
};

watch(route, () => {
  console.log("Route change");
  init();
});

const init = () => {
  parseParams();
  loadData();
};

const offsetFromQuery = () => {
  const pageParam = route.query.page ? parseInt(route.query.page as string) : 1;
  return offsetByPage(pageParam);
};

const parseParams = () => {
  // Ist etwas war ? wenn ja : wenn nein
  const searchParam = route.query.search as string;

  offset.value = offsetFromQuery();
  if (searchParam && searchParam !== "" && searchParam !== searchQuery.value) {
    searchQuery.value = searchParam;
    RunSearch();
  }
};

onMounted(() => {
  init();
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
  background-color: #fffdfc;
}

.head input {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  border: none;
  padding: 15px;
  border-radius: 5px;
  background-color: rgb(241, 238, 233);
}

.grid {
  background-color: #fff9f4;
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
  border-radius: 4px;
  border-width: 0.1px;
  border-color: #fff5e6;
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
