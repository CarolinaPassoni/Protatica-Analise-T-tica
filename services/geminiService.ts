
import { GoogleGenAI } from "@google/genai";
import type { Analysis, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(text: string): T | null => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
            console.error("No JSON object found in response");
            return null;
        }

        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        return null;
    }
};

const getAnalysisFromWeb = async (youtubeUrl: string, mode: 'web' | 'video' = 'web'): Promise<Analysis> => {
    const model = 'gemini-3-pro-preview';
    const isDetailed = mode === 'video';
    
    const analysisPrompt = `
      SISTEMA DE AUDITORIA TÁTICA PROTATICA V6 — PRECISÃO E RASTREABILIDADE.

      REFERÊNCIA OBRIGATÓRIA:
      LINK DO YOUTUBE: ${youtubeUrl}

      REGRA DE OURO (CRÍTICA):
      - Você deve usar EXATAMENTE o link fornecido pelo usuário em "videoUrl" (sem encurtar, sem alterar parâmetros, sem trocar por outra forma).
      - A análise precisa ser CONDIZENTE com o conteúdo do vídeo e com a partida correta.

      PROTOCOLO DE VERIFICAÇÃO EM CADEIA (CRÍTICO):
      1) IDENTIFICAÇÃO PRIMÁRIA: Use o Google Search para acessar o link ${youtubeUrl}. Extraia TÍTULO EXATO, CANAL e DATA DE PUBLICAÇÃO.
      2) IDENTIFICAÇÃO DA PARTIDA: Pelo título/descrição (e, se necessário, fontes confiáveis), determine: times, competição e data do jogo.
      3) VALIDAÇÃO: Busque escalações, placar e estatísticas SOMENTE da partida identificada no passo 2.
      4) CONSISTÊNCIA COM O VÍDEO: A análise deve refletir o que o vídeo mostra/comenta (momentos, comportamento tático, ajustes).

      DIRETRIZ DE ERRO:
      Se você não conseguir identificar a partida com confiança suficiente, retorne:
      um JSON contendo a chave "error" com a mensagem: Incapaz de verificar a partida do vídeo ${youtubeUrl}. Por favor, verifique o link.

      MODO: ${isDetailed ? 'ANÁLISE DETALHADA (VÍDEO) — COMPLETA, MULTIPARÂMETROS' : 'ANÁLISE RÁPIDA (WEB) — OBJETIVA'}

      SAÍDA OBRIGATÓRIA (JSON):
      {
        "videoTitle": "TÍTULO EXATO DO VÍDEO",
        "videoUrl": "COPIE EXATAMENTE O LINK DO YOUTUBE INFORMADO NO INÍCIO (SEM ALTERAR)",
        "timeA": "Time A",
        "timeB": "Time B",
        "placar": "Placar real (ex: 2 x 1)",
        "resumoPartida": "Resumo fiel ao vídeo e à partida correta.",
        "momentosChave": "Cronologia dos lances e acontecimentos mais relevantes (com minutos quando possível).",

        "contextoPartida": {
          "competicao": "Ex: Brasileirão / Libertadores / Copa do Mundo",
          "temporada": "Ex: 2023/24",
          "fase": "Ex: final / semifinal / rodada X",
          "dataJogo": "DD/MM/AAAA (se encontrado)",
          "estadio": "Nome (se encontrado)",
          "cidade": "Cidade (se encontrado)",
          "arbitro": "Nome (se encontrado)",
          "publico": "Número (se encontrado)",
          "condicoesClimaticas": "Se o vídeo/fontes indicarem"
        },

        "formacoes": {
          "timeA": {
            "esquema": "Ex: 4-3-3",
            "titulares": ["..."],
            "banco": ["..."],
            "destaquesFuncionais": "Papéis, inversões, rotações, encaixes, etc."
          },
          "timeB": {
            "esquema": "Ex: 4-4-2",
            "titulares": ["..."],
            "banco": ["..."],
            "destaquesFuncionais": "Papéis, inversões, rotações, encaixes, etc."
          }
        },

        "faseDefensiva": {
          "timeA": {"posicionamento":"...","compactacao_pressao":"...","transicao":"..."},
          "timeB": {"posicionamento":"...","compactacao_pressao":"...","transicao":"..."}
        },

        "faseOfensiva": {
          "timeA": {"saidaDeBola":"...","criacao":"...","finalizacao_movimentacao":"..."},
          "timeB": {"saidaDeBola":"...","criacao":"...","finalizacao_movimentacao":"..."}
        },

        "pressao": {
          "timeA": {"alturaBloco":"...","gatilhos":"...","comportamentoSemBola":"...","ppdaEstimado":"...","recuperacaoAlta":"..."},
          "timeB": {"alturaBloco":"...","gatilhos":"...","comportamentoSemBola":"...","ppdaEstimado":"...","recuperacaoAlta":"..."}
        },

        "modeloDeJogo": {
          "timeA": {
            "organizacao":"Princípios e estrutura com bola/sem bola",
            "saidaDeBola":"Padrões (3+1, 2+3, apoios, atração, etc.)",
            "progressao":"Como progride (corredor/entrelinhas/terceiro homem)",
            "tercoFinal":"Ataque ao último terço (amplitudes, half-space, cruzamentos, infiltrações)",
            "finalizacao":"Volume, qualidade, zonas e tipos",
            "transicaoOfensiva":"Como acelera após recuperar",
            "transicaoDefensiva":"Como reage ao perder",
            "contraPressao":"Intensidade e organização"
          },
          "timeB": {
            "organizacao":"...",
            "saidaDeBola":"...",
            "progressao":"...",
            "tercoFinal":"...",
            "finalizacao":"...",
            "transicaoOfensiva":"...",
            "transicaoDefensiva":"...",
            "contraPressao":"..."
          }
        },

        "estrategiaComportamento": {
          "controleRitmoAdaptacao": "Como cada time controlou o ritmo e se adaptou ao jogo.",
          "bolasParadas": "Resumo de bolas paradas (ofensivas/defensivas) e impacto."
        },

        "estatisticas": {
          "posseDeBola": {"timeA": "XX%", "timeB": "XX%"},
          "finalizacoes": {"timeA": "X", "timeB": "Y"},
          "finalizacoesNoAlvo": {"timeA": "X", "timeB": "Y"},
          "passesCertos": {"timeA": "XX%", "timeB": "XX%"},
          "faltasCometidas": {"timeA": "X", "timeB": "Y"},
          "desarmes": {"timeA": "X", "timeB": "Y"},
          "escanteios": {"timeA": "X", "timeB": "Y"},
          "impedimentos": {"timeA": "X", "timeB": "Y"},
          "mapaDeCalor": {
            "timeA": {"tercoDefensivo": "XX%", "tercoMedio": "XX%", "tercoOfensivo": "XX%"},
            "timeB": {"tercoDefensivo": "XX%", "tercoMedio": "XX%", "tercoOfensivo": "XX%"}
          }
        },

        "indicadoresAvancados": {
          "xG": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "grandesChances": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "chutesNaArea": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "chutesForaDaArea": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "passesTercoFinal": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "passesProgressivos": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "cruzamentos": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "duelosGanhos": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "perdasDePosse": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "recuperacoes": {"timeA":"(se houver)", "timeB":"(se houver)"},
          "fieldTilt": {"timeA":"(se houver)", "timeB":"(se houver)"}
        },

        "pontosFortes": { "timeA": ["..."], "timeB": ["..."] },
        "pontosFracos": { "timeA": ["..."], "timeB": ["..."] },

        "analiseJogadores": [
          {"nome":"Jogador", "analise":"Função, impacto, decisões, erros/acertos (condizente com vídeo e partida)."}
        ],

        "linhaDoTempo": [
          {"minuto":"12'", "time":"Time A", "tipo":"chance/gol/cartao/ajuste/substituicao", "descricao":"...", "impactoTatico":"..."}
        ],

        "ajustesTreinadores": "Mudanças táticas durante o jogo (substituições e ajustes) e efeitos.",
        "recomendacoesTaticas": {
          "timeA": ["Ajuste 1", "Ajuste 2"],
          "timeB": ["Ajuste 1", "Ajuste 2"]
        },

        "conclusaoRecomendacoes": "Veredito técnico final e recomendações práticas.",
        "verificacaoAuditoria": {
          "partidaIdentificada": "TimeA x TimeB — competição — data",
          "fontesPrincipais": ["..."],
          "observacoes": "Limitações, divergências ou ausência de dados.",
          "nivelConfianca": "alta | media | baixa"
        }
      }

      IMPORTANTE:
      - Se estiver em modo ANÁLISE RÁPIDA (WEB), você pode resumir/omitir listas longas (titulares/banco/linhaDoTempo), mas mantenha a estrutura e preencha ao menos com valores coerentes (ou strings vazias) sem inventar fatos conflitantes.
    
    `;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: analysisPrompt,
        config: {
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 6000 }
        }
    });

    const analysis = parseJsonResponse<any>(response.text);

    if (!analysis) {
        throw new Error("Erro Crítico: O sistema não conseguiu processar os dados deste vídeo. Tente novamente.");
    }

    if (analysis.error) {
        throw new Error(analysis.error);
    }

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Garantia de auditoria: sempre preservar exatamente o link original fornecido.
    analysis.videoUrl = youtubeUrl;

    // Incluir explicitamente o próprio vídeo como primeira fonte (sem depender do grounding).
    const uniqueSources: GroundingSource[] = [
      { title: 'YouTube (vídeo analisado)', uri: youtubeUrl },
      ...sources,
    ].filter((src, idx, arr) => {
      const uri = (src.uri || '').trim();
      if (!uri) return false;
      return idx === arr.findIndex(s => (s.uri || '').trim() === uri);
    });
    analysis.sources = uniqueSources;

    return analysis as Analysis;
};

const extractFramesFromVideo = (file: File, maxFrames: number = 20): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
                        frames.push(canvas.toDataURL('image/jpeg', 0.5).split(',')[1]);
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
    const model = 'gemini-3-pro-preview';
    const frames = await extractFramesFromVideo(file);
    const imageParts = frames.map(data => ({ inlineData: { mimeType: 'image/jpeg', data } }));
    
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { text: `Você é um analista tático. A partir dos frames, identifique a partida e gere um JSON no mesmo formato do modo detalhado (V6).

Regras:
- videoTitle deve ser o nome do arquivo.
- videoUrl deve ser omitido ou null.
- Se não for possível identificar os times/placar com confiança, retorne um JSON contendo a chave "error" com a mensagem: Incapaz de identificar a partida a partir do arquivo.

Campos mínimos obrigatórios: videoTitle, timeA, timeB, placar, resumoPartida, momentosChave, faseDefensiva, faseOfensiva, estrategiaComportamento, estatisticas, pontosFortes, pontosFracos, analiseJogadores, conclusaoRecomendacoes.
` },
                ...imageParts
            ]
        },
        config: {
            thinkingConfig: { thinkingBudget: 2000 }
        }
    });

    const analysis = parseJsonResponse<Analysis>(response.text);
    if (!analysis) throw new Error("Falha na análise visual.");
    analysis.videoTitle = file.name;
    // Arquivo local não possui URL de origem.
    analysis.videoUrl = undefined;
    return analysis;
};

export const analyzeFootballMatch = async (input: any): Promise<Analysis> => {
    if (input.type === 'file') return await getAnalysisFromFile(input.file);
    return await getAnalysisFromWeb(input.url, input.mode);
};
