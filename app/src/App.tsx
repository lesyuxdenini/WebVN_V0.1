import { GameProvider, useGame } from '@/context/GameContext';
import { TitleScreen } from '@/components/TitleScreen';
import { GameScreen } from '@/components/GameScreen';
import { ChapterSelect } from '@/components/ChapterSelect';
import { SettingsScreen } from '@/components/SettingsScreen';
import { CreditsScreen } from '@/components/CreditsScreen';

function ScreenRouter() {
  const { state } = useGame();

  switch (state.currentScreen) {
    case 'title':
      return <TitleScreen />;
    case 'game':
      return <GameScreen />;
    case 'chapter_select':
      return <ChapterSelect />;
    case 'settings':
      return <SettingsScreen />;
    case 'credits':
      return <CreditsScreen />;
    default:
      return <TitleScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
}
