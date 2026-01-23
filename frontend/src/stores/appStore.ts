// Zustand 状态管理
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
  // 当前输入的知识点
  currentConcept: string;
  setCurrentConcept: (concept: string) => void;

  // 生成状态
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;

  // 进度消息
  progressMessage: string;
  setProgressMessage: (message: string) => void;

  // 生成的 HTML
  generatedHtml: string | null;
  setGeneratedHtml: (html: string | null) => void;

  // 美学分析
  aestheticAnalysis: AestheticAnalysis | null;
  setAestheticAnalysis: (analysis: AestheticAnalysis | null) => void;

  // 教育设计理念
  educationalRationale: string | null;
  setEducationalRationale: (rationale: string | null) => void;

  // 交互指南
  interactionGuide: string[];
  setInteractionGuide: (guide: string[]) => void;

  // 错误
  error: string | null;
  setError: (error: string | null) => void;

  // 重置状态
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
