// @ts-nocheck
import {
  cargaRoles
} from "../js/seguridad.js";
import {
  getAuth
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";

class MiNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<ul>
        <li>
          <a href="index.html">Sesión</a>
          <li>
            <a href="galeria.html">Galería</a>
          </li>
        </li>
      </ul>`;
    this.ul =
      this.querySelector("ul");
    getAuth().onAuthStateChanged(
      usuario => this.
        cambiaUsuario(usuario),
      muestraError);
  }

  /**
   * @param {import(
      "../lib/tiposFire.js").User}
      usu */
      async cambiaUsuario(usu) {
        if (usu && usu.email) {
          let html = "";
          const roles =
            await cargaRoles(
              usu.email);
          /* Enlaces para solo
           * para clientes. */
          if (roles.has("Administrador")) {
            html += /* html */
              `<li>
                <a href="convenios.html">Convenios</a>
                <a href="citas">Citas</a>
                <a href="eventos.html">Eventos</a>
                <a href="trabajadores.html">Trabajadores</a>
                <a href="pagospendientes.html">Pagos</a>
                <a href="preguntasfrecuentes.html">Preguntas</a>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }
          /* Enlaces para solo
           * administradores.
           */
          if (roles.has("Cliente")) {
            html += /* html */
              `<li>
                <a href="pagoscliente.html">Pagos</a>
                <a href="preguntasfrecuentes.html">Preguntas</a>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }
          if (roles.has("Visitante")) {
            html += /* html */
              `<li>
                <a href="preguntasfrecuentesexternos.html">Preguntas</a>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }
          if (roles.has("Espectador")) {
            html += /* html */
              `<li>
                <a href="preguntasfrecuentesexternos.html">Preguntas</a>
                <a href="contacto.html">Contacto</a>
              </li>`;
          }
          this.ul.innerHTML += html;
        }
      }
    }
