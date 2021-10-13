import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class Ejemplo implements Ejemplo_I {
	public void escribir_mensaje(int id_proceso) throws RemoteException {
		System.out.println("Recibida petición de proceso: "+id_proceso);
		if (id_proceso == 0) {
			try{
				System.out.println("Empezamos a dormir");
				Thread.sleep(5000);
				System.out.println("Terminamos de dormir");
			}
			catch (Exception e) {
				System.err.println("Ejemplo exception:");
				e.printStackTrace();
			}
		}
		System.out.println("\nHebra "+id_proceso);
	}
	
	public static void main (String [] args) {
		if (System.getSecurityManager() == null) {
			System.setSecurityManager(new SecurityManager());
		}
		
		try {
			Ejemplo_I prueba = new Ejemplo();
			
			Ejemplo_I stub = (Ejemplo_I) UnicastRemoteObject.exportObject(prueba, 0);
			Registry registry = LocateRegistry.getRegistry();
			String nombre_objeto_remoto = "un_nombre_para_obj_remoto";
			
			String rutaAbsoluta = "/D/ING INFÓRMATICA/TERCERO/SEGUNDO CUATRIMESTRE/DSD/PRÁCTICAS/practica 3/src/server.policy";
			String rutaRelativa = "../src";
			
			System.setProperty("java.security.policy", "file:server.policy");
			registry.rebind(nombre_objeto_remoto, stub);

			
			System.out.println("Ejemplo bound");
		} catch (Exception e) {
			System.err.println("Ejemplo exception:");
			e.printStackTrace();
		}
	}

}
