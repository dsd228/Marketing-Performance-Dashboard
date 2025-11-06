# Análisis Estratégico y Digital de Arcor

Descripción
----------
Proyecto profesional de consultoría digital: "Análisis Estratégico y Digital de Arcor (Argentina)". Objetivo: evaluar presencia digital, analizar rendimiento de campañas publicitarias, extraer insights accionables y proponer una hoja de ruta operativa para optimizar inversión y conversión.

Alcance
-------
- Investigación de marca y análisis competitivo.
- Estrategias digitales (social media, publicidad online, customer journey).
- Análisis de datos simulados (publicidad y tráfico web).
- Notebooks reproducibles con Python (pandas, matplotlib, seaborn, statsmodels).
- Dashboard interactivo en Streamlit para explorar métricas.
- Informe ejecutivo y presentación visual.

Herramientas usadas
-------------------
- Python (pandas, numpy, matplotlib, seaborn, statsmodels)
- Streamlit
- Excel (XLSX)
- Canva (mockups creativos)
- Google Ads (simulación de campañas)
- Google Trends (contexto de demanda)
- PowerPoint / PDF (presentación ejecutiva)

Estructura del repositorio
--------------------------
arcor-marketing-analysis/
│
├── README.md
├── investigacion_marca/
│   ├── analisis_general_arcor.md
│   ├── mision_vision_valores.md
│   ├── analisis_dafo.md
│   └── competidores_principales.md
│
├── estrategias_digitales/
│   ├── estrategia_redes_sociales.md
│   ├── estrategia_publicitaria.md
│   ├── plan_contenidos_mensual.csv
│   └── customer_journey_arcor.md
│
├── analitica/
│   ├── datos_publicidad.csv
│   ├── datos_trafico_web.csv
│   ├── analisis_metricas.ipynb
│   ├── correlaciones_conversiones.ipynb
│   └── dashboard_streamlit_app.py
│
├── resultados/
│   ├── informe_resultados.pdf     (placeholder / export available)
│   ├── insights_recomendaciones.md
│   └── resumen_visual_dashboard.png (placeholder / export available)
│
└── presentacion/
    ├── resumen_ejecutivo_arcor.pdf (placeholder / export available)
    └── presentacion_powerpoint.pptx (placeholder / export available)

Cómo reproducir los análisis (resumen)
-------------------------------------
1. Clonar repo y cambiar a la rama:
   git clone https://github.com/dsd228/Marketing-Performance-Dashboard.git
   cd Marketing-Performance-Dashboard
   git fetch origin
   git checkout -b arcor-marketing-analysis origin/arcor-marketing-analysis

2. Crear entorno Python y dependencias:
   python -m venv venv
   source venv/bin/activate   (Linux/Mac) o venv\Scripts\activate (Windows)
   pip install pandas numpy matplotlib seaborn statsmodels streamlit jupyterlab openpyxl

3. Ejecutar notebooks:
   jupyter lab
   - Abrir `analitica/analisis_metricas.ipynb` y `analitica/correlaciones_conversiones.ipynb`.

4. Ejecutar dashboard:
   streamlit run analitica/dashboard_streamlit_app.py

Notas
-----
- Los CSV contienen datos simulados diseñados para ser coherentes con métricas reales de mercado y permiten reproducir los KPIs del informe.
- Los archivos PDF/PPTX están indicados como placeholders: se pueden exportar localmente desde los notebooks o creativos y luego subir como binarios al repo.
- Licencia MIT incluida.