<template>
  <div class="nes-container with-title is-centered statsContainer">
    <p class="title">
      <b> {{title}} </b>
    </p>
    <ul class="inventoryList">
      <li 
        v-for="item in Object.keys(itemApiling)" 
        :key="item" 
        :style="{ backgroundImage: `url(${setItemImg(item)})`}"
        @click="useItem(item)"
      >
        <small class="itemQuantity">
          <b>
            {{ itemApiling[item] }} 
          </b>
        </small>
      </li>
    </ul>
  </div>
</template>

<script>
import s_potion from "../assets/img/s_potion.jpg";
import m_potion from "../assets/img/m_potion.jpg";
import l_potion from "../assets/img/l_potion.jpg";
import w_sword from "../assets/img/w_sword.jpg";

import g_tooth from "../assets/img/g_tooth.jpg";
import orc_ear from "../assets/img/orc_ear.jpg";
import troll_hide from "../assets/img/troll_hide.jpg";
export default {
  computed: {
    itemApiling() {
      return this.items.reduce((acc, item) => {
        if (acc[item]) {
          acc[item] += 1;
        } else {
          acc[item] = 1;
        }
        return acc;
      }, {});
    },
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    setItemImg(item) {
      const itemImages = {
      "s_potion": s_potion,
      "m_potion": m_potion,
      "l_potion": l_potion,
      "w_sword": w_sword,
      "g_tooth": g_tooth,
      "orc_ear": orc_ear,
      "troll_hide": troll_hide
    };

  return itemImages[item];
    },
    useItem(item) {
      if ([ "s_potion", "m_potion", "l_potion" ].includes(item)) {
        this.$emit("usePotion", item);
      }
    },
  }
};
</script>

<style></style>
