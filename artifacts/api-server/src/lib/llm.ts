/**
 * llm.ts
 *
 * Módulo para generación de resumen y extracción de etiquetas
 * usando modelos de lenguaje grande (LLM) via Hugging Face Inference API.
 *
 * El análisis de sentimiento se delega a BERT (ver bert.ts).
 * Este módulo solo maneja resumen y etiquetas.
 */

import { HfInference } from "@huggingface/inference";

const PROMPT_SISTEMA = `Eres un experto en análisis de texto. Tu tarea es analizar el texto que te proporciona el usuario y devolver ÚNICAMENTE un JSON válido con la siguiente estructura exacta, sin ningún texto adicional antes o después:

{
  "resumen": "Síntesis del texto en máximo 2 oraciones claras y concisas.",
  "etiquetas": ["etiqueta1", "etiqueta2", "etiqueta3", "etiqueta4", "etiqueta5"]
}

Reglas estrictas:
- "resumen": Sintetiza las ideas principales del texto en máximo 2 oraciones.
- "etiquetas": Lista de 3 a 8 etiquetas con los temas y conceptos principales (en español, en minúsculas).
- NO incluyas análisis de sentimiento, eso se procesa por separado.
- Responde SOLO con el JSON, sin markdown, sin explicaciones, sin texto adicional.`;

function construirPromptUsuario(texto: string): string {
  return `Analiza el siguiente texto:\n\n${texto}`;
}

interface ResultadoLLM {
  resumen: string;
  etiquetas: string[];
}

function extraerJSON(texto: string): ResultadoLLM {
  const limpio = texto
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const match = limpio.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No se encontró JSON válido en la respuesta del modelo.");
  }

  return JSON.parse(match[0]) as ResultadoLLM;
}

/**
 * Usa Hugging Face Inference API (SDK oficial) para generar
 * el resumen y las etiquetas del texto.
 */
export async function analizarConHuggingFace(
  texto: string,
  modelo: string
): Promise<ResultadoLLM> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY no configurada. Agrégala al archivo .env."
    );
  }

  const hf = new HfInference(apiKey);

  const LLM_TIMEOUT_MS = 60_000;
  const respuesta = await Promise.race([
    hf.chatCompletion({
      model: modelo,
      messages: [
        { role: "system", content: PROMPT_SISTEMA },
        { role: "user", content: construirPromptUsuario(texto) },
      ],
      temperature: 0.3,
      max_tokens: 512,
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Tiempo de espera agotado para el modelo LLM (60s).")), LLM_TIMEOUT_MS)
    ),
  ]);

  const contenido = respuesta.choices[0]?.message?.content;
  if (!contenido) {
    throw new Error("El modelo no devolvió ninguna respuesta.");
  }

  return extraerJSON(contenido);
}
