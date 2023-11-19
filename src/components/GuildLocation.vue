<template>
  <p class="smallerParagraph">{{ message }}</p>
  <button class="nes-btn" @click="askAboutDiploma">Ask about diploma</button>
  <button class="nes-btn" @click="requestDiploma">
    Request Certified Adventurer™ Diploma
  </button>
  <button class="nes-btn" @click="leaveOffice">Leave Office</button>
</template>

<script>
import { useCharacterStore } from "@/stores/character";
import { mapState } from "pinia";
export default {
  data() {
    return {
      GOBLIN_TOOTHS: 25,
      ORC_EARS: 15,
      TROLL_HIDES: 5,
      message: "",
    };
  },
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
  },
  methods: {
    askAboutDiploma() {
      this.message = `With the Certified Adventurer™ Diploma, you are officially allowed to carry a metal sword and a shield, 
      take quests from other people, and even leave the province to try to banish The Great Evil™. 
      Procedure fees:  ${this.GOBLIN_TOOTHS} goblin teeth, ${this.ORC_EARS} orc ears, and ${this.TROLL_HIDES} troll hides.`
    },
    leaveOffice() {
      this.$emit("leaveOffice");
    },
    requestDiploma() {
      let lootCounts = {
        "g_tooth": 0,
        "orc_ear": 0,
        "troll_hide": 0
      };

      this.characterStore.character.loot.forEach((loot) => {
        if (lootCounts.hasOwnProperty(loot)) {
          lootCounts[loot] += 1;
        }
      });

      if (
        lootCounts["g_tooth"] === this.GOBLIN_TOOTHS &&
        lootCounts["orc_ear"] === this.ORC_EARS &&
        lootCounts["troll_hide"] === this.TROLL_HIDES
      ) {
        let vm = this.$parent;
        while(vm) {
          vm.$emit('victory');
          vm = vm.$parent;
        }
      } else {
        this.message = "You don't have the required items to get a diploma.";
      }
    }
  },
};
</script>

<style></style>
