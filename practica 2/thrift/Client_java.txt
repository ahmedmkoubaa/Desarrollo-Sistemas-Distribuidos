import java.awt.List;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;

import org.apache.thrift.TException;
import org.apache.thrift.transport.TSSLTransportFactory;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TSSLTransportFactory.TSSLTransportParameters;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;

public class Client {
  public static void main(String [] args) {
	 try {
		  TTransport transport = new TSocket("localhost", 9090);	      
	      TProtocol protocol = new  TBinaryProtocol(transport);
	      Calculadora.Client client = new Calculadora.Client(protocol);
//	      
//	      TTransport transportJavaServer = new TSocket("localhost", 9091);	      
//	      TProtocol protocolJavaServer = new  TBinaryProtocol(transportJavaServer);  
//	      Calculadora.Client clientToJavaServer = new Calculadora.Client(protocolJavaServer);
	      
	      transport.open();
//	      transportJavaServer.open();

	      try {
//	    	 System.out.println(" -------------- CLIENTE -------------- ");
//	    	 System.out.println(client.ping());
//	    	 System.out.println(clientToJavaServer.ping());
	    	 
	    	 calcula(client);
//	    	 calcula(clientToJavaServer);
		  } 
	      catch (OperacionInvalida failedOper) {
			 System.out.println("Ha ocurrido un error con codigo '" + 
					 failedOper.idOper + "' y mensaje '" + failedOper.msg + "'");
		  }

	      transport.close();
//	      transportJavaServer.close();
	      
	 } catch (TException e) {
		System.out.println("Ha ocurrido un error al intentar establecer la conexión");
		e.printStackTrace();
	}
  }

  private static void calcula(Calculadora.Client client) throws TException, OperacionInvalida
  {
	double resultado;
	ArrayList<Double> listaResultado = new ArrayList<Double>();
	ArrayList<Double> l1 = new ArrayList<Double>();
	ArrayList<Double> l2 = new ArrayList<Double>();
	OperacionListas operacion = new OperacionListas(l1, l2, TipoOperacion.SUMA);
	
	// -----------------------------------------------------------------------------------//
	// Operaciones aritmeticas basicas
	
	System.out.println("Vamos a hacer ping al servidor");
	String resultadoStr = client.ping();
	System.out.println("El ping devuelve: " + resultadoStr);
	
	System.out.println("Vamos a sumar dos números");
	resultado = client.suma(1, 1);
	System.out.println("Resultado de sumar es: " + resultado);
	    
	System.out.println("Vamos a restar dos números");
	resultado = client.resta(1, 1);
	System.out.println("Resultado de restar es: " + resultado);

	System.out.println("Vamos a multiplicar dos números");
	resultado = client.multiplica(1, 1);
	System.out.println("Resultado de multiplicar es: " + resultado);
	
	System.out.println("Vamos a dividir dos números");
	resultado = client.divide(1, 1);
	System.out.println("Resultado de dividir es: " + resultado);
	
	// -----------------------------------------------------------------------------------//
	// Operaciones con estructuras mas complejas	
	for (double i = 1; i <= 5; i++) {
		l1.add(i);
		l2.add(i);
	}
	
	System.out.println("Vamos a hacer la media de una lista");
	resultado = client.media(l1);
	System.out.println("Resultado de hacer la media " + resultado);
	
	
	System.out.println("Vamos a sumar listas (pásando ambas por parámetro)");
	listaResultado = (ArrayList<Double>)client.sumaListas(l1, l2);
	System.out.println("Resultado de sumar es" + listaResultado.toString());
	
	// -----------------------------------------------------------------------------------//
	// Operaciones con estructuras complejas y compuestas a su vez de otras estructuras mas complejas
	System.out.println("Vamos a sumar dos listas con operaciones especiales");
	operacion.setTipo(TipoOperacion.SUMA);
	listaResultado = (ArrayList<Double>)client.operaListas(operacion);
	System.out.println("El resultado de la operacion es " + listaResultado);
	
	System.out.println("Vamos a restar dos listas con operaciones especiales");
	operacion.setTipo(TipoOperacion.RESTA);
	listaResultado = (ArrayList<Double>)client.operaListas(operacion);
	System.out.println("El resultado de la operacion es " + listaResultado);
	
	System.out.println("Vamos a multiplicar dos listas con operaciones especiales");
	operacion.setTipo(TipoOperacion.MULTIPLICACION);
	listaResultado = (ArrayList<Double>)client.operaListas(operacion);
	System.out.println("El resultado de la operacion es " + listaResultado);
	
	System.out.println("Vamos a dividir dos listas con operaciones especiales");
	operacion.setTipo(TipoOperacion.DIVISION);
	listaResultado = (ArrayList<Double>)client.operaListas(operacion);
	System.out.println("El resultado de la operacion es " + listaResultado);
;  }
}