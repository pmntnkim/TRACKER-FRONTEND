import React from "react"
import { Link } from "react-router-dom"
import { 
  Dumbbell, 
  ChevronRight, 
  Zap, 
  Target, 
  TrendingUp, 
  Sparkles,
  MessageCircle,
  BarChart3
} from "lucide-react"

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Track Every Rep",
      description: "Log workouts with precision. See your progress over time with detailed analytics.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Programs",
      description: "Get personalized 12-week training plans tailored to your goals and fitness level.",
    },
    {
      icon: MessageCircle,
      title: "Chat with AI Coach",
      description: "Ask questions, get advice, and stay motivated with your personal AI fitness coach.",
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Set targets, track streaks, and celebrate PRs. Built for results.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                ANGRIT
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login" className="angrit-btn-secondary text-sm">
                Log In
              </Link>
              <Link to="/register" className="angrit-btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Fitness
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Train Smarter.
            <br />
            <span className="angrit-gradient-text">Get Stronger.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Your ultimate workout companion. Track progress, follow AI-generated
            programs, and get real-time coaching—all in one powerful app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="angrit-btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Start Free Today
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="angrit-btn-secondary text-lg px-8 py-4"
            >
              I have an account
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500K+", label: "Workouts Logged" },
              { value: "95%", label: "Goal Success" },
            ].map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built by fitness enthusiasts, for fitness enthusiasts. Every feature
            designed to help you reach your goals faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="angrit-card angrit-glow animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">ANGRIT</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ANGRIT. Built for Athletes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;