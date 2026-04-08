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
3. Configurar el token de una de estas dos formas:
   Dentro de la carpeta descomprimida:
   - **Opción A**: Hacer doble clic en **`iniciar.bat`** y pegar el token cuando se lo requiera
   - **Opción B**: Abrir el archivo **`.env`** con un editor de texto y pegar el token manualmente siguiendo el formato del archivo **`.env_example`**
5. Esperar a que se instalen las dependencias y se inicien los servidores
6. Abrir en el navegador: **http://localhost:5173**


## Uso

1. Selecciona un modelo de IA (Qwen 72B recomendado).
2. Pega tu texto en el área de texto.
3. Haz clic en **"Analizar texto"**.
4. Verás: resumen, sentimiento con score BERT, y etiquetas.
