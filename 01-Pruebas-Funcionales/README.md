# 📋 Módulo 1: Pruebas Funcionales y Diseño de Casos

En este módulo del QA Innovation Lab de NTT Data, nos enfocamos en establecer bases sólidas de Quality Assurance basadas en el estándar **ISTQB (Certified Tester Foundation Level)** y en la adopción de metodologías ágiles a través de **BDD (Behavior-Driven Development)** usando **Gherkin**.

El objetivo principal no es solo "encontrar bugs", sino entender el ciclo de vida de las pruebas, aplicar técnicas formales de diseño y comunicar el comportamiento esperado del software de manera clara entre el negocio y el equipo técnico.

---

## 🧠 1. Fundamentos y Principios de Pruebas (ISTQB)
Comprender la teoría detrás del testing es fundamental para optimizar esfuerzos. En este módulo interioricé los **7 Principios de las Pruebas**, entre los que destaco:
* **Las pruebas tempranas ahorran tiempo y dinero:** Involucrar a QA desde la fase de requisitos (Shift-Left Testing).
* **Agrupación de defectos (Regla 80/20):** Un pequeño número de módulos suele contener la mayoría de los defectos.
* **La paradoja del pesticida:** Si se repiten las mismas pruebas, dejarán de encontrar nuevos defectos; los casos deben revisarse y actualizarse constantemente.
* **La falacia de la ausencia de errores:** Un sistema sin defectos visibles no sirve de nada si no cumple con las necesidades del usuario y del negocio.

## 🏗️ 2. Niveles de Pruebas
Aprendí a clasificar las pruebas según la etapa del desarrollo en la que nos encontramos:
1. **Pruebas de Componente (Unitarias):** Aislamiento de piezas de código.
2. **Pruebas de Integración:** Verificación de la comunicación entre componentes o sistemas.
3. **Pruebas de Sistema:** Validación del comportamiento global del producto.
4. **Pruebas de Aceptación (UAT):** Validación final por parte del usuario o cliente para asegurar que el sistema satisface sus necesidades.

## 🛠️ 3. Técnicas de Diseño de Pruebas (Caja Negra)
Para dejar de probar "a ciegas" o basarme solo en la intuición, apliqué técnicas de diseño que garantizan una mayor cobertura con menor cantidad de casos redundantes:
* **Partición de Equivalencia (PE):** Dividir los datos de entrada en clases donde se espera que el sistema actúe igual.
* **Análisis de Valores Frontera (AVF):** Probar los límites de las particiones de equivalencia, donde ocurren la mayoría de los errores.
* **Tablas de Decisión:** Útiles para documentar reglas de negocio complejas con múltiples combinaciones de condiciones.
* **Transición de Estados:** Pruebas enfocadas en cómo el sistema cambia de un estado a otro mediante eventos.

## 🥒 4. Behavior-Driven Development (BDD) y Gherkin
Gran parte del módulo se centró en cómo escribir escenarios de prueba efectivos que sirvan como documentación viva. Aprendí a redactar bajo el estándar **Gherkin** utilizando sus lineamientos prácticos y las *7 Cualidades de Escenarios Altamente Efectivos*.

### Reglas clave aplicadas:
* **Enfoque Declarativo vs Imperativo:** Describir el *comportamiento* y la regla de negocio, NO los clics en la interfaz de usuario (evitar "Hago clic en el botón X y luego en Y").
* **Uso correcto de la sintaxis:** `Dado` (Contexto/Precondición), `Cuando` (Acción), `Entonces` (Resultado Esperado), y conectores `Y` / `Pero`.
* **Uso de Backgrounds y Scenario Outlines:** Para evitar la repetición de pasos comunes y parametrizar pruebas con tablas de datos.

### Ejemplo de mi redacción en Gherkin:
```gherkin
Característica: Autenticación de usuarios en el portal de la cooperativa
  Como conductor registrado
  Quiero iniciar sesión en el sistema
  Para poder visualizar mis rutas asignadas

  Esquema del escenario: Inicio de sesión exitoso con credenciales válidas
    Dado que el usuario se encuentra en la página de inicio de sesión
    Cuando ingresa su "<usuario>" y "<contraseña>"
    Y confirma la acción de acceso
    Entonces el sistema redirige al panel principal
    Y muestra un mensaje de bienvenida para el "<usuario>"

    Ejemplos:
      | usuario    | contraseña  |
      | chofer_01  | Acceso123* |
      | admin_rutas| Admin456$   |

## 💼 5. Aplicación Práctica en Proyectos

Para consolidar la teoría adquirida en el bootcamp, apliqué estas metodologías de testing en la conceptualización y diseño de pruebas de proyectos reales:

### Caso 1: E-commerce de Muebles "Kabu"
Utilicé técnicas de **Caja Negra** para validar las reglas de negocio del carrito de compras y la pasarela de pagos.
* **Análisis de Valores Frontera (AVF):** Diseñé pruebas para validar los límites de descuentos por volumen de compra (ej. qué pasa si el cliente compra exactamente el límite para envío gratis, un centavo menos, o un centavo más).
* **Partición de Equivalencia:** Categoricé los tipos de tarjetas de crédito y cupones de descuento en clases válidas e inválidas para reducir la cantidad de pruebas exhaustivas sin perder cobertura.

### Caso 2: Sistema de Gestión de Transporte
Implementé **BDD con Gherkin** para alinear los requisitos del sistema con el comportamiento esperado por los choferes y administradores de rutas. 

*A continuación, un ejemplo de cómo documenté las reglas de negocio mediante tablas de decisión y escenarios:*

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