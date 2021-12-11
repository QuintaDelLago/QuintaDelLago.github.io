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

"use strict";
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
}

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

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await daoPagos.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Pago} */
      const data = doc.data();
      forma.nombredelcliente.value = data.nombre;
      forma.tipodeevento.value = data.tipo  || ""
      forma.paquete.value = data.paquete   || "";
      forma.numerodeinvitados.value = data.invitados  || "";
      forma.montoapagar.value = data.mapagar  || "";
      forma.montopagado.value = data.mpagado  || "";
      forma.faltante.value = data.faltante  || "";
      forma.fecha.value = data.fecha  || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
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
    const nombre = getString(formData, "nombredelciente").trim();  
    const tipo = getString(formData, "tipodeevento").trim();
    const paquete = getString(formData, "paquete").trim();  
    const invitados = getString(formData, "numerodeinvitados").trim();
    const mapagar = getString(formData, "montoapagar").trim();
    const mpagado = getString(formData, "montopagado").trim();
    const faltante = getString(formData, "faltante").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Pago} */
    const modelo = {
      nombre,
      tipo,
      paquete,
      invitados,
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
      await daoPagos.
        doc(id).
        delete();
      muestraPagos();
    }
  } catch (e) {
    muestraError(e);
  }
}

