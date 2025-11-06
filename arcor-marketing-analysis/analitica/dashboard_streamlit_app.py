# Dashboard Streamlit — Arcor (simulado)
# Instalar requerimientos: pip install streamlit pandas matplotlib seaborn

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
sns.set(style='whitegrid')

st.set_page_config(page_title="Arcor — Dashboard de Marketing", layout="wide")
st.title("Dashboard de Rendimiento — Arcor (simulado)")

@st.cache_data
def load_data():
    ads = pd.read_csv('analitica/datos_publicidad.csv', parse_dates=['fecha'])
    traffic = pd.read_csv('analitica/datos_trafico_web.csv', parse_dates=['fecha'])
    ads['roas'] = (ads['ingresos_ars'] / ads['gasto_ars']).round(2)
    return ads, traffic

ads, traffic = load_data()

# Filtros
st.sidebar.header("Filtros")
canal_sel = st.sidebar.multiselect("Canal", options=ads['canal'].unique(), default=list(ads['canal'].unique()))
campana_sel = st.sidebar.multiselect("Campaña", options=ads['campana'].unique(), default=list(ads['campana'].unique()))

ads_f = ads[ads['canal'].isin(canal_sel) & ads['campana'].isin(campana_sel)]

# KPIs
col1, col2, col3, col4 = st.columns(4)
col1.metric("Gasto (ARS)", f"{ads_f['gasto_ars'].sum():,.0f}")
col2.metric("Ingresos (ARS)", f"{ads_f['ingresos_ars'].sum():,.0f}")
col3.metric("Conversiones", int(ads_f['conversiones'].sum()))
roas_global = (ads_f['ingresos_ars'].sum() / ads_f['gasto_ars'].sum()) if ads_f['gasto_ars'].sum() > 0 else 0
col4.metric("ROAS", f"{roas_global:.2f}")

st.markdown("---")

# Gráficos
st.subheader("ROAS por campaña")
fig, ax = plt.subplots(figsize=(10,4))
sns.barplot(data=ads_f.sort_values('roas', ascending=False), x='campana', y='roas', palette='Blues_d', ax=ax)
plt.xticks(rotation=45)
st.pyplot(fig)

st.subheader("Visitas por canal (tráfico web)")
fig2, ax2 = plt.subplots(figsize=(10,4))
traffic_group = traffic.groupby('canal').agg({'usuarios':'sum'}).reset_index()
sns.barplot(data=traffic_group, x='canal', y='usuarios', palette='Greens_d', ax=ax2)
plt.xticks(rotation=45)
st.pyplot(fig2)

st.subheader("Detalle de campañas")
st.dataframe(ads_f[['campana','canal','fecha','impresiones','clicks','conversiones','gasto_ars','ingresos_ars','roas']])