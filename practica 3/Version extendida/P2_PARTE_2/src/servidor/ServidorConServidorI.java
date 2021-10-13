package servidor;

import java.rmi.Remote;
import java.rmi.RemoteException;

import Cliente.ClienteI;

// Interfaz que implementará un servidor para recibir llamadas desde otro servidor
public interface ServidorConServidorI extends Remote{

	
	// Obtener datos de la replica
	int getClientesTotales() throws RemoteException;
	String getNombre() throws RemoteException;
	String getNombreDelSiguiente() throws RemoteException;
	
	void aniadirCliente(ClienteI cliente) throws RemoteException;
	Boolean clienteEstaRegistrado(ClienteI cliente) throws RemoteException;
	
	/*****************************************************************************/
	// Metodos para la version extendida
	
	// Para aniadir nuevas replicas al conjunto, se aniaden con forma de anillo
	void addReplica (ServidorConServidorI nuevaReplica) throws RemoteException;
	void setSiguiente(ServidorConServidorI siguiente) throws RemoteException;
	void setNombreSiguienteDelSiguiente(String nombreNuevo ) throws RemoteException;
	
	// Para ejecutar operaciones propagadas, es decir, de una replica a otra hasta llegar a la inicial
	ServidorConServidorI getSiguiente() throws RemoteException;
	ServidorConServidorI buscaReplicaConMenosClientes(ServidorConServidorI replicaDestino) throws RemoteException;
	void actualizarTotal(final double cantidad, final ServidorConServidorI origen) throws RemoteException;
	void setTotal (final double cantidad) throws RemoteException;
	void propagarUltimo(ServidorConServidorI ultima, ServidorConServidorI origen) throws RemoteException;	
	

}
