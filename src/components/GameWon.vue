<template>
  <div class="container">
    <div class="row">
      <div class="col text-center">
        <h1>
          You now are a Certified Adventurer™!!
        </h1>
       
        <button class="nes-btn" @click="restartGame">Try again?</button>
        <div class="endGameContainer">
        </div>
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