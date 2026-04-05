# Matriz de Diseño de Casos de Prueba - E-commerce "Kabu"

Este documento evidencia la aplicación de técnicas de **Caja Negra** (Análisis de Valores Frontera y Partición de Equivalencia) para optimizar la cobertura de pruebas en el módulo de carrito de compras del E-commerce "Kabu".

## 1. Regla de Negocio: Envío Gratuito
**Requisito:** Los pedidos con un subtotal igual o superior a $50.00 aplican para "Envío Gratuito". Pedidos por debajo de este monto tienen un recargo fijo de $5.00.

### Aplicación de Análisis de Valores Frontera (AVF)
Se determinan los límites exactos de la condición para asegurar que el sistema cambie de comportamiento correctamente en el umbral.

| ID Caso | Partición / Límite | Subtotal del Carrito | Resultado Esperado | Severidad |
| :--- | :--- | :--- | :--- | :--- |
| TC-KABU-001 | Justo debajo del límite (Inválido para envío gratis) | $49.99 | Aplica recargo de envío ($5.00). Total: $54.99 | Alta |
| TC-KABU-002 | Límite exacto (Válido para envío gratis) | $50.00 | Costo de envío $0.00. Total: $50.00 | Alta |
| TC-KABU-003 | Justo arriba del límite (Válido) | $50.01 | Costo de envío $0.00. Total: $50.01 | Media |
| TC-KABU-004 | Valor Cero o Negativo (Edge case) | $0.00 | Error: "El carrito no puede estar vacío" | Media |

---

## 2. Regla de Negocio: Aplicación de Cupones de Descuento
**Requisito:** El sistema permite ingresar un código promocional. Solo los cupones activos del tipo "Verano20" otorgan un 20% de descuento. Cupones expirados o mal escritos deben ser rechazados sin alterar el subtotal.

### Aplicación de Partición de Equivalencia (PE)
Se dividen los posibles inputs en clases de equivalencia para probar un representante de cada clase en lugar de agotar todas las combinaciones posibles.

**Clases Válidas e Inválidas:**
*   **PE Válida 1:** Cupón activo y bien escrito.
*   **PE Inválida 1:** Cupón expirado.
*   **PE Inválida 2:** Cupón inventado/inexistente.
*   **PE Inválida 3:** Input vacío o caracteres especiales.

| ID Caso | Clase de Equivalencia (Input) | Código Ingresado | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| TC-KABU-005 | PE Válida 1 (Cupón exitoso) | `VERANO20` | Mensaje: "Cupón aplicado". Subtotal se reduce 20%. |
| TC-KABU-006 | PE Inválida 1 (Cupón expirado) | `INVIERNO19` | Error: "Cupón expirado". Subtotal sin cambios. |
| TC-KABU-007 | PE Inválida 2 (Cupón inexistente) | `RANDOMXYZ` | Error: "Cupón no válido". Subtotal sin cambios. |
| TC-KABU-008 | PE Inválida 3 (Caracteres especiales) | `<script>alert(1)</script>` | Error de validación de campo (Prevención XSS). |

---
*Nota: Esta matriz representa la etapa de diseño de casos ("Test Design") y sirve como insumo previo a la automatización de la interfaz de usuario con Selenium o Cypress.*