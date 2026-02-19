import { motion } from "motion/react";

const DELAY = 0.4;
const STREAK_THICKNESS = 2;

interface Streak {
    top: number;
    left: number;
    duration: number;
    repeatDelay: number;
}

// There is no specific reason for the values chosen.
const STREAKS: Streak[] = [
    { top: 0, left: 32, duration: 2.5, repeatDelay: 1.5 },
    { top: 384, left: 128, duration: 2.2, repeatDelay: 1.3 },
    { top: 96, left: 351, duration: 2.0, repeatDelay: 1.0 },
    { top: 0, left: 704, duration: 2.3, repeatDelay: 1.2 },
    { top: 288, left: 768, duration: 2.1, repeatDelay: 1.4 },
    { top: 64, left: 992, duration: 2.4, repeatDelay: 1.1 },
    { top: 64, left: 1406, duration: 2.2, repeatDelay: 1.3 },
] as const;

interface StreakProps {
    streak: Streak;
    delay?: number;
}

const Streak: React.FC<StreakProps> = ({ streak, delay = 0 }) => {
    const { top, left, duration, repeatDelay } = streak;

    return (
        <motion.div
            className={`absolute z-10 h-16 w-[${STREAK_THICKNESS}px]`}
            style={{
                top,
                left,
                background: 'linear-gradient(to bottom, transparent, var(--grid-glow))',
            }}
            initial={{ opacity: 0, transform: 'translateY(-20px)' }}
            animate={{
                opacity: [0, 1, 0],
                transform: ['translateY(-20px)', 'translateY(256px)'],
            }}
            transition={{
                duration,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
                repeatDelay,
            }}
        />
    )
}

const AnimatedStreaks: React.FC = () => {
    return (
        <>
            {STREAKS.map((streak, i) => (
                <Streak key={i} streak={streak} delay={DELAY * i} />
            ))}
        </>
    );
};

export default AnimatedStreaks;