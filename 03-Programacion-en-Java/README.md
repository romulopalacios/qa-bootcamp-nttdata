# Modulo 3: Programacion en Java (Core para Automatizacion)

Este modulo expone mi base algoritmica y dominio de la Programacion Orientada a Objetos (POO), pilares fundamentales para trascender del enfoque *Record & Playback* hacia la construccion de frameworks de automatizacion robustos, mantenibles y escalables (SDET/QA Automation Engineer).

## 1. Patrones y Programacion Orientada a Objetos (POO)

En el desarrollo de software orientado a la calidad, un framework de pruebas es en si mismo un proyecto de software. Mi dominio de Java se centra en aplicar buenas practicas para el testing:

- **Encapsulamiento e Interfaces:** Utilizados extensivamente al modelar *Page Objects* o *Componentes de UI* para ocultar los localizadores (XPath/CSS) y exponer unicamente metodos de accion. Esto abstrae la complejidad y previene el codigo espagueti en los *Test Scripts*.
- **Herencia y Polimorfismo:** Implementados para crear clases base (como `BaseTest` o `BasePage`) que agrupan comportamientos comunes (inicializacion de WebDriver, configuraciones, teardowns), respetando el principio DRY (Don't Repeat Yourself).
- **Manejo de Colecciones (Collections):** Uso de `List`, `Map` y `Set` para el parseo de datos de prueba, implementacion de *Data-Driven Testing*, y la iteracion al realizar aserciones multiples (ej. validar que una tabla entera en la UI coincida con datos en base de datos).

## 2. Resolucion de Problemas y Control de Excepciones

**Situacion:** Los scripts de automatizacion suelen ser fragiles (*flaky tests*) si no tienen un manejo de errores robusto ante demoras en el DOM o fallos inesperados en la API.

**Accion técnica:**
- Estructuracion de control de excepciones (`try-catch-finally`) personalizado.
- En lugar de detener la suite entera por un `NoSuchElementException` o un `TimeoutException`, la logica permite capturar el error, generar evidencias visuales (screenshots), emitir logs descriptivos al reporte de pruebas y limpiar el hilo de ejecucion antes de que corra el siguiente escenario.

## 3. Evidencia Practica

En el directorio `/src/` se encuentra expuesto el codigo fuente y algoritmos desarrollados como cimientos logicos. 
Esta base certifica mi resolucion de problemas a nivel back-end, y garantiza que poseo las herramientas arquitectonicas necesarias para inyectar logica avanzada, manipular repositorios de prueba (Base de datos o JSON), y orquestar herramientas complejas del stack QA como Selenium y RestAssured.