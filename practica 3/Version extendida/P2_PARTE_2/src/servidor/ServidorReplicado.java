package servidor;

import java.net.MalformedURLException;
import java.rmi.AlreadyBoundException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.util.ArrayList;

import Cliente.Cliente;
import Cliente.ClienteI;

public class ServidorReplicado extends UnicastRemoteObject implements ServidorConServidorI, ServidorConClienteI {
	private ServidorConServidorI siguienteReplica;
	private ServidorConServidorI ultimaReplica;
	
	// por si se detectase que cayó la siguiente replica
	private String nombreSiguiente, nombreSiguienteDelSiguiente;
	
	private ArrayList<ClienteI> clientes;

	private String nombre;
	private double total = 0;



	
	private int replicasAniadidas = 0;	// numero de replicas aniadidas
	
	ServidorReplicado(String nombre, ServidorConServidorI origen) throws RemoteException{
		super();
		this.clientes = new ArrayList<ClienteI>();
		this.nombre = nombre;
		
		if (origen != null ) {
			origen.addReplica(this); 
			
		} else {
			System.out.println("Soy el primero nodo");
			
			this.siguienteReplica = this;
			this.nombreSiguiente = this.nombre;
			this.nombreSiguienteDelSiguiente = this.nombre;
			this.ultimaReplica = this;
		}
		
		System.out.println("[" + nombre +"] siguiente " + nombreSiguiente + " siguiente del siguiente " + nombreSiguienteDelSiguiente);
	}
	
	@Override
	public void addReplica (ServidorConServidorI nuevaReplica) throws RemoteException {
		
		System.out.println("[" + nombre + "] añdiendo nueva replica");
		
		if (replicasAniadidas > 0) {
			// siguiente del ultimo nodo es realmente el origen
			ServidorConServidorI origen = this.ultimaReplica.getSiguiente();
			
			// la nueva replica apunta ahora al origen
			nuevaReplica.setSiguiente(origen);
			
			// a la ultima replica le asignamos como siguiente la nueva replica
			this.ultimaReplica.setSiguiente(nuevaReplica);
			
			// la nueva replica es ahora la ultima
			this.ultimaReplica = nuevaReplica;
			
			// informar a las demas replicas del nuevo ultimo
			this.siguienteReplica.propagarUltimo(ultimaReplica, this);
			
			// Cuando aniadimos la segunda replica hay que actualizar el origen
			if (replicasAniadidas < 2) 
				origen.setNombreSiguienteDelSiguiente(nuevaReplica.getNombre());
			
		} else {
			this.siguienteReplica = nuevaReplica;
			this.nombreSiguiente = nuevaReplica.getNombre();
			
			nuevaReplica.setSiguiente(this);
			this.ultimaReplica = nuevaReplica;
		}		
				
		nuevaReplica.setTotal(total);
		replicasAniadidas++;
	}
	
	public void propagarUltimo(ServidorConServidorI ultima, ServidorConServidorI origen) throws RemoteException {
		if (!nombre.equals(origen.getNombre())) {
			this.ultimaReplica = ultima;
			this.siguienteReplica.propagarUltimo(ultima, origen);
		}
	}
	
	public void setSiguiente(ServidorConServidorI siguiente) throws RemoteException {
		this.siguienteReplica = siguiente;
		this.nombreSiguiente = siguiente.getNombre();
		this.nombreSiguienteDelSiguiente = siguiente.getNombreDelSiguiente();
	} 
	
	public synchronized void setTotal (final double cantidad) throws RemoteException {
		this.total = cantidad;
	}
	
	public void setNombreSiguienteDelSiguiente(String nombreNuevo ) throws RemoteException {
		this.nombreSiguienteDelSiguiente = nombreNuevo;
	}
	
	public ServidorConServidorI getSiguiente() throws RemoteException {
		return this.siguienteReplica;
	}
	
	public String getNombreDelSiguiente() throws RemoteException {
		return nombreSiguiente;
	}
	
	@Override
	public String getNombre() {
		return nombre;
	}
	
	// Metodo usado por un cliente para registrarse en una replica del servidor
	@Override
	public synchronized   void registrarseEnServidor(ClienteI cliente) throws RemoteException {
		System.out.println("Soy origen he recibido registro");
		ServidorConServidorI replicaMenosCargada;
		
		try {
			replicaMenosCargada = this.siguienteReplica.buscaReplicaConMenosClientes(this);
		} catch (RemoteException e) {
			this.ocuparLugarSiguiente();
			
			// Reintentar la operacion
			replicaMenosCargada = this.siguienteReplica.buscaReplicaConMenosClientes(this);
		}
		
		if (replicaMenosCargada == null) 
			throw new RemoteException("Fallo al intentar buscar replica menos cargada");
		
		replicaMenosCargada.aniadirCliente(cliente);
	}
	
	// Devuelve la replica con menor numero de clientes, es decir, la menos cargada
	// Cada replica llama recursivamente a la siguiente replica hasta que dicha replica 
	// la replica destino, entonces, se devuelve dicha replica y se compara el numero de
	// clientes de la replica devuelta con la replica que la invoco, se devuelve la replica
	// con menor numero de clientes
	@Override
	public ServidorConServidorI buscaReplicaConMenosClientes(ServidorConServidorI replicaDestino) throws RemoteException {
		// Al principio esta (this) es la replica con menos clientes
		ServidorConServidorI replicaMenosClientes = this;
		
		// si la replica this no es la replica de destino
		if (!this.nombre.equals(replicaDestino.getNombre())) {
			
			System.out.println("[" + nombre + "] buscando minimo, pregunto a siguiente");
			
			try {
				// se pregunta a la siguiente replica
				replicaMenosClientes = this.siguienteReplica.buscaReplicaConMenosClientes(replicaDestino);
			} catch (Exception e) {
				System.out.println("[" + nombre + "] siguiente replica " + nombreSiguiente + " ha caido mientras buscabamos minimo");
				this.ocuparLugarSiguiente();
			}
			
			// si la replica devuelta tiene mas clientes que this, se actualiza "replicaMenosClientes"
			if (this.clientes.size() < replicaMenosClientes.getClientesTotales()) 
				replicaMenosClientes = this;
		}
		
		// se retorna la replica encontrada
		return replicaMenosClientes;
	}
		
	// Metodo usado por el servidor para añadir un nuevo cliente
	public void aniadirCliente(ClienteI cliente) throws RemoteException {
		clientes.add(cliente);
		cliente.setReplica(this);
		
		System.out.println("[" + nombre + "] " + "Se ha registrado un nuevo cliente");
	}
	
	// Metodo que devuelve la cantidad total de donaciones (suma de toda replica)
	@Override
	public double getTotal() throws RemoteException, Exception {
		return total;
	}
	
	// Registra en rmi esta replica como la siguiente, la "reemplaza" dandole cobertura
	private void ocuparLugarSiguiente() throws RemoteException {
		System.out.println("[" + nombre +"] cayo " + nombreSiguiente + ", ocupando lugar");
		
		// Localizar el registro (el puerto, ip, etc deberían ser obtenidos de manera centralizada)
		Registry registry = LocateRegistry.getRegistry(9090);
		
		try {
			// Eliminar del registro el nodo caido
			registry.unbind(nombreSiguiente);
			
			// Registrar esta replica (this) con el nombre del nodo caido (ocupa su lugar)
			registry.bind(nombreSiguiente, this);
			ServidorConServidorI siguiente = (ServidorConServidorI) Naming.lookup("rmi://localhost:9090/" + nombreSiguienteDelSiguiente);
			this.setSiguiente(siguiente);
			
			// Cuando hay 3 replicas (anididas 2 o menos) y perdemos una
			// debemos informar de que la siguiente de la siguiente es ella misma
			// porque se corresponderia con la que cayo
			if (replicasAniadidas < 3) {
				siguiente.setNombreSiguienteDelSiguiente(siguiente.getNombre());
			}
		} 
					
		catch (AlreadyBoundException e1) {
			e1.printStackTrace();
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		} catch (NotBoundException e1) {
			e1.printStackTrace();
		}
		
		replicasAniadidas--;
		
		System.out.println("[" + nombre +"] siguiente " + nombreSiguiente + " siguiente del siguiente " + nombreSiguienteDelSiguiente);
	}

	// Recibir donacion de un cliente, actualizamos el subtotal de la replica
	// Este metodo es la zona de mayor conflicto en nuestro sistema distribuido
	// Actualizar el subtotal es una "seccion critica" para ellos usamos synchronized
	@Override
	public void donar(double cantidad) throws RemoteException {
		if (cantidad > 0) {						// Si la cantidad es mayor que cero	
			try {
				this.siguienteReplica.actualizarTotal(cantidad, this);
			} catch (RemoteException  e) {
				// ocupar lugar del caido
				this.ocuparLugarSiguiente();
				
				// reintentar la operacion nuevamente
				this.siguienteReplica.actualizarTotal(cantidad, this);
			}
			
			// Mostrar donación recibida y subtotal
			System.out.println("[" + nombre + "] " + "donacion recibida, total: " + total);
		}
	}
	
	// Difunde a traves de todas las replicas, el nuevo valor del total, realmente solo incrementa
	// el total en la cantidad indicada, no llega jamás a inicializar el valor del total
	public void actualizarTotal(final double cantidad, final ServidorConServidorI replicaOrigen) throws RemoteException {		
		if (!this.nombre.equals(replicaOrigen.getNombre()))
			try {
				siguienteReplica.actualizarTotal(cantidad, replicaOrigen);
			} catch (RemoteException e) {
				this.ocuparLugarSiguiente();
			}
		
		synchronized (this) {
			total += cantidad;		
		}
		
	}

	// Metodo invocado por otro servidor,  devuelve numero de 
	// clientes registrados en una replica
	@Override
	public int getClientesTotales() throws RemoteException {
		return clientes.size();
	}

	// Devuelve true si el cliente pasado como parametro fue previamente registrado
	@Override
	public Boolean clienteEstaRegistrado(ClienteI cliente) throws RemoteException {
		// TODO Auto-generated method stub
		return (clientes.indexOf(cliente) >= 0);
	}
}
