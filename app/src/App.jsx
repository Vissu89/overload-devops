import { useEffect, useState } from 'react'
import { PROGRAM } from './program'
import './App.css'

const KEY = 'overload-workouts'

export default function App() {
  const [workouts, setWorkouts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] }
  })
  const [dayIndex, setDayIndex] = useState(0)
  const [form, setForm] = useState({ exercise: '', weight: '', reps: '' })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(workouts))
  }, [workouts])

  const day = PROGRAM[dayIndex]
  const target = day.exercises.find((e) => e.name === form.exercise)?.target
  const last = workouts.find((w) => w.exercise === form.exercise)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const changeDay = (e) => {
    setDayIndex(Number(e.target.value))
    setForm({ ...form, exercise: '' })
  }

  const add = (e) => {
    e.preventDefault()
    if (!form.exercise || !form.weight || !form.reps) return
    const entry = { ...form, day: day.name, id: Date.now(), date: new Date().toLocaleDateString() }
    setWorkouts([entry, ...workouts])
    setForm({ ...form, weight: '', reps: '' })
  }

  const remove = (id) => setWorkouts(workouts.filter((w) => w.id !== id))

  return (
    <main className="container">
      <h1>Overload</h1>
      <p className="tag">Log your sets. Lift a little more each week.</p>

      <select className="day" value={dayIndex} onChange={changeDay}>
        {PROGRAM.map((d, i) => <option key={d.name} value={i}>{d.name}</option>)}
      </select>

      <form onSubmit={add} className="form">
        <select value={form.exercise} onChange={update('exercise')}>
          <option value="">Choose exercise</option>
          {day.exercises.map((ex) => <option key={ex.name}>{ex.name}</option>)}
        </select>
        <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={update('weight')} />
        <input type="number" placeholder="Reps" value={form.reps} onChange={update('reps')} />
        <button type="submit">Add set</button>
      </form>

      {form.exercise && (
        <p className="hint">
          Target: {target}
          {last && ` · Last time: ${last.weight} kg × ${last.reps}`}
        </p>
      )}

      <ul className="list">
        {workouts.length === 0 && <li className="empty">No sets logged yet.</li>}
        {workouts.map((w) => (
          <li key={w.id}>
            <span className="date">{w.date}</span>
            <strong>{w.exercise}</strong>
            <span>{w.weight} kg × {w.reps}</span>
            <button className="del" onClick={() => remove(w.id)}>✕</button>
          </li>
        ))}
      </ul>

      <footer>Version: {import.meta.env.VITE_APP_VERSION ?? 'dev'}</footer>
    </main>
  )
}
