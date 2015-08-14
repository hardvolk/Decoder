

// Arreglo de palabras reservadas
var W = [["programa","p"] ,["entrada" , "e"] ,[ "salida" , "d"] ,[ "repetir", "r"] ,["hasta" , "h"] ,["si", "s" ] ,[ "entonces", "t"] ];
var Operators = ['y','o','{','}',';',':','(',')','+','-','*','/','=','<','>','.'];


var tID = 0; // Total de identificadores
var tC = 0; // Total de Constantes
var detectName = false;

var ID = []; // Vector de IDs
var C = []; // Vector para Constantes

var Programa; // Nombre del programa
var InputText; // Entrada de texto
var Output; // Codigo resultante
var word; // Almacena la palabara a analizar
var code; // Almacena el codigo a analizar
var regX = /^[a-zA-Z0-9]+$/; // para validar los IDs



// Funciones para analizar el texto

// Detectar si es operador
function isOperator(op){
    var isOp = false;
    
	for(var i=0; i < 16; i++){
        if (op == Operators[i]){
            isOp = true;
			break;
			}
		}
		return isOp;
}


// Detectar si es una palabra reservada
function isWord() {
    
    var valid = false;
    
    for ( var i = 0; i < 7; i++) {
        if (word == W[i][0]) {
            valid = true;
            word = W[i][1];
            break;
        }
    }
    
    if (valid && word === "p") {detectName = true; }
    return valid;
}

// Determinar que palabra es
function checkWord(){
    
    var inList = false; // Para validar si esta en las listas
    
    // Detectar nombre del progrmama
    if(detectName){
		var lon = word.length;
		
        for(var i=0; i < lon; i++){
	       // Error N0; error en el nombre del programa
		  if((word[i] < 'A') || (word[i] > 'Z' && word[i] < 'a') || (word[i] > 'z')){
		  alert("Verifica el Nombre del programa!");
		  word = "!E0";
		  detectName = false;
		  break;
		  }
        }
        if(word != "!E0"){
            code = "n";
            detectName = false;
        }
    }
    // Verificar si es una palabra reservada
    else if(isWord()) code = word;
    
    //...si no es una palabra reservada...verificar si es una const. (numero entero positivo)
    else if(!isNaN(word)){//...si es un numero...
        // Verificar si el numero ya esta entre las constantes
        for(i=0; i < tC; i++){
            if ( C[i] == word){
                inList = true;
                code = "c" + (i+1);
                break;
            }
        }
        if(!inList){
            C[C.length] = word;
            tC++;
            code = "c" + tC;
        }
    }
    // si no es numero, verificar que sea ID valido
	       
    else{
        // Buscar el ID
        for(i = 0; i < tID; i++){
            if( word == ID[i]){
                inList = true;
                code = "id" + (i+1);
            }
            
        }
        
        if(!inList){
            if(word.match(regX)){
                ID[ID.length] = word;
                tID++;
                code = "id" + tID;
            }else alert(word + " no parece ser ID valido");
            
        }
    }
    
} // <--- Fin de checkWord()

// Reset Variables
function ResetVars(){
    word = "";
    Output = "";
    code = "";
    
    
    C = [];
    ID = [];
    
    tC = 0;
    tID = 0;
    
    $("#TableIDs").html("<thead><tr><th>ID</th><th>Identificador</th></tr></thead>");
    $("#TableCons").html("<thead><tr><th>Index</th><th>Constantes</th></tr></thead>");
}

// Mostrar Constantes e IDs
function ShowTables(){
    if(tID > 0){
        for (var i=0; i < tID; i++)
            $("#TableIDs").append("<tr><td> id" + (i+1) + "</td><td>" + ID[i] + "</td></tr>");
        
    } else $("#TableIDs").append("<tr><td>No hay Elementos</td></tr>");
    
    if(tC > 0){
        for (var i=0; i < tC; i++)
            $("#TableCons").append("<tr><td> c" + (i+1) + "</td><td>" + C[i] + "</td></tr>");
        
    } else $("#TableCons").append("<tr><td>No hay Elementos</td></tr>");
    
}


// Decodificar el codigo
function Decode() {
    InputText = $("#InputText").val();
    var ln = InputText.length;
    
    ResetVars();
    
    for( var i = 0; i < ln; i++) {
        if ( InputText[i] != " " && InputText[i] != "\n") {
            if(isOperator(InputText[i])) {
                if(word != "" && (InputText[i] == 'y' || InputText[i] == 'o') ) word += InputText[i];
                else if ( word != ""){
                    checkWord();
                    Output += code;
                    Output += " ";
                    Output += InputText[i];
                    Output += " ";
                    word = "";
                    code = "";
                } else { // Cuando word == ""
                    if((i+1) <= ln){
                        if(isOperator(InputText[i+1])) {
								Output += InputText[i];
								Output += InputText[i+1];
								Output += ' ';
								i++;
				            } 
                        else if(InputText[i+1] == ' ' || InputText[i+1] == '\n') {
								Output+= InputText[i];
								Output+=' ';
								i++;
                        }
                        else {
                            Output+= InputText[i];
                            Output+=' ';
                            word+=InputText[i+1];
                            i++;
                        }
                        
                     }
                }
                
            } else word += InputText[i];         
        } else if(word != ""){ // Una vez se tenga una palabra...
			checkWord(); // guardamos la respuesta en "code"
			Output += code;
            Output += ' ';
			word = "";
            code = "";
            
        }
        
        
    }
    $("#OutputCode").html(Output);
    ShowTables();
    
} // <- Fin de Decoder

