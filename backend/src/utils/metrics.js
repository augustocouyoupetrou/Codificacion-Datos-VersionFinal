/**
 * Calcula las métricas de compresión a partir del texto original y la
 * cadena de bits codificada.
 *
 * El tamaño original se calcula en BYTES REALES usando TextEncoder
 * (codificación UTF-8), en lugar de simplemente "caracteres × 8 bits".
 * Esto es importante porque caracteres con tilde o la letra "ñ" ocupan
 * más de 1 byte en UTF-8, por lo que el cálculo refleja el tamaño de
 * almacenamiento real del texto, no una aproximación ASCII.
 *
 * @param {string} originalText
 * @param {string} encodedBits - Cadena de '0' y '1' resultante de la codificación.
 * @returns {{
 *   originalSizeBytes: number,
 *   originalSizeBits: number,
 *   encodedSizeBits: number,
 *   encodedSizeBytes: number,
 *   compressionPercentage: number,
 *   symbolCount: number
 * }}
 */
export function calculateMetrics(originalText, encodedBits) {
  const originalSizeBytes = new TextEncoder().encode(originalText).length;
  const originalSizeBits = originalSizeBytes * 8;

  const encodedSizeBits = encodedBits.length;
  const encodedSizeBytes = encodedSizeBits / 8;

  const compressionPercentage =
    originalSizeBits > 0
      ? ((originalSizeBits - encodedSizeBits) / originalSizeBits) * 100
      : 0;

  const symbolCount = new Set(originalText.split('')).size;

  return {
    originalSizeBytes,
    originalSizeBits,
    encodedSizeBits,
    encodedSizeBytes,
    compressionPercentage,
    symbolCount,
  };
}

/**
 * Construye la tabla de resultados (una fila por símbolo) combinando la
 * tabla de frecuencias con la tabla de códigos generada por el algoritmo
 * seleccionado, ordenada de mayor a menor frecuencia.
 *
 * @param {Object<string, number>} freqTable
 * @param {Object<string, string>} codes
 * @param {number} totalChars - Cantidad total de caracteres del texto original.
 * @returns {Array<{char: string, freq: number, probability: number, code: string, codeLength: number}>}
 */
export function buildResultsTable(freqTable, codes, totalChars) {
  return Object.entries(freqTable)
    .map(([char, freq]) => ({
      char,
      freq,
      probability: totalChars > 0 ? freq / totalChars : 0,
      code: codes[char] || '',
      codeLength: (codes[char] || '').length,
    }))
    .sort((a, b) => b.freq - a.freq);
}
