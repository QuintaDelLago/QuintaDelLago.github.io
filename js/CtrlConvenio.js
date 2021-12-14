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
  muestraConvenios
} from "./navegacion.js";
import {
  guardaConvenio,
  selectConvenios
} from "./CtrlConvenios.js";

const params = new URL(location.href).searchParams;
const id = params.get("id");
const daoConvenios = getFirestore().collection("Convenios");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.querySelector("img");
/** @type {HTMLUListElement} */
busca();


async function busca() {
  try {
    const doc = await daoConvenios.doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      img.src = await urlStorage(id);
      selectConvenios(
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
    muestraConvenios();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaConvenio(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoConvenios.doc(id).delete();
      await eliminaStorage(id);
      muestraConvenios();
    }
  } catch (e) {
    muestraError(e);
  }
}
