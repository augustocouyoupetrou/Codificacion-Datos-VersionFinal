/**
 * Devuelve una representación legible de un símbolo para mostrarlo en
 * tablas y gráficos. Los caracteres no imprimibles (espacio, salto de
 * línea, tabulación) se reemplazan por una etiqueta descriptiva; el resto
 * de los símbolos se muestran sin cambios.
 *
 * @param {string} char
 * @returns {string}
 */
export function formatCharLabel(char) {
  if (char === ' ') return "' ' (espacio)";
  if (char === '\n') return '\\n (salto de línea)';
  if (char === '\t') return '\\t (tabulación)';
  if (char === '\r') return '\\r (retorno de carro)';
  return char;
}

/**
 * Versión corta (sin paréntesis ni texto) pensada para etiquetas de eje
 * en gráficos, donde el espacio es más reducido.
 *
 * @param {string} char
 * @returns {string}
 */
export function formatCharShort(char) {
  if (char === ' ') return '␣';
  if (char === '\n') return '\\n';
  if (char === '\t') return '\\t';
  if (char === '\r') return '\\r';
  return char;
}
