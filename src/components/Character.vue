<template>
  <div>
    <div class="nes-container with-title is-centered statsContainer">
      <p class="title">
        <b> Stats of {{ characterStore.character.name }} </b>
      </p>
      <div class="nes-table-responsive playerStats">
        <div>
          <ul class="nes-list is-disc">
            <li class="stat">
              Level: {{ characterStore.character.level }}
            </li>
          </ul>
          <ul class="nes-list is-disc">
            <li class="stat">
              Experience: {{ characterStore.character.exp }}
            </li>
          </ul>
        </div>
        <div>
          <ul class="nes-list is-disc">
            <li class="stat">
              Speed: {{ characterStore.character.speed }}
            </li>
          </ul>
          <ul class="nes-list is-disc">
            <li class="stat">
              Attack: {{ characterStore.character.attack }}
            </li>
          </ul>
        </div>
        <div>
          <ul class="nes-list is-disc">
            <li class="stat">
              Health: {{ characterStore.character.health }}/{{characterStore.character.max_health }}
            </li>
          </ul>
          <ul class="nes-list is-disc">
            <li class="stat">
              Gold: {{ characterStore.character.gold }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <InventoryArray
      @usePotion="usePotion($event)" 
      title="Inventory" 
      :items="characterStore.character.inventory" 
    />
    <InventoryArray title="Loot" :items="characterStore.character.loot" />
  </div>
</template>
<script>
import InventoryArray from "./InventoryArray.vue";
import items from "../assets/items.json";
import { useCharacterStore } from "@/stores/character";
import { mapState } from "pinia";
export default {
  components: {
    InventoryArray,
  },
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
  },
  props: {},
  data() {
    return {
      LEVELUPCONSTANT: 0.2,
      items,
    };
  },
  //TODO: tomar potis fuera de combate
  watch: {
    characterStore: {
      deep: true,
      handler: function () {
        this.checkForLevelUp(this.characterStore.character);
      },
    },
  },
  methods: {
    checkForLevelUp(character) {
      const thresholdExp = (character.level / this.LEVELUPCONSTANT) ** 2;
      if (character.exp > thresholdExp) {
        this.levelUp(character);
      }
    },
    levelUp(character) {
      character.level++;
      character.attack += character.attack_per_level;
      character.max_health += character.max_health_per_level;
      character.speed += character.speed_per_level;
      this.$emit("levelUp");
    },
    usePotion(potion) {
      const heal = this.items.items[potion].health
      this.characterStore.healAmount(heal)
      this.characterStore.removeItemFromInventory(potion)
    },
  },
};
</script>

<style>
.playerStats div {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

</style>
