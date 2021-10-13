package servidor;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.ArrayList;

import Cliente.Cliente;
import Cliente.ClienteI;

public class ServidorReplicado extends UnicastRemoteObject implements ServidorConServidorI, ServidorConClienteI {
	private ServidorConServidorI miReplica;
	private ArrayList<ClienteI> clientes;
	
	private String nombre;
	private double subtotal = 0;
 

	
	ServidorReplicado(String nombre, ServidorConServidorI miReplica) throws RemoteException{
		super();
		this.clientes = new ArrayList<ClienteI>();
		this.nombre = nombre;
		
		if (miReplica != null) {		
			setReplica(miReplica);
			miReplica.setReplica(this);
		}
	}
	
	@Override
	public String getNombre() {
		return nombre;
	}
	
	// Metodo usado por un cliente para registrarse en una replica del servidor
	@Override
	public void registrarseEnServidor(ClienteI cliente) throws RemoteException {
		initRegistro(cliente);
	}
	
	// Funcion privada que internamente implementa el método de registro
	private void initRegistro(ClienteI cliente) throws RemoteException {
		int clientesReplica = miReplica.getClientesTotales();
		if (clienteEstaRegistrado(cliente)) 			   aniadirCliente(cliente);
		else if (miReplica.clienteEstaRegistrado(cliente)) miReplica.aniadirCliente(cliente);
		else {
			if (clientes.size() < clientesReplica) aniadirCliente(cliente);
			else 					               miReplica.aniadirCliente(cliente);
		}
	}
	
	
	// Metodo usado por el servidor para añadir un nuevo cliente
	public void aniadirCliente(ClienteI cliente) throws RemoteException {
		clientes.add(cliente);
		cliente.setReplica(this);
		
		System.out.println("[" + nombre + "] " + "Se ha registrado un nuevo cliente");
	}
	
	// Metodo que devuelve la cantidad total de donaciones (suma de toda replica)
	@Override
	public double getTotal() throws RemoteException {
		return subtotal + miReplica.getSubtotal();
	}

	// Recibir donacion de un cliente, actualizamos el subtotal de la replica
	@Override
	public void donar(double cantidad) throws RemoteException {
		if (cantidad > 0) {
			subtotal += cantidad;
			System.out.println("[" + nombre + "] " + "donacion recibida, subtotal: " + subtotal);
		}

		
		
	}

	// Metodo llamado por otro servidor (replica) para 
	// saber el subtotal de una replica
	@Override
	public double getSubtotal() throws RemoteException {
		return subtotal;
	}

	// Metodo invocado por otro servidor,  devuelve numero de 
	// clientes registrados en una replica
	@Override
	public int getClientesTotales() throws RemoteException {
		return clientes.size();
	}

	// Asignar a una replica del ServidorReplicado
	@Override
	public void setReplica(ServidorConServidorI replica) throws RemoteException {
		// TODO Auto-generated method stub
		this.miReplica = replica;
		System.out.println("soy " + nombre + " tengo " + miReplica.getNombre());
	}

	// Devuelve true si el cliente en pasado como parametro fue previamente registrado
	@Override
	public Boolean clienteEstaRegistrado(ClienteI cliente) throws RemoteException {
		// TODO Auto-generated method stub
		return (clientes.indexOf(cliente) >= 0);
	}
}
