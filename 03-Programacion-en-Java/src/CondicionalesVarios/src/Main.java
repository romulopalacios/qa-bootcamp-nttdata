public class Main {
    public static void main(String[] args) {
       //Aplicativo de Control de Accesos a una Discoteca
        //Pueden entrar hombres mayores de 18 años, y mujeres mayores de 20.


        boolean esMasculino;
        int edad;


        //Inicializar
        esMasculino = true;
        edad = 19;
        //RPTA:

        if(esMasculino == true){
            //Hombres
            if(edad > 18){
                System.out.println("RPTA 1");
            }else{
                System.out.println("RPTA 2");
            }
        }else{
            //Mujeres
            if(edad > 20){
                System.out.println("RPTA 1");
            }else{
                System.out.println("RPTA 2");
            }
        }

        if((esMasculino == true && edad > 18) || (esMasculino == false && edad > 20)){
            //System.out.println("RPTA 1");
        }else{
           // System.out.println("RPTA 2");
        }

    }
}