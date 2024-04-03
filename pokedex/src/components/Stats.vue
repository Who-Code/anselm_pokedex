<template>
  <div class="Stats">
    <div class="headStats">
      <h1>Stats von:</h1>
      <h2 class="Name">{{ pokemonName }}</h2>
      <button @click="goBack">Back</button>
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
        <button
          :disabled="IsLoading"
          class="soundSpielen"
          @click.prevent="playSound(pokemon?.cries.latest)"
        >
          <img class="pokeImage" :src="pokemon?.sprites.front_default" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, Ref } from "vue";
import { PokeApiService, type Pokemon } from "@/services/PokeApiService";

const router = useRouter();
const route = useRoute();
const pokemonName = route.params.name;
const pokemon: Ref<Pokemon | null> = ref(null);
const Api = PokeApiService.getInstance();
const IsLoading = ref(false);
const audioPlayer = new Audio();

const loadData = async () => {
  pokemon.value = await Api.get(pokemonName as string);
};

const goBack = () => {
  router.back();
};

onMounted(loadData);

const playSound = (sound: string) => {
  IsLoading.value = true;

  const endedLastPlayback = audioPlayer.src === "" || audioPlayer.ended;

  if (sound !== "" && endedLastPlayback) {
    audioPlayer.src = sound;
    audioPlayer.volume = 0.5;
    audioPlayer.play();
  }
  IsLoading.value = false;
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
  background-color: #f5f5dc;
  display: inline-block;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  border-radius: 40px;
  border: none;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.soundSpielen:hover {
  background-color: #ede9d9;
}

.pokeImage {
  width: 60px;
}
</style>
