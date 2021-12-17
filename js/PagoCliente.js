import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraPagos
} from "./navegacion.js";

const daoPagos = getFirestore().collection("Pagos");
const params = new URL(location.href).searchParams;
const id = params.get("correo");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(busca, muestraError);

async function busca() {
  try {
    const doc = await daoPagos.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Pago} */
      const data = doc.data();
      forma.nombre.value = data.nombre;
      forma.correo.value = data.correo  || "";
      forma.tipodeevento.value = data.tipo  || "";
      forma.numerodeinvitados.value = data.invitados  || "";
      forma.precioppersona.value = data.precioppersona   || "";
      forma.mapagar.value = data.mapagar  || "";
      forma.mpagado.value = data.mpagado  || "";
      forma.faltante.value = data.faltante  || "";
      forma.fecha.value = data.fecha  || "";
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraPagos();
  }
}
