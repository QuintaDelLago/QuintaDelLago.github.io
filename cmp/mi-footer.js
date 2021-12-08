class MiFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML =
      `<p>
        &copy; 2021
        Quinta del Lago Texcoco
      </p>`;
  }
}

customElements.define("mi-footer", MiFooter);
