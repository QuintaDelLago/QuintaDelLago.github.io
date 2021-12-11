import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraCitas
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoCitas = getFirestore().collection("Citas");
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
    const doc = await daoCitas.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Cita} */
      const data = doc.data();
      forma.nombredelcliente.value = data.nombre;
      forma.fecha.value = data.fecha  || "";
      forma.hora.value = data.hora || "";
      forma.correoelectronico.value = data.correo || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraCitas();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const nombre = getString(formData, "nombredelcliente").trim();  
    const fecha = getString(formData, "fecha").trim();
    const hora = getString(formData, "hora").trim();
    const correo = getString(formData, "correoelectronico").trim();
    /**
     * @type {
        import("./tipos.js").
                Cita} */
    const modelo = {
      nombre, 
      fecha,
      hora,
      correo
    };
    await daoCitas.doc(id).set(modelo);
    muestraCitas();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoCitas.
        doc(id).
        delete();
      muestraCitas();
    }
  } catch (e) {
    muestraError(e);
  }
}

