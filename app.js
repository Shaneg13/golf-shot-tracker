let currentHole = 1;
let shots = JSON.parse(localStorage.getItem("shots")) || [];

function saveShot() {
    const club = document.getElementById("clubInput").value;
    const distance = document.getElementById("distanceInput").value;

    if (!club || !distance) {
        alert("Enter club and distance.");
        return;
    }

    const shot = {
        hole: currentHole,
        shotNumber: shots.length + 1,
        club: club,
        distance: distance,
        time: new Date().toLocaleString()
    };

    shots.push(shot);
    localStorage.setItem("shots", JSON.stringify(shots));

    document.getElementById("clubInput").value = "";
    document.getElementById("distanceInput").value = "";

    renderShots();
}

function nextHole() {
    currentHole++;
    document.getElementById("currentHole").textContent = currentHole;
}

function renderShots() {
    const shotList = document.getElementById("shotList");
    shotList.innerHTML = "";

    shots.slice(-10).reverse().forEach(function(shot) {
        const item = document.createElement("div");
        item.className = "shot-item";
        item.textContent = "Hole " + shot.hole + " | " + shot.club + " | " + shot.distance + " yds";
        shotList.appendChild(item);
    });
}

renderShots();