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
export default {
  computed: {
    itemApiling() {
      return this.items.reduce((acc, item) => {
        console.log(item);
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
      if (item === "s_potion") {
        return s_potion;
      } else if (item === "m_potion") {
        return m_potion;
      } else if (item === "l_potion") {
        return l_potion;
      } else if (item === "w_sword") {
        return w_sword;
      } else if (item === "g_tooth") {
        return g_tooth;
      } else if (item === "orc_ear") {
        return orc_ear;
      }
    },
    useItem(item) {
      
    },
  }
};
</script>

<style></style>
