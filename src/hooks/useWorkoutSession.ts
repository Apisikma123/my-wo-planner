export interface WorkoutState {
  status: 'idle' | 'Mulai' | 'selesai';
  isPreparing: boolean;
  currentSetIndex: number;
  currentRep: number;
  prepTimeLeft: number;
  exerciseTimeLeft: number;
  isTimerBased: boolean;
}

type WorkoutAction =
  | { type: 'MULAI_LATIHAN' }
  | { type: 'TICK_PREP' }
  | { type: 'SELESAI_PREP' }
  | { type: 'TICK_ACTIVE' }
  | { type: 'KEMBALI_KE_SET_SEBELUMNYA' }
  | { type: 'SELESAI_LATIHAN' };

export const initialWorkoutState: WorkoutState = {
  status: 'idle',
  isPreparing: false,
  currentSetIndex: 1, // Dimulai dari set 1
  currentRep: 1,
  prepTimeLeft: 10, // Jeda 10 detik bersiap
  exerciseTimeLeft: 60, // Durasi timer utama (misal 60 detik)
  isTimerBased: true,
};

export const workoutReducer = (state: WorkoutState, action: WorkoutAction): WorkoutState => {
  switch (action.type) {
    case 'MULAI_LATIHAN':
      // JIKA status = "Mulai", MAKA masuk ke isPreparing = true selama 10 detik.
      return { 
        ...state, 
        status: 'Mulai', 
        isPreparing: true, 
        prepTimeLeft: 10 
      };
    
    case 'TICK_PREP':
      return { 
        ...state, 
        prepTimeLeft: Math.max(0, state.prepTimeLeft - 1) 
      };

    case 'SELESAI_PREP':
      // JIKA isPreparing sudah selesai (0 detik), BARU ubah isPreparing = false
      return { 
        ...state, 
        isPreparing: false 
      };

    case 'TICK_ACTIVE':
      return { 
        ...state, 
        exerciseTimeLeft: Math.max(0, state.exerciseTimeLeft - 1) 
      };

    case 'KEMBALI_KE_SET_SEBELUMNYA':
      // Kurangi currentSetIndex sebanyak 1 dan reset ulang status set
      const newSetIndex = Math.max(1, state.currentSetIndex - 1);
      return { 
        ...state, 
        currentSetIndex: newSetIndex,
        currentRep: 1, // Reset rep jika ada
        exerciseTimeLeft: initialWorkoutState.exerciseTimeLeft, // Reset timer latihan
        isPreparing: true, // Opsional: Berikan jeda siap-siap lagi setelah di-reset
        prepTimeLeft: 10
      };

    case 'SELESAI_LATIHAN':
      return { 
        ...state, 
        status: 'selesai',
        isPreparing: false
      };

    default:
      return state;
  }
};
