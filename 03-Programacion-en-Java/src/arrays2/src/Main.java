public class Main {
    public static void main(String[] args) {

        int datos[][] = { {1,2,3}, {10, 20, 30} , {-1,-2,-3}   };


        System.out.println(datos[2][1]);

        for(int i=0;i<datos.length;i++){
            for(int j=0; j<datos[i].length;j++){
                System.out.println(datos[i][j]);
                //System.out.println("i:" + i + "   -   j:" + j);
            }
        }
    }
}