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
      if (item === "s_potion") {
        return s_potion;
      } else if (item === "m_potion") {
        return m_potion;
      }
    }
  }
};
</script>

<style></style>
