import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Code, Palette, BookOpen, Sparkles } from 'lucide-react';
import { useGameActions } from '@/context/GameContext';

export function CreditsScreen() {
  const { changeScreen } = useGameActions();

  return (
    <div className="flex h-screen w-screen flex-col bg-[#243B6B]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#FFF4E6]/10 px-4 py-3 sm:px-8">
        <button
          onClick={() => changeScreen('title')}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#FFF4E6]/70 transition-colors hover:bg-[#F5A3B7]/20 hover:text-[#FFF4E6]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-lg font-bold text-[#FFF4E6]">Credits</h1>
      </div>

      {/* Credits content */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-md space-y-8">
          {/* Title */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-[#F5A3B7] sm:text-3xl">
              How to Make the Top Student Fall in Love
            </h2>
            <p className="mt-2 text-sm text-[#FFF4E6]/50">A BL Visual Novel</p>
          </motion.div>

          <CreditSection
            icon={<BookOpen size={20} />}
            title="Story & Script"
            names={['Original Story', '10 Chapters of BL Romance']}
            delay={0.1}
          />

          <CreditSection
            icon={<Palette size={20} />}
            title="Art & Visuals"
            names={['Pixel Art Backgrounds (16 scenes)', 'CG Illustrations (10 events)', 'Title Logo Design']}
            delay={0.2}
          />

          <CreditSection
            icon={<Code size={20} />}
            title="Engine & Development"
            names={['React + TypeScript + Vite', 'Tailwind CSS + Framer Motion', 'Custom VN Engine Architecture']}
            delay={0.3}
          />

          <CreditSection
            icon={<Sparkles size={20} />}
            title="Features"
            names={['Dialogue System with Typewriter Effect', 'Choice System', 'Save/Load System', 'Chapter Select', 'Mobile Responsive Design']}
            delay={0.4}
          />

          {/* Special thanks */}
          <motion.div
            className="rounded-xl border border-[#F5A3B7]/20 bg-[#F5A3B7]/5 p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Heart className="mx-auto mb-2 h-5 w-5 text-[#F5A3B7]" />
            <p className="text-sm text-[#FFF4E6]/70">
              Thank you for playing!
            </p>
            <p className="mt-1 text-xs text-[#FFF4E6]/40">
              Version 0.1 — More chapters coming soon
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CreditSection({
  icon,
  title,
  names,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  names: string[];
  delay?: number;
}) {
  return (
    <motion.div
      className="rounded-xl border border-[#FFF4E6]/10 bg-[#FFF4E6]/5 p-4 sm:p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="mb-3 flex items-center gap-2 text-[#F5A3B7]">
        {icon}
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <ul className="space-y-1">
        {names.map((name, i) => (
          <li key={i} className="text-sm text-[#FFF4E6]/70">
            {name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
