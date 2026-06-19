import { huffmanEncode, huffmanDecode } from '../algorithms/huffman.js';
import { shannonFanoEncode, shannonFanoDecode } from '../algorithms/shannonFano.js';
import { calculateMetrics, buildResultsTable } from '../utils/metrics.js';

const VALID_ALGORITHMS = ['huffman', 'shannon-fano'];

/**
 * Verifica que el algoritmo recibido sea uno de los dos soportados.
 * @param {*} algorithm
 * @returns {boolean}
 */
function isValidAlgorithm(algorithm) {
  return VALID_ALGORITHMS.includes(algorithm);
}

/**
 * POST /api/compress
 *
 * Recibe { text, algorithm } y devuelve el resultado completo de la
 * codificación: bits codificados, tabla de códigos, tabla de frecuencias,
 * árbol de Huffman (solo si algorithm === 'huffman'; null en caso
 * contrario), métricas de compresión y la tabla de resultados ya armada
 * para la tabla de la interfaz.
 *
 * El controller no implementa ninguna lógica de codificación: solo valida
 * la entrada, delega en los módulos expertos (algorithms/, utils/metrics.js)
 * y da forma a la respuesta. Esa separación responsabilidad-coordinación
 * vs. responsabilidad-cálculo es el patrón Controller de GRASP.
 */
export function compress(req, res) {
  const { text, algorithm } = req.body || {};

  if (typeof text !== 'string' || text.length === 0) {
    return res.status(400).json({
      error: 'El campo "text" es obligatorio y no puede estar vacío.',
    });
  }

  if (!isValidAlgorithm(algorithm)) {
    return res.status(400).json({
      error: 'El campo "algorithm" debe ser "huffman" o "shannon-fano".',
    });
  }

  try {
    const result =
      algorithm === 'huffman' ? huffmanEncode(text) : shannonFanoEncode(text);

    const metrics = calculateMetrics(text, result.encodedBits);
    const resultsTable = buildResultsTable(result.freqTable, result.codes, text.length);

    return res.status(200).json({
      encodedBits: result.encodedBits,
      codes: result.codes,
      freqTable: result.freqTable,
      tree: result.tree || null,
      metrics,
      resultsTable,
    });
  } catch (err) {
    console.error('Error en /api/compress:', err);
    return res.status(500).json({
      error: 'Ocurrió un error interno al comprimir el texto.',
    });
  }
}

/**
 * POST /api/decompress
 *
 * Recibe { algorithm, encodedBits, codes, tree } y devuelve
 * { decodedText }. El frontend reenvía el árbol (Huffman) o la tabla de
 * códigos (Shannon-Fano) que recibió en la respuesta de /api/compress,
 * ya que el backend no guarda estado entre pedidos: cada request trae
 * todo lo necesario para resolverse por sí solo.
 */
export function decompress(req, res) {
  const { algorithm, encodedBits, codes, tree } = req.body || {};

  if (!isValidAlgorithm(algorithm)) {
    return res.status(400).json({
      error: 'El campo "algorithm" debe ser "huffman" o "shannon-fano".',
    });
  }

  if (typeof encodedBits !== 'string' || encodedBits.length === 0) {
    return res.status(400).json({
      error: 'El campo "encodedBits" es obligatorio y no puede estar vacío.',
    });
  }

  try {
    const decodedText =
      algorithm === 'huffman'
        ? huffmanDecode(encodedBits, tree)
        : shannonFanoDecode(encodedBits, codes);

    return res.status(200).json({ decodedText });
  } catch (err) {
    console.error('Error en /api/decompress:', err);
    return res.status(500).json({
      error: 'Ocurrió un error interno al descomprimir el texto.',
    });
  }
}
