/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calc.h"
#include <stdlib.h>


double
calcprog_1(char *server, Operacion * operandos, char operando)
{
	CLIENT *clnt;
	double * result_final;

#ifndef	DEBUG
	clnt = clnt_create (server, CALCPROG, CALCVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (server);
		exit (1);
	}
#endif	/* DEBUG */

	switch (operando) {
		case '+': result_final = sumar_1(operandos, clnt); 				break;
		case '-': result_final = restar_1(operandos, clnt); 				break;
		case 'x': result_final = multiplicar_1(operandos, clnt); break;
		case '/': result_final = dividir_1(operandos, clnt); 			break;

		default: printf("Operando erróneo %c\n", operando); exit(EXIT_FAILURE); 			break;
	}

	if (result_final == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}

#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */

	return *result_final;
}


int
main (int argc, char *argv[])
{
	char *server;						// Declarar variable que guardara la ip del server
	Operacion operandos;				// Para almacenar los operandos de la operacion

	if (argc < 5) {
		printf ("usage: %s <server ip or DNS> <operando 1> <operador> <operando 2>\n", argv[0]);
		exit (1);
	}

	server = argv[1];												// Obtener direccion ip
	operandos.operando1 = atof(argv[2]);					// Obtener primer operando
	operandos.operando2 = atof(argv[4]);					// Obtener segundo operando
	char operador = argv[3][0];								// Obtener operador (solo un caracter)

	double resultado = calcprog_1 (server, &operandos, operador);			// Ejecutar en servidor, con direccion, operandos y operador
	printf("El resultado es: %f\n", resultado);									// Mostrar resultado por pantalla

	exit (0);
}
