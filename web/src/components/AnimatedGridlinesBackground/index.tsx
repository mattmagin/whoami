import StaticGridPattern from "./StaticGridPattern";
import AnimatedStreaks from "./AnimatedStreaks";

const AnimatedGridlinesBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatedStreaks />

            <StaticGridPattern />
        </div>
    );
};

export default AnimatedGridlinesBackground;
