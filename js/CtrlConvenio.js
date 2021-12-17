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

const daoConvenios = getFirestore().collection("Convenios");
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
    const doc = await daoConvenios.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Convenio} */
      const data = doc.data();
      forma.nombreempresa.value = data.nombre;
      forma.servicio.value = data.servicio  || "";
      forma.telefono.value = data.telefono || "";
      forma.encargado.value = data.encargado || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraConvenios();
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
        import("./tipos.js").
                Convenio} */
    const modelo = {
      nombre, 
      servicio,
      encargado,
      telefono
    };
    await daoConvenios.doc(id).set(modelo);
    muestraConvenios();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoConvenios.doc(id).delete();
      muestraConvenios();
    }
  } catch (e) {
    muestraError(e);
  }
}

