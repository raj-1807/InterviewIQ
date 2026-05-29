import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="hero-particles"
            init={particlesInit}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
            }}
            options={{
                fullScreen: false,
                fpsLimit: 60,
                background: { color: { value: 'transparent' } },
                particles: {
                    number: {
                        value: 60,
                        density: { enable: true, area: 900 },
                    },
                    color: { value: ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'] },
                    shape: { type: 'circle' },
                    opacity: {
                        value: { min: 0.1, max: 0.5 },
                        animation: {
                            enable: true,
                            speed: 0.8,
                            minimumValue: 0.1,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 1, max: 3 },
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 0.5,
                            sync: false,
                        },
                    },
                    move: {
                        enable: true,
                        speed: 0.6,
                        direction: 'none',
                        random: true,
                        straight: false,
                        outModes: { default: 'out' },
                    },
                    links: {
                        enable: true,
                        distance: 140,
                        color: '#6366f1',
                        opacity: 0.12,
                        width: 1,
                    },
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: 'grab',
                        },
                    },
                    modes: {
                        grab: {
                            distance: 160,
                            links: { opacity: 0.3 },
                        },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticleBackground;
