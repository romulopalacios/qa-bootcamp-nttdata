# language: es
Característica: Gestión de aforo y asignación de rutas en buses
  Como administrador de la cooperativa de transporte
  Quiero controlar la asignación de pasajeros en las rutas
  Para garantizar que ningún bus exceda su capacidad máxima permitida por la ley

  Antecedentes:
    Dado que el sistema de gestión de rutas está inicializado
    Y existe un bus "Unidad 05" registrado con capacidad máxima de 40 pasajeros
    Y la ruta "Montecristi - ULEAM" está activa para la fecha actual

  Escenario: Venta exitosa cuando el bus tiene asientos disponibles
    Dado que la "Unidad 05" tiene 39 boletos vendidos en la ruta "Montecristi - ULEAM"
    Cuando el despachador registra la venta de 1 boleto adicional
    Entonces el sistema confirma la venta exitosamente
    Y la "Unidad 05" cambia su estado a "Aforo Completo"

  Esquema del escenario: Bloqueo de ventas al superar la capacidad máxima
    Dado que la "Unidad 05" tiene <asientos_vendidos> boletos vendidos en la ruta "Montecristi - ULEAM"
    Cuando el despachador intenta registrar la venta de <boletos_a_vender> boleto(s) adicional(es)
    Entonces el sistema debe rechazar la transacción
    Y mostrar el mensaje de error "<mensaje_esperado>"
    Y el total de boletos vendidos debe mantenerse en <asientos_vendidos>

    Ejemplos:
      | asientos_vendidos | boletos_a_vender | mensaje_esperado                                  |
      | 40                | 1                | Capacidad máxima excedida. No hay asientos libres |
      | 39                | 2                | La venta supera los asientos disponibles          |

  Escenario: Liberación de asiento por cancelación de boleto
    Dado que la "Unidad 05" tiene 40 boletos vendidos (Aforo Completo)
    Cuando un pasajero cancela su boleto con 2 horas de anticipación
    Entonces el sistema debe liberar un asiento
    Y la "Unidad 05" cambia su estado a "Disponible"
    Y permite la venta de 1 nuevo boleto