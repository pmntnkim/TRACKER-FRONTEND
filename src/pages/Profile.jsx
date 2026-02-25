import React from "react"
import { useState, useEffect } from "react"
import { User, Save, Loader2 } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, updateUserProfile } from "../actions/userActions"

const Profile = () => {
  const dispatch = useDispatch()
  const {
    loading: isLoading,
    profile,
    updateLoading: isSaving,
    updateSuccess
  } = useSelector(state => state.userProfile)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
    height_cm: "",
    weight_kg: "",
    fitnessGoal: "",
    fitnessLevel: ""
  })

  const fitnessGoals = [
    { value: "BUILD_MUSCLE", label: "Build Muscle" },
    { value: "LOSE_WEIGHT", label: "Lose Weight" },
    { value: "IMPROVE_STRENGTH", label: "Improve Strength" },
    { value: "INCREASE_ENDURANCE", label: "Increase Endurance" },
    { value: "GENERAL_FITNESS", label: "General Fitness" }
  ]
  const fitnessLevels = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "EXPERT", label: "Expert" }
  ]

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username ?? "",
        email: profile.email ?? "",
        age: profile.age?.toString() ?? "",
        height_cm: profile.height_cm?.toString() ?? "",
        weight_kg: profile.weight_kg?.toString() ?? "",
        fitnessGoal: profile.fitness_goal ?? profile.fitnessGoal ?? "",
        fitnessLevel: profile.fitness_level ?? profile.fitnessLevel ?? ""
      })
    }
  }, [profile])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch(
      updateUserProfile({
        age: formData.age ? parseInt(formData.age) : null,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        fitness_goal: formData.fitnessGoal,
        fitness_level: formData.fitnessLevel
      })
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and fitness preferences.
          </p>
        </div>

        {isLoading ? (
          <div className="angrit-card animate-pulse">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {/* Avatar Section */}
            <div className="angrit-card flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {formData.username || "Your Username"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {formData.email}
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="angrit-card">
              <h2 className="font-display text-xl font-bold mb-6">
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    className="angrit-input w-full"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="angrit-input w-full"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="angrit-input w-full"
                    placeholder="Years"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Height</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleChange}
                      className="angrit-input w-full pr-12"
                      placeholder="Height"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      cm
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-medium">Weight</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleChange}
                      className="angrit-input w-full pr-12"
                      placeholder="Weight"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness Info */}
            <div className="angrit-card">
              <h2 className="font-display text-xl font-bold mb-6">
                Fitness Preferences
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Fitness Goal
                  </label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="angrit-input w-full"
                  >
                    <option value="">Select goal</option>
                    {fitnessGoals.map(goal => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Fitness Level
                  </label>
                  <select
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleChange}
                    className="angrit-input w-full"
                  >
                    <option value="">Select level</option>
                    {fitnessLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {updateSuccess && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm animate-fade-in">
                Profile updated successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="angrit-btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default Profile
