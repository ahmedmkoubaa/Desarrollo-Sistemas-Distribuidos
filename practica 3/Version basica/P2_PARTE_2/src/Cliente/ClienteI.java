package Cliente;

import java.net.MalformedURLException;
import java.rmi.NotBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;

import servidor.ServidorConClienteI;

public interface ClienteI extends Remote{
	void setReplica(ServidorConClienteI servidor) throws RemoteException;
}
