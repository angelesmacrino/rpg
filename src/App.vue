<template>
  <div class="container-fuid">
    <div v-if="isGameActive">

      <div class="row mt-2">
        <div class="col text-center">
          <h1>Yet another RPG</h1>
        </div>
      </div>

      <div class="row mt-2 d-flex alig-items-center justify-content-center">
        <div class="col-lg-5 col-md-7 col-sm-6 d-flex flex-row justify-content-center">
            <Tileboard
              :ref="'tileBoardRef'"
              @monsterBattle="monsterBattle"
              :inBattle="inBattle"
            />
          </div>
        <div class="col-lg-5 col-md-5 col-sm-6 d-flex flex-column align-items-center justify-content-center">

          <div class="d-flex flex-column align-items-center justify-content-center movementGrid">
            <div class="upRow">
              <div class="d-flex align-items-center justify-content-center movementCell">
          
              </div>
              <button @click="moveByClick('ArrowUp')" class="movementCell nes-btn">
                <img :src="getImage('up_arrow')" alt="up_arrow" />
              </button>
              <div class="movementCell">
          
              </div>
            </div>
            <div class="sidesRow">
              <button @click="moveByClick('ArrowLeft')" class="movementCell nes-btn">
                <img :src="getImage('left_arrow')" alt="left_arrow" />
              </button>
              <div class="movementCell">
          
              </div>
              <button @click="moveByClick('ArrowRight')" class="movementCell nes-btn">
                <img :src="getImage('right_arrow')" alt="right_arrow" />
          
              </button>
            </div>
            <div class="downRow">
              <div class="movementCell">
                
              </div>
              <button @click="moveByClick('ArrowDown')" class="movementCell nes-btn">
                <img :src="getImage('down_arrow')" alt="down_arrow" />
              </button>
              <div class="movementCell">
                
              </div>
            </div>
          </div>
        
          <div class="infoScreen">
            <button
              id="charButton"
              class="nes-btn is-warning position-absolute top-0 start-0"
              @click="toggleCharacterStats()"
            >
              {{ lookingAtCharacter ? "M" : "C" }}
            </button>
            <CurrentLocationInfoAndStats v-if="!lookingAtCharacter" @victory="victory" />
            <Character v-show="lookingAtCharacter" @levelUp="levelUpModal()" />
          </div>

        </div>
      </div>

      <div class="row">
        <div class="col">
          <footer class="">
            © 2023 - Mishulina. All rights reserved. CSS by 
            <a href="https://nostalgic-css.github.io/NES.css/" rel="noreferrer nofollow" target="_blank">
              NES.css
            </a>
          </footer>
        </div>
      </div>

      <BattleScreen
      v-if="inBattle"
      :monster="battledMonster"
      @finishBattle="finishBattle()"
      @gameOver="gameOver()"
      @fleedBattle="fleedBattle()"
      />
      <AfterBattleModal
      v-if="afterBattleModal"
      :event="after_battle_event"
      @closeModal="closeAfterBattleModal"
      />
    </div>

  </div>
  <GameOver 
    v-if="gameIsOver" 
    @restartGame="restartGame" 
  />
  <GameWon 
    v-if="gameWon" 
    @restartGame="restartGame"
  />
 
</template>

<script>
import Tileboard from "./components/Tileboard.vue";
import BattleScreen from "./components/BattleScreen.vue";
import Character from "./components/Character.vue";
import AfterBattleModal from "./components/AfterBattleModal.vue";
import GameOver from "./components/GameOver.vue";
import GameWon from "./components/GameWon.vue";
import CurrentLocationInfoAndStats from "./components/CurrentLocationInfoAndStats.vue";
import { useCharacterStore } from "@/stores/character";
import { mapState, mapActions } from "pinia";

import up_arrow from "./assets/img/up_arrow.png";
import down_arrow from "./assets/img/down_arrow.png";
import left_arrow from "./assets/img/left_arrow.png";
import right_arrow from "./assets/img/right_arrow.png";


export default {
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
    isGameActive() {
      return !this.gameIsOver && !this.gameWon;
    },
  },
  components: {
    Tileboard,
    BattleScreen,
    Character,
    AfterBattleModal,
    GameOver,
    GameWon,
    CurrentLocationInfoAndStats
  },
  data() {
    return {
      inBattle: false,
      battledMonster: null,
      afterBattleModal: false,
      gameIsOver: false,
      lookingAtCharacter: false,
      after_battle_event: "",
      gameWon: false
    };
  },
  methods: {
    victory() {
      this.gameWon = true
    },
    ...mapActions(useCharacterStore, ["gainXp", "gainGold"]),
    toggleCharacterStats() {
      this.lookingAtCharacter = !this.lookingAtCharacter;
    },
    fleedBattle() {
      this.inBattle = false;
      this.battledMonster = null;
    },
    monsterBattle(battledMonster) {
      this.setAttributesOfMonster(battledMonster);
      this.monsterWillDropLoot(battledMonster);
      this.inBattle = true;
      this.battledMonster = battledMonster;
    },
    setAttributesOfMonster(battledMonster) {
      this.setMonsterLevel(battledMonster);
      this.setMonsterAttributes(battledMonster);
    },
    setMonsterLevel(battledMonster) {
      const randomNumber = Math.floor(Math.random() * 2);
      const isTerrainP = this.characterStore.currentTerrain === "P";
      const isTerrainF = this.characterStore.currentTerrain === "F";
      const isTerrainM = this.characterStore.currentTerrain === "M";

      if (isTerrainP && battledMonster.name === "Orc" || isTerrainF && battledMonster.name === "Troll") {
        battledMonster.level = 1;
      } else if (isTerrainP) {
        battledMonster.level = randomNumber + 1;
      } else if (isTerrainF) {
        battledMonster.level = randomNumber + 2;
      } else if (isTerrainM) {
        battledMonster.level = randomNumber + 4;
      }
    },
    setMonsterAttributes(battledMonster) {
      const ATTRS = ["health", "attack", "defense", "speed", "gold", "exp"];
      for (let i = 0; i < ATTRS.length; i++) {
        const attr = ATTRS[i];
        battledMonster[attr] =
          battledMonster[`base_${attr}`] +
          battledMonster[`${attr}_per_level`] * (battledMonster.level - 1);
      }
    },
    monsterWillDropLoot(battledMonster) {
      const chance = Math.floor(Math.random() * 2);
      if (battledMonster.drop_rate * 10 > chance) {
        battledMonster.has_loot = true;
      }
    },
    finishBattle() {
      this.inBattle = false;
      this.gainXp(this.battledMonster.exp);
      this.gainGold(this.battledMonster.gold);
      if (this.monsterDroppedLoot()) {
        this.addDropToCharacterAndOpenModal();
      }
      this.battledMonster = null;
    },
    addDropToCharacterAndOpenModal() {
      this.characterStore.character.loot.push(this.battledMonster.drop);
      this.after_battle_event = this.battledMonster.drop;
      this.afterBattleModal = true;
    },
    monsterDroppedLoot() {
      return this.battledMonster.has_loot;
    },
    levelUpModal() {
      this.after_battle_event = "level_up";
      this.afterBattleModal = true;
    },
    closeAfterBattleModal() {
      this.afterBattleModal = false;
    },
    gameOver() {
      this.inBattle = false;
      this.battledMonster = null;
      this.gameIsOver = true;
    },
    restartGame() {
      window.location.reload();
    },
    moveByClick(key) {
      this.$refs.tileBoardRef.moveCharacter({ key });
    },
    getImage(img) {
      const images = {
        up_arrow: up_arrow,
        down_arrow: down_arrow,
        left_arrow: left_arrow,
        right_arrow: right_arrow
      };

      return images[img];
    }
  },
};
</script>
<style>

#app {
  width: 77%;
}
#charButton {
  z-index: 1000;
  
  font-size: 0.5rem;
}


.nes-btn:disabled {
  background-color: #e7e7e7;
  cursor: not-allowed;
}
.nes-btn:disabled::after {
  box-shadow: none !important;
}
.nes-btn:active:not(.is-disabled)::after {
  box-shadow: none;
}

.statsContainer {
  margin-top: 15px;
}
.buttonsGroup {
  margin: 30px 0px 15px 0px;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1400px) {
  .buttonsGroup {
    flex-direction: column; 
  }
}
.inventoryList {
  padding: 0;
  text-align: start;
  max-width: fit-content;
}
.inventoryList li {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 3px;
  border: 3px solid black;
}
.stat {
  text-align: initial;
}
.inventoryList li small {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 5px;
  height: 5px;
  color: black;
}


@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  .nes-container.is-rounded,
  .nes-btn,
  .nes-progress,
  .nes-textarea {
    border-image-repeat: stretch !important;
  }
}
.battleScreen  h3 {
  text-align: center;
  text-wrap: nowrap;
  font-weight: 600;
  font-size: 1rem;
}
</style>
<style scoped>

.infoScreen {
  max-width: 600px;
  padding: 15px; 
}


.movementGrid div {
  display: flex
}
.movementCell {
  width:50px;
  height: 50px;
}
.movementCell img {
  width: 30px;
}

</style>
