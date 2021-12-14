import {
  getFirestore
} from "../lib/fabrica.js";
import {
  cod, getForánea, muestraError
} from "../lib/util.js";
import {
  muestraConvenios
} from "./navegacion.js";

const firestore = getFirestore();
const daoConvenios = firestore.collection("Convenios");


/**
 * @param {
    HTMLSelectElement} select
 * @param {string} valor */
export function
  selectConvenios(select,
    valor) {
  valor = valor || "";
  daoConvenios.orderBy("nombre").
    onSnapshot(
      snap => {
        let html = "";
        if (snap.size > 0) {
          snap.forEach(doc =>
            html += htmlConvenio(doc, valor));
          select.innerHTML = html;
        } else {
          html += /* html */
            `<li class="vacio">
              -- No hay convenios
              registrados. --
            </li>`;
        }
      },
      e => {
        muestraError(e);
        selectConvenios(
          select, valor);
      }
    );
}

/**
 * @param {
  import("../lib/tiposFire.js").
  DocumentSnapshot} doc
 * @param {string} valor */
function
  htmlConvenio(doc, valor) {
  const selected =
    doc.id === valor ?
      "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Convenio} */
  const data = doc.data();}


/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function
  guardaConvenio(evt, formData,
    id) {
  try {
    evt.preventDefault();
    const trabajadorId = getForánea(formData, "telefono");
    const nombre = formData.get("nombre");
    const puesto = formData.get("puesto");
    await daoConvenios.
      doc(id).
      set({
        nombre,
        puesto,
        trabajadorId
      });
    muestraConvenios();
  } catch (e) {
    muestraError(e);
  }
}