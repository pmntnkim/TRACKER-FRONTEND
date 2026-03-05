import React, { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Loader2,
  Play,
  Plus,
  Square,
  Trash2
} from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import {
  listWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog
} from "../actions/workoutActions"
import { listExercises } from "../actions/exerciseActions"
import axios from "axios"

const ACTIVE_WORKOUT_STORAGE_KEY = "activeWorkoutSession"

const WorkoutLog = () => {
  const dispatch = useDispatch()

  const {
    loading: isLoading,
    workouts: workoutHistory,
    createLoading: isSaving
  } = useSelector(state => state.workoutLog)
  const { userInfo } = useSelector(state => state.authLogin)
  const { exercises } = useSelector(state => state.exerciseList)

  const [savedSplits, setSavedSplits] = useState([])
  const [isSplitsLoading, setIsSplitsLoading] = useState(false)
  const [splitError, setSplitError] = useState("")
  const [showProgramSelector, setShowProgramSelector] = useState(false)
  const [selectedSplitId, setSelectedSplitId] = useState("")
  const [selectedProgramId, setSelectedProgramId] = useState("")

  const [activeWorkout, setActiveWorkout] = useState(null)
  const [exercisePicker, setExercisePicker] = useState("")
  const [finishMessage, setFinishMessage] = useState("")
  const [exerciseAddedDialog, setExerciseAddedDialog] = useState("")
  const [, setTimerTick] = useState(0)

  useEffect(() => {
    dispatch(listWorkoutLogs())
    dispatch(listExercises())
  }, [dispatch])

  useEffect(() => {
    const rawActiveWorkout = localStorage.getItem(ACTIVE_WORKOUT_STORAGE_KEY)
    if (!rawActiveWorkout) return

    try {
      const parsedActiveWorkout = JSON.parse(rawActiveWorkout)
      if (parsedActiveWorkout?.startedAt && Array.isArray(parsedActiveWorkout?.exercises)) {
        setActiveWorkout(parsedActiveWorkout)
      }
    } catch (error) {
      localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (!activeWorkout) {
      localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY)
      return
    }

    localStorage.setItem(ACTIVE_WORKOUT_STORAGE_KEY, JSON.stringify(activeWorkout))
  }, [activeWorkout])

  useEffect(() => {
    if (!activeWorkout) return undefined

    const timer = window.setInterval(() => {
      setTimerTick(prev => prev + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [activeWorkout])

  useEffect(() => {
    if (!exerciseAddedDialog) return undefined

    const timer = window.setTimeout(() => {
      setExerciseAddedDialog("")
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [exerciseAddedDialog])

  useEffect(() => {
    const loadSavedSplits = async () => {
      if (!userInfo?.token) {
        setSavedSplits([])
        return
      }

      setIsSplitsLoading(true)
      setSplitError("")

      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/splits/", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        })

        setSavedSplits(Array.isArray(data) ? data : [])
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message
        setSplitError(message)
        setSavedSplits([])
      } finally {
        setIsSplitsLoading(false)
      }
    }

    loadSavedSplits()
  }, [userInfo?.token])

  const selectedSplit = useMemo(
    () => savedSplits.find(split => String(split.id) === String(selectedSplitId)),
    [savedSplits, selectedSplitId]
  )

  const selectedProgram = useMemo(
    () =>
      selectedSplit?.programs?.find(
        programItem => String(programItem.id) === String(selectedProgramId)
      ) ?? null,
    [selectedSplit, selectedProgramId]
  )

  const getTodayString = () => new Date().toISOString().split("T")[0]

  const formatDuration = seconds => {
    const safeSeconds = Math.max(0, Number(seconds) || 0)
    const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0")
    const remainingSeconds = String(safeSeconds % 60).padStart(2, "0")
    return `${hours}:${minutes}:${remainingSeconds}`
  }

  const createInitialSet = setIndex => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    order: setIndex,
    weight: "",
    reps: "",
    completed: false
  })

  const createExerciseBlock = exerciseName => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: exerciseName,
    notes: "",
    sets: [createInitialSet(1)]
  })

  const startWorkoutFromProgram = () => {
    if (!selectedSplit || !selectedProgram) return

    const programExercises = (selectedProgram.exercises ?? [])
      .filter(exerciseName => String(exerciseName).trim())
      .map(exerciseName => createExerciseBlock(exerciseName))

    setFinishMessage("")
    setExercisePicker("")
    setActiveWorkout({
      startedAt: Date.now(),
      splitName: selectedSplit.name,
      programName: selectedProgram.name,
      exercises: programExercises
    })

    if (programExercises.length > 0) {
      setExerciseAddedDialog(
        `${programExercises.length} exercise${
          programExercises.length > 1 ? "s" : ""
        } added from ${selectedProgram.name}.`
      )
    }
  }

  const startEmptyWorkout = () => {
    setFinishMessage("")
    setExercisePicker("")
    setShowProgramSelector(false)
    setActiveWorkout({
      startedAt: Date.now(),
      splitName: "",
      programName: "Empty Session",
      exercises: []
    })
  }

  const updateExercise = (exerciseId, updater) => {
    setActiveWorkout(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map(exerciseItem =>
          exerciseItem.id === exerciseId ? updater(exerciseItem) : exerciseItem
        )
      }
    })
  }

  const addExerciseToActiveWorkout = () => {
    const pickedName =
      exercises.find(exercise => String(exercise.id) === String(exercisePicker))?.name ?? ""

    if (!pickedName || !activeWorkout) return

    setActiveWorkout(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: [...prev.exercises, createExerciseBlock(pickedName)]
      }
    })
    setExercisePicker("")
    setExerciseAddedDialog(`${pickedName} added to this workout.`)
  }

  const removeExerciseFromWorkout = exerciseId => {
    setActiveWorkout(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.filter(exerciseItem => exerciseItem.id !== exerciseId)
      }
    })
  }

  const addSetToExercise = exerciseId => {
    updateExercise(exerciseId, exerciseItem => ({
      ...exerciseItem,
      sets: [...exerciseItem.sets, createInitialSet(exerciseItem.sets.length + 1)]
    }))
  }

  const updateSetField = (exerciseId, setId, field, value) => {
    updateExercise(exerciseId, exerciseItem => ({
      ...exerciseItem,
      sets: exerciseItem.sets.map(setItem =>
        setItem.id === setId ? { ...setItem, [field]: value } : setItem
      )
    }))
  }

  const toggleSetComplete = (exerciseId, setId) => {
    updateExercise(exerciseId, exerciseItem => ({
      ...exerciseItem,
      sets: exerciseItem.sets.map(setItem =>
        setItem.id === setId
          ? { ...setItem, completed: !setItem.completed }
          : setItem
      )
    }))
  }

  const getDisplayPreviousSet = (sets, setIndex) => {
    if (setIndex === 0) return "-"
    const previous = sets[setIndex - 1]
    if (!previous) return "-"
    if (!previous.weight && !previous.reps) return "-"
    return `${previous.weight || "-"} × ${previous.reps || "-"}`
  }

  const finishWorkout = async () => {
    if (!activeWorkout) return

    const payloads = activeWorkout.exercises
      .map(exerciseItem => {
        const completedSets = exerciseItem.sets.filter(setItem => {
          const hasReps = Number(setItem.reps) > 0
          const hasWeight = Number(setItem.weight) >= 0
          return setItem.completed && (hasReps || hasWeight)
        })

        const sourceSets = completedSets.length > 0 ? completedSets : exerciseItem.sets

        const normalizedSets = sourceSets.filter(
          setItem => Number(setItem.reps) > 0 || Number(setItem.weight) > 0
        )

        if (!exerciseItem.name || normalizedSets.length === 0) {
          return null
        }

        const repsValues = normalizedSets
          .map(setItem => Number(setItem.reps))
          .filter(value => Number.isFinite(value) && value > 0)
        const weightValues = normalizedSets
          .map(setItem => Number(setItem.weight))
          .filter(value => Number.isFinite(value) && value >= 0)

        return {
          exercise: exerciseItem.name,
          sets: normalizedSets.length,
          reps: repsValues.length
            ? Math.round(repsValues.reduce((sum, value) => sum + value, 0) / repsValues.length)
            : 0,
          weight: weightValues.length
            ? Math.round(weightValues.reduce((sum, value) => sum + value, 0) / weightValues.length)
            : 0,
          date: getTodayString()
        }
      })
      .filter(Boolean)

    if (payloads.length === 0) {
      setFinishMessage("Add at least one logged set before finishing.")
      return
    }

    try {
      await Promise.all(payloads.map(payload => dispatch(createWorkoutLog(payload))))
      dispatch(listWorkoutLogs())

      setActiveWorkout(null)
      setShowProgramSelector(false)
      setSelectedSplitId("")
      setSelectedProgramId("")
      setFinishMessage("Workout finished and saved.")
    } catch (error) {
      setFinishMessage(error.message || "Failed to save workout. Please try again.")
    }
  }

  const cancelWorkout = () => {
    setActiveWorkout(null)
    setShowProgramSelector(false)
    setExercisePicker("")
    setFinishMessage("")
  }

  const handleDelete = id => {
    dispatch(deleteWorkoutLog(id))
  }

  const groupedHistory = workoutHistory.reduce((acc, entry) => {
    const date = entry.date ?? getTodayString()
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {})

  const formatDate = dateStr => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === getTodayString()) return "Today"
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday"
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    })
  }

  const elapsedSeconds = activeWorkout
    ? Math.floor((Date.now() - activeWorkout.startedAt) / 1000)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {exerciseAddedDialog && (
        <div className="fixed top-24 right-4 z-50 w-[min(90vw,320px)] animate-fade-in">
          <div className="angrit-card py-3 px-4">
            <p className="text-sm font-medium">{exerciseAddedDialog}</p>
          </div>
        </div>
      )}

      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Workout Log
          </h1>
          <p className="text-muted-foreground">
            Start a session, pick your split/program, log each set, then finish.
          </p>
        </div>

        <div className="space-y-6 mb-8 animate-slide-up">
          {!activeWorkout ? (
            <>
              <div className="angrit-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold mb-1">
                      Start Workout
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Start guided with split/program, or begin an empty session.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProgramSelector(true)
                        const firstSplit = savedSplits[0]
                        if (firstSplit) {
                          setSelectedSplitId(String(firstSplit.id))
                          const firstProgram = firstSplit.programs?.[0]
                          setSelectedProgramId(firstProgram ? String(firstProgram.id) : "")
                        }
                      }}
                      className="angrit-btn-primary flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Workout
                    </button>

                    <button
                      type="button"
                      onClick={startEmptyWorkout}
                      className="angrit-btn-secondary flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Start Empty Workout
                    </button>
                  </div>
                </div>
              </div>

              {showProgramSelector && <div className="angrit-card">
                <h3 className="font-semibold mb-4">Choose Split and Program</h3>

                {isSplitsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading splits...
                  </div>
                ) : savedSplits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No saved splits found. Create one in Program page, or start empty.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Split</label>
                      <select
                        value={selectedSplitId}
                        onChange={event => {
                          const splitId = event.target.value
                          setSelectedSplitId(splitId)
                          const nextSplit = savedSplits.find(
                            split => String(split.id) === String(splitId)
                          )
                          const firstProgram = nextSplit?.programs?.[0]
                          setSelectedProgramId(firstProgram ? String(firstProgram.id) : "")
                        }}
                        className="angrit-input w-full"
                      >
                        <option value="">Select split</option>
                        {savedSplits.map(split => (
                          <option key={split.id} value={split.id}>
                            {split.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Program</label>
                      <select
                        value={selectedProgramId}
                        onChange={event => setSelectedProgramId(event.target.value)}
                        className="angrit-input w-full"
                        disabled={!selectedSplit}
                      >
                        <option value="">Select program</option>
                        {(selectedSplit?.programs ?? []).map(programItem => (
                          <option key={programItem.id} value={programItem.id}>
                            {programItem.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {selectedProgram && (
                  <div className="mt-4 p-4 rounded-xl bg-secondary/40">
                    <p className="text-sm text-muted-foreground mb-2">
                      Exercises in {selectedProgram.name}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProgram.exercises ?? []).map(exerciseName => (
                        <span
                          key={exerciseName}
                          className="text-xs px-2 py-1 rounded-md bg-background border border-border"
                        >
                          {exerciseName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={startWorkoutFromProgram}
                    disabled={!selectedProgram}
                    className="angrit-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Dumbbell className="w-5 h-5" />
                    Start {selectedProgram?.name || "Program"}
                  </button>
                </div>

                {splitError && (
                  <p className="mt-3 text-sm text-destructive">{splitError}</p>
                )}
              </div>}
            </>
          ) : (
            <div className="space-y-4">
              <div className="angrit-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold flex items-center gap-2">
                      {activeWorkout.programName}
                      {activeWorkout.splitName && (
                        <span className="text-sm font-medium text-muted-foreground">
                          <ChevronRight className="w-4 h-4 inline" />
                          {activeWorkout.splitName}
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(elapsedSeconds)} elapsed
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelWorkout}
                      className="angrit-btn-secondary flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      type="button"
                      onClick={finishWorkout}
                      disabled={isSaving}
                      className="angrit-btn-primary flex items-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Finish
                    </button>
                  </div>
                </div>
              </div>

              <div className="angrit-card">
                <h3 className="font-semibold mb-4">Add Exercise</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={exercisePicker}
                    onChange={event => setExercisePicker(event.target.value)}
                    className="angrit-input w-full"
                  >
                    <option value="">Select exercise</option>
                    {exercises.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addExerciseToActiveWorkout}
                    className="angrit-btn-secondary flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {activeWorkout.exercises.length === 0 ? (
                <div className="angrit-card text-center py-10">
                  <p className="text-muted-foreground">
                    No exercises in this session yet. Add one to start logging.
                  </p>
                </div>
              ) : (
                activeWorkout.exercises.map(exerciseItem => (
                  <div key={exerciseItem.id} className="angrit-card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{exerciseItem.name}</h4>
                        <input
                          value={exerciseItem.notes}
                          onChange={event =>
                            updateExercise(exerciseItem.id, prevExercise => ({
                              ...prevExercise,
                              notes: event.target.value
                            }))
                          }
                          placeholder="Exercise notes..."
                          className="angrit-input mt-2 w-full max-w-sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExerciseFromWorkout(exerciseItem.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/50 text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-left">SET</th>
                            <th className="px-3 py-2 text-left">PREVIOUS</th>
                            <th className="px-3 py-2 text-left">KG</th>
                            <th className="px-3 py-2 text-left">REPS</th>
                            <th className="px-3 py-2 text-left">DONE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exerciseItem.sets.map((setItem, setIndex) => (
                            <tr
                              key={setItem.id}
                              className={setItem.completed ? "bg-primary/10" : ""}
                            >
                              <td className="px-3 py-2 font-medium">{setItem.order}</td>
                              <td className="px-3 py-2 text-muted-foreground">
                                {getDisplayPreviousSet(exerciseItem.sets, setIndex)}
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={setItem.weight}
                                  onChange={event =>
                                    updateSetField(
                                      exerciseItem.id,
                                      setItem.id,
                                      "weight",
                                      event.target.value
                                    )
                                  }
                                  className="angrit-input w-20"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={setItem.reps}
                                  onChange={event =>
                                    updateSetField(
                                      exerciseItem.id,
                                      setItem.id,
                                      "reps",
                                      event.target.value
                                    )
                                  }
                                  className="angrit-input w-20"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleSetComplete(exerciseItem.id, setItem.id)
                                  }
                                  className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-colors ${
                                    setItem.completed
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background text-muted-foreground"
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      onClick={() => addSetToExercise(exerciseItem.id)}
                      className="mt-3 angrit-btn-secondary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Set
                    </button>
                  </div>
                ))
              )}

              {finishMessage && (
                <p className="text-sm text-muted-foreground">{finishMessage}</p>
              )}
            </div>
          )}
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Workout History
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
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
                    {entries.map(entry => (
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
  )
}

export default WorkoutLog
