/**
 * analizar.ts
 *
 * Ruta principal del análisis de texto.
 *
 * Flujo:
 *  1. El LLM (Hugging Face) genera el resumen y las etiquetas.
 *  2. BERT (via Hugging Face) analiza el sentimiento con score continuo.
 *  3. Si BERT no está disponible, el sentimiento queda como "Neutral".
 */

import { Router, type IRouter } from "express";
import { AnalyzeTextBody } from "@workspace/api-zod";
import { analizarConHuggingFace } from "../lib/llm";
import { analizarSentimientoBERT } from "../lib/bert";

const router: IRouter = Router();

const MODELOS_DISPONIBLES = [
  {
    id: "huggingface",
    name: "Hugging Face",
    models: [
      {
        id: "Qwen/Qwen2.5-72B-Instruct",
        name: "Qwen 2.5 72B (Recomendado)",
      },
      {
        id: "Qwen/Qwen2.5-Coder-32B-Instruct",
        name: "Qwen 2.5 Coder 32B",
      },
      {
        id: "meta-llama/Llama-3.1-8B-Instruct",
        name: "Llama 3.1 8B",
      },
    ],
  },
];

const MODELOS_VALIDOS = new Set(
  MODELOS_DISPONIBLES.flatMap((p) => p.models.map((m) => m.id))
);

router.get("/models", (_req, res) => {
  res.json({ providers: MODELOS_DISPONIBLES });
});

router.post("/analyze", async (req, res) => {
  const parseResult = AnalyzeTextBody.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error:
        "Solicitud inválida. Verifica que el texto y modelo estén correctamente enviados.",
    });
    return;
  }

  const { text, model } = parseResult.data;

  if (!text || text.trim().length === 0) {
    res.status(400).json({ error: "El texto no puede estar vacío." });
    return;
  }

  if (text.trim().length < 20) {
    res.status(400).json({
      error:
        "El texto es demasiado corto. Por favor proporciona al menos 20 caracteres.",
    });
    return;
  }

  if (!MODELOS_VALIDOS.has(model)) {
    res.status(400).json({
      error: `Modelo "${model}" no disponible.`,
    });
    return;
  }

  try {
    const llmPromise = analizarConHuggingFace(text, model);

    const bertPromise = analizarSentimientoBERT(text).catch((err: unknown) => {
      req.log.warn({ err }, "BERT no disponible, sentimiento quedará Neutral");
      return null;
    });

    const [resultadoLLM, resultadoBERT] = await Promise.all([
      llmPromise,
      bertPromise,
    ]);

    const { resumen, etiquetas } = resultadoLLM;

    let sentimiento: string;
    let bertScore: number | undefined;
    let bertMethod: string;

    if (resultadoBERT) {
      sentimiento = resultadoBERT.sentimiento;
      bertScore = resultadoBERT.scoreContinuo;
      bertMethod = "bert";
    } else {
      sentimiento = "Neutral";
      bertMethod = "fallback";
    }

    const sentimientosValidos = ["Positivo", "Negativo", "Neutral"];
    if (!sentimientosValidos.includes(sentimiento)) {
      sentimiento = "Neutral";
    }

    res.json({
      summary: resumen,
      sentiment: sentimiento,
      tags: etiquetas,
      model,
      provider: "huggingface",
      ...(bertScore !== undefined && { bertScore }),
      bertMethod,
    });
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error
        ? err.message
        : "Error desconocido al procesar el análisis.";
    req.log.error({ err }, "Error al analizar texto");
    res.status(500).json({ error: mensaje });
  }
});

export default router;
