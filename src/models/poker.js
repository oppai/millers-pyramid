const {
    deflate,
    unzip
} = require('zlib');

const Numbers = 'AKQJT98765432'.split('');
const Status = {
    none: 0,
    preflop: 1,
    flop: 2,
    turn: 3,
    river: 4
};

function reverse(str) {
    return str.split("").reverse().join("");
}

function format(value, index1, index2) {
    return index1 > index2 ? value + 'o' : (index1 == index2 ? value : reverse(value) + 's');
}

function combo(index1, index2) {
    return (index1 > index2 ? 12 : (index1 == index2 ? 6 : 4));
}

function makeInitializeTable() {
    return Numbers.map(function (num1, idx1) {
        return Numbers.map(function (num2, idx2) {
            return {
                hole: format(num2 + num1, idx1, idx2),
                combo: combo(idx1, idx2),
                status: Status.none
            }
        })
    });
}

function countCombos(status, cards) {
    return cards.reduce((acc, rows) =>
        acc + (rows.reduce((acc2, x) => acc2 + (x.status >= status ? x.combo : 0), 0)), 0);
}

function encodeTable(cards, callback) {
    const list = cards.map(row => row.map(c => c.status))
    const json = JSON.stringify(list)
    deflate(json, (err, buffer) => {
        const encodedCards = buffer.toString('base64')
        callback(err, encodedCards)
    })
}

function decodeTable(cards, cardsParam, callback) {
    const buffer = Buffer.from(cardsParam, 'base64');
    unzip(buffer, (err, buffer) => {
        const list = JSON.parse(buffer.toString())
        const decodedCards = cards.map((rows, i) =>
            rows.map((c, j) => {
                c.status = list[i][j]
                return c
            }))
        callback(err, decodedCards)
    })
}

export {
    Status,
    makeInitializeTable,
    format,
    countCombos,
    encodeTable,
    decodeTable
}
