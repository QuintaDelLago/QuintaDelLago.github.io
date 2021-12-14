import {
  getAuth
} from "../lib/fabrica.js";
import {
  getString
} from "../lib/util.js";
import {
  guardaTrabajador,
  selectTrabajadores
} from "./CtrlTrabajadores.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLUListElement} */

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
forma.addEventListener("submit", guarda);
    selectTrabajadores(forma.numerodetelefono, "");


/** @param {Event} evt */
async function guarda(evt) {
  const formData = new FormData(forma);
  const id = getString(formData, "telefono").trim();
  await guardaTrabajador(evt,formData, id);
}