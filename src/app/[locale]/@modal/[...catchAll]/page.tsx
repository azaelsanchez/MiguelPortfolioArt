/**
 * Captura cualquier navegación (del lado del cliente) hacia una ruta que no
 * sea `(.)work/[slug]` ni la raíz — `/work`, `/about`, `/contact`... — y no
 * renderiza nada, para que el modal se cierre. Sin esto, una vez abierto el
 * modal se quedaría montado encima de cualquier página a la que navegases
 * después: las rutas paralelas conservan el último contenido que coincidió
 * con cada slot hasta que algo coincide y lo reemplaza. La raíz exacta la
 * cubre el `page.tsx` de al lado (ver su comentario).
 */
export default function ModalCatchAll() {
  return null;
}
