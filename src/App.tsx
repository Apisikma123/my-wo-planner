import { useState } from 'react';
import { WorkoutProvider } from './store/workoutStore';
import { GrowthProvider } from './store/growthStore';
import RosterPage from './pages/RosterPage';
import GrowthDashboard from './pages/GrowthDashboard';
import BottomNav from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState<'roster' | 'growth'>('roster');

  return (
    <WorkoutProvider>
      <GrowthProvider>
        <div className="app-container">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="main-content">
            {activeTab === 'roster' ? <RosterPage /> : <GrowthDashboard />}
          </main>
        </div>
      </GrowthProvider>
    </WorkoutProvider>
  );
}
