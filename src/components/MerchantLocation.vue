<template>
  <p class="smallerParagraph m-0">{{ message }}</p>
  <div>
    <div v-if="itemInfo">
      <ItemOfMerchantInfo :item="itemInfo" @buyItem="buyItem()" />
    </div>
    <ul class="inventoryList">
      <ItemOfMerchant @getItemInfo="getItemInfo($event)" />
    </ul>
  </div>
  <button class="nes-btn" @click="leaveMerchant()">Leave</button>
</template>

<script>
import items from "../assets/items.json";
import TheCity from "../assets/TheCity.json";
import { useCharacterStore } from "@/stores/character";
import { mapState, mapActions } from "pinia";
import ItemOfMerchant from "./ItemOfMerchant.vue";
import ItemOfMerchantInfo from "./ItemOfMerchantInfo.vue";

export default {
  components: {
    ItemOfMerchant,
    ItemOfMerchantInfo,
  },
  data() {
    return {
      lookingAtItems: false,
      TheCity,
      items,
      itemInfo: null,
      message: "",
    };
  },
  computed: {
    ...mapState(useCharacterStore, {
      characterStore: (state) => state,
    }),
  },
  methods: {
    ...mapActions(useCharacterStore, ["spendGold", "addItemToInventory"]),
    leaveMerchant() {
      this.$emit("leaveMerchant");
    },
    getItemInfo(item) {
      const newInfo = this.items.items[item];
      if (this.itemInfo === newInfo) {
        this.itemInfo = null;
      } else {
        this.itemInfo = this.items.items[item];
      }
    },
    buyItem() {
      this.spendGold(this.itemInfo.price);
      this.addItemToInventory(this.itemInfo.id);
      this.message = `You bought a ${this.itemInfo.name}!`;
    },
  },
  //MENSAJES DE COMPRA
};
</script>

<style></style>
