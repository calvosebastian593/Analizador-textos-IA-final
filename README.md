# Analizador de Textos IA

## Requisitos previos

- **Node.js** versión 18 o superior → [Descargar aquí](https://nodejs.org/)
- **pnpm** → Instalar con: `npm install -g pnpm`
- **API Key de Hugging Face** (gratuita) → [Crear token aquí](https://huggingface.co/settings/tokens) (tipo "Read")

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd <nombre-del-proyecto>
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar la API Key

Copia el archivo de ejemplo y agrega tu clave:

```bash
cp .env.example .env
```

Abre `.env` con cualquier editor y reemplaza el valor:

```
HUGGINGFACE_API_KEY=hf_tu_token_aqui
```

### 4. Ejecutar la aplicación

Abre **dos terminales** en la raíz del proyecto:

**Terminal 1** — Backend:

```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2** — Frontend:

```bash
pnpm --filter @workspace/text-insight run dev
```

### 5. Abrir en el navegador

```
http://localhost:5173
```

---

## Uso

1. Selecciona un modelo de IA (Qwen 72B recomendado).
2. Pega tu texto en el área de texto.
3. Haz clic en **"Analizar texto"**.
4. Verás: resumen, sentimiento con score BERT, y etiquetas.
