var fs = require("fs");
var ruta = "";

function chooseFile(name) {
    var chooser = $(name);
    chooser.change(function(evt) {
        console.log($(this).val());
        ruta = $(this).val();
        ShowInfo(ruta);
    });
    
    chooser.trigger('click');  
    
}

function OpenFile(){
    $("#OpenDialog").change(function(evt){
        console.log($(this).val());
        ruta = $(this).val();
        //--------------------Read it
        fs.readFile(ruta,function(error, fileContent){
        if(error) ShowError("Hubo un error mientras se abria el archivo :/ Ruta: "+ruta);
         else $("#InputText").val(fileContent);
        });
        
    });
    $("#OpenDialog").trigger("click");
    
}

function writeToFile(){
    $("#SaveDialog").change(function(evt){
        console.log($(this).val());
        ruta = $(this).val();
        //-------------------- WriteFile
         fs.writeFile(ruta,CodeGe,function(error){
        if(error) ShowError("Hubo un error mientras se guardaba el archivo :/");
        else ShowInfo("Archivo guardado correctamente <a href='"+ruta+"'>Abrir</a>");
        });
    });
    $("#SaveDialog").trigger("click");
        
}