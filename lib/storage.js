import {
  getStorage
} from "./fabrica.js";

const storage = getStorage();

/**
 * @param {string} nombre nombre
 * @param {FormDataEntryValue} archivo */
export async function
  subeStorage(nombre, archivo) {
  if (archivo instanceof File &&
    archivo.size > 0) {
    await storage.
      ref(nombre).
      put(archivo);
  }
}

/**
 * @param {string} nombre */
export async function
  urlStorage(nombre) {
  try {
    return await storage.
      ref(nombre).
      getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}

/**
 * @param {string} nombre nombre */
export async function
  eliminaStorage(nombre) {
  return await storage.
    ref(nombre).delete();
}
