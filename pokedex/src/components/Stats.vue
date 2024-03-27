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
    <div>
      <div>Geräusche von: {{ pokemonName }}</div>
      <div class="buttonContainer">
        <button class="soundSpielen" @click.prevent="playSound(pokemon?.cries.latest)"></button>
      </div>
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

const playSound = (sound) => {
  if (sound) {
    const audio = new Audio(sound);
    audio.volume = 0.5;
    audio.play();
  }
};
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

.buttonContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.soundSpielen {
  display: flex;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  border: 0px solid #fff5e6;
  background-image: url("@/assets/PlayButton.png");
  background-size: cover;
  background-position: center;
}
</style>
