export type Domain = 'Logical' | 'Analytical' | 'Creative' | 'Communication' | 'Practical';

export interface Question {
  id: string;
  text: string;
  domain: Domain;
  weight: number; // 0 to 1
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DomainScores {
  Logical: number;
  Analytical: number;
  Creative: number;
  Communication: number;
  Practical: number;
}

export interface AssessmentResult {
  domainScores: DomainScores;
  confidence: 'High' | 'Low';
  variance: number;
}

export interface StreamFit {
  stream: string;
  fit: number;
}

export interface Degree {
  id: string;
  name: string;
  requiredDomains: Partial<Record<Domain, number>>;
  careers: string[];
}

export interface College {
  id: string;
  name: string;
  type: 'Government' | 'Aided' | 'Self-Financing';
  district: string;
  category: string;
  fees: number;
  placement: number; // 1 to 5
  degrees: string[]; // degree IDs
  website?: string;
  matchReason?: string;
}

export interface UserAssessment {
  id: string;
  userId: string;
  answers: Record<string, number>; // questionId -> 1-5 score
  result: AssessmentResult;
  streams: StreamFit[];
}

export interface StudentDetails {
  name: string;
  class: string;
  district: string;
}
