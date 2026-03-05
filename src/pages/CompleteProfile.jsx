import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Loader2, Save, User } from "lucide-react"
import { getUserProfile, updateUserProfile } from "../actions/userActions"

const CompleteProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.authLogin)
  const {
    loading: isLoading,
    profile,
    updateLoading: isSaving,
    updateSuccess,
    updateError
  } = useSelector(state => state.userProfile)

  const [formData, setFormData] = useState({
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
    if (!profile) return

    const currentForm = {
      age: profile.age?.toString() ?? "",
      height_cm: profile.height_cm?.toString() ?? "",
      weight_kg: profile.weight_kg?.toString() ?? "",
      fitnessGoal: profile.fitness_goal ?? profile.fitnessGoal ?? "",
      fitnessLevel: profile.fitness_level ?? profile.fitnessLevel ?? ""
    }

    setFormData(currentForm)

    const isComplete =
      currentForm.age &&
      currentForm.height_cm &&
      currentForm.weight_kg &&
      currentForm.fitnessGoal &&
      currentForm.fitnessLevel

    if (isComplete && !userInfo?.needs_profile) {
      navigate("/dashboard", { replace: true })
    }
  }, [profile, userInfo?.needs_profile, navigate])

  useEffect(() => {
    if (updateSuccess) {
      navigate("/dashboard", { replace: true })
    }
  }, [updateSuccess, navigate])

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(
      updateUserProfile({
        age: parseInt(formData.age, 10),
        height_cm: parseInt(formData.height_cm, 10),
        weight_kg: parseFloat(formData.weight_kg),
        fitness_goal: formData.fitnessGoal,
        fitness_level: formData.fitnessLevel
      })
    )
  }

  const isFormValid =
    formData.age &&
    formData.height_cm &&
    formData.weight_kg &&
    formData.fitnessGoal &&
    formData.fitnessLevel

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl angrit-card-elevated animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Finish your profile to continue. This helps personalize your workouts.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading profile...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {updateError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {updateError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  min="1"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Height (cm)</label>
                <input
                  type="number"
                  min="1"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Fitness Goal</label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
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
                <label className="block text-sm font-medium">Fitness Level</label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  className="angrit-input w-full"
                  required
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

            <button
              type="submit"
              disabled={isSaving || !isFormValid}
              className="angrit-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Continue
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default CompleteProfile
