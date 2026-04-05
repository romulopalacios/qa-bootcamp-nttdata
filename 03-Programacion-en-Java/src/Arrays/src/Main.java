public class Main {
    public static void main(String[] args) {
        int num[] = {201,	2,	23,	3,	30,	20,	4,	9,	88};

        System.out.println("Longitud: " +  num.length);

        for(int j=num.length-1;j>=0;j--){
            System.out.println("Valor(" + j + " ): " + num[j]);
        }

        for(int i=0;i<num.length;i++){
            //System.out.println("Valor(" + i + " ): " + num[i]);
        }


    }
}