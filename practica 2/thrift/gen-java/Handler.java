

import java.util.ArrayList;
import java.util.List;

import org.apache.thrift.TException;

public class Handler implements Calculadora.Iface {

	@Override
	public int suma(int num1, int num2) throws TException {
		System.out.println("Estoy sumando");
		return num1 + num2;
	}

	@Override
	public int resta(int num1, int num2) throws TException {
		System.out.println("Estoy restando");
		return num1 - num2;
	}

	@Override
	public double multiplica(double num1, double num2) throws TException {
		System.out.println("Estoy multiplicando");
		return num1 * num2;
	}

	@Override
	public double divide(double num1, double num2) throws OperacionInvalida, TException {
		System.out.println("Estoy dividiendo");
		if (num2 == 0) 
			throw new OperacionInvalida(2, "No se puede dividir entre 0");
		
		return num1/num2;
	}

	@Override
	public double media(List<Double> lista) throws OperacionInvalida, TException {
		if (lista.size() == 0) 
			throw new OperacionInvalida(-1, "La lista sobre la que se realizará la media no tiene elementos");
		else {
			System.out.println("Estoy haciendo media de lista");
			double suma = 0;
			for (double d: lista) 
				suma += d;
			
			suma /= lista.size();
			return suma;
		}
	}

	@Override
	public List<Double> sumaListas(List<Double> l1, List<Double> l2) throws TException {
		System.out.println("Estoy sumando dos listas");
		return operaListas(new OperacionListas(l1, l2, TipoOperacion.SUMA));
	}

	@Override
	public List<Double> operaListas(OperacionListas operacion) throws OperacionInvalida, TException {
		System.out.println("Estoy operando dos listas");
		
		ArrayList<Double> resultado = new ArrayList<Double>();
		int size = 0;
		
		if (operacion.l1.size() < operacion.l2.size()) size = operacion.l1.size();
		else size = operacion.l2.size();
		
		switch(operacion.tipo) {
			case SUMA: 
				System.out.println("Estamos sumando dos listas");
				for (int i = 0; i < size; i++) resultado.add(operacion.l1.get(i) + operacion.l2.get(i)); 
				break;
				
			case RESTA:
				System.out.println("Estamos restando dos listas");
				for (int i = 0; i < size; i++) resultado.add(operacion.l1.get(i) - operacion.l2.get(i)); 
				break;
				
			case MULTIPLICACION: 
				System.out.println("Estamos multiplicando dos listas");
				for (int i = 0; i < size; i++) resultado.add(operacion.l1.get(i) * operacion.l2.get(i)); 
				break;
				
			case DIVISION: 
				System.out.println("Estamos dividiendo dos listas");
				for (int i = 0; i < size; i++) 
					if (operacion.l2.get(i) == 0) throw new OperacionInvalida(2, "No se puede dividir entre 0");
					else resultado.add(operacion.l1.get(i) / operacion.l2.get(i)); 
				break;
				
			default: throw new OperacionInvalida(5, "Operación no reconocida");
		}
		
		return resultado;
	}

	@Override
	public String ping() throws TException {
		System.out.println("Me acaban de hacer un ping");
		return "Soy el servidor en java";
	}
}
