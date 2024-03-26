<template>
    <div>
      <h1>{{ pokemonName }}</h1>
      <router-link to="/">Zurück zum Pokedex</router-link>
    </div>
  </template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const pokemonName = route.params.name;
</script>