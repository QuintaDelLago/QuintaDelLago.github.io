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
  eliminaStorage,
  subeStorage,
  urlStorage
} from "../lib/storage.js";

const daoTrabajadores = getFirestore().collection("Trabajadores");
const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.querySelector("img");

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
      img.src = await urlStorage(data.telefono);
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
    const avatar = formData.get("avatar");
    /**
     * @type {
        import("./tipos.js").
                Trabajador} */
    const modelo = {
      nombre, 
      puesto,
      telefono
    };
    await daoTrabajadores.doc(id).set(modelo);
    await subeStorage(id, avatar);
    muestraTrabajadores();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la eliminación")) {
      await daoTrabajadores.doc(id).delete();
      await eliminaStorage(id);
      muestraTrabajadores();
    }
  } catch (e) {
    muestraError(e);
  }
}


