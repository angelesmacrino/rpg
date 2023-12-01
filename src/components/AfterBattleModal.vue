<template>
  <div class="levelUpScreen nes-container is-rounded position-absolute bg-white d-flex flex-column justify-content-start align-content-center">
    <h4>{{ afterBattle[event] }}</h4>
    <ul v-if="event === 'level_up'">
      <li>Health: + {{ characterStore.character.max_health_per_level }}</li>
      <li>Attack: + {{ characterStore.character.attack_per_level }}</li>
      <li>Speed: + {{ characterStore.character.speed_per_level }}</li>
    </ul>
    <button class="nes-btn" @click="closeModal">OK</button>
  </div>
</template>

<script>
import afterBattle from "../assets/afterBattle.json";
import { useCharacterStore } from "@/stores/character";
import { mapState } from "pinia";

export default {
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
  },
  props: {
    event: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      afterBattle,
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.levelUpScreen {
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  /* height: 200px; */
  padding: 20px!important;
  z-index: 3;
  z-index: 10000000;
}

@media (max-width: 768px) {
  .levelUpScreen {
    top: 30%;
    width: 100%
  }
}

@media (min-width: 769px) {
  .levelUpScreen {
    top: 50%;
  }
}
</style>
