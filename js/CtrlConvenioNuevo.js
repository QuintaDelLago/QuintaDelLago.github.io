import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraConvenios
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoConvenios =
  getFirestore().
    collection("Convenios");
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
    const nombre = getString(formData, "nombreempresa").trim();  
    const servicio = getString(formData, "servicio").trim();
    const encargado = getString(formData, "encargado").trim();
    const telefono = getString(formData, "telefono").trim();
    /**
     * @type {
        import("./tipos.js").Evento} */
    const modelo = {
      nombre, 
      servicio,
      encargado,
      telefono
    };
    await daoConvenios.
      add(modelo);
    muestraConvenios();
  } catch (e) {
    muestraError(e);
  }
}


