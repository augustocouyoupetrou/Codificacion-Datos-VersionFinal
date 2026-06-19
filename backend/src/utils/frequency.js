/**
 * Construye la tabla de frecuencias de un texto.
 * Recorre el texto carácter por carácter y cuenta cuántas veces
 * aparece cada símbolo (letras, espacios, signos, saltos de línea, etc.).
 *
 * @param {string} text - Texto de entrada.
 * @returns {Object<string, number>} Objeto { simbolo: frecuencia }.
 */
export function buildFrequencyTable(text) {
  const freq = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}
