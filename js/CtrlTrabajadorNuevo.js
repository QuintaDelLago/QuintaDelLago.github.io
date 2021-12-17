import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraTrabajadores
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  guardaTrabajador,
} from "./trabajadores.js";


const daoTrabajadores = getFirestore().collection("Trabajadores");
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
    const nombre = getString(formData, "nombredeltrabajador").trim();  
    const puesto = getString(formData, "puesto").trim();
    const telefono = getString(formData, "telefono").trim();
    await guardaTrabajador(evt,formData,telefono);
    /**
     * @type {
        import("./tipos.js").Trabajador} */
    const modelo = {
      nombre, 
      puesto,
      telefono
    };
    await daoTrabajadores.add(modelo);
    muestraTrabajadores();
  } catch (e) {
    muestraError(e);
  }
}


