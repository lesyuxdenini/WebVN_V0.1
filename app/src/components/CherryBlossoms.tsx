import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function CherryBlossoms({ count = 30 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 6,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setPetals(newPetals);
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute rounded-full"
          style={{
            left: `${petal.x}%`,
            width: petal.size,
            height: petal.size * 0.7,
            backgroundColor: '#F5A3B7',
            opacity: petal.opacity,
            borderRadius: '50% 0 50% 50%',
          }}
          initial={{ y: -20, rotate: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(petal.id) * 80, -Math.sin(petal.id) * 60, Math.sin(petal.id) * 40],
            rotate: [0, 360 * 2],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
