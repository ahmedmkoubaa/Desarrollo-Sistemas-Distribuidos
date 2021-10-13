typedef list<double> MiLista
typedef list<MiLista> MiMatriz

enum TipoOperacion {
    SUMA            = 0,
    RESTA           = 1,
    MULTIPLICACION  = 2,
    DIVISION        = 3,
    MEDIA           = 4
}

struct OperacionListas {
    1: MiLista l1,
    2: MiLista l2,
    3: TipoOperacion tipo,
}

exception OperacionInvalida {
    1: i32 idOper,
    2: string msg
}

service Calculadora{
   i32 suma(1:i32 num1, 2:i32 num2),
   i32 resta(1:i32 num1, 2:i32 num2),

   double multiplica(1: double num1, 2: double num2),
   double divide(1: double num1, 2:double num2) throws (1: OperacionInvalida error),

   double media(1: list<double> lista) throws (1: OperacionInvalida error),
   MiLista sumaListas(1: MiLista l1, 2: MiLista l2),


   MiLista operaListas(1: OperacionListas operacion) throws (1: OperacionInvalida error),

   string ping(),
}
