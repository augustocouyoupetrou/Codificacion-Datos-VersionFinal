import { buildFrequencyTable } from '../utils/frequency.js';

/**
 * Nodo del árbol de Huffman.
 * - Las hojas tienen `char` distinto de null.
 * - Los nodos internos tienen `char === null` y dos hijos (left/right).
 */
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

/**
 * Construye el árbol binario de Huffman a partir de la tabla de frecuencias.
 *
 * Algoritmo:
 * 1. Se crea un nodo hoja por cada símbolo distinto.
 * 2. Se toman repetidamente los DOS nodos de menor frecuencia.
 * 3. Se combinan en un nuevo nodo interno cuya frecuencia es la suma de ambos.
 * 4. Se repite hasta que quede un único nodo: la raíz del árbol.
 *
 * Como el alfabeto de símbolos distintos suele ser pequeño (decenas, no miles),
 * se prioriza la claridad usando un arreglo que se reordena en cada paso,
 * en lugar de una cola de prioridad optimizada.
 *
 * Caso especial: si el texto tiene un único símbolo distinto, no se puede
 * construir un árbol binario "real" (no hay con quién combinarlo), por lo
 * que se envuelve esa única hoja en un nodo raíz artificial. Esto garantiza
 * que el símbolo reciba el código "0" en lugar de un código vacío.
 *
 * @param {Object<string, number>} freqTable
 * @returns {HuffmanNode} raíz del árbol
 */
function buildHuffmanTree(freqTable) {
  let nodes = Object.entries(freqTable).map(
    ([char, freq]) => new HuffmanNode(char, freq)
  );

  if (nodes.length === 1) {
    const onlyNode = nodes[0];
    return new HuffmanNode(null, onlyNode.freq, onlyNode, null);
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
    nodes.push(merged);
  }

  return nodes[0];
}

/**
 * Recorre el árbol de Huffman generando el código binario de cada símbolo.
 * Ir a la izquierda agrega un '0', ir a la derecha agrega un '1'.
 *
 * @param {HuffmanNode} node
 * @param {string} prefix
 * @param {Object<string, string>} codes
 * @returns {Object<string, string>}
 */
function generateHuffmanCodes(node, prefix = '', codes = {}) {
  if (!node) return codes;

  if (node.char !== null) {
    // Hoja: si el prefijo está vacío (árbol de un solo símbolo) se usa "0".
    codes[node.char] = prefix || '0';
    return codes;
  }

  generateHuffmanCodes(node.left, prefix + '0', codes);
  generateHuffmanCodes(node.right, prefix + '1', codes);
  return codes;
}

/**
 * Codifica un texto utilizando el algoritmo de Huffman.
 *
 * @param {string} text - Texto original a comprimir.
 * @returns {{
 *   encodedBits: string,
 *   codes: Object<string, string>,
 *   freqTable: Object<string, number>,
 *   tree: HuffmanNode|null
 * }}
 */
export function huffmanEncode(text) {
  if (!text || text.length === 0) {
    return { encodedBits: '', codes: {}, freqTable: {}, tree: null };
  }

  const freqTable = buildFrequencyTable(text);
  const tree = buildHuffmanTree(freqTable);
  const codes = generateHuffmanCodes(tree);

  const encodedBits = text
    .split('')
    .map((char) => codes[char])
    .join('');

  return { encodedBits, codes, freqTable, tree };
}

/**
 * Decodifica una cadena de bits utilizando el árbol de Huffman generado
 * durante la codificación. Se recorre el árbol bit a bit: '0' va a la
 * izquierda, '1' va a la derecha; al llegar a una hoja se emite el símbolo
 * y se vuelve a la raíz.
 *
 * @param {string} encodedBits - Cadena de '0' y '1'.
 * @param {HuffmanNode} tree - Árbol de Huffman usado en la codificación.
 * @returns {string} Texto decodificado.
 */
export function huffmanDecode(encodedBits, tree) {
  if (!tree || !encodedBits) return '';

  let decoded = '';
  let node = tree;

  for (const bit of encodedBits) {
    node = bit === '0' ? node.left : node.right;

    if (!node) {
      // Bit inválido para este árbol; no debería ocurrir con datos propios.
      break;
    }

    if (node.char !== null) {
      decoded += node.char;
      node = tree;
    }
  }

  return decoded;
}
