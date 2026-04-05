public class Main {
    public static void main(String[] args) {
        String nombre = "Jose Martinez Guerrero. Hola como estan todos?";

        int pos;
        int contador = 0;
        String a, b;
        b = nombre + " ";
        pos = b.indexOf(" ");
        while(pos>0){
            a = b.substring(0,pos);
            b = b.substring(pos+1);
            pos = b.indexOf(" ");
            System.out.println(a);
            contador++;
        }
        System.out.println("Cantidad de Palabras: " + contador);


    }
}