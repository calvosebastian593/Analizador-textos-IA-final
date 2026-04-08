# Analizador de Textos IA

Aplicación web fullstack que analiza cualquier texto largo y devuelve:

1. **Resumen** de máximo 2 oraciones.
2. **Sentimiento** (Positivo / Negativo / Neutral) clasificado por BERT con score continuo.
3. **Etiquetas temáticas** extraídas del contenido.

Usa únicamente **Hugging Face** (API gratuita) como proveedor de IA.

---

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior → [Descargar aquí](https://nodejs.org/)
- **pnpm** → Una vez tengas Node.js, abre una terminal y ejecuta: `npm install -g pnpm`
- **Git** → [Descargar aquí](https://git-scm.com/downloads) (si no lo tienes)
- **API Key de Hugging Face** (gratuita) → [Crear token aquí](https://huggingface.co/settings/tokens) (tipo "Read")

---

## Instalación paso a paso

### 1. Descargar el proyecto

**Opción A (más fácil): Descargar como ZIP**

1. Ve a: https://github.com/calvosebastian593/Analizador-textos-IA-final
2. Haz clic en el botón verde **"<> Code"**
3. Selecciona **"Download ZIP"**
4. Descomprime el ZIP en la carpeta que quieras

**Opción B: Clonar con Git** (si tienes Git instalado)

```bash
git clone https://github.com/calvosebastian593/Analizador-textos-IA-final.git
```

### 2. Abrir una terminal dentro del proyecto

- **Windows**: Abre la carpeta del proyecto, haz clic en la barra de dirección del explorador, escribe `cmd` y presiona Enter
- **Mac/Linux**: Abre la terminal y navega a la carpeta del proyecto con `cd ruta/de/la/carpeta`

### 3. Instalar dependencias

```bash
pnpm install
```

Esto instala todas las librerías necesarias. Puede tomar unos minutos.

### 4. Configurar la API Key

Crea el archivo de configuración copiando el ejemplo:

```bash
cp .env.example .env
```

Abre el archivo `.env` con cualquier editor de texto (Notepad, VS Code, etc.) y reemplaza `tu_api_key_aqui` con tu token de Hugging Face:

```
HUGGINGFACE_API_KEY=hf_tu_token_aqui
```

### 5. Ejecutar la aplicación

Necesitas abrir **dos terminales** (ambas dentro de la carpeta del proyecto):

**Terminal 1** — Inicia el backend:

```bash
pnpm --filter @workspace/api-server run dev
```

Espera a que diga "Server listening" y luego abre la segunda terminal.

**Terminal 2** — Inicia el frontend:

```bash
pnpm --filter @workspace/text-insight run dev
```

Espera a que diga "Local: http://localhost:5173".

### 6. Abrir en el navegador

Abre tu navegador (Chrome, Firefox, etc.) y ve a:

```
http://localhost:5173
```

---

## Uso

1. Selecciona un modelo de IA (Qwen 72B recomendado).
2. Pega tu texto en el área de texto.
3. Haz clic en **"Analizar texto"**.
4. Verás: resumen, sentimiento con score BERT, y etiquetas.
