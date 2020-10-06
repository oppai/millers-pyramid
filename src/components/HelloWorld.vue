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
    <div class="range-table-side">
      <div>
        <form>
        <label><input type="radio" name="gameType" v-model="currentGameType" v-on:change="changeGameType" v-bind:value="gameTypes.Holdem">Holdem</label>
        <label><input type="radio" name="gameType" v-model="currentGameType" v-on:change="changeGameType" v-bind:value="gameTypes.ShortDeck">ShortDeck</label>
        </form>
      </div>
      <table border="1">
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
  </div>
</template>

<script>
const Poker = require("../models/poker");
const initCards = Poker.makeInitializeTable();

function refreshTable(self) {
  const cardsParam = self.$route.query.cards;
  self.currentGameType = self.$route.query.type;
  self.cards = Poker.makeInitializeTable(self.currentGameType);
  if(cardsParam != undefined ) {
    Poker.decodeTable(self.cards, cardsParam, (err, cards) => {
      if (err) { console.log(err); }
      self.cards = cards;
    });
  }
}

function updateParams(self, reload = false) {
  Poker.encodeTable(self.cards, (err, encodeCards) => {
    if (err) {
      console.log(err);
    }
    self.$router
      .replace({ path: "/", query: { cards: encodeCards, type: self.currentGameType } })
      .catch(() => {});
    if (reload) {
      self.$router.go({path: self.$router.currentRoute.path, query: self.$route.query, force: true})
    }
  });
}

export default {
  mounted() {
    refreshTable(this);
  },
  data() {
    return {
      cards: initCards,
      status: Poker.Status,
      gameTypes: Poker.GameType,
      currentGameType: Poker.GameType.Holdem
    };
  },
  methods: {
    changeStatus(item) {
      item.status = (item.status + 1) % 5;
      updateParams(this);
    },
    changeGameType() {
      updateParams(this, true);
    },

    showRatio(status) {
      const current = Poker.countCombos(status, this.cards);
      const prev = Poker.countCombos(status - 1, this.cards);
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
