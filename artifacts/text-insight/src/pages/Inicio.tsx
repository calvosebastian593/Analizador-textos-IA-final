import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetModels, useAnalyzeText, getGetModelsQueryKey } from "@workspace/api-client-react";
import { SiHuggingface } from "react-icons/si";
import { FileText, Tags, Loader2, Sparkles, TriangleAlert, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Inicio() {
  const [texto, setTexto] = useState("");
  const [modelo, setModelo] = useState("");

  const { data: datosModelos, isLoading: cargandoModelos } = useGetModels({
    query: { queryKey: getGetModelsQueryKey() },
  });

  const mutacionAnalisis = useAnalyzeText();

  const handleAnalizar = () => {
    if (!texto.trim()) return;
    mutacionAnalisis.mutate({
      data: {
        text: texto,
        provider: "huggingface",
        model: modelo,
      },
    });
  };

  const proveedorHF = datosModelos?.providers?.find((p) => p.id === "huggingface");
  const opcionesModelo = proveedorHF?.models || [];

  useEffect(() => {
    if (opcionesModelo.length > 0 && !opcionesModelo.find((m) => m.id === modelo)) {
      setModelo(opcionesModelo[0].id);
    }
  }, [opcionesModelo, modelo]);

  const resultado = mutacionAnalisis.data;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <main className="w-full max-w-4xl px-6 py-12 flex flex-col gap-8">

        <header className="flex flex-col gap-2 items-center text-center mb-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-2">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Analizador de Textos IA</h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Analiza el contenido de tus textos con inteligencia artificial. Obtén resúmenes,
            análisis de sentimiento con BERT y etiquetas de temas.
          </p>
        </header>

        <div className="flex flex-col gap-6 w-full">
          <Card className="border shadow-md bg-card/50 backdrop-blur">
            <CardContent className="p-6 flex flex-col gap-4">

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground ml-1">
                    Modelo de IA
                  </label>
                  <Select
                    value={modelo}
                    onValueChange={setModelo}
                    disabled={cargandoModelos || !opcionesModelo.length}
                  >
                    <SelectTrigger className="w-full h-11" data-testid="select-model">
                      <SelectValue placeholder={cargandoModelos ? "Cargando..." : "Selecciona modelo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {opcionesModelo.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
                  <SiHuggingface className="w-4 h-4 text-yellow-500" />
                  <span>Hugging Face</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Texto a analizar
                </label>
                <Textarea
                  placeholder="Pega aquí tu texto largo para analizarlo..."
                  className="min-h-[200px] resize-y text-base p-4 focus-visible:ring-primary/30 font-sans"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  data-testid="textarea-input"
                />
                {texto.length > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    {texto.length} caracteres
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  size="lg"
                  className="font-semibold px-8 hover-elevate transition-all"
                  onClick={handleAnalizar}
                  disabled={!texto.trim() || !modelo || mutacionAnalisis.isPending}
                  data-testid="button-analyze"
                >
                  {mutacionAnalisis.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analizar texto
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {mutacionAnalisis.isError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl flex items-start gap-3">
                  <TriangleAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 text-destructive">
                    <p className="font-semibold">Error en el análisis</p>
                    <p className="text-sm opacity-90">
                      {mutacionAnalisis.error?.data?.error
                        || mutacionAnalisis.error?.message
                        || "Error desconocido. Intenta de nuevo."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {mutacionAnalisis.isSuccess && resultado && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex flex-col gap-6"
              >
                <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                  <span>
                    Modelo:{" "}
                    <span className="font-semibold text-foreground/80">{resultado.model}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>
                      Sentimiento:{" "}
                      <span className="font-semibold">
                        {resultado.bertMethod === "bert" ? "BERT" : "Fallback"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card
                    className="md:col-span-2 border-border/50 shadow-sm bg-card overflow-hidden"
                    data-testid="card-summary"
                  >
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                      <CardTitle className="flex items-center gap-2 text-lg text-primary">
                        <FileText className="w-5 h-5" />
                        Resumen inteligente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                        {resultado.summary}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-border/50 shadow-sm bg-card overflow-hidden"
                    data-testid="card-sentiment"
                  >
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                      <CardTitle className="flex items-center gap-2 text-lg text-primary">
                        Sentimiento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[140px] gap-4">
                      {resultado.sentiment === "Positivo" ? (
                        <Badge
                          className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border border-emerald-500/30 text-lg px-6 py-2"
                          data-testid="badge-sentiment"
                        >
                          Positivo
                        </Badge>
                      ) : resultado.sentiment === "Negativo" ? (
                        <Badge
                          className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/30 text-lg px-6 py-2"
                          data-testid="badge-sentiment"
                        >
                          Negativo
                        </Badge>
                      ) : (
                        <Badge
                          className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30 text-lg px-6 py-2"
                          data-testid="badge-sentiment"
                        >
                          Neutral
                        </Badge>
                      )}

                      {resultado.bertScore !== undefined && resultado.bertScore !== null && (
                        <div className="text-center flex flex-col gap-1">
                          <p className="text-xs text-muted-foreground">Score BERT continuo</p>
                          <p className="text-2xl font-bold text-foreground">
                            {resultado.bertScore.toFixed(2)}
                            <span className="text-sm font-normal text-muted-foreground"> / 5.00</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            nlptown/bert-base-multilingual
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card
                  className="border-border/50 shadow-sm bg-card overflow-hidden"
                  data-testid="card-tags"
                >
                  <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                      <Tags className="w-5 h-5" />
                      Etiquetas temáticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {resultado.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="px-4 py-1.5 text-sm font-medium bg-secondary/80 hover:bg-secondary border border-border/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!mutacionAnalisis.isPending && !mutacionAnalisis.isSuccess && !mutacionAnalisis.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-16 flex flex-col items-center justify-center text-center opacity-60 mt-4"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Listo para analizar</h3>
                <p className="text-muted-foreground max-w-sm">
                  Pega tu texto arriba, selecciona un modelo y haz clic en "Analizar texto".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
