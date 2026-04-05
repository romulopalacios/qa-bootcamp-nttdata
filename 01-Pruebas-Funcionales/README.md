# 📋 Módulo 1: Pruebas Funcionales y Diseño de Casos

Este módulo documenta mis competencias funcionales en QA, evidenciando el paso de las metodologías formales de testing a su implementación práctica, estructurado como un portafolio.

## 1. Teoría recibida

En esta etapa consolidé bases metodológicas orientadas a estandarizar y maximizar la cobertura de escenarios de prueba, fundamentado en:

- **Estandarización ISTQB:** Comprensión de los 7 Principios de las Pruebas y los diferentes Niveles (Unitarias, Integración, Sistema, UAT), con fuerte énfasis en el Shift-Left Testing.
- **Técnicas de Caja Negra:** Reducción de redundancia en casos de prueba mediante la aplicación de:
  - Partición de Equivalencia (PE).
  - Análisis de Valores Frontera (AVF).
  - Tablas de Decisión y Transición de Estados.
- **Behavior-Driven Development (BDD):** Enfoque guiado por comportamiento usando la sintaxis de Gherkin (`Dado`, `Cuando`, `Entonces`), construyendo escenarios declarativos que funcionan como documentación viva en el ciclo de vida ágil.

## 2. Práctica aplicada en el bootcamp

La base teórica se tradujo en artefactos y entregables durante el programa, enfocados en el diseño eficiente y en la clarificación de requerimientos de negocio:

- **Diseño de Escenarios Efectivos:** Redacción de casos sin ambigüedades, evitando el enfoque imperativo en interfaces gráficas, priorizando reglas de negocio.
- **Uso Avanzado de Gherkin:** Implementación de `Antecedentes` (Backgrounds) y `Esquemas de escenario` (Scenario Outlines) para parametrizaciones mediante tablas de datos (Data Tables), optimizando el tiempo y facilitando la automatización posterior.

*(Los PDFs y artefactos documentales del Bootcamp generados durante las sesiones se encuentran contenidos en este directorio)*.

## 3. Práctica aplicada a mis propios desarrollos

Para demostrar el valor real de estas prácticas, integré estas metodologías de testing directo al diseño de mis propios proyectos:

### Caso 1: E-commerce de Muebles "Kabu"
Utilicé técnicas de **Caja Negra** para validar lógicas de negocio complejas en carritos de compra:
- **Análisis de Valores Frontera (AVF):** Validación estricta de límites de descuentos por volumen (por ej. pruebas en el borde del valor de envío gratuito).
- **Partición de Equivalencia:** Agrupación de clases válidas e inválidas para procesar reglas de cupones, disminuyendo pruebas exhaustivas sin impacto en la cobertura.

### Caso 2: Sistema de Gestión de Transporte (Autenticación y Aforo)
Implementé **BDD con Gherkin** para transparentar reglas críticas del transporte de cooperativas:

```gherkin
Característica: Asignación de rutas y control de aforo
  Como administrador de la cooperativa
  Quiero gestionar las rutas entre Montecristi y la ULEAM
  Para asegurar que los buses no superen su capacidad máxima

  Escenario: Alerta de aforo máximo alcanzado en horario pico
    Dado que el bus "Unidad 05" tiene una capacidad máxima de "40" pasajeros
    Y la ruta actual es "Montecristi - ULEAM"
    Cuando el sistema registra el ingreso del pasajero número "41"
    Entonces el sistema debe bloquear la emisión de nuevos boletos
    Y mostrar la alerta "Capacidad máxima excedida" al despachador
```

Estas metodologías fortalecen mi criterio como QA, demostrando que poseo tanto el vocabulario y contexto formal (ISTQB/BDD), como la experiencia para aterrizarlo directamente al desarrollo de productos.