# Proyecto: Marketing Digital y Análisis de Datos — EcoWave

Bienvenido al repositorio del proyecto profesional de Marketing Digital y Análisis de Datos basado en la marca ficticia **EcoWave** — una tienda online de productos sostenibles para el hogar y estilo de vida.

Este proyecto está diseñado como ejemplo completo para demostrar competencias en:
- Estrategia digital
- Publicidad (Google Ads)
- SEO y tráfico orgánico
- Redes sociales y crecimiento
- UX y customer journey
- Analítica web (Google Analytics)
- Visualización de datos (Python, Power BI / simulación)

Objetivo
---------
Proveer un conjunto práctico y reproducible de artefactos (estrategias, informes, notebooks y visualizaciones) que muestren el ciclo completo de una campaña digital: desde la planificación estratégica hasta el análisis de resultados y la presentación ejecutiva.

Herramientas usadas
-------------------
- Google Ads (planificación y simulación de resultados)
- Google Analytics (medición de tráfico y eventos)
- Power BI (mockup del dashboard y propuesta de visualización)
- Canva (ejemplos de posts)
- Python (pandas, matplotlib, seaborn) — notebooks incluidos
- Excel (.xlsx) y CSV — datos tabulares y calendarios de contenidos
- PowerPoint / PDF — presentación ejecutiva

Estructura de carpetas
----------------------
marketing-project/
│
├── README.md
├── estrategia_digital/              # Planificación, DAFO, buyer persona, customer journey
├── campañas_ads/                    # Planes y resultados de campañas (Google Ads), AB tests
├── redes_sociales/                  # Calendarios, estrategias y ejemplos creativos
├── analitica_web/                   # Guía GA, KPIs y mockup Power BI
├── visualizaciones/                 # Notebooks + imágenes de gráficas
└── presentacion/                     # Resumen ejecutivo (PDF) y portfolio visual (PPTX)

Contenidos destacados
---------------------
- Plan de marketing con objetivos SMART, segmentación y roadmap trimestral.
- Simulación de campañas Google Ads con métricas: CTR, CPC, conversiones, ROAS.
- Informe de ROAS / LTV / CAC con cálculos y recomendaciones de optimización.
- Notebooks Python (`ventas_mensuales.ipynb`, `trafico_web.ipynb`) que reproducen análisis y gráficos con datos simulados.
- CSVs y XLSX con datos de ejemplo (AB testing, calendario de contenidos, KPIs).
- Presentación ejecutiva con conclusiones y acciones prioritarias.

Cómo reproducir los análisis
----------------------------
1. Clona el repositorio:
   git clone https://github.com/dsd228/Marketing-Performance-Dashboard.git
   cd Marketing-Performance-Dashboard/marketing-project

2. Entorno Python recomendado:
   - Python 3.9+
   - Crear entorno virtual y activar:
     python -m venv venv
     source venv/bin/activate  (Linux/Mac)  o  venv\Scripts\activate (Windows)
   - Instalar dependencias:
     pip install pandas matplotlib seaborn notebook jupyterlab

3. Abrir y ejecutar los notebooks:
   - jupyter lab
   - Abrir `visualizaciones/dashboards/ventas_mensuales.ipynb` y `trafico_web.ipynb`
   - Las celdas crean datos simulados, calculan KPIs (CTR, conversion_rate, ROAS, CAC, LTV) y generan gráficas.

4. Revisar informes y CSV:
   - `analitica_web/informe_kpis.csv` contiene métricas mensuales simuladas.
   - `campañas_ads/ab_testing_resultados.xlsx` (o abrir el CSV alternativo) contiene resultados A/B.

5. Presentación:
   - `presentacion/resumen_ejecutivo.pdf` y `presentacion/portfolio_visual.pptx` incluyen conclusiones y gráficos exportados desde los notebooks y Power BI mockup.

Licencia
--------
Este proyecto incluye una licencia MIT en el archivo LICENSE.

Notas finales
-------------
- Todos los datos son simulados y tienen finalidad educativa.
- Se recomienda reemplazar las simulaciones con datos reales siguiendo la guía de `analitica_web/guia_google_analytics.md`.
- Para dudas o adaptaciones (traducción, formato, exportación a Power BI real), contactar al autor.




