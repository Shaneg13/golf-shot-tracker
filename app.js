let currentHole = 1;

let currentRound = JSON.parse(
    localStorage.getItem("currentRound")
) || null;

let shots = JSON.parse(
    localStorage.getItem("shots")
) || [];

function saveRound() {

    const course =
        document.getElementById("courseInput").value;

    const date =
        document.getElementById("dateInput").value;

    if (!course || !date) {
        alert("Enter course and date.");
        return;
    }

    currentRound = {
        id: Date.now(),
        course: course,
        date: date
    };

    localStorage.setItem(
        "currentRound",
        JSON.stringify(currentRound)
    );

    document.getElementById("roundTitle").textContent =
        course + " - " + date;
}

function saveShot() {

    if (!currentRound) {
        alert("Start a round first.");
        return;
    }

    const club =
        document.getElementById("clubInput").value;

    const distance =
        document.getElementById("distanceInput").value;

    if (!club || !distance) {
        alert("Enter club and distance.");
        return;
    }

    const shot = {
        roundId: currentRound.id,
        course: currentRound.course,
        roundDate: currentRound.date,
        hole: currentHole,
        club: club,
        distance: Number(distance),
        timestamp: new Date().toISOString()
    };

    shots.push(shot);

    localStorage.setItem(
        "shots",
        JSON.stringify(shots)
    );

    document.getElementById("clubInput").value = "";
    document.getElementById("distanceInput").value = "";

    renderShots();
}

function nextHole() {
    currentHole++;
    document.getElementById("currentHole").textContent =
        currentHole;
}

function renderShots() {

    const shotList =
        document.getElementById("shotList");

    shotList.innerHTML = "";

    shots
        .slice(-15)
        .reverse()
        .forEach(function(shot) {

            const item =
                document.createElement("div");

            item.className = "shot-item";

            item.textContent =
                shot.course +
                " | H" +
                shot.hole +
                " | " +
                shot.club +
                " | " +
                shot.distance +
                " yds";

            shotList.appendChild(item);

        });
}

if (currentRound) {

    document.getElementById("roundTitle").textContent =
        currentRound.course +
        " - " +
        currentRound.date;

}

renderShots();

function clearShots() {

    if (!confirm("Delete all shots?")) {
        return;
    }

    shots = [];

    localStorage.setItem(
        "shots",
        JSON.stringify(shots)
    );

    renderShots();
}

function exportShots() {

    const data =
        JSON.stringify(shots, null, 2);

    const blob =
        new Blob([data], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "golf-shots.json";

    a.click();

    URL.revokeObjectURL(url);
}

function showStats() {

    if (shots.length === 0) {
        alert("No shots recorded.");
        return;
    }

    const clubs = {};

    shots.forEach(function(shot) {

        if (!clubs[shot.club]) {

            clubs[shot.club] = {
                total: 0,
                count: 0
            };

        }

        clubs[shot.club].total += shot.distance;
        clubs[shot.club].count++;

    });

    let output = "Club Averages\n\n";

    Object.keys(clubs).forEach(function(club) {

        const avg =
            Math.round(
                clubs[club].total /
                clubs[club].count
            );

        output +=
            club +
            ": " +
            avg +
            " yds\n";

    });

    alert(output);
}