# Modulo 2: Pruebas de Servicios (API Testing)

Este modulo documenta mis competencias en QA de APIs, no solo como teoria, sino como evidencia practica y aplicacion real en proyectos propios.

## 1. Teoria recibida

En esta parte demuestro la base conceptual adquirida en el bootcamp:

- Fundamentos de pruebas de servicios y contratos API.
- Diferencias y estrategia de validacion para REST (JSON) y SOAP (XML).
- Lectura de contratos OpenAPI/Swagger para derivar cobertura.
- Criterios de calidad en APIs: codigos HTTP, estructura de respuesta, tiempos de respuesta y manejo de errores.

Herramientas estudiadas:

- Postman (colecciones, environments, scripts de pre-request y tests).
- Swagger/OpenAPI (analisis de contratos YAML).
- Karate Framework (enfoque BDD para automatizacion API).
- Docker (levantamiento de entornos para pruebas locales).

## 2. Practica aplicada en el bootcamp

Aqui se encuentran los entregables que evidencian la ejecucion tecnica del modulo:

- Contrato de API: Practica/CRUD Books and Users API.yaml
- Coleccion de pruebas: Practica/Examen-Wallet-QA.postman_collection.json
- Entorno de ejecucion: Practica/walllet-test.postman_environment.json

Actividades realizadas:

- Diseno y ejecucion de pruebas CRUD sobre endpoints REST.
- Validacion de codigos de estado esperados y no esperados.
- Comprobacion de estructura y contenido de payloads.
- Parametrizacion de pruebas con variables de entorno.
- Preparacion de colecciones para regresion y reutilizacion.

## 3. Practica aplicada a mis propios desarrollos

En mis proyectos personales/full-stack aplico este mismo enfoque para asegurar calidad desde backend:

- Defino casos de prueba a partir de contratos API antes de integrar frontend.
- Verifico que los endpoints cumplan reglas de negocio y esquemas de datos.
- Incorporo validaciones de error handling y tiempos de respuesta.
- Uso colecciones reutilizables para smoke tests y regresion.

Resultado: esta carpeta funciona como portafolio tecnico, porque conecta conocimiento teorico, evidencia ejecutada y aplicacion en escenarios reales de desarrollo.