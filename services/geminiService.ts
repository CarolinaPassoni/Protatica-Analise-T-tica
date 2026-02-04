import { GoogleGenAI } from "@google/genai";
import type { Analysis, GroundingSource } from "../types";

/**
 * PROTATICA — Gemini Service (Hardened)
 * Garantias:
 * - videoUrl na resposta é EXATAMENTE o link colado pelo usuário.
 * - Bloqueia análise se o modelo retornar outro videoId (anti “troca de vídeo”).
 * - Valida título via YouTube oEmbed; se não bater, bloqueia.
 * - Se não houver segurança, retorna erro (não chuta).
 */

const getApiKey = (): string | undefined => {
  // Vite: só variáveis com prefixo VITE_ chegam no browser
  const viteKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;

  // Compat: caso você tenha injetado via define (process.env.*)
  const procAny = (globalThis as any)?.process;
  const procKey = procAny?.env?.API_KEY as string | undefined;
  const procGeminiKey = procAny?.env?.GEMINI_API_KEY as string | undefined;

  return viteKey || procKey || procGeminiKey;
};

const getClient = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Chave de API não configurada. Defina VITE_GEMINI_API_KEY nas variáveis de ambiente (Vercel/Local) e faça um novo deploy."
    );
  }
  return new GoogleGenAI({ apiKey });
};

const extractYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;

    if (u.hostname.endsWith("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    const parts = u.pathname.split("/").filter(Boolean);
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];

    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];

    return null;
  } catch {
    return null;
  }
};

const fetchYouTubeOEmbed = async (
  youtubeUrl: string
): Promise<{ title?: string; author_name?: string } | null> => {
  try {
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
      youtubeUrl
    )}`;
    const res = await fetch(endpoint, { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data?.title, author_name: data?.author_name };
  } catch {
    return null;
  }
};

const parseJsonResponse = <T,>(text: string): T | null => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

const normalizeTitle = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");

const titlesLooselyMatch = (a: string, b: string): boolean => {
  const t1 = normalizeTitle(a);
  const t2 = normalizeTitle(b);
  if (!t1 || !t2) return false;
  return t1 === t2 || t1.includes(t2) || t2.includes(t1);
};

const getAnalysisFromWeb = async (
  youtubeUrl: string,
  mode: "web" | "video" = "web"
): Promise<Analysis> => {
  const model = "gemini-3-pro-preview";
  const isDetailed = mode === "video";

  // GUARDA 1: exige videoId válido no link
  const expectedVideoId = extractYouTubeId(youtubeUrl);
  if (!expectedVideoId) {
    throw new Error(
      "Link do YouTube inválido ou sem videoId. Cole a URL completa do vídeo (ex: https://www.youtube.com/watch?v=XXXX)."
    );
  }

  // GUARDA 2: valida o vídeo via oEmbed (link público/correto)
  const oembed = await fetchYouTubeOEmbed(youtubeUrl);
  if (!oembed?.title) {
    throw new Error(
      "Não foi possível validar esse vídeo pelo YouTube (oEmbed). Verifique se o link está correto e público."
    );
  }

  const analysisPrompt = `
SISTEMA PROTATICA — PRECISÃO E RASTREABILIDADE (HARDENED)

REFERÊNCIA OBRIGATÓRIA:
- LINK DO YOUTUBE (copie exatamente): ${youtubeUrl}
- VIDEO_ID_ESPERADO: ${expectedVideoId}
- METADADOS VERIFICADOS (oEmbed):
  - titulo: ${oembed.title}
  - canal: ${oembed.author_name ?? "indisponivel"}

REGRAS CRÍTICAS:
1) NÃO troque o vídeo por outro. Analise SOMENTE o vídeo com VIDEO_ID_ESPERADO.
2) "videoUrl" deve ser EXATAMENTE o link fornecido (sem encurtar/normalizar/remover parâmetros).
3) "videoId" deve ser exatamente: ${expectedVideoId}
4) "videoTitle" deve corresponder ao título verificado do oEmbed (diferenças pequenas como emoji/espaços são ok).
5) Se não conseguir identificar a partida com segurança, retorne error (não chute).

DIRETRIZ DE ERRO:
Retorne um JSON contendo "error" com:
"Incapaz de identificar com segurança a partida do vídeo ${youtubeUrl}. Por favor, verifique o link."

MODO: ${isDetailed ? "DETALHADO" : "RÁPIDO"}

SAÍDA (JSON):
{
  "videoTitle": "TÍTULO EXATO DO VÍDEO",
  "videoUrl": "${youtubeUrl}",
  "videoId": "${expectedVideoId}",

  "timeA": "Time A",
  "timeB": "Time B",
  "placar": "Placar real",
  "resumoPartida": "",
  "momentosChave": "",

  "contextoPartida": { "competicao":"", "temporada":"", "fase":"", "dataJogo":"", "estadio":"", "cidade":"" },

  "formacoes": {
    "timeA": { "esquema":"", "titulares":[], "banco":[], "destaquesFuncionais":"" },
    "timeB": { "esquema":"", "titulares":[], "banco":[], "destaquesFuncionais":"" }
  },

  "faseDefensiva": {
    "timeA": { "posicionamento":"", "compactacao_pressao":"", "transicao":"" },
    "timeB": { "posicionamento":"", "compactacao_pressao":"", "transicao":"" }
  },

  "faseOfensiva": {
    "timeA": { "saidaDeBola":"", "criacao":"", "finalizacao_movimentacao":"" },
    "timeB": { "saidaDeBola":"", "criacao":"", "finalizacao_movimentacao":"" }
  },

  "estrategiaComportamento": { "controleRitmoAdaptacao":"", "bolasParadas":"" },

  "estatisticas": {
    "posseDeBola": { "timeA":"", "timeB":"" },
    "finalizacoes": { "timeA":"", "timeB":"" },
    "finalizacoesNoAlvo": { "timeA":"", "timeB":"" }
  },

  "pontosFortes": { "timeA": [], "timeB": [] },
  "pontosFracos": { "timeA": [], "timeB": [] },

  "analiseJogadores": [],
  "conclusaoRecomendacoes": "",

  "verificacaoAuditoria": { "partidaIdentificada":"", "fontesPrincipais":[], "observacoes":"", "nivelConfianca":"alta | media | baixa" }
}
`;

  const response = await getClient().models.generateContent({
    model,
    contents: analysisPrompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 6000 },
    },
  });

  const analysis = parseJsonResponse<any>(response.text);

  if (!analysis) {
    throw new Error("Erro Crítico: não consegui processar a resposta do modelo. Tente novamente.");
  }

  if (analysis.error) {
    throw new Error(analysis.error);
  }

  // GUARDA 3: preserva link original EXATO
  analysis.videoUrl = youtubeUrl;

  // GUARDA 4: exige videoId e valida igual ao esperado
  const returnedId = (analysis as any)?.videoId as string | undefined;
  if (!returnedId) {
    throw new Error(
      "Erro: o modelo não retornou videoId. A análise foi bloqueada para evitar troca de vídeo."
    );
  }
  if (returnedId !== expectedVideoId) {
    throw new Error(
      `Erro: o modelo retornou um vídeo diferente do solicitado (ID ${returnedId} != ${expectedVideoId}).`
    );
  }

  // GUARDA 5: título deve bater com oEmbed (match “solto”)
  if (typeof analysis.videoTitle !== "string" || !titlesLooselyMatch(oembed.title, analysis.videoTitle)) {
    throw new Error(
      "Erro: o título retornado não corresponde ao vídeo informado. A análise foi bloqueada para evitar troca de vídeo."
    );
  }

  // Fontes (grounding)
  const sources: GroundingSource[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });
  }

  // Sempre inclui o próprio vídeo como primeira fonte; remove duplicados
  const uniqueSources: GroundingSource[] = [
    { title: "YouTube (vídeo analisado)", uri: youtubeUrl },
    ...sources,
  ].filter((src, idx, arr) => {
    const uri = (src.uri || "").trim();
    if (!uri) return false;
    return idx === arr.findIndex((s) => (s.uri || "").trim() === uri);
  });

  analysis.sources = uniqueSources;

  return analysis as Analysis;
};

const extractFramesFromVideo = (file: File, maxFrames: number = 20): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frames: string[] = [];

    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      let captured = 0;
      const step = video.duration / maxFrames;

      const capture = () => {
        if (captured < maxFrames) {
          video.currentTime = captured * step;
          video.onseeked = () => {
            ctx?.drawImage(video, 0, 0);
            frames.push(canvas.toDataURL("image/jpeg", 0.5).split(",")[1]);
            captured++;
            capture();
          };
        } else {
          URL.revokeObjectURL(video.src);
          resolve(frames);
        }
      };

      capture();
    };

    video.onerror = () => reject("Erro no processamento do vídeo.");
  });
};

const getAnalysisFromFile = async (file: File): Promise<Analysis> => {
  const model = "gemini-3-pro-preview";
  const frames = await extractFramesFromVideo(file);
  const imageParts = frames.map((data) => ({ inlineData: { mimeType: "image/jpeg", data } }));

  const response = await getClient().models.generateContent({
    model,
    contents: {
      parts: [
        {
          text: `Você é um analista tático. A partir dos frames, identifique a partida e gere um JSON.

Regras:
- videoTitle deve ser o nome do arquivo.
- videoUrl deve ser omitido ou null.
- Se não for possível identificar os times/placar com confiança, retorne um JSON com "error".
`,
        },
        ...imageParts,
      ],
    },
    config: { thinkingConfig: { thinkingBudget: 2000 } },
  });

  const analysis = parseJsonResponse<Analysis>(response.text);
  if (!analysis) throw new Error("Falha na análise visual.");
  (analysis as any).videoTitle = file.name;
  (analysis as any).videoUrl = undefined;
  return analysis;
};

export const analyzeFootballMatch = async (input: any): Promise<Analysis> => {
  if (input.type === "file") return await getAnalysisFromFile(input.file);
  return await getAnalysisFromWeb(input.url, input.mode);
};
