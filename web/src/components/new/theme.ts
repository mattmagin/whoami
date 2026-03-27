export type Color = 'green' | 'orange' | 'blue' | 'yellow' | "pink" | "purple"
export type ThemeVariants = 'dark' | 'light'

interface ThemeColors {
    contentBackground: string;
    secondarySectionBackground: string;
    borderOutline: string;
    heading: string;
    black: string;
    body: string;
    green: string;
    orange: string;
    blue: string;
    yellow: string;
    pink: string;
    purple: string;
    offWhite: string;
    boldYellow: string;
    coralPink: string;
    skyBlue: string;
    secondOrange: string;
    softGreen: string;
    lavender: string;
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
            secondarySectionBackground: '#FFFFFF',
            borderOutline: '#000000',
            heading: "#282825",
            black: "#000000",
            body: "#52514e",
            green: '#04e17a',
            orange: '#FF7A05',
            blue: '#0099FF',
            yellow: '#f7cb45',
            pink: '#ff91e7',
            purple: '#9147ff',
            offWhite: '#FFFDF5',
            boldYellow: '#FFD23F',
            coralPink: '#FF6B6B',
            skyBlue: '#74B9FF',
            softGreen: '#88D498',
            secondOrange: '#FFA552',
            lavender: '#B8A9FA',
        },
        light: {
            contentBackground: '#f9f5f2',
            secondarySectionBackground: '#FFFFFF',
            borderOutline: '#000000',
            heading: "#282825",
            black: "#000000",
            body: "#52514e",
            green: '#04e17a',
            orange: '#FF7A05',
            blue: '#0099FF',
            yellow: '#f7cb45',
            pink: '#ff91e7',
            purple: '#9147ff',
            offWhite: '#FFFDF5',
            boldYellow: '#FFD23F',
            coralPink: '#FF6B6B',
            skyBlue: '#74B9FF',
            softGreen: '#88D498',
            secondOrange: '#FFA552',
            lavender: '#B8A9FA',
        }
    }
}