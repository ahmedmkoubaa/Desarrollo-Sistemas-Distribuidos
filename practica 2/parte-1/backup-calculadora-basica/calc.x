/*Definir tipos de datos*/
struct Operacion {
	float operando1;
	float operando2;
};

/*Definir programas a usar*/
program CALCPROG {
	version CALCVER {
		double SUMAR(Operacion) 		= 1;
		double RESTAR(Operacion) 		= 2;
		double MULTIPLICAR(Operacion) = 3;
		double DIVIDIR(Operacion) 		= 4;
	}											= 1;
}												= 0x21000155;


/*AMPLIACION

struct Operacion {
	float operando1;
	float operando2;
};

Struct Vector {
	const int MAX = 255;
	double datos[MAX];
};

program CALCPROG {
	version CALCVER {
		double SUMAR(Operacion) 		= 1;
		double RESTAR(Operacion) 		= 2;
		double MULTIPLICAR(Operacion) = 3;
		double DIVIDIR(Operacion) 		= 4;

		double MEDIA_VECTOR(Vector)	= 5;
		double MULTIPLICAR_ESCALAR(Vector, double) = 6;

	}											= 1;
}												= 0x21000155;


*/
