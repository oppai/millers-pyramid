<template>
  <div class="range-table">
    <table class="range-table-main">
      <tr v-for="(rows, idx1) in cards" :key="idx1">
        <td class="range-table-cell" v-for="(item, idx2) in rows" :key="idx2">
          <button
            :class="`range-table-cell-text status-${item.status}`"
            v-on:click="changeStatus(item)"
          >{{ item.hole }} ({{ item.combo }})</button>
        </td>
      </tr>
    </table>
    <table class="range-table-side" border="1">
      <thead>
        <td>Streat</td>
        <td>Action / Range</td>
      </thead>
      <tbody>
        <tr>
          <td class="status-1">preflop</td>
          <td>{{ showRatio(status.preflop) }}%</td>
        </tr>
        <tr>
          <td class="status-2">flop</td>
          <td>{{ showRatio(status.flop) }}%</td>
        </tr>
        <tr>
          <td class="status-3">turn</td>
          <td>{{ showRatio(status.turn) }}%</td>
        </tr>
        <tr>
          <td class="status-4">river</td>
          <td>{{ showRatio(status.river) }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const Poker = require("../models/poker");
const cards = Poker.makeInitializeTable();

export default {
  mounted() {
    const cardsParam = this.$route.query.cards;
    Poker.decodeTable(this.cards, cardsParam, (err, cards) => {
      if (err) {
        console.log(err);
      }
      this.cards = cards;
    });
  },
  data() {
    return {
      cards: cards,
      status: Poker.Status
    };
  },
  methods: {
    changeStatus(item) {
      item.status = (item.status + 1) % 5;
      Poker.encodeTable(this.cards, (err, encodeCards) => {
        if (err) {
          console.log(err);
        }
        this.$router
          .replace({ path: "/", query: { cards: encodeCards } })
          .catch(() => {});
      });
    },
    showRatio(status) {
      const current = Poker.countCombos(status, cards);
      const prev = Poker.countCombos(status - 1, cards);
      return Math.round((current / (prev || 1)) * 1000) / 10;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.range-table {
  display: flex;
}
.range-table-main {
  margin-left: auto;
  margin-right: 20px;
}
.range-table-side {
  margin-left: 20px;
  margin-right: auto;
}
.range-table-cell {
  width: 42px;
  height: 42px;
}
.range-table-cell-text {
  height: 100%;
  width: 100%;
  text-align: left;
  vertical-align: top;
}
.status-1 {
  background-color: greenyellow;
}
.status-2 {
  background-color: yellow;
}
.status-3 {
  background-color: orange;
}
.status-4 {
  background-color: red;
}
</style>
