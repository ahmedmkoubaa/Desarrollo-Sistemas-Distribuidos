const MAX= 255; /* longitud maxima de la entrada directorio */
typedef string nametype<MAX>; /* entrada directorio */
typedef struct namenode *namelist; /* enlace en el listado */

struct namenode {
	nametype name; /* nombre de la entrada de directorio */
	namelist next ; /* siguiente entrada */
};

/*DEFINIR AQUÍ ESTRUCTURAS DE DATOS USADAS*/

/* la siguiente union se utiliza para discriminar entre llamadas con exito y llamadas con errores */
union readdir_res switch (int errno) {
	case 0:
		namelist list; /* sin error: listado del directorio */
	default:
		void; /* con error: nada */
};

struct Operacion {
	float operando1;
	float operando2;
};

/*DEFINIR AQUÍ PROGRAMAS QUE QUERAMOS USAR*/

program DIRPROG {
	version DIRVER {
		readdir_res READDIR(nametype) = 1;
		double SUMAR (Operacion) = 2;
	} =1;
} = 0x20000155;
