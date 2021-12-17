import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  urlStorage
} from "../lib/storage.js";

/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
const daoTrabajadores = getFirestore().collection("Trabajadores");

getAuth().
  onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {consulta();}
}

function consulta() {
  daoTrabajadores.orderBy("nombre").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
    async function htmlLista(snap) {
      let html = "";
      if (snap.size > 0) {
        /** @type {
              Promise<string>[]} */
        let trabajadores = [];
        snap.forEach(doc => trabajadores.
          push(htmlFila(doc)));
        const htmlFilas =
          await Promise.all(trabajadores);
        html += htmlFilas.join("");
      } else {
        html += /* html */
          `<li class="vacio">
            -- No hay trabajadores
            registrados. --
          </li>`;
      }
      lista.innerHTML = html;
    }

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                  Trabajador} */
  const data = doc.data();
  const nombre = cod(data.nombre);
  const puesto = cod(data.puesto);
  const telefono = cod(data.telefono);
  const img = cod(await urlStorage(data.telefono));
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return ( /* html */
    `<li>
      <a class="fila conImagen"
          href=
    "trabajador.html?${parámetros}">
        <span class="marco">
          <img src="${img}">
        </span>
        <span class="texto">
          <strong class="primario">
            ${nombre}
          <span class="secundario">
            ${puesto}<br>
            ${telefono}
          </span>
        </span>
      </a>
    </li>`);
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

