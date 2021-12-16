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

const daoTrabajadores = getFirestore().collection("Trabajadores");
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
    const doc = await daoTrabajadores.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Trabajador} */
      const data = doc.data();
      forma.nombredeltrabajador.value = data.nombre;
      forma.puesto.value = data.puesto  || "";
      forma.telefono.value = data.telefono || "";
     // forma.avatar.value = data.avatar || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraTrabajadores();
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
  //  const avatar = getString(formData, "avatar").trim();
    /**
     * @type {
        import("./tipos.js").
                Trabajador} */
    const modelo = {
      nombre, 
      puesto,
      telefono
     // avatar
    };
    await daoTrabajadores.doc(id).set(modelo);
    muestraTrabajadores();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoTrabajadores.doc(id).delete();
      muestraTrabajadores();
    }
  } catch (e) {
    muestraError(e);
  }
}

