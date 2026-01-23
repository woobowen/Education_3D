// Zustand 狀態管理
import { create } from 'zustand';

export interface AestheticAnalysis {
  concept_analysis: {
    core_metaphor: string;
    emotional_tone: string;
    temporal_nature: string;
    spatial_structure: string;
  };
  aesthetic_decision: {
    art_movement: string;
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    material_style: string;
    lighting_mood: string;
  };
  interaction_design: {
    primary_gesture: string;
    discovery_moments: string[];
    learning_progression: string;
  };
}

export interface AppState {
  // 當前輸入的知識點
  currentConcept: string;
  setCurrentConcept: (concept: string) => void;

  // 生成狀態
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;

  // 進度消息
  progressMessage: string;
  setProgressMessage: (message: string) => void;

  // 生成的 HTML
  generatedHtml: string | null;
  setGeneratedHtml: (html: string | null) => void;

  // 美學分析
  aestheticAnalysis: AestheticAnalysis | null;
  setAestheticAnalysis: (analysis: AestheticAnalysis | null) => void;

  // 教育設計理念
  educationalRationale: string | null;
  setEducationalRationale: (rationale: string | null) => void;

  // 互動指南
  interactionGuide: string[];
  setInteractionGuide: (guide: string[]) => void;

  // 錯誤
  error: string | null;
  setError: (error: string | null) => void;

  // 重置狀態
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentConcept: '',
  setCurrentConcept: (concept) => set({ currentConcept: concept }),

  isGenerating: false,
  setIsGenerating: (value) => set({ isGenerating: value }),

  progressMessage: '',
  setProgressMessage: (message) => set({ progressMessage: message }),

  generatedHtml: null,
  setGeneratedHtml: (html) => set({ generatedHtml: html }),

  aestheticAnalysis: null,
  setAestheticAnalysis: (analysis) => set({ aestheticAnalysis: analysis }),

  educationalRationale: null,
  setEducationalRationale: (rationale) => set({ educationalRationale: rationale }),

  interactionGuide: [],
  setInteractionGuide: (guide) => set({ interactionGuide: guide }),

  error: null,
  setError: (error) => set({ error: error }),

  reset: () => set({
    generatedHtml: null,
    aestheticAnalysis: null,
    educationalRationale: null,
    interactionGuide: [],
    error: null,
    progressMessage: '',
  }),
}));
