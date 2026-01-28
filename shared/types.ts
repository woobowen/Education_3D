// 语言可视化配置文件
export interface LanguageVisualProfile {
  memoryModel: 'manual' | 'managed' | 'abstract';
  pointerVisual: 'arrow' | 'line' | 'none';
  collectionMeta: 'contiguous' | 'linked' | 'dynamic';
  codeStyle: 'strict' | 'script';
  concurrencyVisual: boolean;
}

export type LanguageProfileMap = Record<string, LanguageVisualProfile>;

// 共享类型定义

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  programmingLanguage: 'C' | 'C++' | 'Python' | 'Java' | 'Go' | string;
  studyCycle: string; // e.g., "3h/day"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningGoal: string;
}

export interface GenerationRequest {
  concept: string;
  userProfile?: UserProfile;
}

export interface GenerationProgress {
  type: 'progress' | 'complete' | 'error';
  message?: string;
  htmlContent?: string;
  aestheticAnalysis?: AestheticAnalysis;
  interactionGuide?: string[];
}

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

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}