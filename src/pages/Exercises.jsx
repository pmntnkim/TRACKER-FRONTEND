import React, { useEffect, useState } from "react"
import {
  Crown,
  Dumbbell,
  ExternalLink,
  Filter,
  LoaderCircle,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import PremiumDialog from "../components/PremiumDialog"
import { useDispatch, useSelector } from "react-redux"
import {
  createExercise,
  deleteExercise,
  getExerciseDetails,
  listExercises,
  updateExercise,
} from "../actions/exerciseActions"
import { getUserProfile } from "../actions/userActions"
import {
  EXERCISE_CREATE_RESET,
  EXERCISE_DELETE_RESET,
  EXERCISE_DETAILS_RESET,
  EXERCISE_UPDATE_RESET,
} from "../constants/exerciseConstants"

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  { label: "Cardio", value: "cardio" },
  { label: "Strength", value: "strength" },
  { label: "Stretching", value: "stretching" },
  { label: "Flexibility", value: "flexibility" },
]

const DIFFICULTY_OPTIONS = [
  { label: "All difficulty levels", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
]

const EMPTY_FORM_STATE = {
  exercise_name: "",
  description: "",
  category: "strength",
  difficulty_level: "medium",
  video_url: "",
  muscle_groups_targeted: "",
  equipment_needed: "",
}

const formatEnumLabel = value => {
  if (!value) {
    return "Not specified"
  }

  return value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, character => character.toUpperCase())
}

const mapExerciseToForm = exercise => ({
  exercise_name: exercise.exercise_name || "",
  description: exercise.description || "",
  category: exercise.category || "strength",
  difficulty_level: exercise.difficulty_level || "medium",
  video_url: exercise.video_url || "",
  muscle_groups_targeted: exercise.muscle_groups_targeted || "",
  equipment_needed: exercise.equipment_needed || "",
})

const Exercises = () => {
  const dispatch = useDispatch()
  const { loading: listLoading, exercises, error: listError } = useSelector(state => state.exerciseList)
  const { loading: detailLoading, exercise: selectedExercise, error: detailError } = useSelector(
    state => state.exerciseDetails
  )
  const { loading: profileLoading, profile } = useSelector(state => state.userProfile)
  const { userInfo } = useSelector(state => state.authLogin)
  const { loading: createLoading } = useSelector(state => state.exerciseCreate)
  const { loading: updateLoading } = useSelector(state => state.exerciseUpdate)
  const { loading: deleteLoading } = useSelector(state => state.exerciseDelete)

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)
  const [editingExerciseId, setEditingExerciseId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [formState, setFormState] = useState(EMPTY_FORM_STATE)
  const [adminMessage, setAdminMessage] = useState("")
  const [adminMessageTone, setAdminMessageTone] = useState("success")
  const [activeDetailId, setActiveDetailId] = useState(null)

  const difficultyColors = {
    easy: "bg-success/10 text-success border border-success/20",
    medium: "bg-warning/10 text-warning border border-warning/20",
    hard: "bg-primary/10 text-primary border border-primary/20",
  }

  const isAdminUser = Boolean(userInfo?.isAdmin)
  const canViewPremiumDetails = isAdminUser || Boolean(profile?.is_premium)
  const mutationLoading = createLoading || updateLoading
  const activeFilters = {
    q: debouncedSearchQuery,
    category: selectedCategory,
    difficulty: selectedDifficulty,
  }

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  useEffect(() => {
    // Debounce search so filtering happens on the API instead of on a fully loaded list.
    const timerId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timerId)
  }, [searchQuery])

  useEffect(() => {
    dispatch(listExercises(activeFilters))
  }, [dispatch, debouncedSearchQuery, selectedCategory, selectedDifficulty])

  const resetAdminForm = () => {
    setEditingExerciseId(null)
    setFormState(EMPTY_FORM_STATE)
    dispatch({ type: EXERCISE_CREATE_RESET })
    dispatch({ type: EXERCISE_UPDATE_RESET })
  }

  const refreshExercises = () => {
    dispatch(listExercises(activeFilters))
  }

  const handleInputChange = event => {
    const { name, value } = event.target
    setFormState(currentState => ({
      ...currentState,
      [name]: value,
    }))
  }

  const handleWatchVideo = videoUrl => {
    // Product requirement: leave the app and open YouTube in the same browser tab.
    window.location.assign(videoUrl)
  }

  const handleViewDetails = async exerciseId => {
    if (!canViewPremiumDetails) {
      setShowPremiumDialog(true)
      return
    }

    try {
      setActiveDetailId(exerciseId)
      await dispatch(getExerciseDetails(exerciseId))
    } catch {
      setActiveDetailId(null)
    }
  }

  const handleEditExercise = async exerciseId => {
    try {
      const exercise = await dispatch(getExerciseDetails(exerciseId))
      setActiveDetailId(exerciseId)
      setEditingExerciseId(exerciseId)
      setFormState(mapExerciseToForm(exercise))
      setAdminMessage("Editing selected exercise.")
      setAdminMessageTone("success")
    } catch (error) {
      setAdminMessage(error.message)
      setAdminMessageTone("error")
    }
  }

  const handleDeleteExercise = async exerciseId => {
    const shouldDelete = window.confirm("Delete this exercise from the library?")

    if (!shouldDelete) {
      return
    }

    setPendingDeleteId(exerciseId)

    try {
      await dispatch(deleteExercise(exerciseId))
      dispatch({ type: EXERCISE_DELETE_RESET })
      setAdminMessage("Exercise removed from the library.")
      setAdminMessageTone("success")

      if (activeDetailId === exerciseId) {
        setActiveDetailId(null)
        dispatch({ type: EXERCISE_DETAILS_RESET })
      }

      if (editingExerciseId === exerciseId) {
        resetAdminForm()
      }

      refreshExercises()
    } catch (error) {
      setAdminMessage(error.message)
      setAdminMessageTone("error")
    } finally {
      setPendingDeleteId(null)
    }
  }

  const handleAdminSubmit = async event => {
    event.preventDefault()
    setAdminMessage("")

    try {
      if (editingExerciseId) {
        const updatedExercise = await dispatch(updateExercise(editingExerciseId, formState))
        dispatch({ type: EXERCISE_UPDATE_RESET })
        setAdminMessage("Exercise updated successfully.")
        setAdminMessageTone("success")

        if (activeDetailId === updatedExercise.id) {
          await dispatch(getExerciseDetails(updatedExercise.id))
        }
      } else {
        await dispatch(createExercise(formState))
        dispatch({ type: EXERCISE_CREATE_RESET })
        setAdminMessage("Exercise added successfully.")
        setAdminMessageTone("success")
      }

      resetAdminForm()
      refreshExercises()
    } catch (error) {
      setAdminMessage(error.message)
      setAdminMessageTone("error")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedDifficulty("")
  }

  const detailAccessLabel = canViewPremiumDetails
    ? "Premium detail access active"
    : "Upgrade to premium to unlock full exercise details"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                Exercise Library
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Browse the shared exercise catalog, open tutorial videos directly on YouTube, and keep premium detail access separate from the public list.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="angrit-card p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Available Now
                </p>
                <p className="text-2xl font-bold">{exercises.length}</p>
                <p className="text-sm text-muted-foreground">Exercises returned by the current filter set.</p>
              </div>

              <div className="angrit-card p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Video Access
                </p>
                <p className="text-sm font-semibold">YouTube links only</p>
                <p className="text-sm text-muted-foreground">No embeds, no streaming, no hosted media.</p>
              </div>

              <div className="angrit-card p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Detail Access
                </p>
                <p className="text-sm font-semibold">{detailAccessLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {isAdminUser ? "Admin CRUD enabled." : "Premium members can view full exercise metadata."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="angrit-card animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Filter the library</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 md:col-span-2 xl:col-span-1">
                <span className="text-sm text-muted-foreground">Search</span>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by exercise or description"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    className="angrit-input w-full pl-12"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Category</span>
                <select
                  value={selectedCategory}
                  onChange={event => setSelectedCategory(event.target.value)}
                  className="angrit-input w-full"
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value || "all-categories"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <select
                  value={selectedDifficulty}
                  onChange={event => setSelectedDifficulty(event.target.value)}
                  className="angrit-input w-full"
                >
                  {DIFFICULTY_OPTIONS.map(option => (
                    <option key={option.value || "all-difficulties"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button type="button" onClick={clearFilters} className="angrit-btn-secondary w-full flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Clear filters
                </button>
              </div>
            </div>
          </section>

          <section className="angrit-card animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Access model</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Free users can browse the catalog and open YouTube tutorials in the same browser tab.</p>
              <p>Premium users can also load full exercise details, including muscle groups and equipment notes.</p>
              <p>Admins can create, edit, and delete exercises without record limits through the panel below.</p>
            </div>
          </section>
        </div>

        {(listError || adminMessage) && (
          <div
            className={`mb-6 rounded-2xl border p-4 ${
              listError || adminMessageTone === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-success/30 bg-success/10 text-success"
            }`}
          >
            {listError || adminMessage}
          </div>
        )}

        {canViewPremiumDetails && (selectedExercise || detailLoading || detailError) && (
          <section className="angrit-card mb-8 animate-fade-in">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Premium exercise detail
                </p>

                {detailLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Loading full exercise information...
                  </div>
                ) : detailError ? (
                  <p className="text-destructive">{detailError}</p>
                ) : selectedExercise ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2">{selectedExercise.exercise_name}</h2>
                    <p className="text-muted-foreground max-w-3xl">
                      {selectedExercise.description || "No detailed description has been added yet."}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Choose an exercise card to load the full premium detail view.</p>
                )}
              </div>

              {selectedExercise && !detailLoading && (
                <button
                  type="button"
                  onClick={() => handleWatchVideo(selectedExercise.video_url)}
                  className="angrit-btn-primary flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </button>
              )}
            </div>

            {selectedExercise && !detailLoading && (
              <div className="grid gap-4 mt-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Category</p>
                  <p className="font-semibold">{formatEnumLabel(selectedExercise.category)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Difficulty</p>
                  <p className="font-semibold">{formatEnumLabel(selectedExercise.difficulty_level)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Muscle groups</p>
                  <p className="font-semibold">{selectedExercise.muscle_groups_targeted || "Not specified"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Equipment</p>
                  <p className="font-semibold">{selectedExercise.equipment_needed || "Not specified"}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {isAdminUser && (
          <section className="angrit-card mb-8 animate-slide-up">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">
                    {editingExerciseId ? "Edit exercise" : "Add a new exercise"}
                  </h2>
                </div>

                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAdminSubmit}>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-muted-foreground">Exercise name</span>
                    <input
                      className="angrit-input w-full"
                      name="exercise_name"
                      value={formState.exercise_name}
                      onChange={handleInputChange}
                      placeholder="Romanian Deadlift"
                      required
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <select
                      className="angrit-input w-full"
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      required
                    >
                      {CATEGORY_OPTIONS.filter(option => option.value).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-muted-foreground">Difficulty level</span>
                    <select
                      className="angrit-input w-full"
                      name="difficulty_level"
                      value={formState.difficulty_level}
                      onChange={handleInputChange}
                      required
                    >
                      {DIFFICULTY_OPTIONS.filter(option => option.value).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-muted-foreground">YouTube tutorial URL</span>
                    <input
                      className="angrit-input w-full"
                      type="url"
                      name="video_url"
                      value={formState.video_url}
                      onChange={handleInputChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <textarea
                      className="angrit-input w-full min-h-32 resize-y"
                      name="description"
                      value={formState.description}
                      onChange={handleInputChange}
                      placeholder="Add coaching notes, execution cues, and what the movement trains."
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-muted-foreground">Muscle groups targeted</span>
                    <input
                      className="angrit-input w-full"
                      name="muscle_groups_targeted"
                      value={formState.muscle_groups_targeted}
                      onChange={handleInputChange}
                      placeholder="Hamstrings, glutes, lower back"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-muted-foreground">Equipment needed</span>
                    <input
                      className="angrit-input w-full"
                      name="equipment_needed"
                      value={formState.equipment_needed}
                      onChange={handleInputChange}
                      placeholder="Barbell"
                    />
                  </label>

                  <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="angrit-btn-primary flex items-center justify-center gap-2"
                      disabled={mutationLoading}
                    >
                      {mutationLoading ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          Saving exercise...
                        </>
                      ) : editingExerciseId ? (
                        <>
                          <Pencil className="w-4 h-4" />
                          Update exercise
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          Create exercise
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetAdminForm}
                      className="angrit-btn-secondary flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reset form
                    </button>
                  </div>
                </form>
              </div>

              <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Admin workflow</p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">1.</span> Enter the exercise name, metadata, and a valid YouTube tutorial URL.</p>
                  <p><span className="font-semibold text-foreground">2.</span> Save the exercise to publish it instantly in the shared library.</p>
                  <p><span className="font-semibold text-foreground">3.</span> Use the Edit and Delete actions on any card to maintain the catalog over time.</p>
                </div>
              </aside>
            </div>
          </section>
        )}

        {listLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="angrit-card animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`angrit-card angrit-glow relative animate-slide-up ${
                  activeDetailId === exercise.id ? "border-primary/40" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display text-lg font-bold mb-2">
                  {exercise.exercise_name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 min-h-12">
                  {exercise.short_description || "No short description available yet."}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="px-2 py-1 rounded-lg bg-secondary text-xs font-medium border border-border">
                    {formatEnumLabel(exercise.category)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[
                      exercise.difficulty_level
                    ] ?? "bg-secondary text-secondary-foreground border border-border"}`}
                  >
                    {formatEnumLabel(exercise.difficulty_level)}
                  </span>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => handleWatchVideo(exercise.video_url)}
                    className="angrit-btn-primary flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on YouTube
                  </button>

                  <button
                    type="button"
                    onClick={() => handleViewDetails(exercise.id)}
                    className="angrit-btn-secondary flex items-center justify-center gap-2"
                    disabled={!isAdminUser && profileLoading}
                  >
                    {canViewPremiumDetails ? <ShieldCheck className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                    {canViewPremiumDetails ? "View full details" : "Premium details"}
                  </button>

                  {isAdminUser && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditExercise(exercise.id)}
                        className="angrit-btn-secondary flex items-center justify-center gap-2 px-4"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed"
                        disabled={deleteLoading && pendingDeleteId === exercise.id}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {deleteLoading && pendingDeleteId === exercise.id ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!listLoading && exercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              No exercises found
            </h3>
            <p className="text-muted-foreground mb-4">
              Adjust the search and filters, or add a new exercise if you are managing the library.
            </p>
            {isAdminUser && (
              <button type="button" onClick={resetAdminForm} className="angrit-btn-secondary inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Start a new exercise
              </button>
            )}
          </div>
        )}

        {!canViewPremiumDetails && !profileLoading && (
          <section className="angrit-card mt-8 border-primary/20 bg-primary/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Premium exercise detail</p>
                <h2 className="text-xl font-bold mb-2">Unlock full exercise instructions and metadata</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Free members can browse the library and open YouTube tutorials, while premium members can also inspect full descriptions, equipment notes, and targeted muscle groups.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPremiumDialog(true)}
                className="angrit-btn-primary flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to premium
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Exercises

