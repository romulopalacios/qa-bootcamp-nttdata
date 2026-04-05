# Modulo 4: Pruebas Automatizadas (Web & API)

Este modulo expone mis capacidades como QA Automation Engineer, demostrando el paso desde pruebas manuales hacia la implementacion de frameworks automatizados escalables y mantenibles. Abarca tanto validaciones de interfaz de usuario (Web UI) como la automatizacion del backend (API RESTful).

## 1. Estrategia y Enfoque

En la ingenieria de calidad actual, la automatizacion indiscriminada genera costos de mantenimiento altos. Mi enfoque se basa en estructurar los scripts bajo patrones de diseno solidos:

- **Page Object Model (POM):** Abstraccion de la interfaz grafica en clases independientes para desacoplar los locators (XPath/CSS) de los casos de prueba, permitiendo mantenibilidad y reduciendo duplicacion de codigo.
- **Data-Driven Testing:** Separacion de los datos de prueba de los tests en si, permitiendo ejecutar un mismo flujo con multiples conjuntos de entrada.
- **Behavior-Driven Development (BDD):** Uso de Gherkin para que la capa de reglas de negocio en la automatizacion sea entendible tanto tecnica como funcionalmente.

## 2. Automatizacion API (Karate Framework)

**Situacion:** Validar iterativamente endpoints REST de diferentes servicios backends, asegurando sus contratos y tiempos de respuesta sin dependencia inicial del front.

**Accion técnica:** 
- Implementacion de scripts `.feature` para automatizar aserciones de codigos HTTP (200, 201, 400).
- Verificacion dinamica de estructuras JSON empleando 'fuzzy matchers'.
- Asercion y chaining de llamadas (ej: extraer un Token de un endpoint POST para autenticar un GET consecutivo).

**Evidencias (ver carpeta `/EXAMEN-AUTOMATIZACION` y `/Karate-API/`):**
- Proyectos Maven estructurados.
- Scenarios enfocados en validacion rapida y profunda de la capa de servicios.

## 3. Automatizacion Web UI (Selenium)

**Situacion:** Asegurar flujos e-to-e criticot en aplicaciones web para reducir el tiempo de regresion del equipo antes de cada release.

**Accion tecnica:**
- Uso de Selenium WebDriver para interactuar con elementos DOM (Selectores relativos, XPath customizados).
- Implementacion del patron **Page Object Model (POM)**.
- Manejo asincrono y pausas de estabilizacion frente a cargas de SPA (Single Page Applications).
- Validacion de aserciones en los ultimos pasos del user journey, garantizando que el flujo funcional coincida con los CR (Criterios de Aceptacion).

**Evidencia (ver carpeta `/Evaluación de Automatización Web/`):** 
Scripts de testing web organizados, implementados con orientacion a objetos, comprobando capacidad para mantener suites de regresion.