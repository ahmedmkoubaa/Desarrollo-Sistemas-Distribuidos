const MAX = 255;

struct Operacion {
	float operando1;
	float operando2;
};

struct Vector {
	int size;
	double datos[MAX];
};

program CALCPROG {
	version CALCVER {
		double SUMAR(Operacion) 						 = 1;
		double RESTAR(Operacion) 						 = 2;
		double MULTIPLICAR(Operacion) 				 = 3;
		double DIVIDIR(Operacion) 						 = 4;

		double MEDIA_VECTOR(Vector)					 = 5;
		Vector MULTIPLICAR_ESCALAR(Vector, double) = 6;

	}											= 1;
}												= 0x21000000;
