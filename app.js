let shots = JSON.parse(localStorage.getItem("shots")) || [];

function addShot() {
    const hole = prompt("Hole number?");
    const club = prompt("Club?");
    const distance = prompt("Distance in yards?");

    const shot = {
        hole: hole,
        shotNumber: shots.length + 1,
        club: club,
        distance: distance,
        time: new Date().toLocaleString()
    };

    shots.push(shot);
    localStorage.setItem("shots", JSON.stringify(shots));

    alert("Shot saved: " + club + " - " + distance + " yards");
}

function viewShots() {
    let output = "Saved Shots:\n\n";

    shots.forEach(function(shot) {
        output += "Hole " + shot.hole + " | Shot " + shot.shotNumber + " | " + shot.club + " | " + shot.distance + " yds\n";
    });

    alert(output);
}