import React, { useEffect, useState } from "react"
import {
  ChevronDown,
  Dumbbell,
  ExternalLink,
  Filter,
  Loader2,
  Lock,
  Pencil,
  RefreshCcw,
  Search,
  ShieldPlus,
  Trash2
} from "lucide-react"
import Navbar from "../components/Navbar"
import PremiumDialog from "../components/PremiumDialog"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteExercise,
  getExerciseDetails,
  listExercises,
  saveExercise
} from "../actions/exerciseActions"
import { getUserProfile } from "../actions/userActions"
import {
  EXERCISE_DELETE_RESET,
  EXERCISE_DETAILS_RESET,
  EXERCISE_SAVE_RESET
} from "../constants/exerciseConstants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog"

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Cardio", value: "cardio" },
  { label: "Strength", value: "strength" },
  { label: "Stretching", value: "stretching" },
  { label: "Flexibility", value: "flexibility" }
]

const difficultyOptions = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" }
]

const difficultyStyles = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive"
}

const initialFormState = {
  exercise_name: "",
  description: "",
  category: "strength",
  difficulty_level: "easy",
  video_url: "",
  muscle_groups_targeted: "",
  equipment_needed: ""
}

const formatLabel = value =>
  (value || "")
    .split("_")
    .join(" ")
    .replace(/\b\w/g, character => character.toUpperCase())

const mapExerciseToForm = exercise => ({
  exercise_name: exercise?.exercise_name || "",
  description: exercise?.description || "",
  category: exercise?.category || "strength",
  difficulty_level: exercise?.difficulty_level || "easy",
  video_url: exercise?.video_url || "",
  muscle_groups_targeted: exercise?.muscle_groups_targeted || "",
  equipment_needed: exercise?.equipment_needed || ""
})

const Exercises = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.authLogin)
  const { loading: isLoading, exercises, error: listError } = useSelector(
    state => state.exerciseList
  )
  const {
    loading: detailsLoading,
    exercise,
    error: detailsError
  } = useSelector(state => state.exerciseDetails)
  const {
    loading: saveLoading,
    success: saveSuccess,
    exercise: savedExercise,
    error: saveError
  } = useSelector(state => state.exerciseSave)
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError
  } = useSelector(state => state.exerciseDelete)
  const { profile } = useSelector(state => state.userProfile)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [editingExerciseId, setEditingExerciseId] = useState(null)
  const [formState, setFormState] = useState(initialFormState)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  const isPremiumUser = Boolean(profile?.is_premium)
  const isAdmin = Boolean(userInfo?.isAdmin)
  const canViewPremiumDetails = isPremiumUser || isAdmin
  const selectedExercise =
    selectedExerciseId && exercise?.id === selectedExerciseId ? exercise : null

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(getUserProfile())
    }
  }, [dispatch, userInfo?.token])

  useEffect(() => {
    // Keep filtering on the server so the library stays responsive as the exercise catalog grows.
    const timeoutId = window.setTimeout(() => {
      dispatch(
        listExercises({
          q: searchQuery,
          category: selectedCategory,
          difficultyLevel: selectedDifficulty
        })
      )
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [dispatch, searchQuery, selectedCategory, selectedDifficulty])

  useEffect(() => {
    // Admin edits use the full detail payload to avoid overwriting fields that are not present in the list response.
    if (editingExerciseId && exercise?.id === editingExerciseId) {
      setFormState(mapExerciseToForm(exercise))
    }
  }, [editingExerciseId, exercise])

  useEffect(() => {
    if (!saveSuccess && !deleteSuccess) {
      return
    }

    if (saveSuccess) {
      setFeedbackMessage(
        editingExerciseId ? "Exercise updated successfully." : "Exercise created successfully."
      )
      setEditingExerciseId(null)
      setFormState(initialFormState)

      if (savedExercise?.id) {
        setSelectedExerciseId(savedExercise.id)
        if (canViewPremiumDetails) {
          dispatch(getExerciseDetails(savedExercise.id))
        }
      }

      dispatch({ type: EXERCISE_SAVE_RESET })
    }

    if (deleteSuccess) {
      setFeedbackMessage("Exercise deleted successfully.")
      setSelectedExerciseId(null)
      setEditingExerciseId(null)
      setFormState(initialFormState)
      dispatch({ type: EXERCISE_DETAILS_RESET })
      dispatch({ type: EXERCISE_DELETE_RESET })
    }

    dispatch(
      listExercises({
        q: searchQuery,
        category: selectedCategory,
        difficultyLevel: selectedDifficulty
      })
    )
  }, [
    canViewPremiumDetails,
    deleteSuccess,
    dispatch,
    editingExerciseId,
    saveSuccess,
    savedExercise,
    searchQuery,
    selectedCategory,
    selectedDifficulty
  ])

  const refreshLibrary = () => {
    dispatch(
      listExercises({
        q: searchQuery,
        category: selectedCategory,
        difficultyLevel: selectedDifficulty
      })
    )
  }

  const handleWatchOnYouTube = videoUrl => {
    window.location.assign(videoUrl)
  }

  const handleViewDetails = exerciseId => {
    if (!canViewPremiumDetails) {
      setShowPremiumDialog(true)
      return
    }

    setSelectedExerciseId(exerciseId)
    setShowDetailsDialog(true)
    dispatch(getExerciseDetails(exerciseId))
  }

  const handleDetailsOpenChange = open => {
    setShowDetailsDialog(open)

    if (!open) {
      setSelectedExerciseId(null)
      dispatch({ type: EXERCISE_DETAILS_RESET })
    }
  }

  const handleCreateNew = () => {
    setEditingExerciseId(null)
    setFormState(initialFormState)
    setFeedbackMessage("")
  }

  const handleEditExercise = exerciseId => {
    setEditingExerciseId(exerciseId)
    setSelectedExerciseId(exerciseId)
    setFeedbackMessage("")
    dispatch(getExerciseDetails(exerciseId))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleEditFromDetails = () => {
    if (!selectedExercise) {
      return
    }

    handleDetailsOpenChange(false)
    handleEditExercise(selectedExercise.id)
  }

  const handleDeleteExercise = exerciseId => {
    if (!window.confirm("Delete this exercise from the library?")) {
      return
    }

    setFeedbackMessage("")
    dispatch(deleteExercise(exerciseId))
  }

  const handleFormChange = event => {
    const { name, value } = event.target
    setFormState(currentState => ({
      ...currentState,
      [name]: value
    }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    setFeedbackMessage("")

    dispatch(
      saveExercise({
        ...(editingExerciseId ? { id: editingExerciseId } : {}),
        ...formState
      })
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />
      <Dialog open={showDetailsDialog} onOpenChange={handleDetailsOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto border-border bg-card p-0 sm:rounded-2xl">
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-6 text-left">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                Premium Exercise Details
              </p>
              <DialogTitle className="font-display text-2xl sm:text-3xl mt-2 pr-10">
                {detailsLoading
                  ? "Loading exercise details..."
                  : selectedExercise?.exercise_name || "Exercise details"}
              </DialogTitle>
              <DialogDescription className="max-w-2xl pt-1">
                Review the full movement notes here without losing your place in the exercise library.
              </DialogDescription>
            </DialogHeader>

            {selectedExercise && (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => handleWatchOnYouTube(selectedExercise.video_url)}
                  className="angrit-btn-primary inline-flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleEditFromDetails}
                    className="angrit-btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Exercise
                  </button>
                )}
              </div>
            )}

            {detailsLoading && (
              <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-5 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Fetching full exercise details.
              </div>
            )}

            {detailsError && !detailsLoading && (
              <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {detailsError}
              </div>
            )}

            {selectedExercise && !detailsLoading && !detailsError && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
                <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Description
                  </p>
                  <p className="text-muted-foreground leading-7 whitespace-pre-line">
                    {selectedExercise.description || "No long-form description has been added yet."}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl bg-secondary/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      Category
                    </p>
                    <p className="font-medium">{formatLabel(selectedExercise.category)}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      Difficulty
                    </p>
                    <p className="font-medium">{formatLabel(selectedExercise.difficulty_level)}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      Muscle Groups Targeted
                    </p>
                    <p className="font-medium">
                      {selectedExercise.muscle_groups_targeted || "No muscle group notes added."}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      Equipment Needed
                    </p>
                    <p className="font-medium">
                      {selectedExercise.equipment_needed || "No equipment required."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                Exercise Library
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Browse unlimited exercise entries and open tutorial videos directly on YouTube in the same tab.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshLibrary}
              className="angrit-btn-secondary inline-flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Library
            </button>
          </div>
        </div>

        {isAdmin && (
          <section className="angrit-card mb-8 animate-slide-up border border-primary/20 bg-card/70 backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                  <ShieldPlus className="w-4 h-4" />
                  Admin Exercise Manager
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  {editingExerciseId ? "Edit Exercise" : "Add Exercise"}
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Create, update, and delete exercise records without record limits. Every exercise stores a direct YouTube link and no video is hosted inside the app.
                </p>
              </div>

              {editingExerciseId && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="angrit-btn-secondary"
                >
                  Create New Exercise
                </button>
              )}
            </div>

            {(feedbackMessage || saveError || deleteError) && (
              <div
                className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
                  saveError || deleteError
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success/10 text-success"
                }`}
              >
                {saveError || deleteError || feedbackMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-medium">Exercise Name</span>
                <input
                  type="text"
                  name="exercise_name"
                  value={formState.exercise_name}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  placeholder="Barbell Romanian Deadlift"
                  required
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  className="angrit-input w-full min-h-28"
                  placeholder="Add coaching notes, setup cues, or movement benefits."
                  rows={4}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Category</span>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  required
                >
                  {categoryOptions
                    .filter(option => option.value !== "all")
                    .map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Difficulty Level</span>
                <select
                  name="difficulty_level"
                  value={formState.difficulty_level}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  required
                >
                  {difficultyOptions
                    .filter(option => option.value !== "all")
                    .map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-medium">YouTube Tutorial Link</span>
                <input
                  type="url"
                  name="video_url"
                  value={formState.video_url}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Muscle Groups Targeted</span>
                <input
                  type="text"
                  name="muscle_groups_targeted"
                  value={formState.muscle_groups_targeted}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  placeholder="Hamstrings, glutes, spinal erectors"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Equipment Needed</span>
                <input
                  type="text"
                  name="equipment_needed"
                  value={formState.equipment_needed}
                  onChange={handleFormChange}
                  className="angrit-input w-full"
                  placeholder="Barbell, bench, resistance band"
                />
              </label>

              <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saveLoading || deleteLoading}
                  className="angrit-btn-primary inline-flex items-center justify-center gap-2"
                >
                  {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingExerciseId ? "Update Exercise" : "Add Exercise"}
                </button>

                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="angrit-btn-secondary"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </section>
        )}

        {!canViewPremiumDetails && (
          <section className="angrit-card mb-8 animate-fade-in border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold mb-2">
                  Premium Detail Access
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Free users can browse the full library and open every YouTube tutorial. Premium unlocks targeted muscle groups, equipment guidance, and full exercise details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPremiumDialog(true)}
                className="angrit-btn-primary inline-flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Premium Details
              </button>
            </div>
          </section>
        )}

        <div className="mb-8 space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                className="angrit-input w-full pl-12"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={event => setSelectedDifficulty(event.target.value)}
              className="angrit-input sm:w-48"
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} difficulty
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowFilters(currentValue => !currentValue)}
              className="angrit-btn-secondary flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {categoryOptions.map(category => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-muted"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {listError && (
          <div className="mb-8 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {listError}
          </div>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="angrit-card animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exerciseItem, index) => (
              <div
                key={exerciseItem.id}
                className="angrit-card angrit-glow relative animate-slide-up border border-border/70"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display text-lg font-bold mb-2">
                  {exerciseItem.exercise_name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 min-h-16">
                  {exerciseItem.short_description || "No short description available yet."}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-lg bg-secondary text-xs font-medium">
                    {formatLabel(exerciseItem.category)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      difficultyStyles[exerciseItem.difficulty_level] || "bg-secondary text-foreground"
                    }`}
                  >
                    {formatLabel(exerciseItem.difficulty_level)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleWatchOnYouTube(exerciseItem.video_url)}
                    className="angrit-btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on YouTube
                  </button>

                  <button
                    type="button"
                    onClick={() => handleViewDetails(exerciseItem.id)}
                    className="angrit-btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    {canViewPremiumDetails ? (
                      <>
                        {detailsLoading && selectedExerciseId === exerciseItem.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        View Details
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Premium Details
                      </>
                    )}
                  </button>

                  {isAdmin && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditExercise(exerciseItem.id)}
                        className="angrit-btn-secondary inline-flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExercise(exerciseItem.id)}
                        disabled={deleteLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && exercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              No exercises found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search, filters, or add a new exercise if you are an administrator.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Exercises

