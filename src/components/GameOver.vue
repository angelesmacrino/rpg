<template>
  <div class="endGameContainer">
    u ded
    <img src="../assets/rip.png" alt="rip" />
    <button class="nes-btn" @click="restartGame">Try again?</button>
  </div>
</template>

<script>


export default {
  methods: {
    restartGame() {
      this.$emit("restartGame");
    }
  },
}
</script>

<style>
  .endGameContainer {
    text-align: center;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>