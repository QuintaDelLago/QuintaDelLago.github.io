/** 
 *  @returns {
      import("./tiposFire").
      Firestore} */
export function getFirestore() {
  // @ts-ignore
  return firebase.firestore();
}

/** 
 *  @returns {
      import("./tiposFire").
      Auth} */
export function getAuth() {
  // @ts-ignore
  return firebase.auth();
}

/** 
 *  @returns {
      import("./tiposFire").
      Storage} */
export function getStorage() {
  // @ts-ignore
  return firebase.storage();
}
