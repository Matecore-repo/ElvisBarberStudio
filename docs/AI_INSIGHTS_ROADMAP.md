# 🤖 Dashboard - Extensiones con IA (Forward-Looking)

## Visión

El dashboard actual está preparado para integraciones de IA que no solo **muestren datos**, sino que **sugieran acciones** de forma automática.

---

## 1. Predicción de Demanda

### Ubicación en Dashboard
Sección nueva debajo de "Salud del Negocio":

```
[AI INSIGHTS]
├─ 📈 Demanda Predicha
│  "Próxima semana: +15% ocupación esperada"
│  "Recomendación: Agenda marketing para mañana"
│
├─ 🎯 Oportunidad de Precio
│  "Demanda alta en viernes tarde"
│  "Sube $2 haircuts 17:00-20:00"
```

### Datos de Entrada
```python
# Histórico de citas + tendencias
trends = {
    "days_of_week": [45, 50, 48, 52, 80, 95, 70],  # Mon-Sun
    "hourly": [10, 15, 20, 35, 40, 45, 30, 20],    # 9am-5pm
    "seasonal": 1.15,                               # +15% este mes
    "anomalies": [cancellations, no_shows]
}

# ML predice
predictions = model.predict(trends)
→ "Saturday: +18% vs average"
```

### Implementación
```typescript
// src/lib/ai/demand-prediction.ts
export async function predictDemand(salonId: string) {
  const historicalData = await getHistoricalAppointments(salonId)
  const trend = calculateTrend(historicalData)
  
  // Llamar a OpenAI API / Custom ML Model
  const prediction = await mlModel.predict({
    historicalData,
    trend,
    seasonality: getSeasonality()
  })
  
  return {
    nextWeek: prediction.occupancy,
    confidence: prediction.confidence,
    recommendation: prediction.suggestion
  }
}
```

---

## 2. Riesgo de Cancelación por Cliente

### Ubicación
Tarjeta en sección "NECESITA ATENCIÓN":

```
⚠️ RIESGO ALTO: Juan Pérez
   "72% probabilidad de cancelación"
   "Última visita: 15 días atrás"
   [Contactar] [Ver historial]
```

### Datos de Entrada
```python
client_features = {
    "visits_count": 12,
    "cancellations": 3,
    "last_visit_days_ago": 15,
    "avg_interval_days": 30,
    "payment_method": "cash",
    "time_of_day_preference": "evening"
}

# ML score
churn_risk = model.predict_proba(client_features)
→ 0.72 (72% riesgo)
```

### Acción Automática
```typescript
if (churnRisk > 0.70) {
  alert = {
    severity: "critical",
    title: `Riesgo de churn: ${client.name}`,
    description: `${Math.round(churnRisk * 100)}% probabilidad de no volver`,
    action: {
      label: "Contactar por WhatsApp",
      href: `/app/clients/${client.id}/contact`
    }
  }
}
```

---

## 3. Recomendaciones de Precio (Dynamic Pricing)

### Ubicación
Nueva sección: "OPORTUNIDADES DE REVENUE"

```
💰 Optimización de Precios
├─ Haircut en viernes 18:00: Sube de $15 → $18 (+20%)
│  "Demanda alta, solo 2 slots disponibles"
│
└─ Beard Trim en lunes: Baja de $12 → $10 (-17%)
   "Ocupación baja, puede generar volumen"
```

### Algoritmo
```python
# Datos por servicio + timeslot
service_metrics = {
    "base_price": 15,
    "demand_last_30d": [45, 48, 50, 52, 65, 80, 95],
    "occupancy_rate": 0.95,
    "elasticity": 0.8,  # Price sensitivity
    "competitor_avg": 16
}

# IA calcula precio óptimo
optimal_price = calculate_price(service_metrics)
→ $17 (margen +13%, aún competitivo)
```

### Implementación
```typescript
// src/lib/ai/price-optimization.ts
export async function suggestPricing(salonId: string) {
  const services = await getServices(salonId)
  
  const suggestions = services.map(service => {
    const metrics = getServiceMetrics(service)
    const price = calculateOptimalPrice(metrics)
    const confidence = metrics.occupancy_rate
    
    return {
      service: service.name,
      current: service.price,
      suggested: price,
      impact: price - service.price,
      timeSlots: getHighDemandTimeSlots(service)
    }
  })
  
  return suggestions.filter(s => Math.abs(s.impact) > 1) // Mínimo $1
}
```

---

## 4. Utilización Óptima de Personal

### Ubicación
Sección "OPERACIONES":

```
⚡ Carga de Trabajo
├─ ✅ Carlos: 8/8 horas (óptimo)
├─ ⚠️  Miguel: 12/8 horas (SOBRECARGADO)
│      "Reasigna clientes a João"
│
└─ ⚠️  João: 2/8 horas (SUBUTILIZADO)
   "Disponible para más reservas"
```

### Datos de Entrada
```python
staff_metrics = {
    "carlos": {
        "scheduled_hours": 8,
        "actual_hours": 8.2,
        "utilization": 0.85,
        "clients_satisfied": 0.95,
        "efficiency": 1.0
    },
    "miguel": {
        "scheduled_hours": 8,
        "actual_hours": 12.1,  # OVERFLOW
        "utilization": 1.51,
        "burnout_risk": 0.78
    }
}

# Rebalanceo
rebalance = model.optimize_allocation(staff_metrics)
→ "Mover 3 clientes de Miguel a João"
```

---

## 5. Sugerencias de Servicios Cruzados

### Ubicación
Panel inferior de perfil de cliente en "ACTIVIDAD RECIENTE":

```
Cliente: Juan Pérez
├─ Última cita: Haircut ($15)
├─ Historial: 8 haircuts, 0 beard trims
│
└─ 💡 Sugerencia: "Beard Trim combo" (-10%)
   "Clientes con 8+ haircuts suelen interesarse"
```

### Datos de Entrada
```python
client_profile = {
    "service_history": ["Haircut"] * 8,
    "avg_spend": 15,
    "frequency": "every 3 weeks",
    "similar_clients_behavior": {
        "beard_trim_uptake": 0.65,
        "combo_uptake": 0.45
    }
}

# IA recomienda
recommendation = model.suggest_upsell(client_profile)
→ "Beard Trim (65% de clientes como él lo hacen)"
```

---

## 6. Predicción de No-Shows

### Ubicación
Badge en "ACTIVIDAD RECIENTE":

```
Cliente: Carlos García - Tomorrow 14:00
Status: SCHEDULED
⚠️ No-show Risk: 23%
   [Enviar Recordatorio]
```

### Datos de Entrada
```python
appointment_features = {
    "client_no_show_history": 1,
    "days_until_appointment": 1,
    "time_of_day": "afternoon",
    "booking_method": "phone",
    "payment_status": "unpaid"
}

# Modelo predice probabilidad
no_show_risk = model.predict_no_show(appointment_features)
→ 0.23 (23% riesgo)

# Automatizar recordatorio
if no_show_risk > 0.20:
    send_reminder_sms()
```

---

## 7. Análisis de Sentimiento (Future)

### Concepto
Integrar reviews/comentarios de clientes en alertas:

```
📊 Satisfacción
├─ Rating promedio: 4.8/5 ✅
├─ Sentiment trending: ↑ (+8% vs mes anterior)
│
└─ Feedback negativo reciente:
   "Espera muy larga" (3 menciones)
   → Suggestion: Agendar más slots
```

---

## 🔧 Stack Técnico Recomendado

### Opciones de IA

| Solución | Costo | Latencia | Complejidad |
|----------|-------|----------|------------|
| **OpenAI GPT-4** | $0.15/req | <1s | Baja |
| **Hugging Face** | $0/self-hosted | 2-5s | Media |
| **Custom ML** | Dev hours | Variable | Alta |
| **Auto-ML** | $50-500/mes | <1s | Baja |

**Recomendación:** Começar con OpenAI GPT-4 (llamadas simples), luego migrar a custom ML si necesario.

### Implementación

```typescript
// src/lib/ai/client.ts
export class AIInsights {
  constructor(private openai: OpenAI) {}
  
  async generateAlerts(metrics: DashboardMetrics) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de análisis de negocio para barbería"
        },
        {
          role: "user",
          content: JSON.stringify(metrics)
        }
      ]
    })
    
    return parseAlerts(response.content)
  }
}

// src/components/dashboard/AIInsights.tsx
export async function AIInsights({ metrics }: Props) {
  const insights = await ai.generateAlerts(metrics)
  
  return (
    <section>
      <h2>💡 Insights Impulsados por IA</h2>
      {insights.map(insight => <Alert key={insight.id} {...insight} />)}
    </section>
  )
}
```

---

## 📊 Impacto Esperado

### Con IA integrada:

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tiempo decisión | 10 min | <1 min | **90% más rápido** |
| Ocupación | 70% | 85% | **+21% ingresos** |
| Satisfacción | 4.5/5 | 4.8/5 | **+7% retención** |
| Churn | 15% | 8% | **-47% abandono** |

---

## 🚀 Roadmap de Implementación

```
Fase 1 (Mes 1-2): Predicción de demanda
├─ Recolectar datos históricos
├─ Entrenar modelo simple
└─ Dashboard con forecast de ocupación

Fase 2 (Mes 2-3): Riesgo de cliente
├─ Scoring de churn
├─ Alertas automáticas
└─ Contacto automático (WhatsApp)

Fase 3 (Mes 3-4): Optimización de precio
├─ Dynamic pricing por servicio/timeslot
├─ A/B testing de precios
└─ Impacto en revenue

Fase 4 (Mes 4+): Mejoras Futuras
├─ Rebalanceo de personal
├─ Sugerencias de cross-sell
├─ Análisis de satisfacción
└─ Predicción de no-shows
```

---

## 💡 Conclusión

Las capacidades de IA aquí descritas transforman el dashboard de **reportero de datos** a **asesor de negocio**. No solo muestra "qué pasó", sino **"qué debe pasar"**.

**Próximo paso:** Empezar con una integración simple (OpenAI API) para predecir demanda. Validar valor con el cliente. Luego expandir.

---

*Documento preparado por Elvis Barber Studio AI Planning 🤖*
