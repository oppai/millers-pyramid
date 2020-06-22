<template>
  <div class="range-table">
    <table class="range-table-main">
      <tr v-for='(rows, idx1) in cards' :key='idx1'>
        <td class="range-table-cell" v-for='(item, idx2) in rows' :key='idx2'>
          <button class="range-table-cell-text" v-bind:class="statusClass(item)" v-on:click="changeStatus(item)">
            {{ item.hole }} ({{ item.combo }})
          </button>
        </td>
      </tr>
    </table>    
    <table class="range-table-side" border="1">
      <thead>
        <td>Streat</td>
        <td>Call / Range</td>
      </thead>
      <tbody>
        <tr>
          <td class="status-preflop">preflop</td><td>{{ showRatio(status.preflop) }}%</td>
        </tr>
        <tr>
        <td class="status-flop">flop</td><td>{{ showRatio(status.flop) }}%</td>
        </tr>
        <tr>
        <td class="status-turn">turn</td><td>{{ showRatio(status.turn) }}%</td>
        </tr>
        <tr>
        <td class="status-river">river</td><td>{{ showRatio(status.river) }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const Numbers = 'AKQJT98765432'.split('')
const Status = {
  none: 0, preflop: 1, flop: 2, turn: 3, river: 4
}

function format(value, index1, index2) {
  return value + (index1 > index2 ? 'o' : ( index1 == index2 ? '' : 's') );
}
function combo(index1, index2) {
  return (index1 > index2 ? 12 : ( index1 == index2 ? 6 : 4) );
}
const cards = Numbers.map(function (num1, idx1) {
  return Numbers.map(function (num2, idx2) {
    return {
      hole: format(num2+num1, idx1, idx2),
      combo: combo(idx1, idx2), 
      status: Status.none
    }
  })
})

function countCombos(status, cards) {
  return cards.reduce( (acc, rows) =>
    acc + (rows.reduce((acc2, x) => acc2 + (x.status >= status ? x.combo : 0), 0))
  , 0)
}
export default {
  data () {
    return {
      cards: cards,
      status: Status
    }
  },
  methods: {
    statusClass(item) {
      return {
        'status-none': item.status == Status.none,
        'status-preflop': item.status == Status.preflop,
        'status-flop': item.status == Status.flop,
        'status-turn': item.status == Status.turn,
        'status-river': item.status == Status.river,
      }
    },
    changeStatus(item) {
      item.status = (item.status + 1) % 5;
    },
    showRatio(status) {
      const current = countCombos(status, cards)
      const prev = countCombos(status-1, cards)
      return Math.round(current / (prev || 1) * 1000) / 10
    }
  }
}
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
.status-preflop {
  background-color: greenyellow;
}
.status-flop {
  background-color: yellow;
}
.status-turn {
  background-color: orange;
}
.status-river {
  background-color: red;
}
</style>
