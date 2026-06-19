const COMPRESS_ENDPOINT = '/api/compress';
const DECOMPRESS_ENDPOINT = '/api/decompress';

/**
 * Realiza un POST con cuerpo JSON al backend y devuelve el JSON de
 * respuesta ya parseado. Normaliza errores de red, errores de parseo y
 * errores que el backend devuelve explícitamente (campo "error") en una
 * única instancia de Error con un mensaje legible, para que App.jsx solo
 * necesite un try/catch alrededor de cada llamada.
 *
 * @param {string} path - Ruta relativa (ej. '/api/compress'). Se resuelve
 *   contra el mismo origen del frontend; en desarrollo, el "proxy"
 *   configurado en package.json la reenvía al backend.
 * @param {Object} payload - Cuerpo de la petición, se serializa como JSON.
 * @returns {Promise<Object>} El cuerpo de la respuesta ya parseado.
 */
async function postJson(path, payload) {
  let response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    throw new Error(
      'No se pudo conectar con el servidor. Verifique que el backend esté en ' +
        'ejecución (npm start en la carpeta backend/).'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('La respuesta del servidor no es un JSON válido.');
  }

  if (!response.ok) {
    throw new Error(data?.error || `Error del servidor (código ${response.status}).`);
  }

  return data;
}

/**
 * Envía el texto a comprimir al backend, que ejecuta el algoritmo
 * seleccionado y calcula las métricas y la tabla de resultados.
 *
 * @param {{ text: string, algorithm: 'huffman'|'shannon-fano' }} params
 * @returns {Promise<{
 *   encodedBits: string,
 *   codes: Object<string, string>,
 *   freqTable: Object<string, number>,
 *   tree: Object|null,
 *   metrics: Object,
 *   resultsTable: Array
 * }>}
 */
export function compressText({ text, algorithm }) {
  return postJson(COMPRESS_ENDPOINT, { text, algorithm });
}

/**
 * Envía al backend los datos generados por la compresión (bits, árbol o
 * tabla de códigos según el algoritmo) para reconstruir el texto original.
 *
 * @param {{
 *   algorithm: 'huffman'|'shannon-fano',
 *   encodedBits: string,
 *   codes: Object<string, string>,
 *   tree: Object|null
 * }} params
 * @returns {Promise<{ decodedText: string }>}
 */
export function decompressText({ algorithm, encodedBits, codes, tree }) {
  return postJson(DECOMPRESS_ENDPOINT, { algorithm, encodedBits, codes, tree });
}
