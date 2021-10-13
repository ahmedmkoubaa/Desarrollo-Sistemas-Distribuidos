package es.ugr.dsd2.rmichat.client;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

import es.ugr.dsd2.rmichat.server.ChatServerI;

public class ChatClientDriver {

	public static void main(String[] args) throws MalformedURLException,
			RemoteException, NotBoundException {
		// TODO Auto-generated method stub
		ChatServerI chatServer = (ChatServerI) Naming
				.lookup("rmi://localhost:9991/RMIChatServer");
		new Thread(new ChatClient(args[0], chatServer)).start();
	}

}
