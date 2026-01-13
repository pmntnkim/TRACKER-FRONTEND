import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Flame, 
  Timer, 
  Zap, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  Dumbbell,
  Target
} from "lucide-react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    weeklyGoal: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats({
        totalWorkouts: 47,
        totalMinutes: 2340,
        currentStreak: 12,
        weeklyGoal: 4,
      });
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Workouts",
      value: stats.totalWorkouts,
      icon: Dumbbell,
      color: "primary",
    },
    {
      label: "Minutes Trained",
      value: stats.totalMinutes.toLocaleString(),
      icon: Timer,
      color: "primary",
    },
    {
      label: "Day Streak",
      value: stats.currentStreak,
      icon: Flame,
      suffix: "🔥",
      color: "warning",
    },
    {
      label: "Weekly Goal",
      value: `${stats.weeklyGoal}/5`,
      icon: Target,
      color: "success",
    },
  ];

  const recentWorkouts = [
    { name: "Push Day", date: "Today", duration: "58 min", exercises: 6 },
    { name: "Pull Day", date: "Yesterday", duration: "62 min", exercises: 7 },
    { name: "Leg Day", date: "2 days ago", duration: "55 min", exercises: 5 },
  ];

  const upcomingWorkouts = [
    { name: "Push Day", day: "Tomorrow", time: "6:00 AM" },
    { name: "Pull Day", day: "Wednesday", time: "6:00 AM" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Today's Progress
          </h1>
          <p className="text-muted-foreground">
            Keep pushing. Every rep counts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="angrit-stat-card angrit-glow animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-24 mb-3"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                      <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-display text-2xl sm:text-3xl font-bold">
                    {stat.value}
                    {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Workouts */}
          <div className="lg:col-span-2 angrit-card animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Recent Workouts</h2>
              <Link
                to="/workout-log"
                className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.exercises} exercises • {workout.duration}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {workout.date}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/workout-log"
              className="mt-6 angrit-btn-primary w-full flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start New Workout
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming */}
            <div className="angrit-card animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Upcoming</h3>
              </div>
              <div className="space-y-3">
                {upcomingWorkouts.map((workout, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{workout.name}</p>
                      <p className="text-xs text-muted-foreground">{workout.day}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {workout.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="angrit-card animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold">This Week</h3>
              </div>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-8 text-xs text-muted-foreground">
                        {day}
                      </span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index < 4 ? "bg-primary" : "bg-muted"
                          }`}
                          style={{
                            width: index < 4 ? "100%" : "0%",
                            animationDelay: `${index * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                4 of 5 workouts completed
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

