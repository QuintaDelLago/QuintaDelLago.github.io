import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraPagos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoPagos =
  getFirestore().
    collection("Pagos");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener("submit", guarda);
    forma.calcularapagar.addEventListener("click", pago, false);
    forma.calcularfaltante.addEventListener("click", faltapagar, false);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const nombre = getString(formData, "nombredelcliente").trim();  
    const tipo = getString(formData, "tipodeevento").trim();
    const invitados = getString(formData, "numerodeinvitados").trim();
    const fecha = getString(formData, "fecha").trim();
    const precioppersona = getString(formData, "precioppersona");
    const mapagar = getString(formData, "mapagar");
    const mpagado = getString(formData, "mpagado");
    const falta = getString(formData, "falta");
    /**
     * @type {
        import("./tipos.js").Pago} */
    const modelo = {
      nombre, 
      tipo,
      invitados,
      fecha,
      precioppersona,
      mapagar,
      mpagado,
      falta
    };
    await daoPagos.
      add(modelo);
    muestraPagos();
  } catch (e) {
    muestraError(e);
  }
}
function pago() {
  try {
    valida(isNaN(forma.numinvitados.value) || forma.numinvitados.value<=0,"Ingrese el número de invitados");
    var pago = forma.paquete.value * forma.numinvitados.valueAsNumber;
    forma.montoapagar.value = pago;
  } catch (error) {
    alert(error.message)  
  }    
  }
  
  function faltapagar() {
  try {
    valida(isNaN(forma.montoapagar.value) || forma.montoapagar.value<=0,"Primero calcule el monto a pagar");
    valida(isNaN(forma.montopagado.value) || forma.montopagado.value<=0,"Ingrese el monto pagado correctamente");
    var falta = forma.montoapagar.value - forma.montopagado.valueAsNumber;
    valida(falta<0, "El pago es mayor al monto acordado, cheque registro");
    valida(falta==0, "Pago saldado, ya puede eliminar el registro");
    forma.faltante.value = falta; 
  } catch (error) {      
    alert(error.message)  
  }    
  }
  
  function valida(cond, mensaje){
  if(cond){
    throw new Error(mensaje);
  }
  }
/*
var formageneral = document.getElementById("forma"),
spnpaquete = document.getElementById("paquete"),
numinvitados = document.getElementById("numerodeinvitados"),
montoapagar = document.getElementById("montoapagar"),
montopagado = document.getElementById("montopagado"),
faltante = document.getElementById("faltante");

formageneral["calcularapagar"].addEventListener("click", pago, false);
formageneral["calcularfaltante"].addEventListener("click", faltapagar, false);

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
}*/

