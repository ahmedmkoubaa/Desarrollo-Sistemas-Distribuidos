package Cliente;

import java.net.ConnectException;
import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.time.Duration;
import java.time.Instant;
import java.util.Scanner;

import servidor.ServidorConClienteI;

public class ClienteDriver {
	public static void main (String [] args) throws MalformedURLException, RemoteException, NotBoundException {
		String nombre = "anonimo";
		
		if (args.length > 0) nombre = args[0];

		
		ServidorConClienteI servidor = (ServidorConClienteI) Naming.lookup("rmi://localhost:9090/origen");
		System.out.println("Tenemos el servidor " + servidor.getNombre());
		
		Cliente cliente = new Cliente(nombre, servidor);
		Scanner scanner = new Scanner(System.in);
		
		double cantidad;
		double donaciones = 0;
		
		// En esta versión vamos a cronometrar el tiempo que se tarda en 
		// hacer 10.000 iteraciones, en cada iteración se dona "1".
		Instant start = Instant.now();
		
		// Haremos una cantidad de donaciones, a 1 euro la donación
		final int unidad = 1;
		final int numeroDonaciones = 10000;
		
		for (int i = 0; i < numeroDonaciones; i++) {
			System.out.print("CLIENTE --> [" + nombre + "] "); 
							
			try {
				// realizamos una donacion
				cliente.donar(unidad);
				
			} catch (RemoteException e) {
				System.out.println("Servidor no disponible, intentelo de nuevo mas tarde : ");
				
				// cayo la replica, intentamos conexion nuevamente a origen
				cliente.setNuevaReplica(servidor);
				
				// reintentar la donacion fallida
				cliente.donar(unidad);
			}
			
			try {
				System.out.println("El total es: " + cliente.getTotal());
			} catch (Exception e) {
				// TODO: handle exception
				System.out.println("Total no disponible, intentelo mas tarde");
			}
		}
		
		Instant finish = Instant.now();
		double duracion = Duration.between(start, finish).toMillis() / 1000.0;
		
		// Mostrar por pantall tiempo total que se tardó
		System.out.println("Duracion total fue " + duracion);
		
//		while (true) {
//			System.out.println("CLIENTE --> [" + nombre + "]"); 
//			System.out.print("Introduzca una cantidad a donar: ");
//			cantidad = Double.parseDouble(scanner.nextLine());
//					
//			if (cantidad <= 0) 
//				System.out.println("La cantidad debe ser mayor que cero");
//			else 
//				try {
//					cliente.donar(cantidad);
//				} catch (RemoteException e) {
//					System.out.println("Servidor no disponible, intentelo de nuevo mas tarde : " + e.getMessage());
//					
//					// cayo la replica, intentamos conexion nuevamente a origen
//					cliente.setNuevaReplica(servidor);
//					
//					// reintentar operacion fallida
//					cliente.donar(cantidad);
//				}
//		
//			try {
//				System.out.println("El total es: " + cliente.getTotal());
//			} catch (Exception e) {
//				// TODO: handle exception
//				System.out.println("Total no disponible, intentelo mas tarde");
//			}
//		}
	}
}
