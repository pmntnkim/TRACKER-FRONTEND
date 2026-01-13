import React from "react";
import { useState, useEffect } from "react";
import { Search, Filter, Lock, Dumbbell, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Cardio",
  ];

  const difficultyColors = {
    Beginner: "bg-success/10 text-success",
    Intermediate: "bg-warning/10 text-warning",
    Advanced: "bg-primary/10 text-primary",
  };

  useEffect(() => {
    const fetchExercises = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setExercises([
        { id: 1, name: "Bench Press", category: "Chest", difficulty: "Intermediate", isPremium: false, muscleGroup: "Pectorals" },
        { id: 2, name: "Incline Dumbbell Press", category: "Chest", difficulty: "Intermediate", isPremium: false, muscleGroup: "Upper Chest" },
        { id: 3, name: "Cable Flyes", category: "Chest", difficulty: "Beginner", isPremium: true, muscleGroup: "Pectorals" },
        { id: 4, name: "Deadlift", category: "Back", difficulty: "Advanced", isPremium: false, muscleGroup: "Full Back" },
        { id: 5, name: "Pull-ups", category: "Back", difficulty: "Intermediate", isPremium: false, muscleGroup: "Lats" },
        { id: 6, name: "Barbell Rows", category: "Back", difficulty: "Intermediate", isPremium: false, muscleGroup: "Middle Back" },
        { id: 7, name: "Military Press", category: "Shoulders", difficulty: "Intermediate", isPremium: false, muscleGroup: "Deltoids" },
        { id: 8, name: "Lateral Raises", category: "Shoulders", difficulty: "Beginner", isPremium: false, muscleGroup: "Side Delts" },
        { id: 9, name: "Face Pulls", category: "Shoulders", difficulty: "Beginner", isPremium: true, muscleGroup: "Rear Delts" },
        { id: 10, name: "Barbell Curl", category: "Arms", difficulty: "Beginner", isPremium: false, muscleGroup: "Biceps" },
        { id: 11, name: "Skull Crushers", category: "Arms", difficulty: "Intermediate", isPremium: false, muscleGroup: "Triceps" },
        { id: 12, name: "Hammer Curls", category: "Arms", difficulty: "Beginner", isPremium: true, muscleGroup: "Brachialis" },
        { id: 13, name: "Squats", category: "Legs", difficulty: "Advanced", isPremium: false, muscleGroup: "Quadriceps" },
        { id: 14, name: "Romanian Deadlift", category: "Legs", difficulty: "Intermediate", isPremium: false, muscleGroup: "Hamstrings" },
        { id: 15, name: "Leg Press", category: "Legs", difficulty: "Beginner", isPremium: false, muscleGroup: "Quadriceps" },
        { id: 16, name: "Plank", category: "Core", difficulty: "Beginner", isPremium: false, muscleGroup: "Abs" },
        { id: 17, name: "Hanging Leg Raises", category: "Core", difficulty: "Advanced", isPremium: true, muscleGroup: "Lower Abs" },
        { id: 18, name: "Russian Twists", category: "Core", difficulty: "Intermediate", isPremium: false, muscleGroup: "Obliques" },
      ]);
      setIsLoading(false);
    };
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="angrit-input w-full pl-12"
              />
            </div>

            {/* Filter Button */}
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

          {/* Category Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {categories.map((category) => (
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  exercise.isPremium ? "border-primary/30" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Premium Badge */}
                {exercise.isPremium && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    Premium
                  </div>
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>

                {/* Info */}
                <h3 className="font-display text-lg font-bold mb-2">
                  {exercise.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.muscleGroup}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-secondary text-xs font-medium">
                    {exercise.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      difficultyColors[exercise.difficulty]
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Premium Overlay */}
                {exercise.isPremium && (
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

        {/* No Results */}
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
  );
};

export default Exercises;

