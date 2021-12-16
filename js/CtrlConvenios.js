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

/** @type {HTMLUListElement} */
const lista = document.
  querySelector("#lista");
const daoAlumno =
  getFirestore().
    collection("Convenios");

getAuth().
  onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    consulta();
  }
}

function consulta() {
  daoAlumno.
    orderBy("nombre")
    .onSnapshot(
      htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    snap.forEach(doc =>
      html += htmlFila(doc));
  } else {
    html += /* html */
      `<li class="vacio">
        -- No hay convenios
        registrados. --
      </li>`;
  }
  lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                  Convenio} */
  const data = doc.data();
  const nombre = cod(data.nombre);
  const servicio = cod(data.servicio);
  const encargado = cod(data.encargado);
  const telefono = cod(data.telefono);
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return ( /* html */
    `<li>
      <a class="fila" href=
  "convenio.html?${parámetros}">
        <strong class="primario">
          ${nombre}
        </strong>
        <a class="secundario">
         ${servicio}
        </a>
        <strong class="secundario">
          ${telefono}
        </strong>
        <a> ${encargado} </a>
      </a>     
    </li>`);
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

