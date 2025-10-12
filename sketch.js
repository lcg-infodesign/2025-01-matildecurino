let table; //tabella dataset
let validRows = []; //righe valide che rispettano le regole

//variabili per le colonne e operazioni
let col0 = [];
let col1 = [];
let col2 = [];
let col3 = []; 
let col4 = [];
let mean0; 
let mean1;
let std1;
let mode2;
let median3;
let mean4;
let std4;

//variabili per mean0
let palm; //img della palma
let minvalMean0;
let maxvalMean0;
let marginX;
let spacing;
let baseYMean0;
let maxPalmHeight;

//variabili per std1 
let campoCalcio; //img campo da calcio 
let calciatore; //img del nuotatore
let minvalStd1;
let maxvalStd1;
let baseYStd1;
let scaleXStd1;
let calciatoriYOffsets = [];

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


function preload() {
  table = loadTable("matildecurino/dataset.csv", "csv", "header");

  //mean column0
  palm = loadImage("palm.png");

  //std column1
  campoCalcio = loadImage("campodacalcio.png");
  calciatore = loadImage("calciatore.png");
}

function setup() {
  createCanvas(1500, 2000);
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

  //variabili per chiamare le colonne
  col0 = validRows.map(r => r.getNum("column0"));
  col1 = validRows.map(r => r.getNum("column1"));
  col2 = validRows.map(r => r.getNum("column2"));
  col3 = validRows.map(r => r.getNum("column3"));
  col4 = validRows.map(r => r.getNum("column4"));

  //variabili per chiamare il calcolo delle operazioni 
  //(media,moda,mediana,standard deviation)
  //relative alle specifiche colonne
  mean0 = mean(col0); //ok
  mean1= mean(col1); //per la rappresentazione grafica della standard deviation
  std1 = std(col1); //ok
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

  //Mean0

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



  //Std1

  //Valori min e max della column1
  minvalStd1 = Math.min(...col1);
  maxvalStd1 = Math.max(...col1);


  baseYStd1 = 900;

  let campoCalcioWidth = 800; //lunghezza campo
  let campoCalcioHeight = 500; //altezza campo

  //img campo da calcio
  imageMode(CENTER);
  image(campoCalcio, width / 2, baseYStd1, campoCalcioWidth, campoCalcioHeight);

  //centro campo da calcio
  let centerCampoCalcioX = width / 2;
  //il campo da calcio rappresenta idealmente il doppio della 
  //standard deviation (std1=62 scale sarà 124 circa)
  let scaleXStd1 = campoCalcioWidth / (2 * std1); 

  //mean 
  stroke(255);
  strokeWeight(5);
  line(centerCampoCalcioX, baseYStd1 - campoCalcioHeight / 2, centerCampoCalcioX, baseYStd1 + campoCalcioHeight / 2);
  noStroke();

  //img calciatori
  imageMode(CENTER);
  textAlign(CENTER);
  fill(0);
  textSize(10);
  
  //la disposizione orizzontale (asse delle x) fa sì che i 
  //calciatori siano disposti a sinistra se il loro valore associato 
  //è minore della media (11.17) e a destra se è maggiore della media 
  //Dato che moltiplico la xCalciatore per lo scaleXStd1 
  //la posizione sarà proporzionale a quella dell'img
  //e i calciatori che non rientrano nella standard deviation saranno fuori 
  //dall'immagine
  //La disposizione verticale è random 
  for (let j = 0; j < col1.length; j++) {
    let valStd1 = col1[j];
    let xCalciatore = centerCampoCalcioX + (valStd1 - mean1) * scaleXStd1;

    if (!calciatoriYOffsets[j]) {
      calciatoriYOffsets[j] = random(-campoCalcioHeight / 2 + 10, campoCalcioHeight / 2 - 10);
    }
    let yCalciatore = baseYStd1 + calciatoriYOffsets[j];

    //img calciatori
    image(calciatore, xCalciatore, yCalciatore, 40, 50);

    //valore valido relativo a ciascun calciatore 
    //!!!!!!capire se togliere!!!!
    text(`(${valStd1})`, xCalciatore, yCalciatore - 30);
  }

  //titolo e spiegazione
  noStroke();
  fill(0);
  textSize(25);
  textAlign(LEFT);
  text(`Standard deviation column1 = ${std1.toFixed(2)}`, 50, 560);
  textSize(14);
  text("Area del campo da calcio (120 metri)", 50, 580);
  //std e mean 
  //!!!!!capire se togliere!!!
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`Mean = ${mean1.toFixed(2)}`, centerCampoCalcioX, 630);
  text(`${std1.toFixed(2)}`, centerCampoCalcioX - 300, 630);
  text(`${std1.toFixed(2)}`, centerCampoCalcioX + 300, 630);

  //Mode2
}


