# Codificación de Datos — Huffman y Shannon-Fano (Frontend + Backend)

**Grupo 4**<br>
**Integrantes:**<br>
- Augusto Couyoupetrou 
- Lucio Cantalupo 
- Ciro Centurion

Aplicación web para el Trabajo Práctico de **Comunicación de Datos**. Permite
comprimir y descomprimir texto con los algoritmos **Huffman** y
**Shannon-Fano**, mostrando métricas y gráficos (Chart.js) de eficiencia de
codificación.

Arquitectura **frontend + backend**: el frontend (React) es una interfaz que
solo muestra datos; toda la codificación, decodificación y el cálculo de
métricas se ejecutan en el backend (Node.js + Express), expuestos como una
API REST que el frontend consume por HTTP.

## Tecnologías utilizadas

**Frontend**: React 18 (Create React App), Chart.js + react-chartjs-2,
FileReader API, CSS plano.

**Backend**: Node.js, Express, CORS. Módulos ES nativos (`"type": "module"`).

## Requisitos previos

- Node.js 18 o superior.
- npm (incluido con Node.js).

```bash
node -v
npm -v
```

## Instalación

El proyecto tiene **dos paquetes independientes**, cada uno con su propio
`package.json`: `frontend/` y `backend/`. Hay que instalar las dependencias
de cada uno por separado.

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Ejecución (se necesitan dos terminales abiertas a la vez)

**Terminal 1 — Backend** (debe arrancar primero):

```bash
cd backend
npm start
```

Esto levanta la API REST en `http://localhost:4000`. La consola debe mostrar:
`Servidor backend escuchando en http://localhost:4000`.

**Terminal 2 — Frontend**:

```bash
cd frontend
npm start
```

Esto abre `http://localhost:3000` en el navegador. El frontend está
configurado (campo `"proxy"` en `frontend/package.json`) para reenviar
automáticamente las peticiones a `/api/...` hacia `http://localhost:4000`,
así que no hace falta configurar nada más para que se hablen entre sí en
desarrollo.

> Si el backend no está corriendo, la aplicación lo va a indicar con un
> mensaje de error claro en pantalla (reutilizando el mismo cartel de error
> que ya existía) en lugar de fallar en silencio.

## Cómo usar la aplicación

1. Escriba texto o cargue un archivo `.txt` (hay ejemplos en `frontend/ejemplos/`).
2. Elija Huffman o Shannon-Fano.
3. Presione **Comprimir**: el frontend envía el texto al backend
   (`POST /api/compress`), que calcula frecuencias, códigos, métricas y la
   tabla de resultados, y los devuelve en la respuesta. La interfaz muestra
   las métricas, la tabla, los gráficos y el flujo de bits.
4. Presione **Descomprimir**: el frontend envía los datos codificados al
   backend (`POST /api/decompress`), que reconstruye el texto original y lo
   devuelve. Se verifica que coincida con el texto de entrada.

## API REST expuesta por el backend

### `POST /api/compress`

Pedido:
```json
{ "text": "el texto a comprimir", "algorithm": "huffman" }
```
(`"algorithm"` es `"huffman"` o `"shannon-fano"`)

Respuesta `200`:
```json
{
  "encodedBits": "0101...",
  "codes": { "e": "0", "l": "10" },
  "freqTable": { "e": 4, "l": 3 },
  "tree": { "char": null, "freq": 11, "left": { }, "right": { } },
  "metrics": {
    "originalSizeBytes": 11,
    "originalSizeBits": 88,
    "encodedSizeBits": 13,
    "encodedSizeBytes": 1.625,
    "compressionPercentage": 85.2,
    "symbolCount": 4
  },
  "resultsTable": [
    { "char": "e", "freq": 4, "probability": 0.36, "code": "0", "codeLength": 1 }
  ]
}
```
`tree` solo viene poblado cuando `algorithm` es `"huffman"`; en Shannon-Fano
es `null` (la decodificación usa `codes`, no un árbol).

Respuesta `400` (texto vacío o algoritmo inválido):
```json
{ "error": "El campo \"text\" es obligatorio y no puede estar vacío." }
```

### `POST /api/decompress`

Pedido:
```json
{
  "algorithm": "huffman",
  "encodedBits": "0101...",
  "codes": { "e": "0", "l": "10" },
  "tree": { "char": null, "freq": 11, "left": { }, "right": { } }
}
```

El frontend reenvía exactamente el `tree`/`codes` que recibió en la
respuesta de `/api/compress`: el backend no guarda estado entre pedidos,
cada request trae todo lo necesario para resolverse por sí solo.

Respuesta `200`:
```json
{ "decodedText": "el texto a comprimir" }
```

## Estructura del proyecto

```
huffman-shannon-app/
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── ejemplos/
│   │   ├── ejemplo1.txt
│   │   └── ejemplo2_alta_compresion.txt
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.jsx
│       ├── App.css
│       ├── services/
│       │   └── compressionApi.js
│       ├── utils/
│       │   ├── chartSetup.js
│       │   └── formatChar.js
│       └── components/
│           ├── Header.jsx
│           ├── InputPanel.jsx
│           ├── AlgorithmSelector.jsx
│           ├── ActionButtons.jsx
│           ├── MetricsPanel.jsx
│           ├── FrequencyTable.jsx
│           ├── FrequencyChart.jsx
│           ├── ComparisonChart.jsx
│           ├── EncodedPreview.jsx
│           └── DecodedPanel.jsx
│
└── backend/
    ├── package.json
    ├── server.js
    └── src/
        ├── algorithms/
        │   ├── huffman.js
        │   └── shannonFano.js
        ├── utils/
        │   └── metrics.js
        ├── controllers/
        │   └── compressionController.js
        └── routes/
            └── compressionRoutes.js
```

## Notas sobre el cálculo de métricas

- El **tamaño original** se calcula en bytes reales codificando el texto en
  UTF-8 (`TextEncoder`, disponible también en Node.js de forma nativa), no
  como una simple cuenta de caracteres × 8 bits.
- El **tamaño codificado** es la longitud real (en bits) de la cadena
  binaria generada por el algoritmo seleccionado.
- Tanto Huffman como Shannon-Fano son algoritmos de **compresión sin
  pérdida**: el texto descomprimido debe coincidir siempre, carácter por
  carácter, con el texto original.
