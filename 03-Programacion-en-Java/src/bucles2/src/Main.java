import java.util.Optional;

public class Main {
    public static void main(String[] args) {
      int numeroFin = 10;
      int numero = 0;
      int sumaAcumulada = 0;



      while(numero <= numeroFin){
          sumaAcumulada = sumaAcumulada + numero;
          System.out.println("i: "+ numero);
          numero = numero + 1; //  numero++;
      }

      do{

          ...
      } while(...);

     System.out.println("SUA Acumulada: " + sumaAcumulada);

    }
}