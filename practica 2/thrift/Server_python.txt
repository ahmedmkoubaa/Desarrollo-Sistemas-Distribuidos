import glob
import sys

from calculadora import Calculadora

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer
from calculadora.ttypes import *

import logging

logging.basicConfig(level=logging.DEBUG)


class CalculadoraHandler:
    def __init__(self):
        self.log = {}

    def suma(self, n1, n2):
        print("sumando " + str(n1) + " con " + str(n2))
        return n1 + n2

    def resta(self, n1, n2):
        print("restando " + str(n1) + " con " + str(n2))
        return n1 - n2

    def multiplica(self, n1, n2):
        print("multiplicando " + str(n1) + " por " + str(n2))
        return n1 * n2

    def divide(self, n1, n2):
        if (n2 == 0):
            raise OperacionInvalida(TipoOperacion.DIVISION, "No se puede dividir entre 0")

        print("dividiendo " + str(n1) + " entre " + str(n2))
        return n1 / n2

    def media(self, lista):
        if (len(lista) == 0):
            raise OperacionInvalida(TipoOperacion.MEDIA,
                "No se pudo hacer media porque la lista no contiene elementos")
        media = 0

        for elemento in lista:
            media += elemento

        media /= len(lista)

        print("calculando la media")
        return media

    def sumaListas(self, l1, l2):
        operacion = OperacionListas()
        operacion.l1 = l1
        operacion.l2 = l2
        operacion.tipo = TipoOperacion.SUMA
        return self.operaListas(operacion)

    def operaListas(self, operacion):
        print("Operando dos listas")

        listaOperada = []

        l1   = operacion.l1
        l2   = operacion.l2
        tipo = operacion.tipo


        if (len(l1) > len(l2)):
            final = len(l2)
        else:
            final = len(l1)

        for i in range(0, final):
            dato1 = l1[i]
            dato2 = l2[i]

            if (tipo == TipoOperacion.SUMA):
                resultado = self.suma(dato1, dato2)
            elif (tipo == TipoOperacion.RESTA):
                resultado = self.resta(dato1, dato2)
            elif (tipo == TipoOperacion.MULTIPLICACION):
                resultado = self.multiplica(dato1, dato2)
            elif (tipo == TipoOperacion.DIVISION):
                try:
                    resultado = self.divide(dato1, dato2)
                except OperacionInvalida as failure:
                    raise failure
            else:
                raise OperacionInvalida(tipo, "Operacion no reconocida")

            listaOperada.append(resultado)

        return listaOperada

    def ping(self):
        print("Me han hecho ping")
        return "Soy el servidor en python"


if __name__ == "__main__":
    handler = CalculadoraHandler()
    processor = Calculadora.Processor(handler)
    transport = TSocket.TServerSocket(host="127.0.0.1", port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print("iniciando servidor...")
    server.serve()
    print("fin")
