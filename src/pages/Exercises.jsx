import React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Lock, Dumbbell, ChevronDown } from "lucide-react"
import Navbar from "../components/Navbar"
import PremiumDialog from "../components/PremiumDialog"
import { useDispatch, useSelector } from "react-redux"
import { listExercises } from "../actions/exerciseActions"
import { getUserProfile } from "../actions/userActions"

const Exercises = () => {
  const dispatch = useDispatch()
  const { loading: isLoading, exercises } = useSelector(
    state => state.exerciseList
  )
  const { profile } = useSelector(state => state.userProfile)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)

  const categories = [
    { label: "All", value: "ALL" },
    { label: "Chest", value: "CHEST" },
    { label: "Back", value: "BACK" },
    { label: "Shoulders", value: "SHOULDERS" },
    { label: "Arms", value: "ARMS" },
    { label: "Legs", value: "LEGS" },
    { label: "Core", value: "CORE" },
    { label: "Cardio", value: "CARDIO" }
  ]

  const difficultyColors = {
    BEGINNER: "bg-success/10 text-success",
    INTERMEDIATE: "bg-warning/10 text-warning",
    ADVANCED: "bg-primary/10 text-primary"
  }

  useEffect(() => {
    dispatch(listExercises())
    dispatch(getUserProfile())
  }, [dispatch])

  const isPremiumUser = Boolean(profile?.is_premium)

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "ALL" ||
      (exercise.category || "").toUpperCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />

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
                  key={category.value}
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
                {exercise.is_premium && !isPremiumUser && (
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      setShowPremiumDialog(true)
                    }}
                    className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    Premium
                  </button>
                )}

                {exercise.is_premium && isPremiumUser && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-success/20 text-success text-xs font-medium">
                    Premium Unlocked
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display text-lg font-bold mb-2">
                  {exercise.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.muscle_group}
                </p>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-secondary text-xs font-medium">
                    {exercise.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[
                      (exercise.difficulty || "").toUpperCase()
                    ] ?? ""}`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>

                {exercise.is_premium && !isPremiumUser && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation()
                        setShowPremiumDialog(true)
                      }}
                      className="angrit-btn-primary text-sm"
                    >
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
      </main>
    </div>
  )
}

export default Exercises

