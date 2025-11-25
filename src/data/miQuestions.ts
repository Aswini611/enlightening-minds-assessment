export type MIDomain = 
  | "Linguistic"
  | "Logical-Mathematical"
  | "Spatial"
  | "Bodily-Kinesthetic"
  | "Musical"
  | "Interpersonal"
  | "Intrapersonal"
  | "Naturalist";

export interface MIQuestion {
  id: number;
  domain: MIDomain;
  question: string;
}

export const miQuestions: MIQuestion[] = [
  // Linguistic (1-6)
  { id: 1, domain: "Linguistic", question: "I enjoy reading books, magazines, or articles in my free time." },
  { id: 2, domain: "Linguistic", question: "I find it easy to express my thoughts and ideas through writing." },
  { id: 3, domain: "Linguistic", question: "I like playing with words, puns, and creative writing." },
  { id: 4, domain: "Linguistic", question: "I remember information better when I read it rather than hear it." },
  { id: 5, domain: "Linguistic", question: "I enjoy telling stories and explaining concepts to others." },
  { id: 6, domain: "Linguistic", question: "I have a good vocabulary and enjoy learning new words." },

  // Logical-Mathematical (7-12)
  { id: 7, domain: "Logical-Mathematical", question: "I enjoy solving puzzles, riddles, and brain teasers." },
  { id: 8, domain: "Logical-Mathematical", question: "I like working with numbers and doing calculations." },
  { id: 9, domain: "Logical-Mathematical", question: "I prefer things to be organized and follow logical patterns." },
  { id: 10, domain: "Logical-Mathematical", question: "I enjoy science experiments and understanding how things work." },
  { id: 11, domain: "Logical-Mathematical", question: "I'm good at strategy games like chess or problem-solving activities." },
  { id: 12, domain: "Logical-Mathematical", question: "I like to categorize and classify information systematically." },

  // Spatial (13-17)
  { id: 13, domain: "Spatial", question: "I think in pictures and visualize concepts easily." },
  { id: 14, domain: "Spatial", question: "I enjoy drawing, painting, or other visual arts." },
  { id: 15, domain: "Spatial", question: "I'm good at reading maps and finding my way in new places." },
  { id: 16, domain: "Spatial", question: "I like designing things and working with colors and shapes." },
  { id: 17, domain: "Spatial", question: "I enjoy building models or working with 3D objects." },

  // Bodily-Kinesthetic (18-23)
  { id: 18, domain: "Bodily-Kinesthetic", question: "I prefer hands-on learning and doing things rather than just reading about them." },
  { id: 19, domain: "Bodily-Kinesthetic", question: "I'm good at sports and physical activities." },
  { id: 20, domain: "Bodily-Kinesthetic", question: "I enjoy activities that involve movement and coordination." },
  { id: 21, domain: "Bodily-Kinesthetic", question: "I find it difficult to sit still for long periods." },
  { id: 22, domain: "Bodily-Kinesthetic", question: "I learn better by doing and practicing rather than listening." },
  { id: 23, domain: "Bodily-Kinesthetic", question: "I'm good at using tools and working with my hands." },

  // Musical (24-28)
  { id: 24, domain: "Musical", question: "I can easily remember melodies and songs." },
  { id: 25, domain: "Musical", question: "I enjoy listening to music and notice patterns in it." },
  { id: 26, domain: "Musical", question: "I like singing, playing instruments, or creating music." },
  { id: 27, domain: "Musical", question: "I often tap rhythms or hum tunes unconsciously." },
  { id: 28, domain: "Musical", question: "I find it easier to study or work with music in the background." },

  // Interpersonal (29-34)
  { id: 29, domain: "Interpersonal", question: "I enjoy working in groups and collaborating with others." },
  { id: 30, domain: "Interpersonal", question: "I'm good at understanding other people's feelings and perspectives." },
  { id: 31, domain: "Interpersonal", question: "I like helping others solve their problems." },
  { id: 32, domain: "Interpersonal", question: "I'm comfortable meeting new people and making friends." },
  { id: 33, domain: "Interpersonal", question: "I prefer team activities over working alone." },
  { id: 34, domain: "Interpersonal", question: "I'm good at mediating conflicts and bringing people together." },

  // Intrapersonal (35-39)
  { id: 35, domain: "Intrapersonal", question: "I prefer working independently on my own projects." },
  { id: 36, domain: "Intrapersonal", question: "I spend time reflecting on my thoughts and feelings." },
  { id: 37, domain: "Intrapersonal", question: "I have a clear understanding of my strengths and weaknesses." },
  { id: 38, domain: "Intrapersonal", question: "I set personal goals and work towards them consistently." },
  { id: 39, domain: "Intrapersonal", question: "I enjoy journaling or keeping track of my personal growth." },

  // Naturalist (40-43)
  { id: 40, domain: "Naturalist", question: "I enjoy being outdoors and observing nature." },
  { id: 41, domain: "Naturalist", question: "I'm interested in animals, plants, and environmental issues." },
  { id: 42, domain: "Naturalist", question: "I like categorizing and classifying living things." },
  { id: 43, domain: "Naturalist", question: "I notice patterns and changes in the natural environment." },
];

export const likertOptions = [
  { value: 1, label: "Mostly Disagree" },
  { value: 2, label: "Slightly Disagree" },
  { value: 3, label: "Slightly Agree" },
  { value: 4, label: "Mostly Agree" },
];
