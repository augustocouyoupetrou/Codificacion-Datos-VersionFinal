import { buildFrequencyTable } from '../utils/frequency.js';

/**
 * Divide recursivamente la lista de símbolos (ordenada por frecuencia
 * descendente) en dos mitades cuya suma de frecuencias sea lo más
 * parecida posible, asignando '0' a la primera mitad y '1' a la segunda.
 * Esto se repite dentro de cada mitad hasta que cada grupo tenga un
 * único símbolo.
 *
 * @param {Array<{char: string, freq: number}>} symbols
 * @param {Object<string, string>} codes - Acumulador de códigos resultantes.
 * @param {string} prefix - Código acumulado hasta el momento.
 */
function shannonFanoRecursive(symbols, codes, prefix = '') {
  if (symbols.length === 0) return;

  if (symbols.length === 1) {
    // Si el prefijo está vacío (un solo símbolo en todo el texto) se usa "0".
    codes[symbols[0].char] = prefix || '0';
    return;
  }

  const total = symbols.reduce((sum, s) => sum + s.freq, 0);

  // Se busca el punto de corte que minimiza la diferencia entre la suma
  // de frecuencias del grupo izquierdo y la del grupo derecho.
  let bestIndex = 1;
  let bestDiff = Infinity;
  let cumulative = 0;

  for (let i = 0; i < symbols.length - 1; i++) {
    cumulative += symbols[i].freq;
    const diff = Math.abs(cumulative - (total - cumulative));
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i + 1;
    }
  }

  const left = symbols.slice(0, bestIndex);
  const right = symbols.slice(bestIndex);

  shannonFanoRecursive(left, codes, prefix + '0');
  shannonFanoRecursive(right, codes, prefix + '1');
}

/**
 * Codifica un texto utilizando el algoritmo de Shannon-Fano.
 *
 * Algoritmo:
 * 1. Se calcula la frecuencia de cada símbolo.
 * 2. Se ordenan los símbolos de mayor a menor frecuencia.
 * 3. Se divide la lista recursivamente en dos mitades de suma de
 *    frecuencias lo más equilibrada posible (top-down), asignando
 *    un bit a cada mitad.
 *
 * @param {string} text
 * @returns {{
 *   encodedBits: string,
 *   codes: Object<string, string>,
 *   freqTable: Object<string, number>
 * }}
 */
export function shannonFanoEncode(text) {
  if (!text || text.length === 0) {
    return { encodedBits: '', codes: {}, freqTable: {} };
  }

  const freqTable = buildFrequencyTable(text);

  const symbols = Object.entries(freqTable)
    .map(([char, freq]) => ({ char, freq }))
    .sort((a, b) => b.freq - a.freq);

  const codes = {};
  shannonFanoRecursive(symbols, codes);

  const encodedBits = text
    .split('')
    .map((char) => codes[char])
    .join('');

  return { encodedBits, codes, freqTable };
}

/**
 * Construye un trie (árbol de prefijos) binario a partir de la tabla de
 * códigos, para poder decodificar la cadena de bits sin ambigüedad.
 * Funciona porque Shannon-Fano garantiza códigos libres de prefijos.
 *
 * @param {Object<string, string>} codes
 * @returns {Object} raíz del trie
 */
function buildDecodingTrie(codes) {
  const root = {};
  for (const [char, code] of Object.entries(codes)) {
    let node = root;
    for (const bit of code) {
      if (!node[bit]) node[bit] = {};
      node = node[bit];
    }
    node.char = char;
  }
  return root;
}

/**
 * Decodifica una cadena de bits generada con Shannon-Fano, utilizando
 * la tabla de códigos (no existe un único "árbol de construcción" como
 * en Huffman, por lo que se reconstruye un trie de prefijos a partir
 * de los códigos para recorrerlo bit a bit).
 *
 * @param {string} encodedBits
 * @param {Object<string, string>} codes
 * @returns {string} Texto decodificado.
 */
export function shannonFanoDecode(encodedBits, codes) {
  if (!encodedBits || !codes || Object.keys(codes).length === 0) return '';

  const trie = buildDecodingTrie(codes);
  let decoded = '';
  let node = trie;

  for (const bit of encodedBits) {
    node = node[bit];

    if (!node) {
      // Bit inválido para esta tabla de códigos; no debería ocurrir.
      break;
    }

    if (node.char !== undefined) {
      decoded += node.char;
      node = trie;
    }
  }

  return decoded;
}
