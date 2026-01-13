import React from "react";
import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Lock, Loader2, Dumbbell } from "lucide-react";
import Navbar from "../components/Navbar";

const Program = () => {
  const [program, setProgram] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(null);

  const generateProgram = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const generatedProgram = [
      {
        week: 1,
        focus: "Foundation & Assessment",
        isPremium: false,
        days: [
          { day: "Monday", workout: "Push Day", exercises: ["Bench Press", "Incline DB Press", "Shoulder Press", "Tricep Dips"] },
          { day: "Wednesday", workout: "Pull Day", exercises: ["Deadlift", "Barbell Rows", "Lat Pulldown", "Bicep Curls"] },
          { day: "Friday", workout: "Legs", exercises: ["Squats", "Leg Press", "Romanian Deadlift", "Calf Raises"] },
        ],
      },
      {
        week: 2,
        focus: "Volume Building",
        isPremium: false,
        days: [
          { day: "Monday", workout: "Push Day", exercises: ["Bench Press", "Cable Flyes", "Lateral Raises", "Overhead Tricep Extension"] },
          { day: "Wednesday", workout: "Pull Day", exercises: ["Pull-ups", "Seated Rows", "Face Pulls", "Hammer Curls"] },
          { day: "Friday", workout: "Legs", exercises: ["Front Squats", "Walking Lunges", "Leg Curls", "Hip Thrusts"] },
        ],
      },
      {
        week: 3,
        focus: "Intensity Phase",
        isPremium: false,
        days: [
          { day: "Monday", workout: "Push Day", exercises: ["Decline Bench", "Dumbbell Press", "Arnold Press", "Close Grip Bench"] },
          { day: "Wednesday", workout: "Pull Day", exercises: ["Pendlay Rows", "Chin-ups", "Shrugs", "Preacher Curls"] },
          { day: "Friday", workout: "Legs", exercises: ["Box Squats", "Bulgarian Split Squats", "Good Mornings", "Sissy Squats"] },
        ],
      },
      {
        week: 4,
        focus: "Deload Week",
        isPremium: false,
        days: [
          { day: "Monday", workout: "Full Body Light", exercises: ["Machine Press", "Lat Pulldown", "Leg Extension", "Core Work"] },
          { day: "Thursday", workout: "Full Body Light", exercises: ["Dumbbell Bench", "Cable Rows", "Goblet Squats", "Stretching"] },
        ],
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        week: i + 5,
        focus: `Advanced Phase ${i + 1}`,
        isPremium: true,
        days: [
          { day: "Monday", workout: "Push Day", exercises: ["Progressive Overload Push Exercises"] },
          { day: "Wednesday", workout: "Pull Day", exercises: ["Progressive Overload Pull Exercises"] },
          { day: "Friday", workout: "Legs", exercises: ["Progressive Overload Leg Exercises"] },
        ],
      })),
    ];

    setProgram(generatedProgram);
    setIsGenerating(false);
    setExpandedWeek(1);
  };

  const toggleWeek = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            AI Training Program
          </h1>
          <p className="text-muted-foreground">
            Get a personalized 12-week program powered by AI.
          </p>
        </div>

        {/* Generate Button */}
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
              onClick={generateProgram}
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

        {/* Loading State */}
        {isGenerating && (
          <div className="space-y-4 animate-fade-in">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="angrit-card animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Program Display */}
        {program.length > 0 && !isGenerating && (
          <div className="space-y-4">
            {/* Regenerate Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={generateProgram}
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
                  week.isPremium ? "border-primary/30" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => !week.isPremium && toggleWeek(week.week)}
                  className={`w-full flex items-center justify-between ${
                    week.isPremium ? "cursor-default" : "cursor-pointer"
                  }`}
                  disabled={week.isPremium}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold ${
                        week.isPremium
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {week.isPremium ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        week.week
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-bold">Week {week.week}</h3>
                      <p className="text-sm text-muted-foreground">
                        {week.focus}
                      </p>
                    </div>
                  </div>

                  {!week.isPremium && (
                    <div className="text-muted-foreground">
                      {expandedWeek === week.week ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  )}

                  {week.isPremium && (
                    <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                      Premium
                    </span>
                  )}
                </button>

                {/* Expanded Content */}
                {expandedWeek === week.week && !week.isPremium && (
                  <div className="mt-6 pt-6 border-t border-border space-y-4 animate-fade-in">
                    {week.days.map((day, dayIndex) => (
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
                          {day.exercises.map((exercise, exIndex) => (
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

                {/* Premium Overlay */}
                {week.isPremium && (
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
      </main>
    </div>
  );
};

export default Program;
