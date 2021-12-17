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
const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

async function busca() {
  try {
    const doc = await daoPagos.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Pago} */
      const data = doc.data();
      forma.nombre.value = data.nombre;
      forma.correo.value = data.correo  || "";
      forma.tipodeevento.value = data.tipo  || "";
      forma.numerodeinvitados.value = data.invitados  || "";
      forma.precioppersona.value = data.precioppersona  || "";
      forma.mapagar.value = data.mapagar  || "";
      forma.mpagado.value = data.mpagado  || "";
      forma.faltante.value = data.faltante  || "";
      forma.fecha.value = data.fecha  || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
      forma.calcularapagar.addEventListener("click", pago);
      forma.calcularfaltante.addEventListener("click", faltapagar);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraPagos();
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
    const mapagar = getString(formData, "mapagar").trim();
    const mpagado = getString(formData, "mpagado").trim();
    const faltante = getString(formData, "faltante").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").Pago} */
    const modelo = {
      nombre,
      correo,
      tipo,
      invitados,
      precioppersona,
      mapagar,
      mpagado,
      faltante, 
      fecha,
    };
    await daoPagos.doc(id).set(modelo);
    muestraPagos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoPagos.doc(id).delete();
      muestraPagos();
    }
  } catch (e) {
    muestraError(e);
  }
}

async function pago() {
  try {
    valida(isNaN(forma.numerodeinvitados.value) || forma.numerodeinvitados.value<=0,"Ingrese el número de invitados");
    var pago = forma.precioppersona.value * forma.numerodeinvitados.valueAsNumber;
    forma.mapagar.value = pago;
  } catch (error) {
    alert(error.message)  
  }    
  }
  
async function faltapagar() {
  try {
    valida(isNaN(forma.mapagar.value) || forma.mapagar.valueAsNumber<=0,"Primero calcule el monto a pagar");
    valida(isNaN(forma.mpagado.value) || forma.mpagado.valueAsNumber<=0,"Ingrese el monto pagado correctamente");
    var falta = forma.mapagar.value - forma.mpagado.valueAsNumber;
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
