union concurrente_res switch (int errno) {
	case 0: long result;
	default: void;
};

program CALCCONCURPROG {
	version CCV1 {
		concurrente_res SUMATORIA_AUXILIAR(int inicio, int final) = 1;
	} 																  = 1;
}																	  = 0x22000000;
