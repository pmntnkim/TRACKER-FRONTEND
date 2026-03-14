import React from 'react';
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  TrendingUp,
  Dumbbell,
  Calendar,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame
} from "lucide-react"
import Navbar from "../components/Navbar"
import { getProgressAnalytics } from "../actions/progressActions"
import { listWorkoutLogs } from "../actions/workoutActions"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
/* ── helpers ──────────────────────────────────────────── */
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const getDayOfWeek = dateStr => {
  const d = new Date(dateStr)
  return (d.getDay() + 6) % 7 // Mon=0 … Sun=6
}
const isThisWeek = dateStr => {
  const now = new Date()
  const d = new Date(dateStr)
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return d >= monday && d <= sunday
}
const isThisMonth = dateStr => {
  const now = new Date()
  const d = new Date(dateStr)
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  )
}
/* ── muscle-group colours ─────────────────────────────── */
const muscleColors = {
  chest: "hsl(0 72% 51%)",
  back: "hsl(0 72% 45%)",
  shoulders: "hsl(0 60% 55%)",
  biceps: "hsl(38 92% 50%)",
  triceps: "hsl(38 80% 45%)",
  legs: "hsl(142 71% 45%)",
  quads: "hsl(142 60% 50%)",
  hamstrings: "hsl(142 50% 40%)",
  glutes: "hsl(200 60% 50%)",
  core: "hsl(270 50% 55%)",
  abs: "hsl(270 50% 55%)",
  calves: "hsl(180 50% 45%)",
  forearms: "hsl(30 60% 50%)"
}
const getMuscleColor = muscle =>
  muscleColors[muscle.toLowerCase()] ?? "hsl(var(--muted-foreground))"
/* ── Muscle Diagram (SVG front view) ──────────────────── */
const MuscleMap = ({ muscles }) => {
  const maxCount = Math.max(...muscles.map(m => m.count), 1)
  const getOpacity = name => {
    const m = muscles.find(x => x.name.toLowerCase() === name.toLowerCase())
    return m ? 0.3 + (m.count / maxCount) * 0.7 : 0.08
  }
  const muscleGroups = [
    { name: "Shoulders", cx: 38, cy: 28, rx: 10, ry: 6 },
    { name: "Shoulders", cx: 62, cy: 28, rx: 10, ry: 6 },
    { name: "Chest", cx: 50, cy: 36, rx: 14, ry: 8 },
    { name: "Biceps", cx: 28, cy: 44, rx: 5, ry: 10 },
    { name: "Triceps", cx: 72, cy: 44, rx: 5, ry: 10 },
    { name: "Core", cx: 50, cy: 50, rx: 10, ry: 10 },
    { name: "Quads", cx: 42, cy: 70, rx: 7, ry: 14 },
    { name: "Quads", cx: 58, cy: 70, rx: 7, ry: 14 },
    { name: "Calves", cx: 42, cy: 88, rx: 5, ry: 8 },
    { name: "Calves", cx: 58, cy: 88, rx: 5, ry: 8 }
  ]
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[220px] mx-auto">
      {/* body outline */}
      <ellipse
        cx="50"
        cy="12"
        rx="8"
        ry="10"
        fill="hsl(var(--muted))"
        opacity={0.3}
      />
      <rect
        x="38"
        y="22"
        width="24"
        height="38"
        rx="6"
        fill="hsl(var(--muted))"
        opacity={0.15}
      />
      <rect
        x="34"
        y="60"
        width="12"
        height="34"
        rx="4"
        fill="hsl(var(--muted))"
        opacity={0.15}
      />
      <rect
        x="54"
        y="60"
        width="12"
        height="34"
        rx="4"
        fill="hsl(var(--muted))"
        opacity={0.15}
      />
      <rect
        x="22"
        y="28"
        width="10"
        height="30"
        rx="4"
        fill="hsl(var(--muted))"
        opacity={0.15}
      />
      <rect
        x="68"
        y="28"
        width="10"
        height="30"
        rx="4"
        fill="hsl(var(--muted))"
        opacity={0.15}
      />
      {muscleGroups.map((g, i) => (
        <ellipse
          key={i}
          cx={g.cx}
          cy={g.cy}
          rx={g.rx}
          ry={g.ry}
          fill={getMuscleColor(g.name)}
          opacity={getOpacity(g.name)}
          className="transition-opacity duration-500"
        />
      ))}
    </svg>
  )
}
/* ── Monthly Calendar ─────────────────────────────────── */
const MonthlyCalendar = ({ activeDays }) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7
  const today = now.getDate()
  const monthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric"
  })
  const cells = Array(firstDayOffset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">
        {monthName}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["M", "T", "W", "Th", "F", "Sa", "S"].map((d, i) => (
          <span key={i} className="text-muted-foreground font-medium py-1">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const active = activeDays.includes(day)
          const isToday = day === today
          return (
            <span
              key={i}
              className={`w-7 h-7 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }
                ${isToday && !active ? "ring-1 ring-primary/50" : ""}
              `}
            >
              {day}
            </span>
          )
        })}
      </div>
    </div>
  )
}
/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const ProgressAnalytics = () => {
  const dispatch = useDispatch()
  const { data: progressData, loading } = useSelector(state => state.progress)
  const { workouts } = useSelector(state => state.workoutLog)
  useEffect(() => {
    dispatch(getProgressAnalytics())
    dispatch(listWorkoutLogs())
  }, [dispatch])
  /* ── derived data from local workouts ────────────────── */
  const weekWorkouts = useMemo(
    () => (workouts ?? []).filter(w => w.date && isThisWeek(w.date)),
    [workouts]
  )
  const monthWorkouts = useMemo(
    () => (workouts ?? []).filter(w => w.date && isThisMonth(w.date)),
    [workouts]
  )
  // Weekly chart data
  const weeklyChart = useMemo(() => {
    const buckets = dayLabels.map(label => ({
      day: label,
      weight: 0,
      workouts: 0
    }))
    weekWorkouts.forEach(w => {
      const idx = getDayOfWeek(w.date)
      buckets[idx].weight += (w.weight ?? 0) * (w.sets ?? 1) * (w.reps ?? 1)
      buckets[idx].workouts += 1
    })
    return buckets
  }, [weekWorkouts])
  // Strength trend (last 8 workouts)
  const strengthTrend = useMemo(() => {
    const sorted = [...(workouts ?? [])]
      .filter(w => w.weight > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-8)
    return sorted.map((w, i) => ({
      idx: i + 1,
      weight: w.weight,
      label: w.exercise ?? `#${i + 1}`
    }))
  }, [workouts])
  // Muscle group breakdown
  const muscleBreakdown = useMemo(() => {
    const map = {}
    weekWorkouts.forEach(w => {
      const group = (w.muscle_group ?? w.exercise ?? "Other").toLowerCase()
      map[group] = (map[group] ?? 0) + 1
    })
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [weekWorkouts])
  // Monthly active days
  const monthActiveDays = useMemo(() => {
    const days = new Set()
    monthWorkouts.forEach(w => {
      if (w.date) days.add(new Date(w.date).getDate())
    })
    return Array.from(days)
  }, [monthWorkouts])
  // Compute insights
  const totalWeightThisWeek = weeklyChart.reduce((s, d) => s + d.weight, 0)
  const weekWorkoutCount = weekWorkouts.length
  // Strength change comparison (simple: compare avg of first half vs second half of trend)
  const strengthChange = useMemo(() => {
    if (strengthTrend.length < 2) return null
    const mid = Math.floor(strengthTrend.length / 2)
    const firstHalf =
      strengthTrend.slice(0, mid).reduce((s, d) => s + d.weight, 0) / mid
    const secondHalf =
      strengthTrend.slice(mid).reduce((s, d) => s + d.weight, 0) /
      (strengthTrend.length - mid)
    const pct = ((secondHalf - firstHalf) / firstHalf) * 100
    return Math.round(pct)
  }, [strengthTrend])
  const insights = useMemo(() => {
    const msgs = []
    if (strengthChange !== null) {
      if (strengthChange > 0)
        msgs.push({
          text: `Your strength increased by ${strengthChange}% recently.`,
          icon: ArrowUp,
          positive: true
        })
      else if (strengthChange < 0)
        msgs.push({
          text: `Strength dipped by ${Math.abs(
            strengthChange
          )}%. Stay consistent!`,
          icon: ArrowDown,
          positive: false
        })
      else
        msgs.push({
          text: "Your strength is holding steady.",
          icon: Minus,
          positive: true
        })
    }
    if (weekWorkoutCount >= 5)
      msgs.push({
        text: `Amazing week! ${weekWorkoutCount} workouts completed.`,
        icon: Flame,
        positive: true
      })
    else if (weekWorkoutCount >= 3)
      msgs.push({
        text: `Solid effort — ${weekWorkoutCount} workouts this week.`,
        icon: Zap,
        positive: true
      })
    if (totalWeightThisWeek > 0)
      msgs.push({
        text: `Total volume this week: ${totalWeightThisWeek.toLocaleString()} kg`,
        icon: Dumbbell,
        positive: true
      })
    if (msgs.length === 0)
      msgs.push({
        text: "Start logging workouts to unlock insights!",
        icon: Activity,
        positive: true
      })
    return msgs
  }, [strengthChange, weekWorkoutCount, totalWeightThisWeek])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Progress Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your strength gains and workout consistency.
          </p>
        </div>
        {/* ── Top Stats ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Workouts This Week",
              value: weekWorkoutCount,
              icon: Dumbbell
            },
            {
              label: "Total Volume (kg)",
              value: totalWeightThisWeek.toLocaleString(),
              icon: TrendingUp
            },
            {
              label: "Active Days (Month)",
              value: monthActiveDays.length,
              icon: Calendar
            },
            {
              label: "Strength Trend",
              value:
                strengthChange !== null
                  ? `${strengthChange > 0 ? "+" : ""}${strengthChange}%`
                  : "—",
              icon:
                strengthChange !== null && strengthChange >= 0
                  ? ArrowUp
                  : ArrowDown
            }
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="angrit-stat-card angrit-glow animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </div>
              <p className="font-display text-2xl sm:text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        {/* ── Charts Row ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Volume Bar Chart */}
          <div
            className="angrit-card animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Progress – This Week
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                  <Bar
                    dataKey="weight"
                    name="Volume (kg)"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Strength Trend Line Chart */}
          <div
            className="angrit-card animate-slide-up"
            style={{ animationDelay: "280ms" }}
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Strength Progression
            </h2>
            <div className="h-56">
              {strengthTrend.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strengthTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11
                      }}
                    />
                    <YAxis
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Log more weighted exercises to see trends.
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ── Bottom Row ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Muscle Map */}
          <div
            className="angrit-card animate-slide-up"
            style={{ animationDelay: "350ms" }}
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Muscle Groups – This Week
            </h2>
            {muscleBreakdown.length > 0 ? (
              <>
                <MuscleMap muscles={muscleBreakdown} />
                <div className="mt-4 space-y-2">
                  {muscleBreakdown.slice(0, 5).map(m => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: getMuscleColor(m.name) }}
                        />
                        <span className="capitalize text-foreground">
                          {m.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{m.count}×</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No muscle data this week yet.
              </p>
            )}
          </div>
          {/* Monthly Calendar */}
          <div
            className="angrit-card animate-slide-up"
            style={{ animationDelay: "420ms" }}
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monthly Activity
            </h2>
            <MonthlyCalendar activeDays={monthActiveDays} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {monthActiveDays.length} active day
              {monthActiveDays.length !== 1 ? "s" : ""} this month
            </p>
          </div>
          {/* Progress Insights */}
          <div
            className="angrit-card animate-slide-up"
            style={{ animationDelay: "490ms" }}
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Insights
            </h2>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    insight.positive
                      ? "bg-primary/5 border border-primary/10"
                      : "bg-destructive/5 border border-destructive/10"
                  }`}
                >
                  <insight.icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      insight.positive ? "text-primary" : "text-destructive"
                    }`}
                  />
                  <p className="text-sm text-foreground">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ProgressAnalytics
