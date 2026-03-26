export type Color = 'green' | 'orange' | 'blue' | 'yellow' | "pink" | "purple"
export type ThemeVariants = 'dark' | 'light'

interface ThemeColors {
    contentBackground: string;
    borderOutline: string;
    heading: string;
    body: string;
    green: string;
    orange: string;
    blue: string;
    yellow: string;
    pink: string;
    purple: string;
}

export interface ThemeShape {
    colors: {
        [key in ThemeVariants]: ThemeColors
    }
}

export const Theme: ThemeShape = {
    colors: {
        dark: {
            contentBackground: '#F2EDED',
            borderOutline: '#000000',
            heading: "#282825",
            body: "#52514e",
            green: '#04e17a',
            orange: '#FF7A05',
            blue: '#0099FF',
            yellow: '#f7cb45',
            pink: '#ff91e7',
            purple: '#9147ff',
        },
        light: {
            contentBackground: '#f9f5f2',
            borderOutline: '#000000',
            heading: "#282825",
            body: "#52514e",
            green: '#04e17a',
            orange: '#FF7A05',
            blue: '#0099FF',
            yellow: '#f7cb45',
            pink: '#ff91e7',
            purple: '#9147ff',
        }
    }
}