package es.ugr.dsd2.rmichat.server;

import java.rmi.Remote;
import java.rmi.RemoteException;

import es.ugr.dsd2.rmichat.client.ChatClientI;

public interface ChatServerI extends Remote {
	void registerChatClient(ChatClientI chatClient) throws RemoteException;

	void broadcastMessage(String Message) throws RemoteException;

}
