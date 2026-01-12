const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');
let cities = [];
let stopRequested = false;

// Resize on load and when window size changes
function resizeCanvas() {
    // Set internal resolution based on CSS size for sharp graphics
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#666";
    ctx.fillText("Click to add cities.", 20, 20);
    

}
 //Draw grid





function drawCities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0b6efd";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let i = 0; i < cities.length; i++) {
        const c = cities[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#111"; /*#ffffff*/
        ctx.fillText(i, c.x + 8, c.y - 8);
        ctx.fillStyle = "#0b6efd";
        
    }

}
// animate best route (line draw)

function animateRoute(route, speed = 2) {
    if (!route || route.length < 2) return;

    let index = 0; // current segment
    let progress = 0; // 0 → 1 progress for each segment

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // redraw cities
        drawCities();

        // draw completed segments
        ctx.strokeStyle = "#2e7d32";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let start = cities[route[0]];
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i <= index; i++) {
            const c = cities[route[i]];
            ctx.lineTo(c.x, c.y);
        }
        ctx.stroke();

        // animate the next segment
        if (index < route.length - 1) {
            let a = cities[route[index]];
            let b = cities[route[index + 1]];

            // interpolate point
            let x = a.x + (b.x - a.x) * progress;
            let y = a.y + (b.y - a.y) * progress;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(x, y);
            ctx.stroke();

            // update progress
            progress += speed * 0.01;

            if (progress >= 1) {
                progress = 0;
                index++;
            }

            requestAnimationFrame(drawFrame);
        }
    }

    drawFrame();
}


// function drawRoute(route) {
//     if (!route || route.length < 2) return;
//     ctx.strokeStyle = "#2e7d32";
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     for (let i = 0; i < route.length; i++) {
//         const c = cities[route[i]];
//         if (i === 0) ctx.moveTo(c.x, c.y);
//         else ctx.lineTo(c.x, c.y);
//     }
//     // return to start
//     // const c0 = cities[route[0]];
//     // ctx.lineTo(c0.x, c0.y);
//     ctx.stroke();
// }

// ====================
// GA Utility Functions
// ====================

function distance(a, b) {
    const distancecal = Math.hypot(a.x - b.x, a.y - b.y);
    log1(`${distancecal.toFixed(2)}`);
    return Math.hypot(a.x - b.x, a.y - b.y);

}

// show distance for best route
function tourCost(route, show = false) {
    let cost = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const a = cities[route[i]];
        const b = cities[route[i + 1]];

        const d = Math.hypot(a.x - b.x, a.y - b.y);

        if (show) {
            log1(`Distance ${route[i]} → ${route[i + 1]} = ${d.toFixed(2)}`);

        }

        cost += d;
    }

    // Return to start
    const a = cities[route[route.length - 1]];
    const b = cities[route[0]];
    const d = Math.hypot(a.x - b.x, a.y - b.y);

    if (show) {
        log1(`Distance ${route[route.length - 1]} → ${route[0]} = ${d.toFixed(2)}`);

    }

    cost += d;

    // if (show) {
    //     log1(`Total Cost = ${cost.toFixed(2)}`);
    //     log1("-----------------------------------");
    // }

    return cost;
}
// show distance for all route
// function tourCost(route, show = true) {
//     let cost = 0;

//     for (let i = 0; i < route.length - 1; i++) {
//         const a = cities[route[i]];
//         const b = cities[route[i + 1]];

//         const d = Math.hypot(a.x - b.x, a.y - b.y);

//         if (show) {
//             log1(`Distance ${route[i]} → ${route[i+1]} = ${d.toFixed(2)}`);
//         }

//         cost += d;
//     }

//     // return to start
//     const a = cities[route[route.length - 1]];
//     const b = cities[route[0]];
//     const d = Math.hypot(a.x - b.x, a.y - b.y);

//     if (show) {
//         log1(`Distance ${route[route.length-1]} → ${route[0]} = ${d.toFixed(2)}`);
//     }

//     cost += d;

//     return cost;
// }


// function tourCost(route) {
//     let cost = 0;
//     for (let i = 0; i < route.length - 1; i++) cost += distance(cities[route[i]], cities[route[i + 1]]);
//     if (route.length > 0) cost += distance(cities[route[route.length - 1]], cities[route[0]]);
//     return cost;

// }
function fitness(route) 
{
     return 1 / tourCost(route); 
    }

function randomRoute(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
function rouletteSelection(pop, fitVals) {
    const total = fitVals.reduce((s, v) => s + v, 0);
    let r = Math.random() * total, s = 0;
    for (let i = 0; i < pop.length; i++) { s += fitVals[i]; if (s >= r) return pop[i]; }
    return pop[pop.length - 1];
}
function orderCrossover(p1, p2) {
    const size = p1.length; const child = Array(size).fill(null);
    let a = Math.floor(Math.random() * size), b = Math.floor(Math.random() * size);
    if (a > b) [a, b] = [b, a];
    for (let i = a; i <= b; i++) child[i] = p1[i];
    let idx = (b + 1) % size;
    for (let i = 0; i < size; i++) {
        const gene = p2[(b + 1 + i) % size];
        if (!child.includes(gene)) { child[idx] = gene; idx = (idx + 1) % size; }
    }
    return child;
}
function swapMutation(route, mutRate) {
    let mutated = false;
    if (Math.random() < mutRate) {
        const i = Math.floor(Math.random() * route.length);
        let j = Math.floor(Math.random() * route.length);
        while (j === i && route.length > 1) j = Math.floor(Math.random() * route.length);
        [route[i], route[j]] = [route[j], route[i]];
        mutated = true;
    }
    return { route, mutated };
}

// Show all routes
// function showBestRoute(route) {

//     if (!route) return;

//     const indexPath = route.join(" → ");

//     const coordPath = route
//         .map(i => `(${cities[i].x.toFixed(0)},${cities[i].y.toFixed(0)})`)
//         .join(" → ");

//     console.log(`Best Route Indexes: ${indexPath}`);
//    // console.log(`Best Route Coords: ${coordPath}`);
// }
// ====================
// GA Runner
// ====================

async function runGA(popSize, mutRate, generations, updateEvery) {
    if (cities.length < 2) { showAlert("Need at least 2 cities."); return; }
    let population = Array.from({ length: popSize }, () => randomRoute(cities.length));
    let bestRoute = null, bestCost = Infinity, gen = 0;
    stopRequested = false;
    document.getElementById('runBtn').disabled = true;
    // document.getElementById('stopBtn').disabled = false;

    while (gen < generations && !stopRequested) {
        for (let batch = 0; batch < updateEvery && gen < generations; batch++, gen++) {
            const fitVals = population.map(ind => fitness(ind));

            // Show all routes
            // population.forEach((route, idx) => {
            //     const indexPath = route.join(" → ");
            //     console.log(`Gen ${gen} — Route ${idx}: ${indexPath}`);
            // });

            //Find best route in cities
            for (let i = 0; i < population.length; i++) {
                const cost = tourCost(population[i]);
                if (cost < bestCost) {
                    bestCost = cost;
                    bestRoute = [...population[i]];
                    const indexPath = bestRoute.join(" → ");
                    const coordPath = bestRoute
                        .map(i => `(${cities[i].x.toFixed(0)},${cities[i].y.toFixed(0)})`)
                        .join(" → ");


                    //show best route
                    console.log(`Route (Gen ${gen}): ${indexPath}`); // log1(`Route (Gen ${gen}): ${indexPath}`);

                    //log1(`Best Route Coordinates: ${coordPath}`);
                    document.getElementById("bestRoute").value = indexPath;

                }

            }

            const newPop = [];
            let mutatedCount = 0;
            for (let i = 0; i < popSize; i++) {
                const p1 = rouletteSelection(population, fitVals);
                const p2 = rouletteSelection(population, fitVals);
                let child = orderCrossover(p1, p2);
                const mutationResult = swapMutation(child, mutRate);
                child = mutationResult.route;
                if (mutationResult.mutated) mutatedCount++;
                newPop.push(child);
            }
            population = newPop;

            // calculate mutation %
            const mutatedPerc = ((mutatedCount / popSize) * 100).toFixed(1);
            document.getElementById('mutatedPerc').value = mutatedPerc;
        }

        document.getElementById('bestCost').value = bestCost.toFixed(2);
        document.getElementById('genCountresult').value = gen;
        console.log(`Gen ${gen} — Cost: ${bestCost.toFixed(2)} — Mutated: ${document.getElementById('mutatedPerc').value}`);


        drawCities();
        animateRoute(bestRoute, 2); // slower
        //drawRoute(bestRoute);
        await new Promise(r => setTimeout(r, 10));
    }

    tourCost(bestRoute, true); //show best route distances
    document.getElementById('runBtn').disabled = false;
    // document.getElementById('stopBtn').disabled = true;
    // if (stopRequested) log("Run stopped.");
    // else 
    //     log(`Finished: best cost ${bestCost.toFixed(2)} at generation ${gen}.`);
    return { bestRoute, bestCost };
}

// ====================
// UI & Events
// ====================

canvas.addEventListener('click', e => {

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    cities.push({ x, y });
    log(`City ${cities.length - 1}: (${x.toFixed(0)}, ${y.toFixed(0)})`);
    //log(`City ${cities.length - 1}: (${x}, ${y})`);

    drawCities();

});


function runGAbtn() {
    const popSize = parseInt(document.getElementById('populationsize').value);
    const mutRate = parseFloat(document.getElementById('mutateperc').value);
    const generations = parseInt(document.getElementById('genCount').value);
    const updateEvery = parseInt(document.getElementById('updateEvery').value);


    if (isNaN(popSize)) {

        showAlert("Population size cannot be blank. Pease enter population size.");
    }

    else if (isNaN(mutRate)) {
        showAlert("Mutation cannot be blank. Please enter mutation.");
    }


    else if (isNaN(generations)) {
        showAlert("Generation cannot be blank. Please enter generation.");
    }
    else {

        log_city_number(`Total number of Cities: ${cities.length}`);
        let updateEvery = generations < 10 ? 1 : 5;
        runGA(popSize, mutRate, generations, updateEvery);
    }

}





function log(msg) {
    const p = document.getElementById('log');
    p.textContent += msg + "\n"; // append at bottom instead of prepending
}

function log1(msg) {
    const p = document.getElementById('log1');
    p.textContent += msg + "\n"; // append at bottom instead of prepending
}

function log_city_number(msg) {
    const p = document.getElementById('log_city_number');
    p.textContent = msg + "\n"; // append at bottom instead of prepending
}

// initial canvas text
// ctx.font = "14px sans-serif";
// ctx.fillStyle = "#666";
// ctx.fillText("Click to add cities.", 20, 20);
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function clearexp() {
    location.reload();
}


// alert message display

function showAlert(message, title = "Alert") {
    document.getElementById("alertModalTitle").innerText = title;
    document.getElementById("alertModalBody").innerText = message;

    const modal = new bootstrap.Modal(
        document.getElementById("alertModal")
    );
    modal.show();
}
