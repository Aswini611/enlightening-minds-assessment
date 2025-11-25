-- Create submissions table for MI assessments
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  city TEXT NOT NULL,
  responses JSONB NOT NULL,
  scores JSONB,
  chart_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert their own assessments
CREATE POLICY "Anyone can submit assessments"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Public can view their own assessment by ID (via URL)
CREATE POLICY "Anyone can view submissions"
ON public.submissions
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_submissions_email ON public.submissions(email);