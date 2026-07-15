import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- GROWTH LOGS ---

// Get all growth data
app.get('/api/growth', async (req, res) => {
  try {
    const [sleep] = await db.query('SELECT * FROM sleep_logs');
    const [nutrition] = await db.query('SELECT * FROM nutrition_logs');
    const [supplements] = await db.query('SELECT * FROM supplement_logs');
    const [plyo] = await db.query('SELECT * FROM plyo_logs');
    const [height] = await db.query('SELECT * FROM height_history ORDER BY date ASC');

    // Format data back to dictionary-like objects for frontend
    const formatLogs = (rows) => {
      const obj = {};
      rows.forEach(row => {
        const { date, created_at, ...rest } = row;
        // Map snake_case to camelCase
        const camelCaseRest = Object.keys(rest).reduce((acc, key) => {
          const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          
          // Handle booleans
          let val = rest[key];
          if (val === 1 || val === 0) val = Boolean(val);
          
          acc[camelKey] = val;
          return acc;
        }, {});
        
        obj[date] = { date, ...camelCaseRest };
      });
      return obj;
    };

    res.json({
      sleepLogs: formatLogs(sleep),
      nutritionLogs: formatLogs(nutrition),
      supplementLogs: formatLogs(supplements),
      plyoLogs: formatLogs(plyo),
      heightHistory: height.map(h => ({
        date: h.date,
        heightCm: Number(h.height_cm),
        notes: h.notes
      }))
    });
  } catch (err) {
    console.error('Error fetching growth data:', err);
    res.status(500).json({ error: 'Failed to fetch growth data' });
  }
});

// Sync Sleep Log
app.post('/api/growth/sleep', async (req, res) => {
  const { date, bedtime, duration, darkRoom, score } = req.body;
  try {
    await db.query(
      'INSERT INTO sleep_logs (date, bedtime, duration, dark_room, score) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bedtime=?, duration=?, dark_room=?, score=?',
      [date, bedtime, duration, darkRoom, score, bedtime, duration, darkRoom, score]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save sleep log' });
  }
});

// Sync Nutrition Log
app.post('/api/growth/nutrition', async (req, res) => {
  const { date, calciumMg, proteinG, waterL, sugarBeforeBed, foods } = req.body;
  try {
    await db.query(
      'INSERT INTO nutrition_logs (date, calcium_mg, protein_g, water_l, sugar_before_bed, foods) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE calcium_mg=?, protein_g=?, water_l=?, sugar_before_bed=?, foods=?',
      [date, calciumMg, proteinG, waterL, sugarBeforeBed, JSON.stringify(foods), calciumMg, proteinG, waterL, sugarBeforeBed, JSON.stringify(foods)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save nutrition log' });
  }
});

// Sync Supplement Log
app.post('/api/growth/supplement', async (req, res) => {
  const { date, d3k2Taken, d3k2WithFat, zincB2Taken, zincB2EmptyStomach } = req.body;
  try {
    await db.query(
      'INSERT INTO supplement_logs (date, d3k2_taken, d3k2_with_fat, zinc_b2_taken, zinc_b2_empty_stomach) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE d3k2_taken=?, d3k2_with_fat=?, zinc_b2_taken=?, zinc_b2_empty_stomach=?',
      [date, d3k2Taken, d3k2WithFat, zincB2Taken, zincB2EmptyStomach, d3k2Taken, d3k2WithFat, zincB2Taken, zincB2EmptyStomach]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save supplement log' });
  }
});

// Sync Plyo Log
app.post('/api/growth/plyo', async (req, res) => {
  const { date, hangMinutes, plyoMinutes, coreMinutes } = req.body;
  try {
    await db.query(
      'INSERT INTO plyo_logs (date, hang_minutes, plyo_minutes, core_minutes) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE hang_minutes=?, plyo_minutes=?, core_minutes=?',
      [date, hangMinutes, plyoMinutes, coreMinutes, hangMinutes, plyoMinutes, coreMinutes]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save plyo log' });
  }
});

// Log Height
app.post('/api/growth/height', async (req, res) => {
  const { date, heightCm, notes } = req.body;
  try {
    await db.query(
      'INSERT INTO height_history (date, height_cm, notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE height_cm=?, notes=?',
      [date, heightCm, notes, heightCm, notes]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save height' });
  }
});

// --- WORKOUT ROSTER ---

app.get('/api/workouts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM workout_roster ORDER BY iso_date ASC');
    const roster = rows.map(r => ({
      isoDate: r.iso_date,
      phase: r.phase,
      workoutType: r.workout_type,
      exercises: r.exercises,
      hghScore: r.hgh_score
    }));
    res.json({ roster });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/api/workouts/sync', async (req, res) => {
  const { roster } = req.body;
  if (!Array.isArray(roster)) {
    return res.status(400).json({ error: 'Invalid roster format' });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Clear old roster and insert new one
      await connection.query('DELETE FROM workout_roster');
      
      if (roster.length > 0) {
        const values = roster.map(r => [
          r.isoDate, 
          r.phase, 
          r.workoutType, 
          JSON.stringify(r.exercises), 
          r.hghScore
        ]);
        
        await connection.query(
          'INSERT INTO workout_roster (iso_date, phase, workout_type, exercises, hgh_score) VALUES ?',
          [values]
        );
      }
      
      await connection.commit();
      res.json({ success: true });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync workouts' });
  }
});

app.listen(PORT, () => {
  console.log(`HGH Boost API Server running on port ${PORT}`);
});
