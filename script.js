/* ==========================================
   DRONESWARM FRONTEND PROTOTYPE
   ========================================== */


/* ================= PAGE INFORMATION ================= */

const pageInfo = {

    dashboard: {
        title: "Dashboard",
        subtitle: "Autonomous disaster response control center"
    },

    drones: {
        title: "Drone Fleet",
        subtitle: "Monitor all active drones and telemetry"
    },

    missions: {
        title: "Mission Management",
        subtitle: "Create, monitor and manage rescue missions"
    },

    victims: {
        title: "Victim Detection",
        subtitle: "Detected victims and rescue priorities"
    },

    map: {
        title: "Live Map",
        subtitle: "Real-time drone and victim tracking"
    },

    alerts: {
        title: "System Alerts",
        subtitle: "Warnings and important events"
    },

    settings: {
        title: "Settings",
        subtitle: "Configure DroneSwarm system preferences"
    }

};


/* ================= NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");

const pages = document.querySelectorAll(".page");


function openPage(pageName) {

    /*
        Hide every page
    */

    pages.forEach(page => {
        page.classList.remove("active-page");
    });


    /*
        Show selected page
    */

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    /*
        Update sidebar
    */

    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        }

    });


    /*
        Update top heading
    */

    if (pageInfo[pageName]) {

        document.getElementById("page-title").textContent =
            pageInfo[pageName].title;

        document.getElementById("page-subtitle").textContent =
            pageInfo[pageName].subtitle;

    }


    /*
        Scroll to top
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= SIDEBAR CLICK ================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const pageName = item.dataset.page;

        openPage(pageName);

    });

});


/* ================= CLOCK ================= */

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${hours}:${minutes}:${seconds}`;

}

setInterval(updateClock, 1000);

updateClock();


/* ================= SIMULATED COVERAGE ================= */

let coverage = 68;


setInterval(() => {

    /*
        Small fake change to make
        the dashboard feel live.
    */

    if (coverage < 95) {
        coverage += 0.1;
    }

    document.getElementById("coverage").textContent =
        Math.floor(coverage) + "%";

}, 5000);


/* ================= DRONE TELEMETRY SIMULATION ================= */

const droneBattery = {

    DRONE_01: 82,
    DRONE_02: 67,
    DRONE_03: 45,
    DRONE_04: 23,
    DRONE_05: 78

};


setInterval(() => {

    /*
        This is ONLY fake frontend data.

        Later this will come from:
        FastAPI → PostgreSQL / ROS 2
    */

    Object.keys(droneBattery).forEach(drone => {

        /*
            Don't allow battery to
            become negative.
        */

        if (droneBattery[drone] > 5) {

            /*
                Very small random change
            */

            const change =
                Math.random() * 0.3;

            droneBattery[drone] -= change;

        }

    });

}, 3000);


/* ================= MAP BUTTONS ================= */

const mapControls =
    document.querySelectorAll(".map-control");


mapControls.forEach(button => {

    button.addEventListener("click", () => {

        mapControls.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

    });

});


/* ================= SEARCH ================= */

const searchInputs =
    document.querySelectorAll(".search-input");


searchInputs.forEach(input => {

    input.addEventListener("keyup", () => {

        const searchValue =
            input.value.toLowerCase();

        /*
            Find the table associated
            with this search box.
        */

        const tableCard =
            input.closest(".table-card");

        if (!tableCard) return;

        const rows =
            tableCard.querySelectorAll("tbody tr");


        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            if (text.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

});


/* ================= DEMO NOTIFICATION ================= */

const notificationButton =
    document.querySelector(".icon-button");


notificationButton.addEventListener("click", () => {

    alert(
        "DroneSwarm Notifications\n\n" +
        "• Victim detected by DRONE_02\n" +
        "• DRONE_04 low battery\n" +
        "• DRONE_03 weak communication"
    );

});


/* ================= STARTUP ================= */

console.log(
    "DroneSwarm frontend prototype initialized."
);

console.log(
    "Backend / AI / ROS 2 integration can be added later."
);


/* =========================================================
   REAL MAP - LEAFLET + OPENSTREETMAP
   ========================================================= */


/*
    Coordinates used for our prototype.

    These are FAKE demo drone/victim positions.
    Later they will come from real GPS.
*/


const droneLocations = {

    D1: [28.6139, 77.2090],

    D2: [28.6200, 77.2150],

    D3: [28.6070, 77.2200],

    D4: [28.6160, 77.2250]

};


const victimLocations = {

    V1: [28.6170, 77.2120],

    V2: [28.6100, 77.2180],

    V3: [28.6140, 77.2240]

};


/* =========================================================
   DRONE ICON
   ========================================================= */

const droneIcon = L.divIcon({

    className: "custom-drone-icon",

    html: `
        <div class="drone-map-icon">
            🚁
        </div>
    `,

    iconSize: [35, 35],

    iconAnchor: [17, 17]

});


/* =========================================================
   VICTIM ICON
   ========================================================= */

const victimIcon = L.divIcon({

    className: "custom-victim-icon",

    html: `
        <div class="victim-map-icon">
            <i class="fa-solid fa-person"></i>
        </div>
    `,

    iconSize: [30, 30],

    iconAnchor: [15, 15]

});


/* =========================================================
   CREATE MAP
   ========================================================= */

let dashboardMap = null;

let fullMap = null;


/* =========================================================
   ADD DRONES
   ========================================================= */

function addDrones(map) {

    Object.entries(droneLocations).forEach(
        ([drone, position]) => {

            L.marker(position, {
                icon: droneIcon
            })
            .addTo(map)

            .bindPopup(`
                <strong>${drone}</strong>
                <br>
                Status: Searching
                <br>
                Battery: 78%
                <br>
                Altitude: 42 m
            `);

        }
    );

}


/* =========================================================
   ADD VICTIMS
   ========================================================= */

function addVictims(map) {

    Object.entries(victimLocations).forEach(
        ([victim, position]) => {

            L.marker(position, {
                icon: victimIcon
            })
            .addTo(map)

            .bindPopup(`
                <strong>${victim}</strong>
                <br>
                Priority: HIGH
                <br>
                Status: Detected
            `);

        }
    );

}


/* =========================================================
   DRONE ROUTES
   ========================================================= */

function addRoutes(map) {

    /*
        D1 → V1
    */

    L.polyline(

        [
            droneLocations.D1,
            victimLocations.V1
        ],

        {
            color: "#36c878",
            weight: 3,
            dashArray: "8, 8"
        }

    ).addTo(map);


    /*
        D2 → V2
    */

    L.polyline(

        [
            droneLocations.D2,
            victimLocations.V2
        ],

        {
            color: "#f5b942",
            weight: 3,
            dashArray: "8, 8"
        }

    ).addTo(map);


    /*
        D3 → V3
    */

    L.polyline(

        [
            droneLocations.D3,
            victimLocations.V3
        ],

        {
            color: "#3b82f6",
            weight: 3,
            dashArray: "8, 8"
        }

    ).addTo(map);

}


/* =========================================================
   RESTRICTED AREA
   ========================================================= */

function addRestrictedArea(map) {

    const restrictedArea = [

        [28.618, 77.218],

        [28.618, 77.224],

        [28.613, 77.224],

        [28.613, 77.218]

    ];


    L.polygon(

        restrictedArea,

        {

            color: "#9b6cff",

            fillColor: "#9b6cff",

            fillOpacity: 0.15,

            weight: 2,

            dashArray: "6, 6"

        }

    )
    .addTo(map)

    .bindPopup(
        "<strong>Restricted Area</strong><br>No drone entry"
    );

}


/* =========================================================
   INITIALIZE DASHBOARD MAP
   ========================================================= */

function initializeDashboardMap() {

    const element =
        document.getElementById("dashboard-map");


    if (!element) return;


    dashboardMap = L.map("dashboard-map")

        .setView(
            [28.614, 77.217],
            14
        );


    /*
        OpenStreetMap tiles
    */

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                '&copy; OpenStreetMap contributors'

        }

    ).addTo(dashboardMap);


    addDrones(dashboardMap);

    addVictims(dashboardMap);

    addRoutes(dashboardMap);

    addRestrictedArea(dashboardMap);

}


/* =========================================================
   INITIALIZE FULL MAP
   ========================================================= */

function initializeFullMap() {

    const element =
        document.getElementById("full-map");


    if (!element) return;


    fullMap = L.map("full-map")

        .setView(
            [28.614, 77.217],
            14
        );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                '&copy; OpenStreetMap contributors'

        }

    ).addTo(fullMap);


    addDrones(fullMap);

    addVictims(fullMap);

    addRoutes(fullMap);

    addRestrictedArea(fullMap);

}


/* =========================================================
   START MAPS
   ========================================================= */

initializeDashboardMap();

initializeFullMap();