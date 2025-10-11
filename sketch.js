
  let table;
  let validRows = [];

  function preload() {
    table = loadTable("matildecurino/dataset.csv", "csv", "header");
  }

  function setup() {
    createCanvas(900, 600);
    textSize(16);
    noLoop();

  //ciclo per la selezione delle righe che rispettano le rules assegnate
  for (let r = 0; r < table.getRowCount(); r++) {
    let c2 = table.getNum(r, "column2");
    let c3 = table.getNum(r, "column3");
    if (c2 < 0 && c3 >= 30 && c3 < 42) {
      validRows.push(table.rows[r]);
    }
  }

  //funzioni media, standard deviation, mediana e moda
  function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  function std(arr) {
    let m = mean(arr);
    return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
  }
  function median(arr) {
    let s = arr.slice().sort((a, b) => a - b);
    let mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
  }
  function mode(arr) {
    let counts = {};
    arr.forEach(x => counts[x] = (counts[x] || 0) + 1);
    let maxCount = Math.max(...Object.values(counts));
    return Object.keys(counts).filter(k => counts[k] === maxCount).map(Number);
  }

  //variabili per chiamare le colonne
  let col0 = validRows.map(r => r.getNum("column0"));
  let col1 = validRows.map(r => r.getNum("column1"));
  let col2 = validRows.map(r => r.getNum("column2"));
  let col3 = validRows.map(r => r.getNum("column3"));
  let col4 = validRows.map(r => r.getNum("column4"));

  //variabili per chiamare le operazioni (media,moda,mediana,standard deviation)
  //relative alle specifiche colonne
  let mean0 = mean(col0);
  let std1 = std(col1);
  let mode2 = mode(col2);
  let median3 = median(col3);
  let mean4 = mean(col4);
  let std4 = std(col4);

  background(245);
  fill(0);
  textAlign(LEFT);
  text(`Mean (column0): ${mean0.toFixed(2)}`, 50, 50);
  text(`Std (column1): ${std1.toFixed(2)}`, 50, 75);
  text(`Mode (column2): ${mode2}`, 50, 100);
  text(`Median (column3): ${median3}`, 50, 125);
  text(`Mean (column4): ${mean4.toFixed(2)}, Std: ${std4.toFixed(2)}`, 50, 150);

}



