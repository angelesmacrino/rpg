<template>
  <div class="tileWorld">
    <div v-for="(row, x) in tilesMatrix" class="tileRow" :key="x">
      <div v-for="(cell, y) in row" class="cell" :key="[x, y]">
        <Tile :ref="tilesMatrix[x][y]" :coordinates="[x, y]" :tile="cell">
          <div
            v-if="coordinates[0] === x && coordinates[1] === y"
            class="character"
          ></div>
        </Tile>
      </div>
    </div>
  </div>
</template>

<script>
import monsters from "../assets/monsters.json";
import Tile from "./Tile.vue";
import { useCharacterStore } from "@/stores/character";
import { mapState, mapActions } from "pinia";
export default {
  name: "Tileboard",
  components: {
    Tile,
  },
  props: {
    inBattle: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
    xCoordinate() {
      return this.coordinates[0];
    },
    yCoordinate() {
      return this.coordinates[1];
    },
  },
  data() {
    return {
      monstersArray: monsters.monsters,
      tilesMatrix: [
        ["F", "F", "F", "F", "F", "F", "F", "F", "P", "F"],
        ["F", "F", "F", "F", "F", "F", "F", "F", "P", "F"],
        ["M", "P", "P", "P", `P`, "F", "F", "F", "P", "F"],
        ["M", "P", "P", "P", "P", "P", "P", "P", "P", "F"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "F"],
        ["P", "P", "P", "P", "P", "C", "P", "P", "P", "F"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "F"],
        ["M", "F", "F", "P", "P", "P", "P", "P", "P", "F"],
        ["M", "F", "F", "F", "P", "P", "F", "F", "F", "F"],
        ["M", "M", "F", "F", "F", "P", "F", "F", "M", "M"],
      ],
      coordinates: [5, 5],
    };
  },
  watch: {
    coordinates: {
      deep: true,
      handler: function () {
        this.setCurrentTerrain(
          this.tilesMatrix[this.xCoordinate][this.yCoordinate]
        );
        if (this.characterNotInCity()) {
          this.chanceMonsterEncounter();
        }
      },
    },
  },
  created() {
    document.addEventListener("keydown", this.moveCharacter);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.moveCharacter);
  },
  mounted() {
    this.setCurrentTerrain(
      this.tilesMatrix[this.xCoordinate][this.yCoordinate]
    );
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCurrentTerrain"]),
    characterNotInCity() {
      return this.characterStore.currentTerrain !== "C";
    },
    chanceMonsterEncounter() {
      const random = Math.floor(Math.random() * 100);
      if (random < 15) {
        const chosenMonster = this.checkForMonster();
        this.$emit("monsterBattle", chosenMonster);
      }
    },
    checkForMonster() {
      const currentTile = this.tilesMatrix[this.xCoordinate][this.yCoordinate];
      const random = Math.random();
      let cumulativeChance = 0;
      let chosenMonster;
      this.monstersArray.every((monster) => {
        cumulativeChance += monster.chance[currentTile];
        if (random < cumulativeChance) {
          chosenMonster = JSON.parse(JSON.stringify(monster));
          return false;
        }
        return true;
      });
      return chosenMonster;
    },
    moveUp() {
      if (this.coordinates[0] > 0) {
        this.coordinates[0] = this.coordinates[0] - 1;
      }
    },
    moveDown() {
      if (this.coordinates[0] < this.tilesMatrix.length - 1) {
        this.coordinates[0] = this.coordinates[0] + 1;
      }
    },
    moveLeft() {
      if (this.coordinates[1] > 0) {
        this.coordinates[1] = this.coordinates[1] - 1;
      }
    },
    moveRight() {
      if (this.coordinates[1] < this.tilesMatrix[0].length - 1) {
        this.coordinates[1] = this.coordinates[1] + 1;
      }
    },
    moveCharacter(e) {
      if (!this.inBattle) {
        const moveFunctions = {
          "ArrowUp": this.moveUp,
          "ArrowDown": this.moveDown,
          "ArrowLeft": this.moveLeft,
          "ArrowRight": this.moveRight
        };

        if (Object.keys(moveFunctions).includes(e.key)) {
          e?.preventDefault?.();
          moveFunctions[e.key]();
        }
      }
    }
  },
};
</script>

<style scoped>
.character {
  width: 15px;
  height: 15px;
  background-color: red;
  margin: auto;
  border: 2px solid black;
}
.tileWorld {
  padding: 15px;
}

@media (min-width: 1024px) {
  .tileWorld {
    width: 40rem;
    height: 40rem;
  }
}
@media (max-width: 1024px) {
  .tileWorld {
    width: 22rem;
    height: 22rem;
  }
}
.tileRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 10%;
  background-color: #fff;
}
.cell {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
}
.tile {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
