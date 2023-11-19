<template>
  <div class="endGameContainer">
    <h1>
      You died
    </h1>
    <div class="nes-container">
      <img src="../assets/img/rip.jpg" alt="rip" />
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
  .endGameContainer {
    text-align: center;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .endGameContainer img {
    max-width: 100%;
    height: auto;
  }

  .endGameContainer button {
    margin-top: 15px;
  }
</style>