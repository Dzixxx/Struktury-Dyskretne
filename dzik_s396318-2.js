/*
	Projekt #3 Most - Michał Dzik s386318
	Algorytm R.Tarjana 
	Worst-case performance: O(|V|+|E|)
*/


// Funkcja rekurencyjna
function DFSb(v,vf,graph,D,cv,L){

	/* Wejście:
		v - wierzchołek startowy
		vf – ojciec wierzchołka v na drzewie rozpinającym w głąb
		graph – zadany w dowolnie wybrany sposób, algorytm tego nie precyzuje
		D – tablica numerów DFS dla poszczególnych wierzchołków
		cv – referencja do zmiennej zewnętrznej przechowującej numery wierzchołków. Przy pierwszym wywołaniu zmienna powinna zawierać 1.
		L – lista mostów. Przechowuje numery wierzchołka startowego i końcowego krawędzi-mostu.
	*/
	let Low, temp;

	D[v] = cv;
	Low = cv;
	cv = cv + 1;

	let neighbours = graph
		.filter( e => e.x == v || e.y == v )
		.map( e => e.x == v ? e.y : e.x );

	for( let i = 0; i < neighbours.length; i++ ){
		let u = neighbours[i];
		// K05
		if( u !== vf ){
			// K06
			if( D[u] !== 0 ){
				// K07
				if( D[u] < Low ){
					Low = D[u];
				}
			}else{
				// K09
				temp = DFSb(u,v,graph,D,cv,L);
				// K10
				if( temp < Low ){
					Low = temp;
				}
			}
		}
	}

	if( vf > -1 && Low === D[v] ){
		// K11 sprawdzamy warunek mostu
		L.push({x: vf, y: v});
	}

	return Low;
	/* Wyjście:
		Wartość parametru Low dla wierzchołka v. Jeśli zostanie znaleziony most, to będzie on dopisany do listy L.
	*/
}

// Algorytm główny

/* Wejście
	n – liczba wierzchołków w grafie
	graf – zadany w dowolnie wybrany sposób, algorytm tego nie precyzuje
*/
let n = 6;

let graph = [
	{ x: 0, y: 1},
	{ x: 0, y: 2},
	{ x: 1, y: 2},
	{ x: 1, y: 4},
	{ x: 3, y: 4},
	{ x: 3, y: 5},
	{ x: 4, y: 5}
];

let D = [];
for(let i = 0; i < n; i++) 
	D[i] = 0;

let L = [];
let cv;	// przechowuje numery wierzcholkow dla dfs

for( let i = 0; i < n - 1; i++ ){
	if( D[i] === 0 ){// szukamy jeszcze nie odwiedzonych wierzcholkow
		cv = 1;	// nr DFS pierwszego wierzcholka
		DFSb(i,-1, graph, D, cv, L);
	}
}

console.log(L);

/* Wyjście
	Lista L zawiera krawędzie będące mostami
*/