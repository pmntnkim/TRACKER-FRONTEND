import React from "react"
import { useEffect, useState } from "react"
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  Loader2,
  Dumbbell,
  Plus,
  X,
  Eye,
  Save,
  Pencil,
  Trash2
} from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { generateProgram, resetProgram } from "../actions/programActions"
import { listExercises } from "../actions/exerciseActions"
import axios from "axios"

const Program = () => {
  const dispatch = useDispatch()
  const {
    loading: isGenerating,
    program,
    error: programError,
    generatedSplit
  } = useSelector(state => state.program)
  const { userInfo } = useSelector(state => state.authLogin)
  const { loading: isExercisesLoading, exercises } = useSelector(
    state => state.exerciseList
  )

  const [expandedWeek, setExpandedWeek] = useState(null)

  const [splitNameInput, setSplitNameInput] = useState("")
  const [programNameInput, setProgramNameInput] = useState("")
  const [customSplit, setCustomSplit] = useState(null)
  const [savedSplits, setSavedSplits] = useState([])
  const [selectedExerciseByProgram, setSelectedExerciseByProgram] = useState({})
  const [isSplitsLoading, setIsSplitsLoading] = useState(false)
  const [isSavingSplit, setIsSavingSplit] = useState(false)
  const [isCancelingEdit, setIsCancelingEdit] = useState(false)
  const [isEditingSplit, setIsEditingSplit] = useState(false)
  const [splitError, setSplitError] = useState("")

  const splitApiConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo?.token}`
    }
  }

  const getSplitPayload = split => ({
    name: split.name,
    programs: (split.programs ?? []).map((programItem, index) => ({
      name: programItem.name,
      order: index,
      exercise_items: (programItem.exercises ?? []).map(
        (exerciseName, exerciseIndex) => ({
          exercise_name: exerciseName,
          order: exerciseIndex
        })
      )
    }))
  })

  const toEditableSplit = split => ({
    ...split,
    programs: (split.programs ?? []).map(programItem => ({
      ...programItem,
      exercises: programItem.exercises ?? []
    }))
  })

  const loadSavedSplits = async () => {
    if (!userInfo?.token) {
      setSavedSplits([])
      return
    }

    setIsSplitsLoading(true)
    setSplitError("")
    try {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/splits/",
        splitApiConfig
      )
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

  useEffect(() => {
    dispatch(listExercises())
  }, [dispatch])

  useEffect(() => {
    loadSavedSplits()
  }, [userInfo?.token])

  useEffect(() => {
    if (generatedSplit?.id) {
      loadSavedSplits()
    }
  }, [generatedSplit?.id])

  const handleGenerate = () => {
    dispatch(resetProgram())
    dispatch(generateProgram())
    setExpandedWeek(1)
  }

  const toggleWeek = week => {
    setExpandedWeek(expandedWeek === week ? null : week)
  }

  const createSplit = () => {
    const splitName = splitNameInput.trim()
    if (!splitName) return

    setCustomSplit({
      name: splitName,
      programs: []
    })
    setIsEditingSplit(true)
    setSplitNameInput("")
    setSplitError("")
  }

  const saveCurrentSplit = async () => {
    if (!customSplit) return
    if (!userInfo?.token) {
      setSplitError("Please log in first.")
      return
    }

    setIsSavingSplit(true)
    setSplitError("")
    try {
      const payload = getSplitPayload(customSplit)
      const isExisting = Number.isInteger(customSplit.id)

      const response = isExisting
        ? await axios.put(
            `http://127.0.0.1:8000/api/splits/${customSplit.id}/`,
            payload,
            splitApiConfig
          )
        : await axios.post(
            "http://127.0.0.1:8000/api/splits/",
            payload,
            splitApiConfig
          )

      const savedSplit = toEditableSplit(response.data)
      setCustomSplit(savedSplit)
      setIsEditingSplit(false)
      setSavedSplits(prev => {
        const existingIndex = prev.findIndex(split => split.id === savedSplit.id)
        if (existingIndex >= 0) {
          return prev.map(split => (split.id === savedSplit.id ? savedSplit : split))
        }
        return [savedSplit, ...prev]
      })
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
      setSplitError(message)
    } finally {
      setIsSavingSplit(false)
    }
  }

  const viewSavedSplit = split => {
    setCustomSplit(toEditableSplit(split))
    setIsEditingSplit(false)

    const defaultExerciseMap = {}
    split.programs.forEach(programItem => {
      defaultExerciseMap[programItem.id] = ""
    })
    setSelectedExerciseByProgram(defaultExerciseMap)
  }

  const renameSavedSplit = async split => {
    if (!userInfo?.token) {
      setSplitError("Please log in first.")
      return
    }

    const nextName = window.prompt("Rename split", split.name)
    if (!nextName) return

    const trimmedName = nextName.trim()
    if (!trimmedName) return

    setSplitError("")
    try {
      const payload = getSplitPayload({ ...split, name: trimmedName })
      const { data } = await axios.put(
        `http://127.0.0.1:8000/api/splits/${split.id}/`,
        payload,
        splitApiConfig
      )
      const updatedSplit = toEditableSplit(data)

      setSavedSplits(prev =>
        prev.map(item => (item.id === split.id ? updatedSplit : item))
      )
      setCustomSplit(prev =>
        prev && prev.id === split.id ? updatedSplit : prev
      )
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
      setSplitError(message)
    }
  }

  const deleteSavedSplit = async splitId => {
    const confirmed = window.confirm("Delete this split?")
    if (!confirmed) return

    if (!userInfo?.token) {
      setSplitError("Please log in first.")
      return
    }

    setSplitError("")
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/splits/${splitId}/`,
        splitApiConfig
      )
      setSavedSplits(prev => prev.filter(split => split.id !== splitId))
      setCustomSplit(prev => (prev && prev.id === splitId ? null : prev))
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
      setSplitError(message)
    }
  }

  const addProgram = () => {
    const programName = programNameInput.trim()
    if (!programName || !customSplit) return

    const programId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setCustomSplit(prev => ({
      ...prev,
      programs: [
        ...prev.programs,
        { id: programId, name: programName, exercises: [] }
      ]
    }))

    setSelectedExerciseByProgram(prev => ({ ...prev, [programId]: "" }))
    setProgramNameInput("")
  }

  const enableSplitEditing = () => {
    if (!customSplit) return
    setIsEditingSplit(true)
  }

  const cancelSplitEditing = async () => {
    if (!customSplit) return

    if (!Number.isInteger(customSplit.id)) {
      setCustomSplit(null)
      setProgramNameInput("")
      setIsEditingSplit(false)
      return
    }

    if (!userInfo?.token) {
      setSplitError("Please log in first.")
      return
    }

    setIsCancelingEdit(true)
    setSplitError("")
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/splits/${customSplit.id}/`,
        splitApiConfig
      )
      const latestSplit = toEditableSplit(data)
      setCustomSplit(latestSplit)
      setSavedSplits(prev =>
        prev.map(split => (split.id === latestSplit.id ? latestSplit : split))
      )
      setProgramNameInput("")
      setIsEditingSplit(false)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
      setSplitError(message)
    } finally {
      setIsCancelingEdit(false)
    }
  }

  const handleSelectedExerciseChange = (programId, value) => {
    setSelectedExerciseByProgram(prev => ({ ...prev, [programId]: value }))
  }

  const getExerciseNameById = exerciseId => {
    const selectedExercise = exercises.find(
      exercise => String(exercise.id) === String(exerciseId)
    )
    return selectedExercise?.name ?? ""
  }

  const addExerciseToProgram = programId => {
    const selectedExerciseId = selectedExerciseByProgram[programId] ?? ""
    const exerciseName = getExerciseNameById(selectedExerciseId).trim()
    if (!exerciseName) return

    setCustomSplit(prev => {
      if (!prev) return prev
      return {
        ...prev,
        programs: prev.programs.map(programItem =>
          programItem.id === programId
            ? {
                ...programItem,
                exercises: [...programItem.exercises, exerciseName]
              }
            : programItem
        )
      }
    })

    setSelectedExerciseByProgram(prev => ({ ...prev, [programId]: "" }))
  }

  const removeExerciseFromProgram = (programId, exerciseIndex) => {
    setCustomSplit(prev => {
      if (!prev) return prev
      return {
        ...prev,
        programs: prev.programs.map(programItem =>
          programItem.id === programId
            ? {
                ...programItem,
                exercises: programItem.exercises.filter(
                  (_, index) => index !== exerciseIndex
                )
              }
            : programItem
        )
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Training Programs
          </h1>
          <p className="text-muted-foreground">
            Build your own split and generate an AI program anytime.
          </p>
        </div>

        <section className="angrit-card mb-8 animate-slide-up">
          <h2 className="font-display text-2xl font-bold mb-2">My Split</h2>
          <p className="text-muted-foreground mb-6">
            Create a split, add programs, then add exercises inside each program.
          </p>

          {!customSplit ? (
            <div className="rounded-xl border border-border p-4 bg-secondary/20">
              <label className="block text-sm font-medium mb-2">Split Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={splitNameInput}
                  onChange={e => setSplitNameInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      createSplit()
                    }
                  }}
                  className="angrit-input w-full"
                  placeholder="e.g. Push Pull Legs"
                />
                <button
                  type="button"
                  onClick={createSplit}
                  className="angrit-btn-primary px-4"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-border p-4 bg-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">Current Split</p>
                <h3 className="font-semibold text-lg">{customSplit.name}</h3>
                <div className="mt-4 flex items-center gap-2">
                  {isEditingSplit ? (
                    <>
                      <button
                        type="button"
                        onClick={saveCurrentSplit}
                        disabled={isSavingSplit || isCancelingEdit}
                        className="angrit-btn-primary inline-flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isSavingSplit ? "Saving..." : "Save Split"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelSplitEditing}
                        disabled={isSavingSplit || isCancelingEdit}
                        className="angrit-btn-secondary inline-flex items-center gap-2"
                      >
                        {isCancelingEdit ? "Canceling..." : "Cancel Edit"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={enableSplitEditing}
                      className="angrit-btn-secondary inline-flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Split
                    </button>
                  )}
                </div>
              </div>

              {isEditingSplit && (
                <div className="rounded-xl border border-border p-4 bg-secondary/20">
                  <label className="block text-sm font-medium mb-2">Add Program</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={programNameInput}
                      onChange={e => setProgramNameInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addProgram()
                        }
                      }}
                      className="angrit-input w-full"
                      placeholder="e.g. Push"
                    />
                    <button
                      type="button"
                      onClick={addProgram}
                      className="angrit-btn-secondary px-3"
                      aria-label="Add program"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {customSplit.programs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-5">
                  {customSplit.programs.map(programItem => (
                    <div
                      key={programItem.id}
                      className="rounded-xl border border-border p-4 bg-secondary/20"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-lg">{programItem.name}</h4>
                      </div>

                      {isEditingSplit && (
                        <>
                          <div className="flex gap-2 mb-4">
                            <select
                              value={selectedExerciseByProgram[programItem.id] ?? ""}
                              onChange={e =>
                                handleSelectedExerciseChange(programItem.id, e.target.value)
                              }
                              className="angrit-input w-full"
                              disabled={isExercisesLoading}
                            >
                              <option value="">
                                {isExercisesLoading
                                  ? "Loading exercises..."
                                  : "Select from exercise library"}
                              </option>
                              {exercises.map(exercise => (
                                <option key={exercise.id} value={exercise.id}>
                                  {exercise.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => addExerciseToProgram(programItem.id)}
                              className="angrit-btn-secondary px-3"
                              aria-label={`Add exercise to ${programItem.name}`}
                              disabled={isExercisesLoading}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {!isExercisesLoading && exercises.length === 0 && (
                            <p className="text-xs text-muted-foreground mb-3">
                              No exercises found in your library.
                            </p>
                          )}
                        </>
                      )}

                      <div className="space-y-2 max-h-64 overflow-auto">
                        {programItem.exercises.length > 0 ? (
                          programItem.exercises.map((exercise, index) => (
                            <div
                              key={`${exercise}-${index}`}
                              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-muted"
                            >
                              <span className="text-sm">{exercise}</span>
                              {isEditingSplit && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExerciseFromProgram(programItem.id, index)
                                  }
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label={`Remove ${exercise}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No exercises added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No programs added yet.</p>
              )}
            </div>
          )}
        </section>

        <section className="angrit-card mb-8 animate-slide-up">
          <h2 className="font-display text-2xl font-bold mb-2">
            Your Workout Splits
          </h2>
          <p className="text-muted-foreground mb-6">
            View your saved splits and continue where you left off.
          </p>

          {splitError && (
            <p className="text-sm text-red-500 mb-4">{splitError}</p>
          )}

          {isSplitsLoading && (
            <p className="text-sm text-muted-foreground mb-4">Loading splits...</p>
          )}

          {savedSplits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved splits yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {savedSplits.map(split => (
                <div
                  key={split.id}
                  className="rounded-xl border border-border p-4 bg-secondary/20"
                >
                  <h3 className="font-semibold text-lg mb-1">{split.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {split.programs.length} program
                    {split.programs.length === 1 ? "" : "s"}
                  </p>
                  <button
                    type="button"
                    onClick={() => viewSavedSplit(split)}
                    className="angrit-btn-secondary inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Split
                  </button>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => renameSavedSplit(split)}
                      className="angrit-btn-secondary inline-flex items-center justify-center p-2"
                      aria-label="Rename split"
                      title="Rename split"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedSplit(split.id)}
                      className="angrit-btn-secondary inline-flex items-center justify-center p-2"
                      aria-label="Delete split"
                      title="Delete split"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="mb-2">
            <h2 className="font-display text-2xl font-bold mb-2">
              AI Training Program
            </h2>
            <p className="text-muted-foreground">
              Get a personalized 12-week program powered by AI.
            </p>
          </div>

          {programError && (
            <p className="text-sm text-red-500">{programError}</p>
          )}

          {generatedSplit?.id && (
            <p className="text-sm text-primary">
              Program created and saved as split: {generatedSplit.name}
            </p>
          )}

          {program.length === 0 && (
            <div className="angrit-card text-center py-12 animate-slide-up">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">
                Ready to Transform?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Our AI analyzes your profile, goals, and fitness level to create a
                custom 12-week training program just for you.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="angrit-btn-primary inline-flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating your program...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Program
                  </>
                )}
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4 animate-fade-in">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="angrit-card animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-muted rounded w-32"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {program.length > 0 && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleGenerate}
                  className="angrit-btn-secondary text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate
                </button>
              </div>

              {program.map((week, index) => (
                <div
                  key={week.week}
                  className={`angrit-card animate-slide-up ${
                    week.is_premium || week.isPremium ? "border-primary/30" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() =>
                      !(week.is_premium || week.isPremium) &&
                      toggleWeek(week.week)
                    }
                    className={`w-full flex items-center justify-between ${
                      week.is_premium || week.isPremium
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                    disabled={week.is_premium || week.isPremium}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold ${
                          week.is_premium || week.isPremium
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary"
                        }`}
                      >
                        {week.is_premium || week.isPremium ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          week.week
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-bold">Week {week.week}</h3>
                        <p className="text-sm text-muted-foreground">{week.focus}</p>
                      </div>
                    </div>

                    {!(week.is_premium || week.isPremium) && (
                      <div className="text-muted-foreground">
                        {expandedWeek === week.week ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    )}

                    {(week.is_premium || week.isPremium) && (
                      <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                        Premium
                      </span>
                    )}
                  </button>

                  {expandedWeek === week.week &&
                    !(week.is_premium || week.isPremium) && (
                      <div className="mt-6 pt-6 border-t border-border space-y-4 animate-fade-in">
                        {(week.days ?? []).map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="p-4 rounded-xl bg-secondary/50"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Dumbbell className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">{day.day}</p>
                                <p className="text-sm text-muted-foreground">
                                  {day.workout}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(day.exercises ?? []).map((exercise, exIndex) => (
                                <span
                                  key={exIndex}
                                  className="px-3 py-1 rounded-lg bg-muted text-sm"
                                >
                                  {exercise}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {(week.is_premium || week.isPremium) && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground text-center">
                        Unlock premium to access advanced training phases
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Program
