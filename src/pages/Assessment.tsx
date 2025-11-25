import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { miQuestions, likertOptions } from "@/data/miQuestions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Assessment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    city: "",
  });

  const [responses, setResponses] = useState<Record<number, number>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.dob || !formData.city.trim()) {
      toast.error("Please fill in all personal information fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (Object.keys(responses).length !== 43) {
      toast.error(`Please answer all 43 questions (${Object.keys(responses).length}/43 answered)`);
      return false;
    }

    for (const questionId of Array.from({ length: 43 }, (_, i) => i + 1)) {
      const response = responses[questionId];
      if (!response || response < 1 || response > 4) {
        toast.error(`Invalid response for question ${questionId}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          city: formData.city,
          responses: responses,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Assessment submitted successfully! 🎉");
      navigate(`/result/${data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Your MI Assessment
          </h1>
          <p className="text-lg text-muted-foreground">
            Take your time and answer honestly - there are no right or wrong answers! 💖
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="shadow-medium border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="shadow-medium border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Assessment Questions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Answer all 43 questions using the scale: 1 = Mostly Disagree to 4 = Mostly Agree
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {miQuestions.map((q) => (
                <div key={q.id} className="space-y-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero text-white flex items-center justify-center font-semibold text-sm">
                      {q.id}
                    </span>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`q-${q.id}`} className="text-base font-medium leading-relaxed">
                        {q.question}
                      </Label>
                      <Select
                        value={responses[q.id]?.toString()}
                        onValueChange={(value) => handleResponseChange(q.id, value)}
                      >
                        <SelectTrigger id={`q-${q.id}`} className="bg-background">
                          <SelectValue placeholder="Select your response" />
                        </SelectTrigger>
                        <SelectContent>
                          {likertOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.value} - {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-hero hover:opacity-90 text-lg px-12 py-6 rounded-xl shadow-medium hover:shadow-large transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating Your Strengths...
                </>
              ) : (
                "Submit Assessment 🌟"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assessment;
