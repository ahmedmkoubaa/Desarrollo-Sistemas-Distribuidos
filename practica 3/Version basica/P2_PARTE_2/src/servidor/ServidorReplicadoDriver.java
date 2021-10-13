package servidor;

import java.lang.invoke.MethodHandles.Lookup;
import java.rmi.AlreadyBoundException;
import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ExportException;

import com.oracle.xmlns.internal.webservices.jaxws_databinding.ExistingAnnotationsType;

import sun.rmi.transport.proxy.RMISocketInfo;


public class ServidorReplicadoDriver {
	public static void main (String [] args) throws RemoteException, AlreadyBoundException {
		if (args.length < 2) {
			System.err.println("Error: numero de argumentos incorrecto");
			System.err.println("USO: <nombre servidor> <nombre replica>");
			System.exit(-1);
		}
		
		final String miNombre = args[0];		// nombre del servidor
		final String nombreReplica = args[1];	// nombre de la replica
		
		final String ip = "localhost";			// ip a la que conectar
		final int puerto = 9090;				// puerto de conexión
		
		ServidorConServidorI miReplica = null;
		
		// Intentamos obtener el objeto remoto que se correspondería con la replica del objeto que
		// instanciamos posteriormente. Si no se consigue dicha replica, se pasa un objeto nulo
		try {
			miReplica = (ServidorConServidorI) Naming.lookup("rmi://" + ip + ":" + puerto + "/" + nombreReplica);
		} catch (Exception e) {
			System.out.println("No se pudo obtener el objeto remoto: "+ nombreReplica);
		}
		
		Registry registry = null;
		
		// Intentamos crear nuevo registro, si fue ya creado
		// atrapamos la excepción y obtenemos el registro
		try {
			registry = LocateRegistry.createRegistry(puerto);
		} catch (ExportException e) {
			// TODO: handle exception
			System.out.println("puerto está ocupado al parecer");
			registry = LocateRegistry.getRegistry(puerto);
		}
		
		// Registramos el nuevo objeto remoto con un nombre de replica y su replica.
		// Aunque la replica sea nula el objeto se creara correctamente.
		registry.bind(miNombre, new ServidorReplicado(miNombre, miReplica));
		System.out.println("Servidor arrancado ...");
	}
	
}
