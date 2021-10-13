package Cliente;

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
		String nombre = " ";
		if (args.length > 0) nombre = args[0];
		
		
		ServidorConClienteI servidor = (ServidorConClienteI) Naming.lookup("rmi://localhost:9090/replica1");
		System.out.println("Tenemos el servidor " + servidor.getNombre());
		
		Cliente cliente = new Cliente(nombre, servidor);
		Scanner scanner = new Scanner(System.in);
		
		double cantidad;
		double donaciones = 0;
		
		while (true) {
			System.out.println("CLIENTE --> [" + nombre + "]"); 
			System.out.print("Introduzca una cantidad a donar: ");
			cantidad = Double.parseDouble(scanner.nextLine());
					
			if (cantidad <= 0) 
				System.out.println("La cantidad debe ser mayor que cero");
			else 
				cliente.donar(cantidad);
		
			System.out.println("El total es: " + cliente.getTotal());
		}
	}
}
