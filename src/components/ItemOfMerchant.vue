<template>
  <li
    v-for="item in TheCity.merchant.items"
    :key="items.items[item].id"
    :style="{ backgroundImage: `url(${setItemImg(item)})` }"
    @click="getItemInfo(item)"
  >
  </li>
</template>

<script>
import TheCity from "../assets/TheCity.json";
import items from "../assets/items.json";

import s_potion from "../assets/img/s_potion.jpg";
import m_potion from "../assets/img/m_potion.jpg";
import l_potion from "../assets/img/l_potion.jpg";

export default {
  data() {
    return {
      TheCity,
      items,
    };
  },
  methods: {
    getItemInfo(item) {
      this.$emit("getItemInfo", item);
    },
    setItemImg(item) {
          const itemImages = {
        "s_potion": s_potion,
        "m_potion": m_potion,
        "l_potion": l_potion
      };

      return itemImages[item];
    }
  }
};
</script>

<style></style>
