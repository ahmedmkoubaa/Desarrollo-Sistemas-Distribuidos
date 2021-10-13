package servidor;

import java.rmi.Remote;
import java.rmi.RemoteException;

import Cliente.ClienteI;

// Interfaz que implementará un servidor para recibir llamadas desde otro servidor
public interface ServidorConServidorI extends Remote{

	double getSubtotal() throws RemoteException;
	int getClientesTotales() throws RemoteException;
	
	void aniadirCliente(ClienteI cliente) throws RemoteException;
	void setReplica(ServidorConServidorI replica) throws RemoteException;
	
	String getNombre() throws RemoteException;
	Boolean clienteEstaRegistrado(ClienteI cliente) throws RemoteException;
}
