# Analizador de Textos IA

Aplicación web fullstack que analiza cualquier texto largo y devuelve:

1. **Resumen** de máximo 2 oraciones.
2. **Sentimiento** (Positivo / Negativo / Neutral) clasificado por BERT con score continuo.
3. **Etiquetas temáticas** extraídas del contenido.

Usa únicamente **Hugging Face** (API gratuita) como proveedor de IA.

---

## Requisito previo

Instalar **Node.js** versión 18 o superior: https://nodejs.org/ (descargar la versión LTS).

---

## Ejecución (Windows)

1. Descargar el proyecto: botón verde **"<> Code"** → **"Download ZIP"** → descomprimir
2. Obtener un token gratuito de Hugging Face: https://huggingface.co/settings/tokens (tipo "Read")
3. Hacer doble clic en **`iniciar.bat`**
4. La primera vez pedirá que pegues tu token de Hugging Face directamente en la ventana
5. Esperar a que se instalen las dependencias y se inicien los servidores
6. Abrir en el navegador: **http://localhost:5173**

---

## Ejecución (Mac / Linux)

1. Descargar el proyecto y descomprimir
2. Obtener un token gratuito de Hugging Face: https://huggingface.co/settings/tokens (tipo "Read")
3. Abrir una terminal en la carpeta del proyecto
4. Ejecutar:

```bash
npm install -g pnpm
pnpm install
cp .env.example .env
```

5. Editar el archivo `.env` y pegar tu token de Hugging Face
6. Iniciar los servidores en dos terminales:

```bash
# Terminal 1 (backend):
pnpm --filter @workspace/api-server run dev

# Terminal 2 (frontend):
pnpm --filter @workspace/text-insight run dev
```

7. Abrir en el navegador: **http://localhost:5173**

---

## Uso

1. Selecciona un modelo de IA (Qwen 72B recomendado).
2. Pega tu texto en el área de texto.
3. Haz clic en **"Analizar texto"**.
4. Verás: resumen, sentimiento con score BERT, y etiquetas.
