import {
  getAuth
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";
import {
  iniciaSesión,
  terminaSesión
} from "./seguridad.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(listener, muestraError);

/**
 * @param {import(
    "../lib/tiposFire").
    User} usuario*/
async function
  listener(usuario) {
  if (usuario && usuario.email) {
    forma.terminarSesión.
      addEventListener("click", terminaSesión);
  } else {
    iniciaSesión();
  }
}