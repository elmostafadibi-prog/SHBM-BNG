// --- CONFIGURATION ---
const API_KEY = 'https://script.google.com/macros/s/AKfycby8KcjB2ibJOk_XRPhhA77rrXp4YxPXsUnR-8BCzrQZiQP6TJj-2j7sfoJRjl_WNowcng/exec'; // Remplacez par votre clé
const SPREADSHEET_ID = '1y1uTrvBAfnws1wCHl66n0UEqfPJqAn6SD6jwTuCn2o0';
// ---------------------

let dataTable;

$(document).ready(function() {
    // Charger la feuille par défaut (tasks) au démarrage
    loadSheet('tasks');
});

/**
 * Charge les données d'une feuille spécifique
 * @param {string} sheetName - Le nom de l'onglet dans Google Sheets
 * @param {HTMLElement} element - L'élément menu cliqué (optionnel)
 */
async function loadSheet(sheetName, element = null) {
    // UI : Mise à jour du menu actif
    if (element) {
        $('.nav-links li a').removeClass('active');
        $(element).addClass('active');
    }
    
    $('#current-sheet-title').text(`Tableau de bord : ${sheetName.toUpperCase()}`);
    $('#loader').show();
    $('#mainTable').hide();

    // Détruire l'ancienne table si elle existe
    if ($.fn.DataTable.isDataTable('#mainTable')) {
        $('#mainTable').DataTable().destroy();
        $('#mainTable').empty();
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 0) {
            renderTable(data.values);
        } else {
            $('#loader').hide();
            alert("Aucune donnée trouvée dans cette feuille.");
        }
    } catch (error) {
        console.error("Erreur d'extraction :", error);
        $('#loader').hide();
        alert("Erreur de connexion à Google Sheets. Vérifiez votre clé API.");
    }
}

/**
 * Génère le tableau HTML et initialise DataTables
 */
function renderTable(values) {
    const headers = values[0]; // Première ligne = Entêtes
    const rows = values.slice(1); // Reste = Données

    // Création de l'entête HTML
    let thead = '<thead><tr>';
    headers.forEach(h => thead += `<th>${h}</th>`);
    thead += '</tr></thead>';
    
    $('#mainTable').append(thead);

    // Initialisation de DataTables
    dataTable = $('#mainTable').DataTable({
        data: rows,
        responsive: true,
        pageLength: 10,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
        },
        dom: '<"top"f>rt<"bottom"lip><"clear">',
        drawCallback: function() {
            $('#loader').hide();
            $('#mainTable').fadeIn();
        }
    });
}

