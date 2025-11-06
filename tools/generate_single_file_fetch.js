#!/usr/bin/env node
/**
 * tools/generate_single_file_fetch.js
 * Ejecutar: node tools/generate_single_file_fetch.js
 *
 * Genera un archivo HTML 'docs/single_page.html' autosuficiente.
 * - Intenta usar archivos locales.
 * - Si no existen, los descarga desde raw.githubusercontent.
 * - Si la descarga falla, usa placeholders.
 * - Embebe (inline) archivos < 5MB como Base64.
 * - Guarda archivos >= 5MB en 'docs/assets/' y los enlaza.
 *
 * Requiere Node.js >= 18 (por 'fetch' global).
 */

import {
    promises as fs
} from 'fs';
import path from 'path';

// --- Configuración ---
const REPO_USER = 'dsd228';
const REPO_NAME = 'Marketing-Performance-Dashboard';
const REPO_BRANCH = 'arcor-marketing-analysis';
const BASE_RAW_URL = `https://raw.githubusercontent.com/${REPO_USER}/${REPO_NAME}/${REPO_BRANCH}/`;

const MAX_INLINE_SIZE = 5 * 1024 * 1024; // 5 MB

const OUTPUT_DIR = path.resolve(process.cwd(), 'docs');
const ASSETS_DIR = path.resolve(OUTPUT_DIR, 'assets');
const OUTPUT_HTML_FILE = path.resolve(OUTPUT_DIR, 'single_page.html');

// Lista de entregables
const DELIVERABLES = [{
    id: 'visual',
    type: 'image',
    title: '1. Resumen Visual',
    localPath: path.resolve(process.cwd(), 'resultados/resumen_visual_dashboard.png'),
    filename: 'resumen_visual_dashboard.png',
}, {
    id: 'report',
    type: 'pdf',
    title: '2. Informe de Resultados',
    localPath: path.resolve(process.cwd(), 'resultados/informe_resultados.pdf'),
    filename: 'informe_resultados.pdf',
}, {
    id: 'summary',
    type: 'pdf',
    title: '3. Resumen Ejecutivo',
    localPath: path.resolve(process.cwd(), 'presentacion/resumen_ejecutivo_arcor.pdf'),
    filename: 'resumen_ejecutivo_arcor.pdf',
}, {
    id: 'presentation',
    type: 'pptx',
    title: '4. Presentación (PowerPoint)',
    localPath: path.resolve(process.cwd(), 'presentacion/presentacion_powerpoint.pptx'),
    filename: 'presentacion_powerpoint.pptx',
}, {
    id: 'insights',
    type: 'markdown',
    title: '5. Insights y Recomendaciones',
    localPath: path.resolve(process.cwd(), 'resultados/insights_recomendaciones.md'),
    filename: 'insights_recomendaciones.md',
}, ];

// --- Helpers ---

/**
 * Asegura que un directorio exista, creándolo si es necesario.
 */
async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, {
            recursive: true
        });
    } catch (e) {
        if (e.code !== 'EEXIST') throw e;
    }
}

/**
 * Intenta descargar un archivo.
 * @param {string} url - URL de descarga.
 * @param {string} localSavePath - Ruta donde guardar el archivo.
 * @returns {boolean} - true si la descarga fue exitosa, false si no.
 */
async function downloadFile(url, localSavePath) {
    console.log(`[Download] Intentando descargar: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[Download] Error HTTP ${response.status} para ${url}`);
            return false;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await ensureDir(path.dirname(localSavePath));
        await fs.writeFile(localSavePath, buffer);
        console.log(`[Download] Exitoso: ${localSavePath}`);
        return true;
    } catch (e) {
        console.error(`[Download] Falló la descarga de ${url}: ${e.message}`);
        return false;
    }
}

/**
 * Genera un placeholder SVG para una imagen faltante.
 */
function getPlaceholderImage(filename) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" style="background-color:#eee;">
        <rect width="800" height="400" fill="#e9ecef"/>
        <text x="50%" y="50%" fill="#495057" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">
            Error: Archivo no encontrado
        </text>
        <text x="50%" y="60%" fill="#6c757d" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">
            ${filename}
        </text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Genera un enlace a la página blob de GitHub para archivos no encontrados.
 */
function getPlaceholderLink(filename, type, localPath) {
    const repoPath = path.relative(process.cwd(), localPath).replace(/\\/g, '/');
    const githubUrl = `https://github.com/${REPO_USER}/${REPO_NAME}/blob/${REPO_BRANCH}/${repoPath}`;
    return {
        type: 'placeholder',
        html: `
            <div class="alert alert-warning">
                <strong>Archivo no encontrado:</strong> ${filename}
                <p>No se pudo encontrar localmente ni descargar. Puedes intentar acceder a él en el repositorio.</p>
                <a href="${githubUrl}" class="btn btn-secondary btn-sm" target="_blank">Ver en GitHub</a>
            </div>`,
        downloadUrl: githubUrl,
        downloadName: filename,
    };
}

/**
 * Procesa cada entregable: descarga si es necesario, y decide si embeber o enlazar.
 */
async function processAsset(asset) {
    const remoteUrl = `${BASE_RAW_URL}${path.relative(process.cwd(), asset.localPath).replace(/\\/g, '/')}`;
    let fileBuffer;
    let fileExists = false;
    let fileSize = 0;

    // 1. Intentar leer localmente
    try {
        fileBuffer = await fs.readFile(asset.localPath);
        fileExists = true;
        fileSize = fileBuffer.length;
        console.log(`[Local] Encontrado: ${asset.filename} (${(fileSize / 1024).toFixed(1)} KB)`);
    } catch (e) {
        // 2. Si no existe, intentar descargar
        console.log(`[Local] No encontrado: ${asset.localPath}. Intentando descarga...`);
        const downloaded = await downloadFile(remoteUrl, asset.localPath);
        if (downloaded) {
            try {
                fileBuffer = await fs.readFile(asset.localPath);
                fileExists = true;
                fileSize = fileBuffer.length;
            } catch (readErr) {
                console.error(`[Error] Se descargó pero no se pudo leer: ${asset.localPath}`);
            }
        }
    }

    // 3. Si existe (local o descargado), procesar
    if (fileExists) {
        // Caso A: Archivo pequeño (< 5MB) -> Embeber Base64
        if (fileSize < MAX_INLINE_SIZE) {
            console.log(`[Process] Embebiendo ${asset.filename} (pequeño)`);
            let mimeType = 'application/octet-stream';
            if (asset.type === 'image') mimeType = `image/${path.extname(asset.filename).substring(1)}`;
            if (asset.type === 'pdf') mimeType = 'application/pdf';
            if (asset.type === 'markdown') return {
                type: 'markdown',
                content: fileBuffer.toString('utf-8')
            };

            const base64 = fileBuffer.toString('base64');
            const dataUri = `data:${mimeType};base64,${base64}`;
            return {
                type: 'inline',
                dataUri: dataUri,
                downloadUrl: dataUri,
                downloadName: asset.filename,
            };
        }
        // Caso B: Archivo grande (>= 5MB) -> Copiar a /docs/assets y enlazar
        else {
            console.log(`[Process] Enlazando ${asset.filename} (grande)`);
            const assetDestPath = path.join(ASSETS_DIR, asset.filename);
            await fs.copyFile(asset.localPath, assetDestPath);
            const relativePath = `./assets/${asset.filename}`;
            return {
                type: 'external',
                path: relativePath,
                downloadUrl: relativePath,
                downloadName: asset.filename,
            };
        }
    }

    // 4. Si no existe (ni local ni descargado) -> Usar Placeholder
    console.warn(`[Process] Usando placeholder para ${asset.filename}`);
    if (asset.type === 'image') {
        const dataUri = getPlaceholderImage(asset.filename);
        return {
            type: 'inline',
            dataUri: dataUri,
            downloadUrl: '#',
            downloadName: asset.filename
        };
    }
    if (asset.type === 'markdown') {
        return {
            type: 'markdown',
            content: `## Error \nNo se pudo cargar ${asset.filename}.`
        };
    }
    return getPlaceholderLink(asset.filename, asset.type, asset.localPath);
}

/**
 * Genera el contenido HTML final.
 */
function generateHTML(assetsData) {
    const find = (id) => assetsData.find(a => a.id === id) || {};

    const visual = find('visual');
    const report = find('report');
    const summary = find('summary');
    const presentation = find('presentation');
    const insights = find('insights');

    // Genera el HTML para cada tipo de asset
    const visualHtml = (visual.result.type === 'inline') ?
        `<a href="${visual.result.downloadUrl}" target="_blank" title="Haz clic para ver la imagen completa">
            <img src="${visual.result.dataUri}" class="img-dashboard" alt="Resumen Visual">
         </a>` :
        getPlaceholderLink(visual.filename, visual.type, visual.localPath).html;

    const reportHtml = (report.result.type === 'inline') ?
        `<iframe src="${report.result.dataUri}" class="pdf-viewer" title="Informe de Resultados"></iframe>` :
        (report.result.type === 'external') ?
        `<iframe src="${report.result.path}" class="pdf-viewer" title="Informe de Resultados"></iframe>` :
        report.result.html;

    const summaryHtml = (summary.result.type === 'inline') ?
        `<iframe src="${summary.result.dataUri}" class="pdf-viewer" title="Resumen Ejecutivo"></iframe>` :
        (summary.result.type === 'external') ?
        `<iframe src="${summary.result.path}" class="pdf-viewer" title="Resumen Ejecutivo"></iframe>` :
        summary.result.html;

    const presentationHtml = (presentation.result.type === 'placeholder' || presentation.result.type === 'external') ?
        presentation.result.html || `<p>La presentación es un archivo grande. Descárgala usando el botón de abajo.</p>` :
        `<div class="alert alert-info">Presentación embebida (inesperado, archivo pequeño).</div>`;

    const insightsContent = (insights.result.type === 'markdown') ?
        JSON.stringify(insights.result.content) :
        JSON.stringify("## Error al cargar Markdown.");

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketing Performance Dashboard - Arcor</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; scroll-behavior: smooth; }
        .navbar { box-shadow: 0 2px 4px rgba(0,0,0,.1); }
        section { padding: 60px 0; border-bottom: 1px solid #eee; }
        h2 { border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-bottom: 30px; }
        .pdf-viewer { width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px; }
        .download-btn { margin-top: 15px; }
        .img-dashboard { width: 100%; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); }
        #markdown-content-display { background: #fdfdfd; border: 1px solid #eee; border-radius: 8px; padding: 25px; min-height: 100px; }
        #markdown-content-display h3 { font-size: 1.5rem; margin-top: 1.5rem; }
        #markdown-content-display table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        #markdown-content-display th, #markdown-content-display td { border: 1px solid #ddd; padding: 12px; }
        #markdown-content-display th { background-color: #f8f9fa; }
        #markdown-content-display code { background-color: #e9ecef; padding: 2px 6px; border-radius: 4px; }
        #markdown-content-display pre { background-color: #212529; color: #f8f9fa; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body data-bs-spy="scroll" data-bs-target="#mainNavbar">

    <nav id="mainNavbar" class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#">📊 Dashboard Arcor</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#visual">Resumen Visual</a></li>
                    <li class="nav-item"><a class="nav-link" href="#informe">Informe</a></li>
                    <li class="nav-item"><a class="nav-link" href="#resumen">Resumen Ejecutivo</a></li>
                    <li class="nav-item"><a class="nav-link" href="#presentacion">Presentación</a></li>
                    <li class="nav-item"><a class="nav-link" href="#insights">Insights</a></li>
                    <li class="nav-item"><a class="nav-link" href="#visualizaciones">Gráfico</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container">
        
        <section id="visual">
            <h2>${visual.title}</h2>
            ${visualHtml}
            <a href="${visual.result.downloadUrl}" class="btn btn-primary download-btn" download="${visual.result.downloadName}" aria-label="Descargar ${visual.title}">Descargar (PNG)</a>
        </section>

        <section id="informe">
            <h2>${report.title}</h2>
            ${reportHtml}
            <a href="${report.result.downloadUrl}" class="btn btn-primary download-btn" download="${report.result.downloadName}" aria-label="Descargar ${report.title}">Descargar (PDF)</a>
        </section>

        <section id="resumen">
            <h2>${summary.title}</h2>
            ${summaryHtml}
            <a href="${summary.result.downloadUrl}" class="btn btn-primary download-btn" download="${summary.result.downloadName}" aria-label="Descargar ${summary.title}">Descargar (PDF)</a>
        </section>

        <section id="presentacion">
            <h2>${presentation.title}</h2>
            ${presentationHtml}
            <a href="${presentation.result.downloadUrl}" class="btn btn-primary download-btn" download="${presentation.result.downloadName}" aria-label="Descargar ${presentation.title}">Descargar (PPTX)</a>
        </section>

        <section id="insights">
            <h2>${insights.title}</h2>
            <div id="markdown-content-display"></div>
        </section>

        <section id="visualizaciones">
            <h2>6. Visualización Interactiva (Ejemplo)</h2>
            <canvas id="myPerformanceChart"></canvas>
        </section>

    </main>

    <footer class="text-center p-4 bg-light mt-5">
        <p class="mb-0">&copy; 2025 - Dashboard de Performance. Generado por script.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js" xintegrity="sha384-BsoN/bXv/iN/XN+jMAXg23A/YISYO1CILiYNo+gW/y1S/J4t/6jHHD/yTjT5i/bC" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js" xintegrity="sha384-GfP9Gk/vK29wi1FjYJMMP5/y2p6eQ8L5vF8S/s/s7pRaACh1E/3/S/vLwP/3Z/5L" crossorigin="anonymous"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            
            // Renderizar Markdown
            try {
                const markdownContent = ${insightsContent};
                const displayElement = document.getElementById("markdown-content-display");
                if (displayElement && window.marked) {
                    displayElement.innerHTML = window.marked.parse(markdownContent);
                }
            } catch (e) { console.error("Error al renderizar Markdown:", e); }

            // Renderizar Gráfico
            try {
                const exampleData = {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [
                        { label: 'Inversión (miles USD)', data: [50, 65, 70, 90], borderColor: 'rgba(255, 99, 132, 1)', tension: 0.1 },
                        { label: 'Conversiones', data: [120, 150, 180, 210], borderColor: 'rgba(54, 162, 235, 1)', tension: 0.1 }
                    ]
                };
                const ctx = document.getElementById('myPerformanceChart');
                if (ctx && window.Chart) {
                    new Chart(ctx, {
                        type: 'line',
                        data: exampleData,
                        options: { responsive: true, plugins: { title: { display: true, text: 'Rendimiento (Ejemplo)' } } }
                    });
                }
            } catch (e) { console.error("Error al renderizar el gráfico:", e); }
        });
    </script>
</body>
</html>
    `;
}

// --- Main Execution ---

async function main() {
    console.log("Iniciando generador de página única...");

    // 1. Asegurar que existan los directorios de salida
    await ensureDir(OUTPUT_DIR);
    await ensureDir(ASSETS_DIR);
    console.log(`Directorio de salida asegurado: ${OUTPUT_DIR}`);
    console.log(`Directorio de assets asegurado: ${ASSETS_DIR}`);

    // 2. Procesar todos los entregables en paralelo
    const processedAssets = await Promise.all(
        DELIVERABLES.map(async (asset) => {
            const result = await processAsset(asset);
            return {
                ...asset,
                result
            };
        })
    );

    // 3. Generar el HTML
    console.log("Generando HTML final...");
    const finalHtml = generateHTML(processedAssets);

    // 4. Escribir el archivo HTML
    await fs.writeFile(OUTPUT_HTML_FILE, finalHtml);
    console.log(`¡Éxito! Archivo generado en: ${OUTPUT_HTML_FILE}`);

    // 5. Resumen
    console.log("\n--- Resumen ---");
    processedAssets.forEach(a => {
        let status = a.result.type;
        if (a.result.path) status += ` (en ${a.result.path})`;
        if (a.result.type === 'inline') status += ` (embebido)`;
        if (a.result.type === 'placeholder') status += ` (placeholder)`;
        console.log(`- ${a.filename}: ${status}`);
    });
    console.log("\nRevisa 'docs/single_page.html' en tu navegador.");
    console.log("Si todo se ve bien, ¡haz commit y push!");
}

main().catch(e => {
    console.error("\n[ERROR FATAL] El script falló:");
    console.error(e);
    process.exit(1);
});
