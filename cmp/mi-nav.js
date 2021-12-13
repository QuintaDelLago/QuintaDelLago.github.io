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
          <a href="index.html">Galería</a>
        </li>
      </ul>`;
    this.ul = this.querySelector("ul");
    getAuth().onAuthStateChanged(usuario => this.cambiaUsuario(usuario), muestraError);
    }

  /**
   * @param {import(
      "../lib/tiposFire.js").User}
      usu */
      async cambiaUsuario(usu) {
        if (usu && usu.email) {
          let html = "";
          const roles = await cargaRoles(usu.email);
          /* Enlaces para solo
           * para administrador. */
          if (roles.has("Administrador")) {
            html += /* html */
            `<li>
                <a href="convenios.html">Convenios</a>
              </li>
              <li>
                <a href="citas.html">Citas</a>
              </li>
              <li>
                <a href="eventos.html">Eventos</a>
              </li>
              <li>
                <a href="trabajadores.html">Trabajadores</a>
              </li>
              <li>
                <a href="preguntasfrecuentes.html">Preguntas</a>
              </li>
              <li>
                <a href="pagos.html">Pagos</a>
              </li>
              <li>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }
          /* Enlaces para solo
           * clientes.
           */
          if (roles.has("Cliente")) {
            html += /* html */
              `<li>
                <a href="pagoscliente.html">Pagos</a>
              </li>
              <li>
                <a href="preguntasfrecuentes.html">Preguntas</a>
              </li>
              <li>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }

          if (roles.has("Visitante")) {
            html += /* html */
              `<li>
                 <a href="preguntasfrecuentesexternos.html">Preguntas</a>
              </li>
              <li>
                <a href="paquetes.html">Paquetes</a>
              </li>`;
          }
          if (roles.has("Espectador")) {
            html += /* html */
            `<li>
                <a href="preguntasfrecuentesexternos.html">Preguntas</a>
            </li>
            <li>
                <a href="contacto.html">Contacto</a>
            </li>`;
          }
          this.ul.innerHTML += html;
        }
      }
    }  
customElements.define("mi-nav", MiNav);

