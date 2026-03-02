import React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Lock, Dumbbell, ChevronDown, X, Pencil, Trash2 } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { listExercises, createExercise, updateExercise, deleteExercise } from "../actions/exerciseActions"

const Exercises = () => {
  const dispatch = useDispatch()
  const { loading: isLoading, exercises } = useSelector(
    state => state.exerciseList
  )
  const { loading: creating, success: createSuccess, error: createError } = useSelector(
    state => state.exerciseCreate
  )
  const { loading: updating, success: updateSuccess, error: updateError } = useSelector(
    state => state.exerciseUpdate
  )
  const { loading: deleting, success: deleteSuccess, error: deleteError } = useSelector(
    state => state.exerciseDelete
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  // create form state
  const [nameInput, setNameInput] = useState("")
  const [descriptionInput, setDescriptionInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [difficultyInput, setDifficultyInput] = useState("")
  const [muscleGroupInput, setMuscleGroupInput] = useState("")
  const [sampleImageUrlInput, setSampleImageUrlInput] = useState("")
  const [sampleImageFile, setSampleImageFile] = useState(null)
  const [videoUrlInput, setVideoUrlInput] = useState("")

  // video modal state
  const [playingUrl, setPlayingUrl] = useState("")

  // editing state
  const [editingExercise, setEditingExercise] = useState(null)

  // validation error shown above form
  const [formError, setFormError] = useState("")

  // mapping to API choice values for the create/edit form
  const categoryOptions = [
    { value: "CHEST", label: "Chest" },
    { value: "BACK", label: "Back" },
    { value: "SHOULDERS", label: "Shoulders" },
    { value: "ARMS", label: "Arms" },
    { value: "LEGS", label: "Legs" },
    { value: "CORE", label: "Core" },
    { value: "CARDIO", label: "Cardio" },
  ];
  // categories for filtering (human labels), include All
  const categories = ["All", ...categoryOptions.map(o => o.label)];

  // map API difficulty codes to colors and labels
  const difficultyOptions = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];
  const difficultyColors = {
    BEGINNER: "bg-success/10 text-success",
    INTERMEDIATE: "bg-warning/10 text-warning",
    ADVANCED: "bg-primary/10 text-primary"
  }

  useEffect(() => {
    dispatch(listExercises())
  }, [dispatch])

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      setNameInput("")
      setDescriptionInput("")
      setCategoryInput("")
      setDifficultyInput("")
      setSampleImageUrlInput("")
      setSampleImageFile(null)
      setVideoUrlInput("")
      setEditingExercise(null)
      setFormError("")
      dispatch(listExercises())
      // reset states
      dispatch({ type: "EXERCISE_CREATE_RESET" })
      dispatch({ type: "EXERCISE_UPDATE_RESET" })
      dispatch({ type: "EXERCISE_DELETE_RESET" })
    }
  }, [createSuccess, updateSuccess, deleteSuccess, dispatch])

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
    let matchesCategory = true
    if (selectedCategory !== "All") {
      // find code for the selected human label
      const opt = categoryOptions.find(o => o.label === selectedCategory)
      matchesCategory = opt ? exercise.category === opt.value : false
    }
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Exercise Library
          </h1>
          <p className="text-muted-foreground">
            Explore {exercises.length}+ exercises to build your perfect workout.
          </p>
        </div>

        {/* Create Exercise Form */}
        <div className="mb-8 animate-slide-up">
          <h2 className="font-display text-2xl font-bold mb-2">Create New Exercise</h2>
          {(formError || createError || updateError || deleteError) && (
            <p className="text-red-500 text-sm mb-2">
              {formError || createError || updateError || deleteError}
            </p>
          )}
          {(createSuccess || updateSuccess || deleteSuccess) && (
            <p className="text-green-500 text-sm mb-2">
              {createSuccess
                ? "Exercise created successfully!"
                : updateSuccess
                ? "Exercise updated!"
                : "Exercise deleted!"}
            </p>
          )}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Exercise Name"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="angrit-input w-full"
            />
            <textarea
              placeholder="Description (optional)"
              value={descriptionInput}
              onChange={e => setDescriptionInput(e.target.value)}
              className="angrit-input w-full"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                className="angrit-input flex-1"
              >
                <option value="">Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={difficultyInput}
                onChange={e => setDifficultyInput(e.target.value)}
                className="angrit-input flex-1"
              >
                <option value="">Difficulty</option>
                {difficultyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Muscle group"
                value={muscleGroupInput}
                onChange={e => setMuscleGroupInput(e.target.value)}
                className="angrit-input flex-1"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Sample Image URL"
                value={sampleImageUrlInput}
                onChange={e => setSampleImageUrlInput(e.target.value)}
                className="angrit-input w-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => setSampleImageFile(e.target.files[0])}
                className="angrit-input"
              />
            </div>
            {(sampleImageUrlInput || sampleImageFile) && (
              <div className="mt-2 w-32 h-32 overflow-hidden rounded">
                {sampleImageFile ? (
                  <img
                    src={URL.createObjectURL(sampleImageFile)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={sampleImageUrlInput}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            )}
            <input
              type="text"
              placeholder="Video URL (YouTube or other)"
              value={videoUrlInput}
              onChange={e => setVideoUrlInput(e.target.value)}
              className="angrit-input w-full"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={creating || updating}
                onClick={() => {
                  setFormError("")
                  if (!nameInput.trim()) {
                    setFormError("Name is required")
                    return
                  }
                  if (!categoryInput) {
                    setFormError("Category is required")
                    return
                  }
                  if (!difficultyInput) {
                    setFormError("Difficulty is required")
                    return
                  }
                  if (!muscleGroupInput.trim()) {
                    setFormError("Muscle group is required")
                    return
                  }

                  const payload = {
                    name: nameInput.trim(),
                    description: descriptionInput.trim(),
                    category: categoryInput,
                    difficulty: difficultyInput,
                    muscle_group: muscleGroupInput.trim(),
                    sample_image: sampleImageUrlInput.trim(),
                    sampleImageFile,
                    video_url: videoUrlInput.trim()
                  }

                  if (editingExercise) {
                    dispatch(updateExercise(editingExercise.id, payload))
                  } else {
                    dispatch(createExercise(payload))
                  }
                }}
                className="angrit-btn-primary"
              >
                {editingExercise
                  ? updating
                    ? "Saving..."
                    : "Save Changes"
                  : creating
                  ? "Creating..."
                  : "Create Exercise"}
              </button>
              {editingExercise && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingExercise(null)
                    setNameInput("")
                    setDescriptionInput("")
                    setCategoryInput("")
                    setDifficultyInput("")
                    setSampleImageUrlInput("")
                    setSampleImageFile(null)
                    setVideoUrlInput("")
                  }}
                  className="angrit-btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="angrit-input w-full pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
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
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="angrit-card animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`angrit-card angrit-glow relative cursor-pointer animate-slide-up ${
                  exercise.is_premium ? "border-primary/30" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* top right actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      // start editing
                      setEditingExercise(exercise)
                      setNameInput(exercise.name || "")
                      setDescriptionInput(exercise.description || "")
                      setCategoryInput(exercise.category || "")
                      setDifficultyInput(exercise.difficulty || "")
                      setSampleImageUrlInput(exercise.sample_image || "")
                      setSampleImageFile(null)
                      setVideoUrlInput(exercise.video_url || "")
                    }}
                    className="p-1 rounded-full bg-secondary hover:bg-muted"
                    title="Edit exercise"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const confirmed = window.confirm(
                        `Delete exercise \"${exercise.name}\"?`
                      )
                      if (confirmed) {
                        dispatch(deleteExercise(exercise.id))
                      }
                    }}
                    className="p-1 rounded-full bg-secondary hover:bg-destructive/20"
                    title="Delete exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {exercise.is_premium && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    Premium
                  </div>
                )}

                {/* sample image or fallback icon */}
                <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                  {exercise.sample_image ? (
                    <img
                      src={exercise.sample_image}
                      alt={exercise.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Dumbbell className="w-10 h-10 text-primary" />
                  )}
                </div>

                <h3 className="font-display text-lg font-bold mb-1">
                  {exercise.name}
                </h3>
                {exercise.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {exercise.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-lg bg-secondary text-xs font-medium">
                    {categoryOptions.find(o => o.value === exercise.category)?.label || exercise.category || ""}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[
                      exercise.difficulty
                    ] ?? ""}`}
                  >
                    {difficultyOptions.find(o => o.value === exercise.difficulty)?.label || exercise.difficulty || ""}
                  </span>
                </div>

                {exercise.video_url && (
                  <button
                    onClick={() => setPlayingUrl(exercise.video_url)}
                    className="angrit-btn-secondary text-sm w-full"
                  >
                    Watch Demo
                  </button>
                )}

                {exercise.is_premium && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="angrit-btn-primary text-sm">
                      Unlock Premium
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              No exercises found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* video playback overlay */}
        {playingUrl && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="relative w-full max-w-3xl">
              <button
                onClick={() => setPlayingUrl("")}
                className="absolute top-2 right-2 text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={
                    playingUrl.includes("youtube")
                      ? playingUrl.replace("watch?v=", "embed/")
                      : playingUrl
                  }
                  title="Exercise demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Exercises

