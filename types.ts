export interface PlayerAnalysis {
  nome: string;
  analise: string;
}

export interface TeamMetrics {
  timeA: string;
  timeB: string;
}

export interface TeamStrengthsWeaknesses {
  timeA: string[];
  timeB: string[];
}

export interface FaseTatica {
  posicionamento: string;
  compactacao_pressao: string;
  transicao: string;
}

export interface FaseOfensiva {
  saidaDeBola: string;
  criacao: string;
  finalizacao_movimentacao: string;
}

export interface MapaDeCalor {
  tercoDefensivo: string;
  tercoMedio: string;
  tercoOfensivo: string;
}

export interface Estatisticas {
  posseDeBola: TeamMetrics;
  finalizacoes: TeamMetrics;
  finalizacoesNoAlvo: TeamMetrics;
  passesCertos: TeamMetrics;
  faltasCometidas: TeamMetrics;
  desarmes: TeamMetrics;
  escanteios: TeamMetrics;
  impedimentos: TeamMetrics;
  mapaDeCalor: {
    timeA: MapaDeCalor;
    timeB: MapaDeCalor;
  };
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

/** Campos extras (principalmente usados na Análise Detalhada - Vídeo) */
export interface ContextoPartida {
  competicao?: string;
  temporada?: string;
  fase?: string;
  dataJogo?: string;
  estadio?: string;
  cidade?: string;
  arbitro?: string;
  publico?: string;
  condicoesClimaticas?: string;
}

export interface FormacaoInfo {
  esquema?: string;              // ex: 4-3-3
  titulares?: string[];          // nomes (se disponíveis)
  banco?: string[];              // nomes (opcional)
  destaquesFuncionais?: string;  // papéis/rotações relevantes
}

export interface PressaoInfo {
  alturaBloco?: string;          // alto / medio / baixo + descrição
  gatilhos?: string;             // triggers de pressão
  comportamentoSemBola?: string; // coberturas, encaixes, etc.
  ppdaEstimado?: string;         // quando houver em fontes
  recuperacaoAlta?: string;      // descrição
}

export interface ModeloDeJogo {
  organizacao?: string;
  saidaDeBola?: string;
  progressao?: string;
  tercoFinal?: string;
  finalizacao?: string;
  transicaoOfensiva?: string;
  transicaoDefensiva?: string;
  contraPressao?: string;
}

export interface IndicadoresAvancados {
  xG?: TeamMetrics;
  grandesChances?: TeamMetrics;
  chutesNaArea?: TeamMetrics;
  chutesForaDaArea?: TeamMetrics;
  passesTercoFinal?: TeamMetrics;
  passesProgressivos?: TeamMetrics;
  cruzamentos?: TeamMetrics;
  duelosGanhos?: TeamMetrics;
  perdasDePosse?: TeamMetrics;
  recuperacoes?: TeamMetrics;
  fieldTilt?: TeamMetrics;
}

export interface EventoTimeline {
  minuto?: string;       // "12'", "45+2'", etc.
  time?: string;         // timeA ou timeB (nome)
  tipo?: string;         // gol, chance, cartão, substituição, ajuste, etc.
  descricao?: string;
  impactoTatico?: string;
}

export interface VerificacaoAuditoria {
  partidaIdentificada?: string;   // ex: "TimeA x TimeB - Competição - Data"
  fontesPrincipais?: string[];    // links/descrições
  observacoes?: string;           // divergências, limitações
  nivelConfianca?: "alta" | "media" | "baixa";
}

export interface RecomendacoesTime {
  timeA?: string[];
  timeB?: string[];
}

export interface Analysis {
  videoTitle: string;
  /**
   * URL exata do vídeo analisado (quando a entrada for por URL).
   * Deve preservar o mesmo link fornecido pelo usuário.
   */
  videoUrl?: string;

  timeA: string;
  timeB: string;
  placar: string;

  // Base
  resumoPartida: string;
  momentosChave: string;

  // Tática base
  faseDefensiva: {
    timeA: FaseTatica;
    timeB: FaseTatica;
  };
  faseOfensiva: {
    timeA: FaseOfensiva;
    timeB: FaseOfensiva;
  };
  estrategiaComportamento: {
    controleRitmoAdaptacao: string;
    bolasParadas: string;
  };

  estatisticas: Estatisticas;

  pontosFortes: TeamStrengthsWeaknesses;
  pontosFracos: TeamStrengthsWeaknesses;
  analiseJogadores: PlayerAnalysis[];
  conclusaoRecomendacoes: string;

  // Extras (detalhado)
  contextoPartida?: ContextoPartida;
  formacoes?: {
    timeA?: FormacaoInfo;
    timeB?: FormacaoInfo;
  };
  pressao?: {
    timeA?: PressaoInfo;
    timeB?: PressaoInfo;
  };
  modeloDeJogo?: {
    timeA?: ModeloDeJogo;
    timeB?: ModeloDeJogo;
  };
  indicadoresAvancados?: IndicadoresAvancados;
  linhaDoTempo?: EventoTimeline[];
  ajustesTreinadores?: string;
  recomendacoesTaticas?: RecomendacoesTime;
  verificacaoAuditoria?: VerificacaoAuditoria;

  sources?: GroundingSource[];
}
