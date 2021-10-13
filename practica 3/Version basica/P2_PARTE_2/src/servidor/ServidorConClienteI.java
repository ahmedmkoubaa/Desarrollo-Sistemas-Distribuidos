package servidor;

import java.rmi.RemoteException;
import java.rmi.Remote;

import Cliente.ClienteI;

// Interfaz que implementará el servidor para recibir llamdas de un proceso cliente

public interface ServidorConClienteI extends Remote {
	
	void registrarseEnServidor(ClienteI cliente) throws RemoteException;
	double getTotal() throws RemoteException;
	void donar(double cantidad) throws RemoteException;
	String getNombre() throws RemoteException;
}
