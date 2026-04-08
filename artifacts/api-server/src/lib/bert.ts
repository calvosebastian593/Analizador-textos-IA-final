/**
 * bert.ts
 *
 * Módulo para el análisis de sentimiento usando el modelo BERT multilingüe
 * a través del SDK oficial de Hugging Face.
 *
 * Modelo: nlptown/bert-base-multilingual-uncased-sentiment
 *   - Devuelve probabilidades para 5 categorías (1 a 5 estrellas)
 *   - Se aplica score continuo (media ponderada) en lugar de argmax
 *     según la metodología del paper: Análisis de sentimientos con lógica
 *     difusa para chatbots (Calvo & Rodríguez)
 *
 * Score continuo: S_cont = 1 + Σ(i * p_i) para i = 0..4
 *   donde p_i es la probabilidad de la clase (i+1) estrellas
 *
 * Mapeo a etiqueta final:
 *   S_cont <= 2.0  → Negativo
 *   S_cont >= 4.0  → Positivo
 *   en el medio    → Neutral
 */

import { HfInference } from "@huggingface/inference";

const BERT_MODEL = "nlptown/bert-base-multilingual-uncased-sentiment";

/**
 * Calcula el score continuo (media ponderada) a partir de las probabilidades
 * de las 5 clases del modelo BERT de sentimiento.
 *
 * Fórmula: S_cont = 1 + Σ(i * p_i) para i = 0..4
 *
 * Esto produce un valor continuo entre 1.0 y 5.0, donde:
 *   1.0 = sentimiento completamente negativo
 *   3.0 = sentimiento neutral
 *   5.0 = sentimiento completamente positivo
 */
function calcularScoreContinuo(probabilidades: Map<string, number>): number {
  let score = 0;

  for (const [label, prob] of probabilidades.entries()) {
    const estrellas = parseInt(label.replace(/\D/g, ""), 10);
    if (!isNaN(estrellas) && estrellas >= 1 && estrellas <= 5) {
      score += (estrellas - 1) * prob;
    }
  }

  return 1 + score;
}

/**
 * Mapea el score continuo a una etiqueta de sentimiento.
 *
 * Umbrales:
 *   S_cont <= 2.0  → "Negativo"
 *   S_cont >= 4.0  → "Positivo"
 *   en el medio    → "Neutral"
 */
function mapearSentimiento(scoreContinuo: number): string {
  if (scoreContinuo <= 2.0) return "Negativo";
  if (scoreContinuo >= 4.0) return "Positivo";
  return "Neutral";
}

export interface ResultadoBERT {
  sentimiento: string;
  scoreContinuo: number;
  modelo: string;
}

/**
 * Analiza el sentimiento del texto usando BERT via Hugging Face SDK.
 *
 * Retorna la clasificación de sentimiento con score continuo.
 * Lanza un error si HUGGINGFACE_API_KEY no está configurada.
 */
export async function analizarSentimientoBERT(
  texto: string
): Promise<ResultadoBERT> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY no configurada. Agrégala al archivo .env para habilitar BERT."
    );
  }

  const hf = new HfInference(apiKey);

  const textoTruncado = texto.length > 512 ? texto.slice(0, 512) : texto;

  const BERT_TIMEOUT_MS = 30_000;
  const resultados = await Promise.race([
    hf.textClassification({
      model: BERT_MODEL,
      inputs: textoTruncado,
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Tiempo de espera agotado para BERT (30s).")), BERT_TIMEOUT_MS)
    ),
  ]);

  if (!resultados || resultados.length === 0) {
    throw new Error("BERT no devolvió resultados de clasificación.");
  }

  const probabilidades = new Map<string, number>();
  for (const r of resultados) {
    probabilidades.set(r.label, r.score);
  }

  const scoreContinuo = calcularScoreContinuo(probabilidades);
  const sentimiento = mapearSentimiento(scoreContinuo);

  return {
    sentimiento,
    scoreContinuo: Math.round(scoreContinuo * 100) / 100,
    modelo: BERT_MODEL,
  };
}
