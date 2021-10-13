package servidor;

import java.lang.invoke.MethodHandles.Lookup;
import java.net.MalformedURLException;
import java.rmi.AlreadyBoundException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ExportException;

import com.oracle.xmlns.internal.webservices.jaxws_databinding.ExistingAnnotationsType;

import sun.rmi.transport.proxy.RMISocketInfo;


public class ServidorReplicadoDriver {
	public static void main (String [] args) throws RemoteException, AlreadyBoundException, MalformedURLException, NotBoundException {
		if (args.length < 1) {
			System.err.println("Error: numero de argumentos incorrecto");
			System.err.println("USO: <nombre replica>");
			System.exit(-1);
		}
		
		final String miNombre = args[0];		// nombre del servidor
		final String nombreOrigen = "origen";	// nombre de la replica
		
		final String ip = "localhost";			// ip a la que conectar
		final int puerto = 9090;				// puerto de conexión
		
		boolean existeOrigen = true;			// En principio el origen existe
		
		ServidorConServidorI replicaOrigen = null;
		
		Registry registry = null;
		
		// Intentamos crear nuevo registro, si fue ya creado
		// atrapamos la excepción y obtenemos el registro
		try {
			registry = LocateRegistry.createRegistry(puerto);
		} catch (ExportException e) {
			// TODO: handle exception
			System.out.println("puerto ya existente");
			registry = LocateRegistry.getRegistry(puerto);
		}
		
		// Intentamos obtener el objeto remoto que se correspondería con la replica del objeto que
		// instanciamos posteriormente. Si no se consigue dicha replica, se pasa un objeto nulo
		try {
			replicaOrigen = (ServidorConServidorI) Naming.lookup("rmi://" + ip + ":" + puerto + "/" + nombreOrigen);
		} catch (Exception e) {
			// no existe la replica origen
			existeOrigen = false;
			System.out.println("No se encontró origen y se tuvo que crear: "+ nombreOrigen);
		}
		
		// Crear la nueva replica con el nombre pasado como argumento al programa
		// y la replica de origen (existente dicha replica o no)
		ServidorConServidorI nuevaReplica = new ServidorReplicado(miNombre, replicaOrigen);
		
		if (!existeOrigen) 
			// registrar nueva replica con nombre de origen, respondera a dos nombres
			registry.bind(nombreOrigen, nuevaReplica);
			
		
		// Registramos el nuevo objeto remoto con un nombre de replica y su replica.
		// Aunque la replica sea nula el objeto se creara correctamente.
		registry.bind(miNombre, nuevaReplica);
		System.out.println("Servidor arrancado ...");
	}
	
}
