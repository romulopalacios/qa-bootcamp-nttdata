# Billetera Digital Enterprise

Este proyecto es una solución completa de **Billetera Digital** diseñada con una arquitectura de microservicios. Incluye una aplicación web (Simulador), especificaciones de API, y backend funcional.

## 📋 Características

*   **Simulador Móvil:** UI en React (Puerto 5173).
*   **Microservicios:**
    *   **Auth Service:** Puerto 4001.
    *   **Wallet Service:** Puerto 4002.
    *   **Transaction Service:** Puerto 4003.
*   **Persistencia:** PostgreSQL.

---

## 🚀 Guía de Despliegue (Todo en Uno)

La aplicación completa (Frontend + Backend + DB) se levanta con Docker Compose.

### 1. Requisitos Previos
*   Tener instalado **Docker Desktop** y que esté corriendo.

### 2. Configuración
Verifica que exista el archivo `config.json` en la raíz (se usa para compartir secretos y puertos).

### 3. Levantar el Entorno

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose up -d
```

Espera unos segundos a que los contenedores descarguen las imágenes e instalen las dependencias (npm install se ejecuta al iniciar).

### 4. Acceder

*   **Aplicación Web (Simulador):** [http://localhost:5173](http://localhost:5173)
*   **API Auth:** [http://localhost:4001](http://localhost:4001)

---

## 🧪 Pruebas de API (Postman)

Se incluye `postman_collection.json` en la raíz. Importa este archivo en Postman para probar los endpoints del backend directamente.

## 📁 Estructura del Proyecto

*   `/` : Código del Frontend (React/Vite).
*   `/auth-service` : Microservicio de Usuarios.
*   `/wallet-service` : Microservicio de Saldos.
*   `/transaction-service` : Microservicio de Transferencias.
*   `docker-compose.yml` : Orquestación de contenedores.
