/*
	Projekt #1

	Step 1.
	Wylosuj n pkt. Polaczymy tylko te ktore sobie przeszkadzaja (odleglosc nadajnikow < 2 x promien) i zapisujemy gxl'u. 

	Step 2
	Ma wyliczyc jaka minimalna liczbe czestotliwosci ma wykupic dostawca aby zapelnic caly obszar ( kolorowanie grafu );
*/

const N = 59; // ilośc nadajników do wylosowania
const R = 5;  // promień mapy
const r = 1;  // promień zasięgu nadajników

// Program 1 -> utworzyć graf i zapisać go w GXL ( export JSON to XML );
function createGraph(){
	
	this.graph = [];
	this.edges = [];
	
	//generuje punkty na mapie o ilosci N w mapie o wymiarze [ 2R, 2R ]
	let randomPoints = generateRandomPointsOnMap(N,R);

	// teraz sciezki 
	for( let i = 0; i < N; i++){
		// iteruj po kazdym wierzcholku i dla kazdego sprawdz polaczenia z innymi
		// jezeli nie istnieje juz taka dodana sciezka to dodaj pod warunkiem ze odleglosci miedzy dwoma punktami 
		// sa mniejsze niz 2r
		for(let j = i+1; j < N; j++){
			let dist = countDistanceBtwPoints(randomPoints[i], randomPoints[j]);
			if( dist < 2*r ){

				// sprawdz czy juz sa wierzcholki dodane
				if( !belongsToGraph( randomPoints[i], this.graph ) ){
					this.graph.push( randomPoints[i] );
				}
				if( !belongsToGraph( randomPoints[j], this.graph ) ){
					this.graph.push( randomPoints[j] );
				}
				
				this.edges.push({
					from: randomPoints[i],
					to: randomPoints[j]
				});
			}
		}
	}
}


// Program 2 -> Pokolorować dany graf najmniejsza liczbą kolorków
function colorizeGraph(graph, edges){
	let n = graph.length;
	let index; // zmienna do indexowania tablicy C

	let CT = []; // n-elementowa tablica okreslajaca numery kolorow wierzcholkow
	for(let i=0;i<n;i++) CT[i] = -1;

	let C = [] // tablica dostepnosci kolorkow - numerami potem mozna robic na [ #000, #FFF ]
	for(let i = 0; i < n; i++) C[i] = i;

	CT[0]=0;

	for( let i = 1; i < n; i++){

		// kazdy kolor uznajemy jako nie zajety;
		for(let color = 0; color < n; color++) C[color] = false;

		// ogarniamy dostepnych sasiadow dla naszego wierzcholka
		let neighbours = findNeighbours( graph[i], edges );

		//Dla każdego sąsiada u wierzchołka v  wykonaj -> Jeśli CT[u] > - 1, to C[CT[u]] ← true
		neighbours.forEach( neighbour => {
			let u = findIndex( neighbour, graph );

			if(u < 0){
				console.log("U nie znaleziono!!!!!!!!!");
			}

			if( CT[u] > -1 ){
				C[ CT[u] ] = true;
			}
		})

		index = 0;
		//Dopóki C[i] = true, wykonuj i ← i + 1
		while( C[index] == true ){
			index++
		}

		CT[i] = index;
	}

	return CT;
}

// Reusable funcs
function generate2DTable(size){
	let W = [];
	for(let i = 0; i < size; i++){
		let inside = [];

		for(let j = 0; j < size; j++){
			inside.push(0);
		}

		W[i] = inside;
	}
	return W;
}

function generateRandomPointsOnMap(N,R){
	// [0,0]x[2R,2R]
	let generatedPoints = [];
	while(generatedPoints.length < N){
		// losuje punkt
		let x = Math.floor( Math.random() * 2*R );
		let y = Math.floor( Math.random() * 2*R );
	
		// ustalam srodek mapy 
		let x0 = R;
		let y0 = R;

		// sprawdzam czy trafilem losowym pkt w mape
		let x2 = x*x - 2*x*x0 + x0*x0,
			y2 = y*y - 2*y*y0 + y0*y0,
			r2 = R * R;

		// czy jest w kole "mapy"
		if( ( x2 + y2 ) < r2 ){
			//trafil, teraz musi tylko sprawdzic czy juz takiego nie ma dodanego
			if(!isAlreadyGenerated( { x, y }, generatedPoints )){
				generatedPoints.push( { x, y } );
			}
		}
	}
	return generatedPoints;
}

function isAlreadyGenerated(el, arr){
	return arr.reduce( (preV, currV, i, a) => {
		if(preV){
			return true;
		}else{
			if( currV.x == el.x && currV.y == el.y ){
				return true;
			}else{
				return false;
			}
		}
	}, false);
}

function printPoints(arr){
	for( let i = 0; i < arr.length ; i++){
		let word = '';
		for(let j = 0; j< arr[i].length; j++){
			word = word + " | " + arr[i][j]
		}
		console.log(word);
	}
}

function countDistanceBtwPoints(a,b){
	return Math.sqrt(  (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) );
}

function belongsToGraph( point, g ){
	for( let i = 0; i < g.length; i++){
		if( g[i].x == point.x && g[i].y == point.y ){
			return true;
		}
	}	
	return false;
}

function findNeighbours( {x,y}, edges){
	let arr = [];
	for( let i = 0; i < edges.length; i++){
		if( edges[i].from.x == x && edges[i].from.y ){
			if( !belongsToGraph( edges[i].to, arr ) )
				arr.push(edges[i].to);
		}
		if( edges[i].to.x == x && edges[i].to.y ){
			if( !belongsToGraph( edges[i].from, arr ) )
				arr.push(edges[i].from);
		}
	}
	return arr;
}

function findIndex(el, arr){
	for(let i = 0; i< arr.length; i++){
		if( arr[i].x == el.x && arr[i].y == el.y ){
			return i;
		}
	}
	return -1;
}

function generateXML(g, e, c){
	var fs = require('fs');

//szablon GLX'a 

	let intro = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE gxl SYSTEM "http://www.gupro.de/GXL/gxl-1.0.dtd">
<gxl>
	<graph id="dzik_s396318">
	`;

	let node = ( x, y, color) => `
	<node id="${x}_${y}" color="${color}">
		<attr name="x">
			<float>${x}</float>
		</attr>
		<attr name="y">
			<float>${y}</float>
		</attr>
	</node>
	`;

	let edge = ( one, two ) => `
	<edge from="${one.x}_${one.y}" to="${two.x}_${two.y}"/>
	`;

	let outro = `
	</graph>
</gxl>
	`;

	let output = intro;
	//dodaje wierzcholki
	for( let i = 0; i < g.length; i++){
		output = output + node( g[i].x, g[i].y, c[i] );
	}
	//dodaje krawedzie
	for(let i = 0; i < e.length; i++){
		output = output + edge(e[i].from, e[i].to);
	}

	output = output + outro;

	fs.writeFile("./dzik_s396318.gxl", output, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The graph was saved!");
	}); 
}

let graph = new createGraph();
let colors = colorizeGraph(graph.graph, graph.edges);

generateXML(graph.graph, graph.edges, colors);
