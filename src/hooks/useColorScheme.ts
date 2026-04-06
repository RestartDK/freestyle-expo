import { useColorScheme as useRNColorScheme } from 'react-native';

/** Resolves RN's `unspecified` / null to a concrete light or dark theme. */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
