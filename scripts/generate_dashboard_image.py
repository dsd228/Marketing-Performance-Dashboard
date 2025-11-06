import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set(style='whitegrid')

# Rutas de entrada/salida
ADS_CSV = os.path.join('analitica', 'datos_publicidad.csv')
TRAFFIC_CSV = os.path.join('analitica', 'datos_trafico_web.csv')
OUTDIR = 'resultados'
OUTFILE = os.path.join(OUTDIR, 'resumen_visual_dashboard.png')

# Comprobar archivos
for path in (ADS_CSV, TRAFFIC_CSV):
    if not os.path.exists(path):
        print(f"ERROR: archivo no encontrado: {path}", file=sys.stderr)
        sys.exit(2)

# Cargar datos
ads = pd.read_csv(ADS_CSV)
traffic = pd.read_csv(TRAFFIC_CSV)

# Calcular ROAS (evitar divisiones por cero)
ads = ads.copy()
ads['roas'] = ads.apply(lambda r: (r['ingresos_ars'] / r['gasto_ars']) if r['gasto_ars'] and r['gasto_ars'] != 0 else 0, axis=1)

# Preparar figura con dos subplots
os.makedirs(OUTDIR, exist_ok=True)
fig, axs = plt.subplots(2, 1, figsize=(12, 9), constrained_layout=True)

# ROAS por campaña
kpis = ads.sort_values('roas', ascending=False)
sns.barplot(data=kpis, x='campana', y='roas', palette='Blues_d', ax=axs[0])
axs[0].set_title('ROAS por campaña (simulado)')
axs[0].set_xlabel('')
axs[0].tick_params(axis='x', rotation=35)

# Visitas por canal
traffic_group = traffic.groupby('canal', as_index=False).agg({'usuarios':'sum'})
sns.barplot(data=traffic_group, x='canal', y='usuarios', palette='Greens_d', ax=axs[1])
axs[1].set_title('Visitas por canal (simulado)')
axs[1].set_xlabel('')
axs[1].tick_params(axis='x', rotation=35)

# Guardar
fig.savefig(OUTFILE, dpi=200, bbox_inches='tight')
print(f"Imagen generada: {OUTFILE}")
print("Tamaño (bytes):", os.path.getsize(OUTFILE))
