package es.ugr.dsd2.rmichat.client;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

import es.ugr.dsd2.rmichat.server.ChatServerI;

public class ChatClientDriver {

	public static void main(String[] args) throws MalformedURLException, RemoteException, NotBoundException {
		String nombre = args[0];
		
		ChatServerI chatServer = (ChatServerI) Naming.lookup("rmi://localhost:9991/RMIChatServer");
		new Thread(new ChatClient(nombre, chatServer)).start();
		
		System.out.println(" -------------------- " + nombre + " --------------------");
		
	}
}
