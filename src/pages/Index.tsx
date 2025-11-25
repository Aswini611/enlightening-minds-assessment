import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-warm text-white text-sm font-medium shadow-soft animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>Discover Your Unique Strengths</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            Multiple Intelligences
            <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
              Assessment
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            Uncover your natural learning style with Gardner's MI framework. 
            A celebration of how you think, learn, and shine ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-top-10 duration-700 delay-300">
            <Link to="/assessment">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-lg px-8 py-6 rounded-xl shadow-medium hover:shadow-large transition-all group">
                Start Your Journey
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">43 Thoughtful Questions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Carefully crafted questions across 8 intelligence domains to map your unique cognitive profile.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-warm flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Personalized Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive a detailed report with your top strengths and tailored study strategies that work for you.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-success flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your responses are confidential and used only to generate your personalized MI profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About MI Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-card rounded-3xl shadow-large p-10 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">What are Multiple Intelligences?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Howard Gardner's theory of Multiple Intelligences suggests that traditional IQ testing doesn't capture 
            the full range of human intelligence. Instead, we each possess unique combinations of eight different 
            types of intelligence:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "🗣️ Linguistic",
              "🔢 Logical-Mathematical",
              "🎨 Spatial",
              "🏃 Bodily-Kinesthetic",
              "🎵 Musical",
              "🤝 Interpersonal",
              "🧘 Intrapersonal",
              "🌿 Naturalist",
            ].map((intelligence) => (
              <div
                key={intelligence}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-2xl">{intelligence.split(" ")[0]}</span>
                <span className="font-medium text-foreground">{intelligence.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <p className="text-lg font-medium bg-gradient-hero bg-clip-text text-transparent mb-2">
          Enlightening Minds
        </p>
        <p className="text-sm">
          Powered by Guruskoolz • MI Assessment v1.0
        </p>
      </footer>
    </div>
  );
};

export default Index;
