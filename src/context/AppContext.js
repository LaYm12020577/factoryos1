import { createContext, useContext } from 'react';

export const LangCtx = createContext("uz");
export const ThemeCtx = createContext({});

export const useLang = () => useContext(LangCtx);
export const useTheme = () => useContext(ThemeCtx);
