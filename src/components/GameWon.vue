<template>
  <div class="container">
    <div class="row">
      <div class="col text-center">
        <h1>
          You now are a Certified Adventurer™!!
        </h1>
       
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
  </style>