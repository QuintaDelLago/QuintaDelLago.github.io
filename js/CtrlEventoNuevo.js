import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraEventos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoEventos =
  getFirestore().
    collection("Eventos");
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
    const nombre = getString(formData, "nombre").trim();  
    const tipo = getString(formData, "tipo").trim();
    const invitados = getString(formData, "invitados").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").Evento} */
    const modelo = {
      nombre, 
      tipo,
      invitados,
      fecha
    };
    await daoEventos.
      add(modelo);
    muestraEventos();
  } catch (e) {
    muestraError(e);
  }
}

