import React, { useCallback } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { fromIsoString, toIsoString, addDays } from '../utils/dateUtils';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import './StartDatePicker.css';

export default function StartDatePicker() {
  const { startDate, setStartDate } = useWorkoutEngine();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setStartDate(e.target.value);
    }
  }, [setStartDate]);

  const shiftDate = useCallback((days: number) => {
    const current = fromIsoString(startDate);
    const newDate = addDays(current, days);
    setStartDate(toIsoString(newDate));
  }, [startDate, setStartDate]);
  
  return (
    <div className="date-picker-container fade-in">
      <div className="date-picker-label">
        <CalendarDays size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> TENTUKAN TANGGAL MULAI
      </div>
      <div className="date-picker-controls">
        <button 
          className="date-shift-btn" 
          onClick={() => shiftDate(-7)}
          title="Mundur 1 Minggu"
        ><ChevronLeft size={16} /></button>
        
        <input
          type="date"
          value={startDate}
          onChange={handleChange}
          className="date-picker-native-input"
        />
        
        <button 
          className="date-shift-btn" 
          onClick={() => shiftDate(7)}
          title="Maju 1 Minggu"
        ><ChevronRight size={16} /></button>
      </div>
      <div className="date-picker-help">
        *Bisa ketik manual, klik ikon kalender, atau pakai tombol panah.
      </div>
    </div>
  );
}
