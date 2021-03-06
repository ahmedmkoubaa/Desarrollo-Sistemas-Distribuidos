/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calc.h"

void mostrarVector (const Vector * vector){
	// Recorrer vector mostrando elementos uno a uno
	for (int i = 0; i < vector->size; i++){
		printf("%f ", vector->datos[i]);
	}
	printf("\n");
}

double *
sumar_1_svc(Operacion arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos sumando\n");
	result = arg1.operando1 + arg1.operando2;

	return &result;
}

double *
restar_1_svc(Operacion arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos restando\n");
	result = arg1.operando1 - arg1.operando2;
	return &result;
}

double *
multiplicar_1_svc(Operacion arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos multiplicando\n");
	result = arg1.operando1 * arg1.operando2;
	return &result;
}

double *
dividir_1_svc(Operacion arg1,  struct svc_req *rqstp)
{
	static double  result;

	printf("Estamos dividiendo\n");
	result = arg1.operando1 / arg1.operando2;

	return &result;
}

double *
media_vector_1_svc(Vector vector,  struct svc_req *rqstp)
{
	static double result = 0;
	double suma_parcial = 0;

	printf("Realizando media de vector\n");
	for (int i = 0; i < vector.size; ++i) suma_parcial += vector.datos[i];
	result = suma_parcial/vector.size;

	return &result;
}

Vector *
multiplicar_escalar_1_svc(Vector vector, double escalar,  struct svc_req *rqstp)
{
	static Vector result;

	printf("Estamos haciendo una multiplicación por escalar\n");
	for (int i = 0; i < vector.size; i++) vector.datos[i] *= escalar;

	result = vector;
	return &result;
}

