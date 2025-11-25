import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DomainScore {
  domain: string;
  average: number;
  percent: number;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  scores: DomainScore[];
  created_at: string;
}

const getInsightText = (domain: string): string => {
  const insights: Record<string, string> = {
    "Linguistic": "You have a natural gift for language and communication. You think in words and love expressing ideas through speaking and writing.",
    "Logical-Mathematical": "Your mind excels at reasoning, patterns, and systematic thinking. You enjoy solving complex problems and working with abstract concepts.",
    "Spatial": "You have a strong visual imagination and can easily manipulate mental images. You think in pictures and have a keen sense of space.",
    "Bodily-Kinesthetic": "You learn best through physical movement and hands-on experiences. Your body is a powerful tool for expression and learning.",
    "Musical": "You have a natural sensitivity to rhythm, melody, and sound patterns. Music enhances your learning and emotional expression.",
    "Interpersonal": "You understand people well and thrive in social interactions. You're empathetic and skilled at working with others.",
    "Intrapersonal": "You have strong self-awareness and understand your own emotions and motivations deeply. You're reflective and self-directed.",
    "Naturalist": "You have a keen awareness of nature and living things. You notice patterns in the environment and feel connected to the natural world.",
  };
  return insights[domain] || "";
};

const getTipsForDomain = (domain: string): string[] => {
  const tips: Record<string, string[]> = {
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
  return tips[domain] || [];
};

const generatePDFHTML = (submission: Submission): string => {
  const date = new Date(submission.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const topTwoDomains = submission.scores.slice(0, 2);
  
  const scoresHTML = submission.scores.map((score, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : ''}
        ${score.domain}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${score.percent.toFixed(1)}%
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); height: 100%; width: ${score.percent}%; border-radius: 10px;"></div>
        </div>
      </td>
    </tr>
  `).join('');

  const insightsHTML = topTwoDomains.map((score, index) => `
    <div style="margin-bottom: 30px; page-break-inside: avoid;">
      <h3 style="color: #3b82f6; font-size: 20px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
        <span style="background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 16px;">
          ${index + 1}
        </span>
        ${score.domain} Intelligence
      </h3>
      <p style="color: #4b5563; margin-bottom: 15px; line-height: 1.6;">
        ${getInsightText(score.domain)}
      </p>
      <div style="margin-left: 40px;">
        <h4 style="color: #111827; font-size: 16px; margin-bottom: 10px;">Study Tips:</h4>
        <ul style="color: #374151; line-height: 1.8;">
          ${getTipsForDomain(score.domain).map(tip => `<li style="margin-bottom: 8px;">✓ ${tip}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { 
      size: A4; 
      margin: 20mm; 
    }
    body {
      font-family: 'Inter', Arial, sans-serif;
      color: #111827;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    h1 { 
      font-family: 'Outfit', Arial, sans-serif;
      font-size: 32px;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    h2 {
      font-family: 'Outfit', Arial, sans-serif;
      font-size: 24px;
      color: #111827;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .profile-table td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    .profile-table td:first-child {
      font-weight: 600;
      color: #4b5563;
      width: 30%;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 30px;
    }
    .tagline {
      font-size: 18px;
      font-style: italic;
      opacity: 0.95;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: white; margin: 0;">MI Assessment Report</h1>
    <p class="tagline">Enlightening Minds</p>
  </div>

  <h2>Profile Information</h2>
  <table class="profile-table">
    <tr>
      <td>Name</td>
      <td>${submission.name}</td>
    </tr>
    <tr>
      <td>Date of Birth</td>
      <td>${new Date(submission.dob).toLocaleDateString()}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${submission.email}</td>
    </tr>
    <tr>
      <td>Contact No.</td>
      <td>${submission.phone}</td>
    </tr>
    <tr>
      <td>City</td>
      <td>${submission.city}</td>
    </tr>
  </table>

  <h2>Your Intelligence Strengths</h2>
  <table>
    <thead>
      <tr style="background: #f3f4f6;">
        <th style="padding: 12px; text-align: left;">Domain</th>
        <th style="padding: 12px; text-align: right;">Score</th>
        <th style="padding: 12px; text-align: left;">Visual</th>
      </tr>
    </thead>
    <tbody>
      ${scoresHTML}
    </tbody>
  </table>

  <div style="page-break-before: always;"></div>

  <h2>Your Top Strengths & Study Tips</h2>
  ${insightsHTML}

  <div class="footer">
    <p>Generated on ${date} • MI Questionnaire v1.0</p>
    <p style="margin-top: 5px;">Powered by Guruskoolz - Enlightening Minds</p>
  </div>
</body>
</html>
  `;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { submissionId } = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'Submission ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching submission:', submissionId);

    // Fetch submission data
    const { data: submission, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error || !submission) {
      console.error('Error fetching submission:', error);
      return new Response(
        JSON.stringify({ error: 'Submission not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF HTML...');

    // Generate HTML for PDF
    const html = generatePDFHTML(submission as Submission);

    // Return HTML that will be converted to PDF on the client side
    return new Response(
      JSON.stringify({ html, filename: `MI_Report_${submission.name.replace(/\s+/g, '_')}.pdf` }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
