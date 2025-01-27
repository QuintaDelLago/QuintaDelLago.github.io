import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraEventos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoEventos = getFirestore().collection("Eventos");
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

async function busca() {
  try {
    const doc = await daoEventos.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Evento} */
      const data = doc.data();
      forma.nombredelcliente.value = data.nombre;
      forma.tipodeevento.value = data.tipo  || "";
      forma.numerodeinvitados.value = data.invitados || "";
      forma.fecha.value = data.fecha || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraEventos();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const nombre = getString(formData, "nombredelcliente").trim();  
    const tipo = getString(formData, "tipodeevento").trim();
    const invitados = getString(formData, "numerodeinvitados").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Evento} */
    const modelo = {
      nombre, 
      tipo,
      invitados,
      fecha
    };
    await daoEventos.doc(id).set(modelo);
    muestraEventos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoEventos.doc(id).delete();
      muestraEventos();
    }
  } catch (e) {
    muestraError(e);
  }
}

