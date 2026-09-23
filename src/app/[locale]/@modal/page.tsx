/**
 * Coincide con `/[locale]` exacto (Home): cierra el modal al volver ahí por
 * navegación de cliente. El catch-all de al lado (`[...catchAll]`) cubre el
 * resto de rutas; un catch-all opcional no vale porque solaparía con esta
 * página y con la propia Home ("misma especificidad de ruta").
 */
export default function ModalRoot() {
  return null;
}
