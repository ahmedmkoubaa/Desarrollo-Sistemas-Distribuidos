/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calc_concurrente.h"

int *
sumatoria_auxiliar_1_svc(int inicio, int final,  struct svc_req *rqstp)
{
	static int  result;

	printf("Estamos calculando el factorial en el auxiliar\n");
	printf("Inicio es %d y final es %d\n", inicio, final);
	int res = 0;
	for (int i = inicio; i <= final; i++) {
		res += i;
		printf("resultado en auxiliar: %d\n", res);
	}

	result = res;
	return &result;
}
