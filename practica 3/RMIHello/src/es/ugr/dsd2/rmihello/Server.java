package es.ugr.dsd2.rmihello;

import java.rmi.AlreadyBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Server {
	public static void main(String [] args) throws RemoteException, AlreadyBoundException{
		Registry registry = LocateRegistry.createRegistry(5099);
		HelloServant hello = new HelloServant();
		registry.bind("hello", hello);
		
		System.out.println("Servidor esperando ...");
	}
}
