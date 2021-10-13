package Cliente;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

import com.sun.org.apache.bcel.internal.generic.INSTANCEOF;

import servidor.ServidorConClienteI;

public class Cliente extends UnicastRemoteObject implements ClienteI {
	private ServidorConClienteI replica = null;
	private String nombre;
	
	// Constructor de la clase cliente, recibimos un servidor principal
	// solicitaremos a dicho servidor registrarnos, entonces este nos registra
	// la replica que considere oportuna
	
	public Cliente (String nombre, ServidorConClienteI servidor) throws RemoteException{
		super();
		this.replica = servidor;
		this.nombre = nombre;
		servidor.registrarseEnServidor(this);
	}
	
	// Asignar replica que usaremos
	@Override
	public void setReplica(ServidorConClienteI servidor) throws RemoteException {
		this.replica = servidor;
		System.out.println("Mi nueva replica es: " + replica.getNombre());
	}
	
	// Realizar una donacion invocando el metodo de la replica
	public void donar(double cantidad) throws RemoteException {
		if (replica != null) {
			replica.donar(cantidad); 
			System.out.println("Cliente ha donado");
		}
		else 
			throw new NullPointerException("Replica del cliente es nula");
	}
	
	// Obtener el total de donaciones invocando el metodo de replica
	public double getTotal() throws RemoteException {
		return replica.getTotal();
	}
	
	// Obtener nombre del cliente
	public String getNombre() { 
		return nombre;
	}
}
