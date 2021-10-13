const MAX = 255;

struct Operacion {
	float operando1;
	float operando2;
};

struct Vector {
	int size;
	double datos[MAX];
};

union basica_res switch (int errno) {
	case 0: double result;
	default: void;
};

union compleja_res_media switch (int errno) {
	case 0: double result;
	default: void;
};

union compleja_res_vector switch (int errno) {
	case 0: Vector result;
	default: void;
};

union concurrente_res switch (int errno) {
	case 0: long result;
	default: void;
};

program CALCPROG {
	version CALCVER {
		basica_res SUMAR(Operacion) 					 = 1;
		basica_res RESTAR(Operacion) 					 = 2;
		basica_res MULTIPLICAR(Operacion) 			 = 3;
		basica_res DIVIDIR(Operacion) 				 = 4;

		compleja_res_media MEDIA_VECTOR(Vector)	 = 5;
		compleja_res_vector MULTIPLICAR_ESCALAR(Vector, double) = 6;

		concurrente_res SUMATORIA(int n) 			 = 7;

	}											= 1;
}												= 0x21000000;
