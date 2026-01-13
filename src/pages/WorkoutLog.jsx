import React from "react";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Calendar, Clock } from "lucide-react";
import Navbar from "../components/Navbar";

const WorkoutLog = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
  });

  const exercises = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull-ups",
    "Barbell Row",
    "Military Press",
    "Barbell Curl",
    "Tricep Dips",
    "Leg Press",
    "Lat Pulldown",
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWorkoutHistory([
        { id: 1, exercise: "Bench Press", sets: 4, reps: 8, weight: 100, date: "2024-01-15" },
        { id: 2, exercise: "Squat", sets: 4, reps: 6, weight: 140, date: "2024-01-15" },
        { id: 3, exercise: "Deadlift", sets: 3, reps: 5, weight: 160, date: "2024-01-14" },
        { id: 4, exercise: "Pull-ups", sets: 4, reps: 10, weight: 0, date: "2024-01-14" },
        { id: 5, exercise: "Military Press", sets: 3, reps: 10, weight: 60, date: "2024-01-13" },
      ]);
      setIsLoading(false);
    };
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.exercise || !formData.sets || !formData.reps) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newEntry = {
      id: Date.now(),
      exercise: formData.exercise,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: parseInt(formData.weight) || 0,
      date: new Date().toISOString().split("T")[0],
    };

    setWorkoutHistory((prev) => [newEntry, ...prev]);
    setFormData({ exercise: "", sets: "", reps: "", weight: "" });
    setIsSaving(false);
  };

  const handleDelete = (id) => {
    setWorkoutHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const groupedHistory = workoutHistory.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Today";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Workout Log
          </h1>
          <p className="text-muted-foreground">
            Track every set, rep, and PR. Consistency builds champions.
          </p>
        </div>

        {/* Log Form */}
        <div className="angrit-card mb-8 animate-slide-up">
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Log Exercise
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium">Exercise</label>
                <select
                  name="exercise"
                  value={formData.exercise}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
                >
                  <option value="">Select exercise</option>
                  {exercises.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Sets</label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleChange}
                  placeholder="4"
                  min="1"
                  className="angrit-input w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Reps</label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  placeholder="8"
                  min="1"
                  className="angrit-input w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  className="angrit-input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="angrit-btn-primary flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Log Exercise
                </>
              )}
            </button>
          </form>
        </div>

        {/* Workout History */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Workout History
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="angrit-card animate-pulse">
                  <div className="h-4 bg-muted rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(groupedHistory).length === 0 ? (
            <div className="angrit-card text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                No workouts yet
              </h3>
              <p className="text-muted-foreground">
                Start logging your exercises above!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <div key={date} className="angrit-card">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(date)}
                  </h3>

                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 group"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{entry.exercise}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.sets} sets × {entry.reps} reps
                            {entry.weight > 0 && ` @ ${entry.weight}kg`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkoutLog;

