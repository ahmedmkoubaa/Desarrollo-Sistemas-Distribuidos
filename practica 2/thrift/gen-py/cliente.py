from calculadora import Calculadora

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from calculadora.ttypes import *

try:
    transport = TSocket.TSocket("localhost", 9090)
    transport = TTransport.TBufferedTransport(transport)
    protocol = TBinaryProtocol.TBinaryProtocol(transport)

    client = Calculadora.Client(protocol)

    transport.open()

    print("hacemos ping al server")
    client.ping()

    resultado = client.suma(1, 1)
    print("1 + 1 = " + str(resultado))

    resultado = client.resta(1, 1)
    print("1 - 1 = " + str(resultado))

    resultado = client.multiplica(1, 1)
    print("1 * 1 = " + str(resultado))

    resultado = client.divide(1, 1)
    # resultado = client.divide(1, 0) # Para generar una excepcion
    print("1 / 1 = " + str(resultado))

    lista = [1, 2, 3, 4, 5]
    # lista = [] # Para generar una excepcion

    resultado = client.media(lista)
    print("La media de 1 a 5 es: " + str(resultado))

    l1 = [1.91, 2.71, 7.21, 4.12, 9.13]
    l2 = [3.21, 4.25, 5.11, 5.64, 5.94]

    # l2[0] = 0     # Para generar una excepcion

    print("l1: \t" + str(l1))
    print("l2: \t" + str(l2))

    resultado = client.sumaListas(l1, l2)
    print("Suma: \t" + str(resultado))

    # ------------------------------------------------------------------------ #
    # Usaremos a continuacion operaciones con estructuras de datos mas complejas

    operacion = OperacionListas()
    print(operacion)

    operacion.l1 = l1
    operacion.l2 = l2
    print(operacion)

    operacion.tipo = TipoOperacion.SUMA
    resultado = client.operaListas(operacion)
    print("Operacion suma: " + str(resultado))

    operacion.tipo = TipoOperacion.RESTA
    resultado = client.operaListas(operacion)
    print("Operacion resta: " + str(resultado))

    operacion.tipo = TipoOperacion.MULTIPLICACION
    resultado = client.operaListas(operacion)
    print("Operacion multiplicacion: " + str(resultado))

    operacion.tipo = TipoOperacion.DIVISION
    # operacion.tipo = 7
    resultado = client.operaListas(operacion)
    print("Operacion division: " + str(resultado))

    transport.close()
except OperacionInvalida as oper:
    print("Hubo un error con codigo '" + str(oper.idOper) + "' y mensaje '" + oper.msg + "'")
