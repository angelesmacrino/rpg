<template>
  <div class="endGameContainer text-center d-flex flex-column justify-content-center align-items-center">
    <h1>
      You died
    </h1>
    <div class="nes-container">
      <img class="img-fuid" src="../assets/img/rip.jpg" alt="rip" />
    </div>
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

<style scoped>

  .endGameContainer button {
    margin-top: 15px;
  }
</style>