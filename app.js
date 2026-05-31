let currentHole = 1;

let currentRound = JSON.parse(
    localStorage.getItem("currentRound")
) || null;

let shots = JSON.parse(
    localStorage.getItem("shots")
) || [];

let holes = JSON.parse(
    localStorage.getItem("holes")
) || [];

function saveHole() {

    const par =
        document.getElementById("parInput").value;

    const score =
        document.getElementById("scoreInput").value;

    if (!par || !score) {
        alert("Enter par and score.");
        return;
    }

    const holeRecord = {
        roundId: currentRound.id,
        hole: currentHole,
        par: Number(par),
        score: Number(score)
    };

    holes.push(holeRecord);

    localStorage.setItem(
        "holes",
        JSON.stringify(holes)
    );

    alert(
        "Hole " +
        currentHole +
        " score saved."
    );
}

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

        updateSummary();
        continueRound();
}

function saveShot() {

    if (!currentRound) {
        alert("Start a round first.");
        return;
    }

    const club =
        document.getElementById("clubInput").value;

    const clubSelect =
        document.getElementById("clubInput");

    const loft =
        clubSelect.options[
            clubSelect.selectedIndex
        ].dataset.loft;

    const distance =
        document.getElementById("distanceInput").value;
        
    const result =
        document.getElementById("resultInput").value;
        
    const lie =
        document.getElementById("lieInput").value;

const holeShots =
    shots.filter(
        s => s.hole === currentHole &&
        s.roundId === currentRound.id
    );

const shotNumber =
    holeShots.length + 1;

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
    loft: loft,
    distance: Number(distance),
    result: result,
    lie: lie,
    shotNumber: shotNumber,
    timestamp: new Date().toISOString()
};

    console.log(shot);

    shots.push(shot);

    localStorage.setItem(
        "shots",
        JSON.stringify(shots)
    );

    document.getElementById("clubInput").value = "";
    document.getElementById("distanceInput").value = "";

    renderShots();
    updateSummary();
}

function updateSummary() {

    document.getElementById("summaryHole").textContent =
        currentHole;

    document.getElementById("summaryShots").textContent =
        shots.length;

    if (currentRound) {
        document.getElementById("summaryCourse").textContent =
            currentRound.course;

        document.getElementById("summaryDate").textContent =
            currentRound.date;
    }
}

function nextHole() {
    currentHole++;
    document.getElementById("currentHole").textContent =
        currentHole;

        updateSummary();
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
    "H" +
    shot.hole +
    " S" +
    shot.shotNumber +
    " | " +
    shot.club +
    " | " +
    shot.distance +
    " yds | " +
    shot.result +
    " | " +
    shot.lie;

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
updateSummary();

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
    updateSummary();
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

function showRoundSetup() {

    document.getElementById("roundSetupCard").style.display =
        "block";

    document.getElementById("shotTrackerCard").style.display =
        "none";

    document.getElementById("summaryCard").style.display =
        "none";

    document.getElementById("recentShotsCard").style.display =
        "none";
}

function continueRound() {

    document.getElementById("roundSetupCard").style.display =
        "none";

    document.getElementById("shotTrackerCard").style.display =
        "block";

    document.getElementById("summaryCard").style.display =
        "block";

    document.getElementById("recentShotsCard").style.display =
        "block";

    renderShots();
    updateSummary();
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

document.getElementById("roundSetupCard").style.display =
    "none";

document.getElementById("shotTrackerCard").style.display =
    "none";

document.getElementById("summaryCard").style.display =
    "none";

document.getElementById("recentShotsCard").style.display =
    "none";