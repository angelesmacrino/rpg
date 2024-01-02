<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col text-center">
        <h1>
          You died
        </h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-center d-flex flex-column justify-content-center align-items-center">
          <div class="nes-container">
            <img class="img-fuid" src="../assets/img/rip.jpg" alt="rip" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <button class="nes-btn" @click="restartGame">Try again?</button>
      </div>
    </div>
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

  @media (max-width: 932px) {
    img {
      width: 200px;
    }
  }
</style>