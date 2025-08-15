# Pokémon — Mini Dashboard

Mini-dashboard en **Next.js + TypeScript + Recharts** que usa un backend ligero con API Routes. 
Integra datos “tipo actividad” sobre Pokémon (eventos sintéticos) para generar series temporales y practicar transformaciones.

## Objetivo
- Integración end-to-end (API → transformaciones → gráficos → filtros).
- ≥3 transformaciones: agregación diaria, % cambio, media móvil 7d, Top-N por tipo, serie por región, distribución por acción.
- ≥4 visualizaciones: línea (tendencia), área (% cambio), barras (Top-N), área apilada (región), donut (acciones).
- Filtros: rango de fechas + tipo/region.
- Drill-down: click en barras → tabla detalle.
- Evidencia: trazas JSONL (proxy) + envío a webhook.

## Datos
- `GET /api/mock/events` — genera 60 días de eventos (battle/catch/trade) con Pokémon populares (id/name/type) y valor derivado.
- `GET /api/poke/proxy?path=pokemon/25` — **opcional**, proxy a PokeAPI (https://pokeapi.co/) con trazas a `http_trace.jsonl`.


## Transformaciones
- **Agregación diaria**: suma de `value` por día.
- **% cambio**: variación día a día.
- **Media móvil 7d**: suavizado de tendencia.
- **Top-N por tipo**.
- **Serie por región** (stacked).
- **Distribución por acción** (pie).


