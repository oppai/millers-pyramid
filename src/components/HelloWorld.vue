<template>
  <div class="range-table">
    <table align="center">
      <tr v-for='(rows, idx1) in cards' :key='idx1'>
        <td class="range-table-cell" v-for='(item, idx2) in rows' :key='idx2'>
          <button class="range-table-cell-text" v-bind:class="statusClass(item)" v-on:click="changeStatus(item)">
            {{ item.hole }}
          </button>
        </td>
      </tr>
    </table>    
  </div>
</template>

<script>
const Numbers = 'AKQJT98765432'.split('')
const Status = {
  none: 0, open: 1, flop: 2, turn: 3, river: 4
}

function format(value, index1, index2) {
  return value + (index1 > index2 ? 'o' : ( index1 == index2 ? '' : 's') );
}
const cards = Numbers.map(function (num1, idx1) {
  return Numbers.map(function (num2, idx2) {
    return {
      hole: format(num2+num1, idx1, idx2),
      status: Status.none
    }
  })
})
export default {
  data () {
    return {
      cards: cards
    }
  },
  methods: {
    statusClass(item) {
      console.log(item)
      return {
        'status-none': item.status == Status.none,
        'status-open': item.status == Status.open,
        'status-flop': item.status == Status.flop,
        'status-turn': item.status == Status.turn,
        'status-river': item.status == Status.river,
      }
    },
    changeStatus(item) {
      item.status = (item.status + 1) % 5;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.range-table {
  display: block;
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
.status-open {
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
