package es.ugr.dsd2.rmichat.server;

import java.net.MalformedURLException;
import java.rmi.AlreadyBoundException;
import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ChatServerDriver {

	public static void main(String [] args) throws RemoteException,
			MalformedURLException, AlreadyBoundException {
		// TODO Auto-generated method stub
		Registry registry = LocateRegistry.createRegistry(9991);
		registry.bind("RMIChatServer", new ChatServer());
	}

}
