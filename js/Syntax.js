var CodeGe = "";
var bit = "";
var inx = 0;
var stop = false;
var pCounter = 0; // Para contar los parentesis abiertos

function ShowError(msg){
    stop = true;
    var out = "";
    $("#ErrorMsg").removeClass("good").removeClass("info").addClass("error");
    $("#ErrorMsg").html(msg);
 
    if($("#ErrorMsg").is(":hidden")) $("#ErrorMsg").show(300);
    
    for(var i = 0; i < inx; i++) out += Output[i];
    out += "<r>..!</r>";
    $("#OutputCode").html(out);
    
}

function NoError(){
    stop = false;
     $("#ErrorMsg").removeClass("error").removeClass("info").addClass("good");
     $("#ErrorMsg").html("Sin errores de Syntaxis :)");
    if($("#ErrorMsg").is(":hidden")) $("#ErrorMsg").show(300);    
}

function ShowInfo(str){
    stop = false;
    $("#ErrorMsg").removeClass("error").addClass("info");
    $("#ErrorMsg").html(str);
    if($("#ErrorMsg").is(":hidden")) $("#ErrorMsg").show(300);  
}

// Esta funcion es importante para la lectura de cada operador/identificador
function nxtBit(){
    var str = "";
    if(CodeGe != ""){
        // "saltar" los espacios
        while(CodeGe[inx] == ' ') inx++;
        
        // Guardar caracter
        str = CodeGe[inx];
        inx++;
        // Verificar si es operador de dos caracteres
        if (str == ':' || str == '<' || str == '>' || str == 'i' || str == 'c') {
            while(CodeGe[inx] != ' '){
                str += CodeGe[inx];
                inx++;        
            }
        }
    }
    return str;
}

// Para obtener el operador anterior...
function prevBit(){
    var str = "";
    var r_inx = inx - bit.length - 1;
    if(r_inx > 0){
        while(CodeGe[r_inx] == ' ') r_inx--;
        while(CodeGe[r_inx] != ' '){
                str = CodeGe[r_inx] + str;
                r_inx--;        
        }
    }
    return str;
}

//                      <---------------------          EXPRESSIONS     ------------------------->
function Expression(){
    
    function Eprima(){
        bit = nxtBit();
        switch(bit){
            case '+':
            case '-':
            case '*':
            case '/':
                Expression();
            break;
            case ')':
                if(pCounter <= 0){
                    ShowError("#76 ¿Falta algun parentesis? - bit: " + bit + " - Pos: <b>" + inx + "</b>");
                }else {
                    pCounter--;
                    Eprima();
                }
            break;
            case ';': // SALIR
            case '}':
            break;
            default: ShowError("#87 Se esperaba un operador aritmetico, ')' o ';' - Bit:" + bit + " - Posicion: <b>" + inx + "</b>");
        }
    }
    
    bit = nxtBit();
    switch(bit[0]){
        case 'i':
        case 'c':
            Eprima();
        break;
        case '(':
            pCounter++;
            Expression();
        break;
        default:
            ShowError("#102 Se esperaba un id, numero -> Bit: " + bit + " - Posicion: <b>" + inx + "</b>");
     }
}

//              ---------   CONDICIONALES   ------------
function Conditionals(){
    
    function Cprima(){
        bit = nxtBit();
        switch(bit){
            case 'y':
            case 'o':
                Conditionals();
            break;
            case '(':
                pCounter++;
                Conditionals();
            break;
            case ')':
                if(pCounter <= 0){
                    ShowError("¿Falta algun parentesis? ->" + bit + " - Pos: <b>" + inx + "</b>");
                }else {
                    pCounter--;
                    Cprima();
                }
                
            break;
            case ';': // SALIR
            case '}':
                if(pCounter != 0) ShowError("¿Falta algun parentesis? - Bit:" + bit + " - Pos: <b>" + inx + "</b> pCounter: " + pCounter);
            break;
        }
    } // Fin de Cprima
    
    function oP(){
        bit = nxtBit();
        switch(bit){
            case '<':
            case '>':
            case '=':
            case '<=':
            case '>=':
            case '<>':
                bit = nxtBit();
                if(bit[0] == 'i' || bit[0] == 'c' ) Cprima();
                else if (bit == '(') {
                    pCounter++;
                    Conditionals();
                }
                else {
                    ShowError("Se esperaba id o numero despues de OR -> '" + bit + "' - Posicion: <b>" + inx + "</b>");
                }
            break;
            default:
                ShowError("Se esperaba un operador relacional -> '" + bit + "' - Posicion: <b>" + inx + "</b>");
        }
    } // Fin de operadores relacionales
    
    bit = nxtBit();
    
    if(bit[0] == 'i' || bit[0] == 'c') oP();
    else if (bit == '('){
        pCounter++;
        Conditionals();
    }
    else {
        ShowError("Se esperaba un id o numero para inicio de condicional -> '" + bit + "' - Posicion: <b>" + inx + "</b>");
    }
}

//                                            <----------               L               --------->
function L(){
    bit = nxtBit();
    switch (bit[0]){
        case 'e':
            bit = nxtBit();
            if(bit[0] != "i") ShowError("#172 Se esperaba id - bit: " + bit + " Pos: <b>" + inx + "</b>");
            else L();
        break;
        case 'i':
            bit = nxtBit();
            if(bit != ":=") ShowError("#177 Se esperaba := - bit: " + bit + " Pos: <b>" + inx + "</b>");
            else {
                Expression();
                if(bit != '}')L();
            }
        break;
        case 'd':
            bit = nxtBit();
            if(bit[0] != "i") ShowError("#185 Se esperaba id despues de 'd' - bit: " + bit + " Pos: <b>" + inx + "</b>");
            else L();
        break;
        case 'r':
            bit = nxtBit();
            if(bit != '{') ShowError("#190 Se esperaba '{' despues de 'r' - bit: " + bit + " Pos: <b>" + inx + "</b>");
            else{
                L();
                if(!stop){
                    bit = nxtBit();
                    if(bit != "h") ShowError("#195 Se esperaba 'hasta' - bit: " + bit + " Pos: <b>" + inx + "</b>");
                    else{
                        Conditionals();
                        if(bit != '}')L();
                    }
                }
            }
        break;
        case 's':
            Conditionals();
            if(bit != 't') ShowError("#205 Se esperaba 'entonces' despues de condicionales C - bit: " + bit + " Pos: <b>" + inx + "</b>");
            else{
                bit = nxtBit();
                if(bit != "{") ShowError("#208 Se esperaba '{' despues de 'entonces' - bit: " + bit + " Pos: <b>" + inx + "</b>");
                else {
                    L();
                    if(!stop) L();
                }
            }
        break;
        case ';':
            L();
        break;
        case '}':
        break;
        default: ShowError("#219 Mal inicio de Instruccion - bit: " + bit + " Pos: <b>" + inx + "</b>");            
    }    
}


//                                  <---------------------      CHECK SYNTAX        -------------------->
function CheckSyntax(){
    // Always start with 0 and ""
    CodeGe = Output;
    inx = 0;
    stop = false;
    pCounter = 0;
    bit = nxtBit();
    
    
    // Comienza a checar...
    switch(bit){
        case 'p': // programa
            bit = nxtBit();
            switch(bit){
                case 'n': // nombre del programa
                    bit = nxtBit();
                    switch(bit){ // Primer ';'
                        case ';':
                            bit = nxtBit();
                            switch(bit){ // Primer '{'
                                case '{':
                                    L(); // Lista de Instrucciones
                                    // bit = nxtBit();
                                    if(stop) break;
                                    switch(bit){ // Ultima '}'
                                        case '}':
                                            bit = nxtBit();
                                            switch(bit){ // Punto Final
                                                case '.':
                                                    NoError();
                                                break;
                                                default: ShowError("¿Falta punto final '.' ?");
                                            } // Final Period                                            
                                        break;
                                        default: ShowError("¿Falta ultima llave '}' ? -> '" + bit + "' Pos: " + inx);
                                    } // Ultima '}'
                                break;
                                default: ShowError("¿Falta primer llave '{' ?");
                            } // '{'
                            break;
                        default: ShowError("Verificar ';' despues del nombre del programa");
                    } // ';'
                    break;
                default: ShowError("¿Programa si nombre? - 'n'");
            }// 'n'
            break;
        default: ShowError("Verificar inicio del codigo - 'p'");
    } // 'p'
    
}

