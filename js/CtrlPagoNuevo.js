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
