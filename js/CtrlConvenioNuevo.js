import {
  getString
} from "../lib/util.js";
import {
  guardaConvenio,
  selectConvenios
} from "./CtrlConvenios.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLUListElement} */

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
forma.addEventListener("submit", guarda);
    selectConvenios(forma.numerodetelefono, "");


/** @param {Event} evt */
async function guarda(evt) {
  const formData = new FormData(forma);
  const id = getString(formData, "telefono").trim();
  await guardaConvenio(evt,formData, id);
}