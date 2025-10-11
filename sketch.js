let table; //tabella dataset
let validRows = []; //righe valide che rispettano le regole
let palm; //img della palma

//variabili per le colonne e operazioni
let col0 = [];
let col1 = [];
let col2 = [];
let col3 = []; 
let col4 = [];
let mean0; 
let std1;
let mode2;
let median3;
let mean4;
let std4;

//variabili per mean0
let minvalMean0;
let maxvalMean0;
let marginX;
let spacing;
let baseYMean0;
let maxPalmHeight;

function preload() {
  table = loadTable("matildecurino/dataset.csv", "csv", "header");

  //media column0
  palm = loadImage("palm.png");
}

function setup() {
  createCanvas(1000, 700);
  textSize(14);
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
  col0 = validRows.map(r => r.getNum("column0"));
  col1 = validRows.map(r => r.getNum("column1"));
  col2 = validRows.map(r => r.getNum("column2"));
  col3 = validRows.map(r => r.getNum("column3"));
  col4 = validRows.map(r => r.getNum("column4"));

  //variabili per chiamare il calcolo delle operazioni 
  //(media,moda,mediana,standard deviation)
  //relative alle specifiche colonne
  mean0 = mean(col0);
  std1 = std(col1);
  mode2 = mode(col2);
  median3 = median(col3);
  mean4 = mean(col4);
  std4 = std(col4);

  textFont('Courier New');

  //valore minimo e massimo per scalare l'altezza delle palme in modo 
  //proporzionale ai valori numerici 
  minvalMean0 = Math.min(...col0);
  maxvalMean0 = Math.max(...col0);

  //margini e spaziatura
  marginX = 80;
  spacing = (1000 - 2 * marginX) / (col0.length - 0.5);
  baseYMean0 = 500 - 100; // linea del terreno massimo
  maxPalmHeight = 300 ; // altezza massima della palma
}


function draw() {
  //Scaling dei valori per la dimensione della palma
  function scalevalueMean0(valMean0) {
    return map(valMean0, minvalMean0, maxvalMean0, 50, maxPalmHeight);
  }

  //Scaling della media lungo l'asse delle y
  //Più grande è la media + alto è il confine tra sabbia e cielo
  let meanYMean0 = map(mean0, minvalMean0, maxvalMean0, baseYMean0 - maxPalmHeight, baseYMean0);

  noStroke();
  //Cielo
  fill(135, 206, 250); //azzurro
  rect(0, 0, width, meanYMean0); 
  //dalla coordinata 0 0, largo come tutta la canva e alto fino alla linea della media

  //Sabbia
  fill(222, 184, 135); //marrone chiaro
  rect(0, meanYMean0, width, 500 - meanYMean0);

  //Media
  // stroke(0);
  // strokeWeight(2);
  // line(0, meanYMean0, width, meanYMean0);

  noStroke();
  fill(0);
  textSize(12);
  text(`${mean0.toFixed(2)}`, 50, meanYMean0);

  //Disegno delle palme
  imageMode(CENTER);
  textAlign(CENTER);
  noStroke();
  fill(0);

  for (let i = 0; i < col0.length; i++) {
    let valMean0 = col0[i];
    let palmHeight = scalevalueMean0(valMean0);
    let xMean0 = marginX + i * spacing;
    let yMean0 = baseYMean0 - palmHeight / 2; // posizionamento verticale

    //palma
    image(palm, xMean0, yMean0, palmHeight * 0.6, palmHeight);

    //valori numerici sotto la palma
    textSize(10);
    text(`(${valMean0})`, xMean0, baseYMean0 + 20);
  }

  //titolo e spiegazione
  noStroke();
  fill(0);
  textSize(25);
  textAlign(LEFT);
  text(`Mean column0 = ${mean0.toFixed(2)}`, 50, 50);
  textSize(14);
  text("Linea di separazione tra la sabbia e il cielo ", 50, 70);
}
