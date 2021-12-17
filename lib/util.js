/** Muestra un error en la consola
 * y un cuadro de alerta con el
 * mensaje.
 * @param {Error} e descripción
 *  del error. */
export function muestraError(e) {
  console.error(e);
  alert(e.message);
}

/** 
 * @param {string} texto
 * @returns {string}  */
export function cod(texto) {
  return (texto || "").
    toString().
    replace(/[<>"']/g, reemplaza);
}

/** @param {string} letra */
function reemplaza(letra) {
  switch (letra) {
    case "<": return "&lt;";
    case ">": return "&gt;";
    case '"': return "&quot;";
    case "'": return "&#039;";
    default: return letra;
  }
}

/**
 * @param {FormData} formData
 * @param {string} name */
export function getString(formData, name) {
  const valor = formData.get(name);
  return (
    typeof valor === "string" ?
      valor : "" );
}


