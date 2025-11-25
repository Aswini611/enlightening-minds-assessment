import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, Home, Sparkles } from "lucide-react";
import { MIDomain } from "@/data/miQuestions";

interface DomainScore {
  domain: MIDomain;
  average: number;
  percent: number;
}

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [scores, setScores] = useState<DomainScore[]>([]);

  useEffect(() => {
    if (id) {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setSubmission(data);
      
      // Calculate scores
      const calculatedScores = calculateScores(data.responses as Record<string, number>);
      setScores(calculatedScores);

      // Update scores in database if not already calculated
      if (!data.scores) {
        await supabase
          .from("submissions")
          .update({ scores: calculatedScores as any })
          .eq("id", id);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const calculateScores = (responses: Record<string, number>): DomainScore[] => {
    const domains: MIDomain[] = [
      "Linguistic",
      "Logical-Mathematical",
      "Spatial",
      "Bodily-Kinesthetic",
      "Musical",
      "Interpersonal",
      "Intrapersonal",
      "Naturalist",
    ];

    const domainQuestions: Record<MIDomain, number[]> = {
      "Linguistic": [1, 2, 3, 4, 5, 6],
      "Logical-Mathematical": [7, 8, 9, 10, 11, 12],
      "Spatial": [13, 14, 15, 16, 17],
      "Bodily-Kinesthetic": [18, 19, 20, 21, 22, 23],
      "Musical": [24, 25, 26, 27, 28],
      "Interpersonal": [29, 30, 31, 32, 33, 34],
      "Intrapersonal": [35, 36, 37, 38, 39],
      "Naturalist": [40, 41, 42, 43],
    };

    const domainScores = domains.map((domain) => {
      const questionIds = domainQuestions[domain];
      const sum = questionIds.reduce((acc, qId) => acc + (responses[qId] || 0), 0);
      const average = sum / questionIds.length;
      const percent = (average / 4) * 100;

      return { domain, average, percent };
    });

    return domainScores.sort((a, b) => b.percent - a.percent);
  };

  const getStrengthColor = (rank: number) => {
    if (rank === 0) return "bg-gradient-hero";
    if (rank === 1) return "bg-gradient-warm";
    return "bg-gradient-success";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-success/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">Analyzing your unique strengths...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-lg">Assessment not found</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-success/5 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-success text-white text-sm font-medium shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span>Assessment Complete!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Your MI Profile, {submission.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's how your unique intelligences shine ✨
          </p>
        </div>

        {/* Scores Chart */}
        <Card className="shadow-large border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Your Intelligence Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scores.map((score, index) => (
              <div key={score.domain} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    {index < 3 && (
                      <span className="text-lg">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                    {score.domain}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {score.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor(index)} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${score.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="shadow-large border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Your Top Strengths & Study Tips 💡</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {scores.slice(0, 2).map((score, index) => (
              <div key={score.domain} className="space-y-3">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full ${getStrengthColor(index)} text-white flex items-center justify-center text-sm`}>
                    {index + 1}
                  </span>
                  {score.domain} Intelligence
                </h3>
                <div className="pl-10 space-y-2">
                  <p className="text-muted-foreground leading-relaxed">
                    {getInsightText(score.domain)}
                  </p>
                  <ul className="space-y-1 text-sm text-foreground">
                    {getTipsForDomain(score.domain).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-hero hover:opacity-90 text-lg px-8 py-6 rounded-xl shadow-medium"
          >
            <Download className="mr-2" />
            Download PDF Report
          </Button>
          <Link to="/">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-2 w-full"
            >
              <Home className="mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Generated on {new Date().toLocaleDateString()} • MI Questionnaire v1.0</p>
        </div>
      </div>
    </div>
  );
};

const getInsightText = (domain: MIDomain): string => {
  const insights: Record<MIDomain, string> = {
    "Linguistic": "You have a natural gift for language and communication. You think in words and love expressing ideas through speaking and writing.",
    "Logical-Mathematical": "Your mind excels at reasoning, patterns, and systematic thinking. You enjoy solving complex problems and working with abstract concepts.",
    "Spatial": "You have a strong visual imagination and can easily manipulate mental images. You think in pictures and have a keen sense of space.",
    "Bodily-Kinesthetic": "You learn best through physical movement and hands-on experiences. Your body is a powerful tool for expression and learning.",
    "Musical": "You have a natural sensitivity to rhythm, melody, and sound patterns. Music enhances your learning and emotional expression.",
    "Interpersonal": "You understand people well and thrive in social interactions. You're empathetic and skilled at working with others.",
    "Intrapersonal": "You have strong self-awareness and understand your own emotions and motivations deeply. You're reflective and self-directed.",
    "Naturalist": "You have a keen awareness of nature and living things. You notice patterns in the environment and feel connected to the natural world.",
  };
  return insights[domain];
};

const getTipsForDomain = (domain: MIDomain): string[] => {
  const tips: Record<MIDomain, string[]> = {
    "Linguistic": [
      "Take detailed notes and rewrite them in your own words",
      "Explain concepts to others or teach what you've learned",
      "Use storytelling and analogies to remember information",
    ],
    "Logical-Mathematical": [
      "Create outlines and organize information systematically",
      "Look for patterns and connections between concepts",
      "Practice problem-solving and use logical reasoning exercises",
    ],
    "Spatial": [
      "Use mind maps, diagrams, and visual charts to organize information",
      "Color-code your notes and use highlighters strategically",
      "Visualize concepts and create mental images of what you're learning",
    ],
    "Bodily-Kinesthetic": [
      "Study in short, active sessions with movement breaks",
      "Use hands-on activities, models, and experiments",
      "Act out concepts or use gestures while studying",
    ],
    "Musical": [
      "Create songs or rhymes to remember information",
      "Study with background music that enhances focus",
      "Use rhythm and beats to memorize sequences",
    ],
    "Interpersonal": [
      "Form study groups and discuss concepts with peers",
      "Teach others what you're learning",
      "Participate in group projects and collaborative learning",
    ],
    "Intrapersonal": [
      "Set personal learning goals and track your progress",
      "Reflect on what you've learned through journaling",
      "Study independently in quiet spaces where you can focus",
    ],
    "Naturalist": [
      "Study outdoors or in natural settings when possible",
      "Organize information by categories and classifications",
      "Connect new concepts to real-world examples from nature",
    ],
  };
  return tips[domain];
};

export default Result;
