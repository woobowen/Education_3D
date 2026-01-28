import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../promptEngine';
import { UserProfile } from '../../../shared/types';

describe('PromptEngine Strategy Pattern Tests', () => {
  const baseProfile: UserProfile = {
    age: 25,
    gender: 'male',
    programmingLanguage: 'Python', // Placeholder
    studyCycle: '2h/day',
    difficulty: 'intermediate',
    learningGoal: 'Understanding internals'
  };

  describe('Strategy Dispatch', () => {
    it('should apply Go strategy correctly (Concurrency + Arrows)', () => {
      const goProfile: UserProfile = { ...baseProfile, programmingLanguage: 'Go' };
      const prompt = buildSystemPrompt(goProfile);

      // Verify Concurrency Visual strategy
      expect(prompt).toContain('- **Concurrency**: Visualize concurrent execution paths');
      
      // Verify Pointer Visual strategy (Arrow)
      expect(prompt).toContain('- **Relationships**: Use THREE.ArrowHelper');
    });

    it('should apply Python strategy correctly (Abstract Memory)', () => {
      const pythonProfile: UserProfile = { ...baseProfile, programmingLanguage: 'Python' };
      const prompt = buildSystemPrompt(pythonProfile);

      // Verify Memory Model strategy (Abstract -> NO Hex Memory Addresses)
      // "Hex Memory Addresses" is only added for 'manual' memory model
      expect(prompt).not.toContain('Hex Memory Addresses');
    });

    it('should apply Java strategy correctly (Managed Memory + Lines)', () => {
      const javaProfile: UserProfile = { ...baseProfile, programmingLanguage: 'Java' };
      const prompt = buildSystemPrompt(javaProfile);

      // Verify Pointer Visual strategy (Line)
      expect(prompt).toContain('- **Relationships**: Use thin lines to represent object references');
      
      // Verify Memory Model strategy (Managed -> NO Hex Memory Addresses)
      expect(prompt).not.toContain('Hex Memory Addresses');
    });
  });

  describe('Debug HUD Injection', () => {
    it('should inject fixed position Debug HUD in HTML', () => {
      const prompt = buildSystemPrompt(baseProfile);
      
      // Check for mandatory Debug HUD HTML structure
      expect(prompt).toContain('<div style="position: fixed;');
      expect(prompt).toContain('Active Profile:');
      expect(prompt).toContain('z-index: 9999;');
    });
  });

  describe('Default Fallback', () => {
    it('should use default strategy for unknown languages', () => {
      const rustProfile: UserProfile = { ...baseProfile, programmingLanguage: 'Rust' };
      
      // Should not throw
      const prompt = buildSystemPrompt(rustProfile);
      
      // Rust is not in registry, should fall back to DEFAULT_PROFILE (Script/Dynamic like Python)
      // Default profile has 'abstract' memory model, so no Hex Addresses
      expect(prompt).not.toContain('Hex Memory Addresses');
      
      // Default profile has 'none' pointer visual, so no ArrowHelper or Thin Lines specific text if check logic matches
      // Checking implementation: 'none' doesn't add a specific rule for relationships in the current code?
      // Let's check the code: 
      // if (arrow) ... else if (line) ...
      // So for 'none', neither is added.
      expect(prompt).not.toContain('THREE.ArrowHelper');
      expect(prompt).not.toContain('thin lines to represent object references');
    });
  });
});