package es.ugr.dsd2.rmichat.client;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.Scanner;

import es.ugr.dsd2.rmichat.server.ChatServerI;

public class ChatClient extends UnicastRemoteObject implements ChatClientI, Runnable {

	private String name;
	private ChatServerI chatServer;

	// Construimos el cliente del chat, le pasamos el nombre del cliente (usuario) y un server del chat
	public ChatClient(String name, ChatServerI chatServer) throws RemoteException {
		super();
		this.name = name;
		this.chatServer = chatServer;
		this.chatServer.registerChatClient(this);
	}

	private static final long serialVersionUID = 1L;

	// Recupera un mensaje y lo muestra por pantalla
	@Override
	public void retrieveMessage(String message) throws RemoteException {
		// TODO Auto-generated method stub
		System.out.println("[Recibido mensaje] " + message);
	}

	// Codigo que implementar en paralelo, lee de la entrada estándar y 
	// lo difunde mediante el chatServer 
	@Override
	public void run() {
		// TODO Auto-generated method stub
		Scanner scanner = new Scanner(System.in);
		String message;
		while (true) {
			System.out.println("\n");
			message = scanner.nextLine();
			try {
				chatServer.broadcastMessage(name + " : " + message, this);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}
