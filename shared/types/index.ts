// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
  subscription?: Subscription;
}

export type UserRole = 'admin' | 'user' | 'premium' | 'enterprise';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  aiAssistantEnabled: boolean;
  autoSaveEnabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  marketing: boolean;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Project and Workspace Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  teamId?: string;
  status: ProjectStatus;
  visibility: 'private' | 'team' | 'public';
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
  modules: ProjectModule[];
}

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface ProjectSettings {
  aiProvider: 'openai' | 'anthropic' | 'both';
  autoBackup: boolean;
  collaborationEnabled: boolean;
  versionControlEnabled: boolean;
}

export interface ProjectModule {
  id: string;
  type: ModuleType;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  data: any; // Module-specific data
  createdAt: string;
  updatedAt: string;
}

export type ModuleType = 
  | 'brainstorming'
  | 'wireframing' 
  | 'figma_integration'
  | 'code_generation'
  | 'qa_testing'
  | 'analytics'
  | 'bug_tracking';

// Brainstorming Module Types
export interface BrainstormingSession {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  participants: string[];
  ideas: Idea[];
  competitorAnalysis?: CompetitorAnalysis;
  usps: string[];
  moat: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  votes: number;
  comments: Comment[];
  tags: string[];
  authorId: string;
  createdAt: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketSize: string;
  targetAudience: string[];
  competitiveLandscape: string;
  opportunities: string[];
  threats: string[];
}

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: number;
  funding?: string;
  employees?: number;
}

// Wireframing Types
export interface Wireframe {
  id: string;
  projectId: string;
  name: string;
  type: 'upload' | 'ai_generated' | 'manual';
  source?: 'pen_paper' | 'miro' | 'figma' | 'sketch' | 'other';
  fileUrl?: string;
  canvasData?: any; // Canvas/drawing data
  screens: WireframeScreen[];
  prototype?: PrototypeFlow;
  createdAt: string;
  updatedAt: string;
}

export interface WireframeScreen {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  canvasData?: any;
  components: WireframeComponent[];
  interactions: Interaction[];
  notes: string[];
}

export interface WireframeComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

export type ComponentType = 
  | 'button'
  | 'input'
  | 'text'
  | 'image'
  | 'card'
  | 'navigation'
  | 'modal'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'slider'
  | 'table'
  | 'chart';

export interface Interaction {
  id: string;
  trigger: string;
  action: string;
  targetScreenId?: string;
  animation?: string;
}

export interface PrototypeFlow {
  startScreenId: string;
  flows: Flow[];
}

export interface Flow {
  id: string;
  name: string;
  steps: FlowStep[];
}

export interface FlowStep {
  screenId: string;
  action: string;
  description?: string;
}

// Figma Integration Types
export interface FigmaFile {
  id: string;
  name: string;
  key: string;
  url: string;
  thumbnailUrl?: string;
  lastModified: string;
  version: string;
}

export interface FigmaFrame {
  id: string;
  name: string;
  type: string;
  children?: FigmaFrame[];
  backgroundColor?: string;
  absoluteBoundingBox?: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PRD {
  id: string;
  projectId: string;
  figmaFileId?: string;
  title: string;
  overview: string;
  objectives: string[];
  userStories: UserStory[];
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  technicalSpecifications: TechnicalSpec[];
  designSpecs: DesignSpec[];
  timeline: Milestone[];
  success_metrics: string[];
  assumptions: string[];
  risks: Risk[];
  exportFormat: 'confluence' | 'notion' | 'markdown' | 'pdf';
  createdAt: string;
  updatedAt: string;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints?: number;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'must_have' | 'should_have' | 'could_have' | 'wont_have';
  category: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TechnicalSpec {
  id: string;
  component: string;
  technology: string;
  description: string;
  dependencies: string[];
  apis: ApiSpec[];
}

export interface ApiSpec {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: Parameter[];
  response: ResponseSpec;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ResponseSpec {
  statusCode: number;
  schema: any;
  example: any;
}

export interface DesignSpec {
  id: string;
  screen: string;
  description: string;
  designTokens: DesignToken[];
  components: ComponentSpec[];
  interactions: InteractionSpec[];
}

export interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border';
}

export interface ComponentSpec {
  name: string;
  description: string;
  props: PropSpec[];
  variants: string[];
}

export interface PropSpec {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
}

export interface InteractionSpec {
  trigger: string;
  action: string;
  feedback: string;
  timing?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  deliverables: string[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
  owner?: string;
}

// Code Generation Types
export interface GeneratedCode {
  id: string;
  projectId: string;
  prdId: string;
  framework: Framework;
  language: ProgrammingLanguage;
  architecture: Architecture;
  files: CodeFile[];
  dependencies: Dependency[];
  deploymentConfig: DeploymentConfig;
  status: 'generating' | 'completed' | 'error';
  generatedAt: string;
}

export type Framework = 
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'angular'
  | 'svelte'
  | 'react_native'
  | 'flutter'
  | 'express'
  | 'fastapi'
  | 'django'
  | 'rails';

export type ProgrammingLanguage = 
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby';

export type Architecture = 
  | 'spa'
  | 'ssr'
  | 'ssg'
  | 'microservices'
  | 'monolith'
  | 'serverless'
  | 'jamstack';

export interface CodeFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  size: number;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  description?: string;
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'heroku';
  environment: Record<string, string>;
  buildCommand: string;
  outputDirectory: string;
  nodeVersion?: string;
}

// QA and Testing Types
export interface TestSuite {
  id: string;
  projectId: string;
  name: string;
  type: TestType;
  testCases: TestCase[];
  coverage: TestCoverage;
  lastRun?: TestRun;
  createdAt: string;
  updatedAt: string;
}

export type TestType = 'unit' | 'integration' | 'e2e' | 'visual' | 'performance' | 'accessibility';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedResult: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  automationStatus: 'manual' | 'automated' | 'in_progress';
}

export interface TestStep {
  id: string;
  action: string;
  data?: string;
  expectedResult?: string;
}

export interface TestRun {
  id: string;
  testSuiteId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  results: TestResult[];
  startTime: string;
  endTime?: string;
  duration?: number;
  coverage?: TestCoverage;
}

export interface TestResult {
  testCaseId: string;
  status: 'passed' | 'failed' | 'skipped' | 'error';
  error?: string;
  screenshot?: string;
  duration: number;
}

export interface TestCoverage {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  projectId: string;
  name: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: string;
  source: 'web' | 'mobile' | 'api';
}

export interface UserJourney {
  id: string;
  projectId: string;
  name: string;
  steps: JourneyStep[];
  conversionRate: number;
  dropOffPoints: DropOffPoint[];
  insights: string[];
}

export interface JourneyStep {
  id: string;
  name: string;
  eventName: string;
  description?: string;
  funnel: FunnelData;
}

export interface FunnelData {
  users: number;
  conversionRate: number;
  averageTime: number;
}

export interface DropOffPoint {
  stepId: string;
  dropOffRate: number;
  reasons: string[];
  suggestions: string[];
}

// Bug Tracking Types
export interface Bug {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'duplicate';
  type: 'bug' | 'feature' | 'improvement' | 'task';
  reproducible: boolean;
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: EnvironmentInfo;
  attachments: Attachment[];
  assigneeId?: string;
  reporterId: string;
  labels: string[];
  jiraKey?: string;
  aiSuggestion?: AISuggestion;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentInfo {
  os: string;
  browser: string;
  version: string;
  device: string;
  viewport: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'log';
  size: number;
}

export interface AISuggestion {
  id: string;
  analysis: string;
  possibleCauses: string[];
  suggestedFixes: CodeSuggestion[];
  confidence: number;
  generatedAt: string;
}

export interface CodeSuggestion {
  file: string;
  lineNumber?: number;
  originalCode?: string;
  suggestedCode: string;
  explanation: string;
}

// Comment System
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentId?: string; // For threaded comments
  mentions: string[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

// File Upload Types
export interface FileUpload {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  metadata?: Record<string, any>;
}

// Google Meet Integration
export interface MeetingSession {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  participants: Participant[];
  recordingUrl?: string;
  transcriptUrl?: string;
  summary?: MeetingSummary;
  actionItems: ActionItem[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'host' | 'participant';
  joinTime?: string;
  leaveTime?: string;
}

export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  nextSteps: string[];
  aiGenerated: boolean;
  generatedAt: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assigneeId?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// AI Assistant Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId: string;
  projectId?: string;
  moduleType?: ModuleType;
  messages: ChatMessage[];
  context: ChatContext;
  createdAt: string;
  updatedAt: string;
}

export interface ChatContext {
  project?: Project;
  module?: ProjectModule;
  recentFiles?: FileUpload[];
  userPreferences?: UserPreferences;
  conversationHistory?: ChatMessage[];
}

// Vector Search Types
export interface VectorDocument {
  id: string;
  content: string;
  metadata: VectorMetadata;
  embedding?: number[];
  createdAt: string;
}

export interface VectorMetadata {
  userId: string;
  projectId?: string;
  moduleType?: ModuleType;
  documentType: 'message' | 'file' | 'comment' | 'recording' | 'meeting';
  source: string;
  tags?: string[];
}

export interface SearchResult {
  document: VectorDocument;
  score: number;
  highlights?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string; // Only in development
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
  source: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  config: IntegrationConfig;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationType = 
  | 'figma'
  | 'jira'
  | 'confluence'
  | 'notion'
  | 'github'
  | 'gitlab'
  | 'slack'
  | 'discord'
  | 'google_workspace'
  | 'microsoft_365';

export interface IntegrationConfig {
  apiKey?: string;
  token?: string;
  webhookUrl?: string;
  settings: Record<string, any>;
}

// All types are defined in this file 