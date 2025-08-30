// Cores baseadas no design do Pile - minimalista e clean
export const Colors = {
  // Cores principais
  background: '#ffffff',
  foreground: '#1a1a1a',
  
  // Cards e superfícies
  card: '#f8f9fa',
  cardForeground: '#1a1a1a',
  
  // Primary (azul para ações importantes)
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  
  // Secondary (tons de cinza)
  secondary: '#f1f5f9',
  secondaryForeground: '#1e293b',
  
  // Muted (textos secundários)
  muted: '#f8fafc',
  mutedForeground: '#64748b',
  
  // Accent (destaques sutis)
  accent: '#f1f5f9',
  accentForeground: '#1e293b',
  
  // Bordas e inputs
  border: '#e2e8f0',
  input: '#f8fafc',
  ring: '#2563eb',
  
  // Estados
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Tons específicos do app
  ideaCard: '#fefefe',
  ideaCardBorder: '#f0f0f0',
  fabBackground: '#2563eb',
  fabForeground: '#ffffff',
} as const;

export type ColorKey = keyof typeof Colors;
