import { WorkoutProvider } from './store/workoutStore';
import RosterPage from './pages/RosterPage';

export default function App() {
  return (
    <WorkoutProvider>
      <RosterPage />
    </WorkoutProvider>
  );
}
