"use strict";
var forma = document.getElementById("forma"),
    btnguardar = document.getElementById("guardar"),
    btneliminar = document.getElementById("eliminar"),
    spnpaquete = document.getElementById("paquete"),
    numinvitados = document.getElementById("numerodeinvitados"),
    btnpago = document.getElementById("calcularapagar"),
    montoapagar = document.getElementById("montoapagar"),
    montopagado = document.getElementById("montopagado"),
    btnfaltante = document.getElementById("calcularfaltante"),
    otpruebas = document.getElementById("pruebas"),
    btnpruebas = document.getElementById("prueb"),
    faltante = document.getElementById("faltante");

forma["calcularapagar"].addEventListener("click", pago, false);
forma["calcularfaltante"].addEventListener("click", faltapagar, false);
function pago() {
    try {
        valida(isNaN(numinvitados.value) || numinvitados.value<=0,"Ingrese el número de invitados");
        var pago = spnpaquete.value * numinvitados.valueAsNumber;
        montoapagar.value = pago;
    } catch (error) {
        alert(error.message)  
    }    
}

function faltapagar() {
    try {
        valida(isNaN(montoapagar.value) || montoapagar.value<=0,"Primero calcule el monto a pagar");
        valida(isNaN(montopagado.value) || montopagado.value<=0,"Ingrese el monto pagado correctamente");
        var falta = montoapagar.value - montopagado.valueAsNumber;
        valida(falta<0, "El pago es mayor al monto acordado, cheque registro");
        valida(falta==0, "Pago saldado, ya puede eliminar el registro");
        faltante.value = falta; 
    } catch (error) {      
        alert(error.message)  
    }    
}

function valida(cond, mensaje){
    if(cond){
        throw new Error(mensaje);
    }
}