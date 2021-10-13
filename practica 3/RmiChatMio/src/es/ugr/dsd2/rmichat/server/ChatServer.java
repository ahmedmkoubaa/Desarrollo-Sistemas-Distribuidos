package es.ugr.dsd2.rmichat.server;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import es.ugr.dsd2.rmichat.client.ChatClientI;

public class ChatServer extends UnicastRemoteObject implements ChatServerI {

	private List<ChatClientI> chatClients;
	private static final long serialVersionUID = 1L;

	public ChatServer() throws RemoteException {
		super();
		this.chatClients = new ArrayList<ChatClientI>();
	}

	@Override
	public synchronized void registerChatClient(ChatClientI chatClient)
			throws RemoteException {
		// TODO Auto-generated method stub
		chatClients.add(chatClient);
	}

	@Override
	public synchronized void broadcastMessage(String message, ChatClientI client)
			throws RemoteException {
		// TODO Auto-generated method stub
		System.out.println("[Servidor difunde] "+ message);
		for (ChatClientI chatClient : chatClients) {
			if (!client.equals(chatClient)) {
				chatClient.retrieveMessage(message);
			}
		}

	}

}
