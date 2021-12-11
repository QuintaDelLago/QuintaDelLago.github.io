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

