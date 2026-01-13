import React from "react";
import { useState, useEffect } from "react";
import { User, Save, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    fitnessLevel: "",
  });

  const fitnessGoals = [
    "Build Muscle",
    "Lose Weight",
    "Improve Strength",
    "Increase Endurance",
    "General Fitness",
  ];

  const fitnessLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  useEffect(() => {
    const fetchProfile = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData({
        name: "John Doe",
        email: "john@example.com",
        age: "28",
        height: "180",
        weight: "85",
        fitnessGoal: "Build Muscle",
        fitnessLevel: "Intermediate",
      });
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

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
              {[1, 2, 3, 4, 5].map((i) => (
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
                <h3 className="font-semibold text-lg">{formData.name}</h3>
                <p className="text-muted-foreground text-sm">{formData.email}</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="angrit-card">
              <h2 className="font-display text-xl font-bold mb-6">
                Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="angrit-input w-full"
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
                      name="height"
                      value={formData.height}
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
                      name="weight"
                      value={formData.weight}
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
                    {fitnessGoals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
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
                    {fitnessLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm animate-fade-in">
                {successMessage}
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
  );
};

export default Profile;
