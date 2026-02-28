const API_KEY = "https://script.google.com/macros/s/AKfycbxENF2oxBn1wBTiJvGF01v1qwM8elxZiN_Lz9J3oY61dpm6Jd1y1Q7IP5at0s7R6-YjXw/exec";
const SPREADSHEET_ID = "1y1uTrvBAfnws1wCHl66n0UEqfPJqAn6SD6jwTuCn2o0";

const sheetTabs = document.getElementById("sheetTabs");

async function getSheetNames() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.sheets.map(sheet => sheet.properties.title);
}

async function loadSheet(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const headers = data.values[0];
    const rows = data.values.slice(1);

    $('#dataTable').DataTable().destroy();
    const thead = document.querySelector("#dataTable thead");
    const tbody = document.querySelector("#dataTable tbody");

    thead.innerHTML = "";
    tbody.innerHTML = "";

    let headerRow = "<tr>";
    headers.forEach(header => headerRow += `<th>${header}</th>`);
    headerRow += "</tr>";
    thead.innerHTML = headerRow;

    rows.forEach(row => {
        let tr = "<tr>";
        row.forEach(cell => tr += `<td>${cell}</td>`);
        tr += "</tr>";
        tbody.innerHTML += tr;
    });

    $('#dataTable').DataTable({
        responsive: true,
        pageLength: 10
    });
}

async function init() {
    const sheets = await getSheetNames();

    sheets.forEach(sheet => {
        const btn = document.createElement("button");
        btn.textContent = sheet;
        btn.onclick = () => loadSheet(sheet);
        sheetTabs.appendChild(btn);
    });

    loadSheet("tasks"); // feuille par défaut
}

init();
