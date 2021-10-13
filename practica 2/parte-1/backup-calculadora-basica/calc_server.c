/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calc.h"

double *
sumar_1_svc(Operacion * arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos sumando\n");
	result = arg1->operando1 + arg1->operando2;

	return &result;
}

double *
restar_1_svc(Operacion * arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos restando\n");
	result = arg1->operando1 - arg1->operando2;
	return &result;
}

double *
multiplicar_1_svc(Operacion * arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos multiplicando\n");
	result = arg1->operando1 * arg1->operando2;
	return &result;
}

double *
dividir_1_svc(Operacion * arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos dividiendo\n");
	result = arg1->operando1 / arg1->operando2;
	return &result;
}
