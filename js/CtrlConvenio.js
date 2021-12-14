import {
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraTrabajadores
} from "./navegacion.js";
import {
  guardaTrabajador,
  selectTrabajadores
} from "./CtrlTrabajadores.js";

const params = new URL(location.href).searchParams;
const id = params.get("id");
const daoTrabajadores = getFirestore().collection("Trabajadores");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.querySelector("img");
/** @type {HTMLUListElement} */
busca();


async function busca() {
  try {
    const doc = await daoTrabajadores.doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      img.src = await urlStorage(id);
      selectTrabajadores(
        forma.telefono,
        data.telefono)
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraTrabajadores();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaTrabajador(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoTrabajadores.doc(id).delete();
      await eliminaStorage(id);
      muestraTrabajadores();
    }
  } catch (e) {
    muestraError(e);
  }
}
