import {
  subeStorage
} from "../lib/storage.js";
import {
  muestraError,
  getString
} from "../lib/util.js";
import {
  muestraTrabajadores
} from "./navegacion.js";



/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function
  guardaTrabajador(evt, formData,
    id) {
  try {
    evt.preventDefault();
    const avatar = formData.get("avatar");
    await subeStorage(id, avatar);
    muestraTrabajadores();
  } catch (e) {
    muestraError(e);
  }
}
