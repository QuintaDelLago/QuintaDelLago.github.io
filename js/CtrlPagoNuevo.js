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

const daoPagos = getFirestore().collection("Pagos");
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
    forma.calcularapagar.addEventListener("click", pago);
    forma.calcularfaltante.addEventListener("click", faltapagar);
  }
}


/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const nombre = getString(formData, "nombre").trim();  
    const correo = getString(formData, "correo").trim();  
    const tipo = getString(formData, "tipodeevento").trim();
    const invitados = getString(formData, "numerodeinvitados").trim();
    const precioppersona = getString(formData, "precioppersona").trim();  
    const mapagar = getString(formData,"mapagar").trim();
    const mpagado = getString(formData,"mpagado").trim();
    const faltante = getString(formData,"faltante").trim();
    const fecha = getString(formData,"fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Pago} */
    const modelo = {
      nombre,
      correo,
      tipo,
      invitados,
      precioppersona,
      mapagar,
      mpagado,
      faltante, 
      fecha
    };
    await daoPagos.add(modelo);
    muestraPagos();
  } catch (e) {
    muestraError(e);
  }
}

async function pago() {
  try {
    valida((isNaN(forma.numerodeinvitados.value) || forma.numerodeinvitados.valueAsNumber<=0),"Ingrese el número de invitados");
    var pago = forma.precioppersona.value * forma.numerodeinvitados.value;
    forma.mapagar.value = pago;
  } catch (error) {
    alert(error.message)  
  }    
}
  
async function faltapagar() {
  try {
    valida((isNaN(forma.mapagar.value) || forma.mapagar.valueAsNumber<=0),"Primero calcule el monto a pagar");
    valida((isNaN(forma.mpagado.value) || forma.mpagado.valueAsNumber<=0),"Ingrese el monto pagado correctamente");
    var falta = forma.mapagar.value - forma.mpagado.value;
    valida(falta<0, "El pago es mayor al monto acordado, cheque registro");
    valida(falta==0, "Pago saldado, ya puede eliminar el registro");
    forma.faltante.value = falta; 
  } catch (error) {      
    alert(error.message)  
  }    
}
  
async function valida(cond, mensaje){
  if(cond){
    throw new Error(mensaje);
  }
}
