// DIRTY TITIAN | Intelligence Portal Engine
// Author: Dirty-X

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let map;
let marker;

const API_SOURCES = [
    { name: 'ipapi.co', url: (ip) => `https://ipapi.co/${ip}/json/` },
    { name: 'freeipapi.com', url: (ip) => `https://freeipapi.com/api/json/${ip}` },
    { name: 'ip-api.com', url: (ip) => `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query,proxy,hosting,mobile,crawler` },
    { name: 'iplocate.io', url: (ip) => `https://www.iplocate.io/api/lookup/${ip}` }
];

function initApp() {
    initMap();
    setupEventListeners();
    detectUserIp();
    logTerminal("System initialized. TITIAN Core Online.");
}

function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);
}

function setupEventListeners() {
    document.getElementById('trackBtn').addEventListener('click', () => {
        const ip = document.getElementById('targetIp').value.trim();
        // Allow empty IP for "Personal Intel" (Self-Tracking)
        if (ip === "" || validateIp(ip)) {
            trackIp(ip);
        } else {
            logTerminal("ERROR: Invalid IPv4/IPv6 address format.", "red");
        }
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
        const randomIp = generateRandomIp();
        document.getElementById('targetIp').value = randomIp;
        trackIp(randomIp);
    });

    // Handle 'Enter' key
    document.getElementById('targetIp').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('trackBtn').click();
    });
}

function validateIp(ip) {
    if (!ip) return false;
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

async function detectUserIp() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        document.getElementById('userIpDisplay').innerText = `NODE IP: ${data.ip}`;
    } catch (e) {
        document.getElementById('userIpDisplay').innerText = `NODE IP: DETECTION BLOCKED`;
    }
}

async function trackIp(ip) {
    logTerminal(`Initiating DIRTY TITIAN Consensus Engine for [${ip}]...`);
    resetUI();

    let results = [];
    let successCount = 0;

    for (const source of API_SOURCES) {
        const startTime = Date.now();
        try {
            const url = source.url(ip);
            const response = await fetch(url);
            const data = await response.json();

            if (data && !data.error) {
                results.push(data);
                successCount++;
                const latency = Date.now() - startTime;
                logTerminal(`Source [${source.name}] synchronized. Latency: ${latency}ms`);
                updateProgress((successCount / API_SOURCES.length) * 100);
            }
        } catch (err) {
            logTerminal(`Source [${source.name}] timeout or blocked. Skipping...`, "dim");
        }
    }

    if (results.length > 0) {
        const consensusData = mergeResults(results);
        displayResults(consensusData);
        logTerminal(`Consensus verification complete. Accuracy score: ${((successCount / API_SOURCES.length) * 100).toFixed(0)}%`, "green");
    } else {
        logTerminal("TITIAN CRITICAL ERROR: All intelligence sources failed.", "red");
    }
}

function mergeResults(results) {
    const merged = {};
    results.forEach(res => {
        merged.ip = merged.ip || res.ip || res.query;
        merged.city = merged.city || res.city;
        merged.region = merged.region || res.region || res.regionName;
        merged.country = merged.country || res.country_name || res.country;
        merged.isp = merged.isp || res.org || res.isp || res.asn;
        merged.lat = merged.lat || res.latitude || res.lat;
        merged.lon = merged.lon || res.longitude || res.lon;
        merged.proxy = merged.proxy || res.proxy || res.is_proxy;
        merged.hosting = merged.hosting || res.hosting || res.is_datacenter;
        merged.mobile = merged.mobile || res.mobile;
        merged.hostname = merged.hostname || res.reverse; // common across some APIs
    });

    merged.decimal = ipv4ToDecimal(merged.ip);
    return merged;
}

function displayResults(data) {
    document.getElementById('resDecimal').innerText = data.decimal || 'N/A';
    document.getElementById('resHostname').innerText = data.hostname || 'No PTR';
    document.getElementById('resLocation').innerText = `${data.city || 'N/A'}, ${data.region || 'N/A'}, ${data.country || 'N/A'}`;
    document.getElementById('resIsp').innerText = data.isp || 'N/A';
    document.getElementById('resType').innerText = data.hosting ? "Data Center / Transit" : (data.mobile ? "Mobile Carrier" : "Consumer Broadband");

    document.getElementById('resDms').innerText = `${toDMS(data.lat, 'lat')} | ${toDMS(data.lon, 'lon')}`;

    const riskEl = document.getElementById('resRisk');
    if (data.proxy) {
        riskEl.innerText = "VPN/PROXY DETECTED";
        riskEl.className = "status-danger";
    } else if (data.hosting) {
        riskEl.innerText = "HOSTING CLOUD";
        riskEl.className = "status-warn";
    } else {
        riskEl.innerText = "LOW RISK / PRIVATE";
        riskEl.className = "status-safe";
    }

    if (data.lat && data.lon) {
        const pos = [data.lat, data.lon];
        map.setView(pos, 10);
        if (marker) marker.remove();
        marker = L.marker(pos).addTo(map)
            .bindPopup(`<b>Target IP:</b> ${data.ip}<br><b>Location:</b> ${data.city}`)
            .openPopup();
    }
}

function generateRandomIp() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

function ipv4ToDecimal(ip) {
    if (!ip || ip.includes(':')) return 'N/A';
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function toDMS(coord, type) {
    if (!coord || coord === 'N/A') return 'N/A';
    const abs = Math.abs(coord);
    const deg = Math.floor(abs);
    const minRem = (abs - deg) * 60;
    const min = Math.floor(minRem);
    const sec = ((minRem - min) * 60).toFixed(2);

    let hemi;
    if (type === 'lat') hemi = coord >= 0 ? 'N' : 'S';
    else hemi = coord >= 0 ? 'E' : 'W';

    return `${deg}° ${min}′ ${sec}″ ${hemi}`;
}

function resetUI() {
    updateProgress(0);
}

function updateProgress(val) {
    document.getElementById('consensusBar').style.width = `${val}%`;
}

function logTerminal(msg, type = "normal") {
    const term = document.getElementById('terminalOutput');
    const p = document.createElement('p');
    p.className = `typist ${type}`;
    p.innerText = `> ${msg}`;
    term.appendChild(p);
    term.scrollTop = term.scrollHeight;
}
