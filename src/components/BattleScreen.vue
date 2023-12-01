<template>
  <div class="battleScreenOverlay position-fixed w-100 h-100 top-0 start-0 end-0 bottom-0" v-if="ready">
    <div v-if="!victoryScreen" class="battleScreen nes-container is-rounded position-absolute bg-white d-flex flex-column justify-content-start align-content-center">
      <div class="row">
        <div class="col">
          <h3>{{ monster.name }} lvl. {{ monster.level }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <HealthBar
            :health="remainingMonsterHealth"
            :maxHealth="monster.health"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 col-md-8 col-sm-6">
          <textarea
            class="nes-textarea"
            name="textarea"
            rows="5"
            disabled
            v-model="battleInfo"
          />
        </div>
        <div class="col-12 col-lg-6 col-md-4 col-sm-6 d-flex justify-content-center">
          <img
            class="img-fuid monsterImg"
            :src="setItemImg(monster.name.toLowerCase())"
            :alt="monster.name"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h3>
            {{ characterStore.character.name }} lvl.
            {{ characterStore.character.level }}
          </h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <HealthBar
            :health="characterStore.character.health"
            :maxHealth="characterStore.character.max_health"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="buttonsContainer w-100 d-flex flex-row justify-content-between align-items-baseline">
            <button
              class="playerActionButton nes-btn nowrap"
              :disabled="!playerTurn"
              @click="attack()"
            >
              Attack
            </button>
            <button
              class="nes-btn nowrap"
              @click="drinkPotion('s_potion')"
              :disabled="
                remainingHealthPotions('s_potion') === 0 || !playerTurn
              "
            >
              <img :src="setItemImg('s_potion')" alt="small potion">
            </button>
            <button
              class="nes-btn nowrap"
              @click="drinkPotion('m_potion')"
              :disabled="
                remainingHealthPotions('m_potion') === 0 || !playerTurn
              "
            >
            <img :src="setItemImg('m_potion')" alt="medium potion">
            </button>
            <button
              class="nes-btn nowrap"
              @click="drinkPotion('l_potion')"
              :disabled="
                remainingHealthPotions('l_potion') === 0 || !playerTurn
              "
            >
            <img :src="setItemImg('l_potion')" alt="large potion">
            </button>
            <button
              class="playerActionButton nes-btn nowrap"
              @click="tryToFlee()"
              :disabled="!playerTurn"
            >
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="victoryScreen nes-container is-rounded position-absolute bg-white d-flex flex-direction-column justify-content-evenly align-items-center">
      <h1>Victory!</h1>
      <span>
        <h3>You gained {{ monster.exp }} xp</h3>
        <h3>You gained {{ monster.gold }} gold</h3>
      </span>
      <button class="nes-btn" @click="finishBattle()">Continue</button>
    </div>
  </div>
</template>
<script>
import HealthBar from "./HealthBar.vue";
import items from "../assets/items.json";

import s_potion from "../assets/img/s_potion.jpg";
import m_potion from "../assets/img/m_potion.jpg";
import l_potion from "../assets/img/l_potion.jpg";
import goblin from "../assets/img/goblin.jpg";
import orc from "../assets/img/orc.jpg";
import troll from "../assets/img/troll.jpg";

import { useCharacterStore } from "@/stores/character";
import { mapState, mapActions } from "pinia";
export default {
  components: {
    HealthBar,
  },
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
  },
  props: {
    monster: Object,
  },
  data() {
    return {
      ready: false,
      remainingMonsterHealth: this.monster.health,
      victoryScreen: false,
      playerTurn: false,
      monsterTurn: false,
      battleInfo: "",
    };
  },
  watch: {
    remainingMonsterHealth() {
      if (this.remainingMonsterHealth <= 0) {
        this.victoryScreen = true;
        this.setTurnsToFalse();
      }
    },
    characterStore: {
      deep: true,
      handler: function () {
        if (this.characterStore.character.health <= 0) {
          this.gameOver();
        }
      },
    },
    monsterTurn() {
      if (this.monsterTurn) {
        setTimeout(() => {
          this.monsterAttack();
        }, 1000);
      }
    },
  },
  mounted() {
    this.battleInfo += `A wild ${this.monster.name} appears!\n`;
    this.ready = true;
    this.decideInitialTurn();
  },
  methods: {
    setItemImg(item) {
      const itemImages = {
        "s_potion": s_potion,
        "m_potion": m_potion,
        "l_potion": l_potion,
        "goblin": goblin,
        "orc": orc,
        "troll": troll
      };

      return itemImages[item];
    },
    remainingHealthPotions(potion) {
      let potions = 0;
      this.characterStore.character.inventory.forEach((item) => {
        if (item === potion) {
          potions += 1;
        }
      });
      return potions;
    },
    drinkPotion(potion) {
      this.healAmount(items.items[potion].health);
      this.removeItemFromInventory(potion);
      this.battleInfo += "You drank a potion and healed 10 health points!\n";
      //TODO: corregir el texto de puntos de vida curados
      this.swapTurns();
    },
    tryToFlee() {
      if (this.probabilityOfCharacterFleeing()) {
        this.handleSuccessfulEscape();
      } else {
        this.handleFailedEscape();
      }
    },
    handleSuccessfulEscape() {
      this.battleInfo += "You escaped!\n";
      this.setTurnsToFalse();
      setTimeout(() => {
        this.$emit("fleedBattle");
      }, 1000);
    },
    handleFailedEscape() {
      this.battleInfo += "You couldn't escape!\n";
      this.swapTurns();
    },
    probabilityOfCharacterFleeing() {
      let fleeChance = this.setFleeChance(
        this.characterStore.character.speed,
        this.monster.speed
      );
      let randomNumber = Math.floor(Math.random() * 100);
      return randomNumber < fleeChance;
    },
    setFleeChance(playerSpeed, monsterSpeed) {
      if (playerSpeed === monsterSpeed) {
        return 50;
      } else {
        return this.calculateFleeChance(playerSpeed, monsterSpeed);
      }
    },
    calculateFleeChance(playerSpeed, monsterSpeed) {
      if (playerSpeed > monsterSpeed) {
        return 75 + (playerSpeed - monsterSpeed) / (2 * playerSpeed);
      } else {
        return 25 - (monsterSpeed - playerSpeed) / (2 * monsterSpeed);
      }
    },
    ...mapActions(useCharacterStore, [
      "gainXp",
      "calculatePlayerAttack",
      "healAmount",
      "removeItemFromInventory",
    ]),
    gameOver() {
      this.battleInfo += "You are dead!";
      this.setTurnsToFalse();
      setTimeout(() => {
        this.$emit("gameOver");
      }, 1500);
    },
    setTurnsToFalse() {
      this.playerTurn = false;
      this.monsterTurn = false;
    },
    swapTurns() {
      this.playerTurn = !this.playerTurn;
      this.monsterTurn = !this.monsterTurn;
    },
    monsterAttack() {
      const finalDamage = this.calculateDamage();
      this.updateHealth(finalDamage);
      this.battleInfo += `${this.monster.name} attacks!. It does ${finalDamage} damage\n`;
      this.swapTurns();
    },
    calculateDamage() {
      return this.monster.attack + Math.round((Math.random() - 0.5) * 2);
    },
    updateHealth(damage) {
      if (this.characterStore.character.health - damage <= 0) {
        this.characterStore.character.health = 0;
      } else {
        this.characterStore.character.health -= damage;
      }
    },
    decideInitialTurn() {
      if (this.characterStore.character.speed >= this.monster.speed) {
        this.playerTurn = true;
      } else {
        this.monsterTurn = true;
      }
    },
    attack() {
      if (this.playerTurn) {
        let damage = this.calculatePlayerAttack();
        this.remainingMonsterHealth -= damage;
        this.battleInfo += `You attack!. You do ${damage} damage\n`;
        this.swapTurns();
      }
    },
    finishBattle() {
      this.$emit("finishBattle");
    },
  },
};
</script>

<style scoped>

.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.battleScreenOverlay {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  cursor: pointer;
}
.battleScreen {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  z-index: 4000;
}
@media (max-width: 992px) {
  .victoryScreen {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .battleScreen {
    width: 90%;
  }
  .buttonsContainer button {
    padding: 0!important;
    font-size: 0.8rem!important;
    max-height: 1.8rem!;
  }
  .victoryScreen {
    width: 90%;
  }
  .victoryScreen h3{
    font-size: 0.9rem!important;
  }


}
@media (min-width: 768px) {
  .battleScreen {
    width: 600px;
  }
}
.buttonsContainer {
  margin-top: 5px;
}

.victoryScreen {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: 400px;
  padding: 20px;
  z-index: 6000;
}

.playerActionButton {
  margin-left: 5px;
}

progress[value] {
  /* Reset the default appearance */
  position: relative;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  margin: 20px 15px 15px 15px;
}
progress[value]::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}
progress[value]::-webkit-progress-value {
  background-color: red;
  border-radius: 2px;
}


.monsterImg {
  align-self: center;
  width: 150px;
  padding: 20px 0px 20px 20px;
}
.monsterHealthNumber {
  position: absolute;
  left: 15px;
  top: 3px;
  font-weight: 800;
  color: black;
}
button img {
  width: 25px
}
</style>
