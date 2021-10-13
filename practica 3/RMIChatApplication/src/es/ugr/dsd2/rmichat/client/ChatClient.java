package es.ugr.dsd2.rmichat.client;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.Scanner;

import es.ugr.dsd2.rmichat.server.ChatServerI;

public class ChatClient extends UnicastRemoteObject implements ChatClientI,
		Runnable {

	private String name;
	private ChatServerI chatServer;

	public ChatClient(String name, ChatServerI chatServer)
			throws RemoteException {
		super();
		this.name = name;
		this.chatServer = chatServer;
		this.chatServer.registerChatClient(this);
	}

	private static final long serialVersionUID = 1L;

	@Override
	public void retrieveMessage(String message) throws RemoteException {
		// TODO Auto-generated method stub
		System.out.println(message);
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		Scanner scanner = new Scanner(System.in);
		String message;
		while (true) {
			message = scanner.nextLine();
			try {
				chatServer.broadcastMessage(name + " : " + message);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

}
