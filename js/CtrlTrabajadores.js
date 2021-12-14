import {
    getFirestore
  } from "../lib/fabrica.js";
  import {
    subeStorage
  } from "../lib/storage.js";
  import {
    cod, getForánea, muestraError
  } from "../lib/util.js";
  import {
    muestraTrabajadores
  } from "./navegacion.js";
  
  const SIN_TRABAJADORES = /* html */
    `<option value="">
      -- Sin Trabajadores --
    </option>`;
  
  const firestore = getFirestore();
  const daoTrabajadores = firestore.collection("Trabajadores");

  
  /**
   * @param {
      HTMLSelectElement} select
   * @param {string} valor */
  export function
    selectTrabajadores(select,
      valor) {
    valor = valor || "";
    daoTrabajadores.orderBy("nombre").
      onSnapshot(
        snap => {
          let html = "";
          if (snap.size > 0) {
            snap.forEach(doc =>
              html += htmlTrabajador(doc, valor));
            select.innerHTML = html;
          } else {
            html += /* html */
              `<li class="vacio">
                -- No hay trabajadores
                registrados. --
              </li>`;
          }
        },
        e => {
          muestraError(e);
          selectTrabajadores(
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
    htmlTrabajador(doc, valor) {
    const selected =
      doc.id === valor ?
        "selected" : "";
    /**
     * @type {import("./tipos.js").
                    Trabajador} */
    const data = doc.data();
    return (/* html */
      `<option
          value="${cod(doc.id)}"
          ${selected}>
        ${cod(data.nombre)}
      </option>`);
  }

  
  /**
   * @param {Event} evt
   * @param {FormData} formData
   * @param {string} id  */
  export async function
    guardaTrabajador(evt, formData,
      id) {
    try {
      evt.preventDefault();
      const trabajadorId = getForánea(formData, "telefono");
      const nombre = formData.get("nombre");
      const puesto = formData.get("puesto");
      await daoTrabajadores.
        doc(id).
        set({
          nombre,
          puesto,
          trabajadorId
        });
      const avatar = formData.get("avatar");
      await subeStorage(id, avatar);
      muestraTrabajadores();
    } catch (e) {
      muestraError(e);
    }
  }