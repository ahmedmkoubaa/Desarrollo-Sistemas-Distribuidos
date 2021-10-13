package es.ugr.dsd2.rmihello;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class HelloServant extends UnicastRemoteObject implements HelloService {

	
	public HelloServant() throws RemoteException {
		super();
		// TODO Auto-generated constructor stub
	}

	public String echo(String input) throws RemoteException {
		// TODO Auto-generated method stub
		return "From server: " + input;
	}

}
