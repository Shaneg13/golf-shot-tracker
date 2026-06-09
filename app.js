let currentHole = Number(localStorage.getItem("currentHole")) || 1;

let currentRound = JSON.parse(
    localStorage.getItem("currentRound")
) || null;

let shots = JSON.parse(
    localStorage.getItem("shots")
) || [];

let holes = JSON.parse(
    localStorage.getItem("holes")
) || [];

const courses = {
    whitinsville: {
        id: "whitinsville",
        name: "Whitinsville Golf Club",
        defaultCourse: true,

        whiteTees: [
            { hole: 1, par: 5, yards: 0, tee: "White" },
            { hole: 2, par: 3, yards: 0, tee: "White" },
            { hole: 3, par: 4, yards: 0, tee: "White" },
            { hole: 4, par: 4, yards: 0, tee: "White" },
            { hole: 5, par: 4, yards: 0, tee: "White" },
            { hole: 6, par: 4, yards: 0, tee: "White" },
            { hole: 7, par: 3, yards: 0, tee: "White" },
            { hole: 8, par: 4, yards: 0, tee: "White" },
            { hole: 9, par: 4, yards: 0, tee: "White" }
        ],

        blueBlackTees: [
            { hole: 1, par: 5, yards: 578, tee: "Blue/Black" },
            { hole: 2, par: 3, yards: 147, tee: "Blue/Black" },
            { hole: 3, par: 4, yards: 372, tee: "Blue/Black" },
            { hole: 4, par: 4, yards: 358, tee: "Blue/Black" },
            { hole: 5, par: 4, yards: 421, tee: "Blue/Black" },
            { hole: 6, par: 4, yards: 385, tee: "Blue/Black" },
            { hole: 7, par: 3, yards: 172, tee: "Blue/Black" },
            { hole: 8, par: 4, yards: 327, tee: "Blue/Black" },
            { hole: 9, par: 4, yards: 446, tee: "Blue/Black" }
        ]
    }
};

let selectedCourseId =
    localStorage.getItem("selectedCourseId") || "whitinsville";

function updateHoleDisplay() {
    document.getElementById("currentHole").textContent = currentHole;
    document.getElementById("summaryHole").textContent = currentHole;

    localStorage.setItem("currentHole", currentHole);
}

function saveHole() {

    const par =
        document.getElementById("parInput").value;

    const score =
        document.getElementById("scoreInput").value;

    if (!par || !score) {
        alert("Enter par and score.");
        return;
    }

    holes = holes.filter(function(hole) {
        return !(
            hole.roundId === currentRound.id &&
            hole.hole === currentHole
        );
    });

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

renderScorecard();

alert(
    "Hole " +
    currentHole +
    " score saved."
);
}

function renderScorecard() {

    const scorecardList =
        document.getElementById("scorecardList");

    scorecardList.innerHTML = "";

    let totalPar = 0;
    let totalScore = 0;

    if (!currentRound) {
        return;
    }

    const currentRoundHoles =
        holes.filter(function(hole) {
            return hole.roundId === currentRound.id;
        });

    currentRoundHoles
        .sort(function(a, b) {
            return a.hole - b.hole;
        })
        .forEach(function(hole) {

            totalPar += hole.par;
            totalScore += hole.score;

            const difference =
                hole.score - hole.par;

            let status = "E";

            if (difference > 0) {
                status = "+" + difference;
            }

            if (difference < 0) {
                status = difference;
            }

            const item =
                document.createElement("div");

            item.className = "scorecard-item";

            item.textContent =
                "Hole " +
                hole.hole +
                " | Par " +
                hole.par +
                " | Score " +
                hole.score +
                " | " +
                status;

            scorecardList.appendChild(item);

        });

    const roundDifference =
        totalScore - totalPar;

    let roundStatus = "E";

    if (roundDifference > 0) {
        roundStatus = "+" + roundDifference;
    }

    if (roundDifference < 0) {
        roundStatus = roundDifference;
    }

    document.getElementById("totalPar").textContent =
        totalPar;

    document.getElementById("totalScore").textContent =
        totalScore;

    document.getElementById("roundStatus").textContent =
        roundStatus;
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

currentHole = 1;
localStorage.setItem("currentHole", currentHole);

document.getElementById("roundTitle").textContent =
    course + " - " + date;

updateHoleDisplay();
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
    if (currentHole < 18) {
        currentHole++;
        updateHoleDisplay();
    } else {
        alert("You are already on Hole 18.");
    }
}

function previousHole() {
    if (currentHole > 1) {
        currentHole--;
        updateHoleDisplay();
    } else {
        alert("You are already on Hole 1.");
    }
}

function renderShots() {

    const shotList =
        document.getElementById("shotList");

    shotList.innerHTML = "";

    if (!currentRound) {
        shotList.textContent = "No round started.";
        return;
    }

    const currentRoundShots =
        shots.filter(function(shot) {
            return shot.roundId === currentRound.id;
        });

    if (currentRoundShots.length === 0) {
        shotList.textContent = "No shots recorded yet.";
        return;
    }

    const groupedShots = {};

    currentRoundShots.forEach(function(shot) {

        if (!groupedShots[shot.hole]) {
            groupedShots[shot.hole] = [];
        }

        groupedShots[shot.hole].push(shot);

    });

    Object.keys(groupedShots)
        .sort(function(a, b) {
            return Number(a) - Number(b);
        })
        .forEach(function(holeNumber) {

            const holeHeader =
                document.createElement("h3");

            holeHeader.textContent =
                "Hole " + holeNumber;

            shotList.appendChild(holeHeader);

            groupedShots[holeNumber]
                .sort(function(a, b) {
                    return a.shotNumber - b.shotNumber;
                })
                .forEach(function(shot) {

                    const item =
                        document.createElement("div");

                    item.className = "shot-item";

                    item.textContent =
                        "Shot " +
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

        });
}

function goHome() {
    hideAllScreens();

    document.getElementById("homeCard").style.display = "block";
}

if (currentRound) {

    document.getElementById("roundTitle").textContent =
        currentRound.course +
        " - " +
        currentRound.date;

}

let simpleScorecard = [];

function startScorecardMode() {
    closeRoundModePopup();

    localStorage.setItem("roundMode", "scorecard");

    showHoleCountPopup();
}

function initializeScorecard(numberOfHoles) {
    const course =
        courses[selectedCourseId];

    simpleScorecard = [];

    if (numberOfHoles === 9) {
        simpleScorecard =
            course.whiteTees.map(function(hole) {
                return {
                    hole: hole.hole,
                    par: hole.par,
                    yards: hole.yards,
                    tee: hole.tee,
                    score: null
                };
            });
    }

    if (numberOfHoles === 18) {
        const frontNine =
            course.whiteTees.map(function(hole) {
                return {
                    hole: hole.hole,
                    par: hole.par,
                    yards: hole.yards,
                    tee: hole.tee,
                    score: null
                };
            });

        const backNine =
            course.blueBlackTees.map(function(hole) {
                return {
                    hole: hole.hole + 9,
                    par: hole.par,
                    yards: hole.yards,
                    tee: hole.tee,
                    score: null
                };
            });

        simpleScorecard =
            frontNine.concat(backNine);
    }

    localStorage.setItem("simpleScorecard", JSON.stringify(simpleScorecard));
    renderSimpleScorecard();
}

function getDefaultPar(holeNumber) {
    // Temporary default setup
    // You can customize this later by course
    const defaultPars = [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4];

    return defaultPars[holeNumber - 1];
}


function showScorecardScreen() {
    hideAllScreens();

    document.getElementById("scorecardScreen").classList.remove("hidden");
}

function renderSimpleScorecard() {
    const grid = document.getElementById("scorecardGrid");
    grid.innerHTML = "";

    simpleScorecard.forEach((hole, index) => {
        const scoreDisplay = hole.score === null ? "-" : hole.score;

        const holeDiv = document.createElement("div");
        holeDiv.className = "scorecard-hole";

        holeDiv.innerHTML = `
            <div class="hole-number">${hole.hole}</div>

            <div class="hole-details">
                <strong>Hole ${hole.hole}</strong>
                <span>Par ${hole.par} • ${hole.yards || "-"} yds • ${hole.tee}</span>
            </div>

            <div class="score-controls">
                <button onclick="decreaseScore(${index})">−</button>
                <div class="score-value">${scoreDisplay}</div>
                <button onclick="increaseScore(${index})">+</button>
            </div>
        `;

        grid.appendChild(holeDiv);
    });

    updateScorecardSummary();
}

function increaseScore(index) {
    if (simpleScorecard[index].score === null) {
        simpleScorecard[index].score = simpleScorecard[index].par;
    } else {
        simpleScorecard[index].score++;
    }

    saveSimpleScorecardProgress();
    renderSimpleScorecard();
}

function decreaseScore(index) {
    if (simpleScorecard[index].score === null) {
        return;
    }

    simpleScorecard[index].score--;

    if (simpleScorecard[index].score < 1) {
        simpleScorecard[index].score = null;
    }

    saveSimpleScorecardProgress();
    renderSimpleScorecard();
}

function updateScorecardSummary() {
    const completedHoles = simpleScorecard.filter(hole => hole.score !== null);

    const totalScore = completedHoles.reduce((sum, hole) => sum + hole.score, 0);
    const totalPar = completedHoles.reduce((sum, hole) => sum + hole.par, 0);

    const toPar = totalScore - totalPar;

    document.getElementById("scorecardTotalScore").textContent = totalScore;

    let toParText = "E";

    if (completedHoles.length === 0) {
        toParText = "-";
    } else if (toPar > 0) {
        toParText = `+${toPar}`;
    } else if (toPar < 0) {
        toParText = `${toPar}`;
    }

    document.getElementById("scorecardToPar").textContent = toParText;
}

function saveSimpleScorecardProgress() {
    localStorage.setItem("simpleScorecard", JSON.stringify(simpleScorecard));
}

function saveScorecardRound() {
    const savedRounds = JSON.parse(localStorage.getItem("savedScorecardRounds")) || [];

const round = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    mode: "scorecard",
    courseId: selectedCourseId,
    courseName: courses[selectedCourseId].name,
    holesPlayed: simpleScorecard.length,
    holes: simpleScorecard,
    totalScore: simpleScorecard
        .filter(hole => hole.score !== null)
        .reduce((sum, hole) => sum + hole.score, 0)
};

    savedRounds.push(round);

    localStorage.setItem("savedScorecardRounds", JSON.stringify(savedRounds));
    localStorage.removeItem("simpleScorecard");

    alert("Scorecard round saved.");

    goHome();
}

function hideAllScreens() {
    document.getElementById("homeCard").style.display = "none";
    document.getElementById("roundSetupCard").style.display = "none";
    document.getElementById("shotTrackerCard").style.display = "none";
    document.getElementById("summaryCard").style.display = "none";
    document.getElementById("scorecardCard").style.display = "none";
    document.getElementById("recentShotsCard").style.display = "none";

    const scorecardScreen =
        document.getElementById("scorecardScreen");

    if (scorecardScreen) {
        scorecardScreen.classList.add("hidden");
    }

    const recentRoundsScreen =
        document.getElementById("recentRoundsScreen");

    if (recentRoundsScreen) {
        recentRoundsScreen.classList.add("hidden");
    }

    const roundDetailScreen =
        document.getElementById("roundDetailScreen");

    if (roundDetailScreen) {
        roundDetailScreen.classList.add("hidden");
    }
}

function showRecentRounds() {
    hideAllScreens();

    document.getElementById("recentRoundsScreen").classList.remove("hidden");

    renderRecentRounds();
}

function renderRecentRounds() {
    const recentRoundsList =
        document.getElementById("recentRoundsList");

    recentRoundsList.innerHTML = "";

    const savedRounds =
        JSON.parse(localStorage.getItem("savedScorecardRounds")) || [];

    if (savedRounds.length === 0) {
        recentRoundsList.innerHTML =
            "<p class='empty-message'>No saved rounds yet.</p>";
        return;
    }

    savedRounds
        .sort(function(a, b) {
            return b.id - a.id;
        })
        .forEach(function(round) {

            const completedHoles =
                round.holes.filter(function(hole) {
                    return hole.score !== null;
                });

            const totalScore =
                completedHoles.reduce(function(sum, hole) {
                    return sum + hole.score;
                }, 0);

            const totalPar =
                completedHoles.reduce(function(sum, hole) {
                    return sum + hole.par;
                }, 0);

            const toPar =
                totalScore - totalPar;

            let toParText = "E";

            if (toPar > 0) {
                toParText = "+" + toPar;
            }

            if (toPar < 0) {
                toParText = toPar;
            }

            const roundDiv =
                document.createElement("div");

roundDiv.className = "recent-round-card";

roundDiv.onclick = function() {
    showRoundDetail(round.id);
};
roundDiv.innerHTML = `
    <div>
        <strong>${round.courseName || "Whitinsville Golf Club"}</strong>
        <span>${round.date} • ${round.holesPlayed || completedHoles.length} holes</span>
    </div>

    <div class="recent-round-score">
        <strong>${totalScore}</strong>
        <span>${toParText}</span>
    </div>
`;

            recentRoundsList.appendChild(roundDiv);

        });
}

function showRoundDetail(roundId) {
    hideAllScreens();

    const roundDetailScreen =
        document.getElementById("roundDetailScreen");

    roundDetailScreen.classList.remove("hidden");

    renderRoundDetail(roundId);
}

function renderRoundDetail(roundId) {
    const savedRounds =
        JSON.parse(localStorage.getItem("savedScorecardRounds")) || [];

    const round =
        savedRounds.find(function(savedRound) {
            return savedRound.id === roundId;
        });

    if (!round) {
        alert("Round not found.");
        showRecentRounds();
        return;
    }

document.getElementById("roundDetailDate").textContent =
    (round.courseName || "Whitinsville Golf Club") + " • " + round.date;

    const roundDetailList =
        document.getElementById("roundDetailList");

    roundDetailList.innerHTML = "";

    const completedHoles =
        round.holes.filter(function(hole) {
            return hole.score !== null;
        });

    let totalScore = 0;
    let totalPar = 0;

    round.holes.forEach(function(hole) {
        const scoreDisplay =
            hole.score === null ? "-" : hole.score;

        const difference =
            hole.score === null ? null : hole.score - hole.par;

        let status = "-";

        if (difference === 0) {
            status = "E";
        }

        if (difference > 0) {
            status = "+" + difference;
        }

        if (difference < 0) {
            status = difference;
        }

        if (hole.score !== null) {
            totalScore += hole.score;
            totalPar += hole.par;
        }

        const holeDiv =
            document.createElement("div");

        holeDiv.className = "round-detail-hole";

        holeDiv.innerHTML = `
            <div class="hole-number">${hole.hole}</div>

            <div class="hole-details">
                <strong>Hole ${hole.hole}</strong>
                    <span>Par ${hole.par} • ${hole.yards || "-"} yds • ${hole.tee || ""}</span>
            </div>

            <div class="round-detail-score">
                <strong>${scoreDisplay}</strong>
                <span>${status}</span>
            </div>
        `;

        roundDetailList.appendChild(holeDiv);
    });

    const toPar =
        totalScore - totalPar;

    let toParText = "E";

    if (completedHoles.length === 0) {
        toParText = "-";
    } else if (toPar > 0) {
        toParText = "+" + toPar;
    } else if (toPar < 0) {
        toParText = toPar;
    }

    document.getElementById("roundDetailTotalScore").textContent =
        totalScore;

    document.getElementById("roundDetailToPar").textContent =
        toParText;
}

function showHoleCountPopup() {
    document.getElementById("holeCountPopup").classList.remove("hidden");
}

function closeHoleCountPopup() {
    document.getElementById("holeCountPopup").classList.add("hidden");
}

function startScorecardRound(numberOfHoles) {
    closeHoleCountPopup();

    localStorage.setItem("scorecardHoleCount", numberOfHoles);

    initializeScorecard(numberOfHoles);
    showScorecardScreen();
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

    document.getElementById("scorecardCard").style.display =
        "none";

    document.getElementById("homeCard").style.display =
        "none";
}

function continueRound() {

    if (!currentRound) {
        alert("No existing round found. Start a new round first.");
        return;
    }

    document.getElementById("homeCard").style.display =
        "none";

    document.getElementById("roundSetupCard").style.display =
        "none";

    document.getElementById("shotTrackerCard").style.display =
        "block";

    document.getElementById("summaryCard").style.display =
        "block";

    document.getElementById("recentShotsCard").style.display =
        "block";
    
    document.getElementById("scorecardCard").style.display =
        "block";

    updateHoleDisplay();
    renderShots();
    renderScorecard();
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

function showRoundModePopup() {
    document.getElementById("roundModePopup").classList.remove("hidden");
}

function closeRoundModePopup() {
    document.getElementById("roundModePopup").classList.add("hidden");
}


function startShotTrackingMode() {
    closeRoundModePopup();

    // Save selected mode
    localStorage.setItem("roundMode", "shotTracking");

    // Existing full tracker flow
    showRoundSetup();
}

function showHome() {
    goHome();
}

document.getElementById("roundSetupCard").style.display =
    "none";

document.getElementById("shotTrackerCard").style.display =
    "none";

document.getElementById("summaryCard").style.display =
    "none";

document.getElementById("recentShotsCard").style.display =
    "none";

document.getElementById("scorecardCard").style.display =
    "none";

window.addEventListener("load", function() {

    setTimeout(function() {

        const splash =
            document.getElementById("splashScreen");

        splash.style.opacity =
            "0";

        setTimeout(function() {
            splash.style.display =
                "none";
        }, 500);

    }, 4000);

});