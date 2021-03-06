'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output':{}});
// rl.on('line', (lineString)=>{
//     console.log(lineString);
// });
// rl.resume();
// ↑ファイルを一行ずつ読み込む

// 2010 年と 2015 年のデータから
// 「集計年」「都道府県」「15〜19歳の人口」を抜き出す
const map = new Map();// key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010) {
            value.popu10 += popu;
        }
        if(year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);
        // console.log(year);
        // console.log(prefecture);
        // console.log(popu);
    }
});
rl.resume();
rl.on('close', () => { //'close' イベントは、全ての行を読み込み終わった際に呼び出される
    // データの取得
    for(let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    // console.log(map);
    // データの並び替え
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        // return pair2[1].change - pair1[1].change; // 比較関数。並び替えのルール
        // 人が減った順なので逆にする
        return pair1[1].change - pair2[1].change; // 比較関数。並び替えのルール
    })
    // console.log(rankingArray);
    // 出力の整形
    const rankingStrings = rankingArray.map((pair, i)=>{
        return (i+1) + '位 ' + pair[0] + ':' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率：' + pair[1].change;
    });
    console.log(rankingStrings);
});
// 前者の引数 pair1 を 後者の引数 pair2 より前にしたいときは、負の整数、
// pair2 を pair1 より前にしたいときは、正の整数、
// pair1 と pair2 の並びをそのままにしたいときは、 0 を返す必要があります。