export const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application", icon: "🌐" },
  { value: "e-commerce", label: "E-Commerce Store", icon: "🛒" },
  { value: "landing-page", label: "Landing Page / Marketing Site", icon: "📄" },
  { value: "mobile-app", label: "Mobile Application", icon: "📱" },
  { value: "api-backend", label: "API / Backend Service", icon: "⚙️" },
  { value: "dashboard", label: "Dashboard / Internal Tool", icon: "📊" },
  { value: "other", label: "Other / Not Sure", icon: "❓" },
] as const;

export const BUDGET_RANGES = [
  { value: "5k-10k", label: "$5k - $10k" },
  { value: "10k-25k", label: "$10k - $25k" },
  { value: "25k-50k", label: "$25k - $50k" },
  { value: "50k-plus", label: "$50k+" },
  { value: "flexible", label: "Flexible / Not Sure" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const REFERRAL_SOURCES = [
  { value: "google", label: "Google Search" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "referral", label: "Personal Referral" },
  { value: "portfolio", label: "Portfolio Site" },
  { value: "other", label: "Other" },
] as const;

export const SUBMISSION_STATUS = [
  { value: "new", label: "New", color: "blue" },
  { value: "reviewed", label: "Reviewed", color: "yellow" },
  { value: "contacted", label: "Contacted", color: "green" },
  { value: "archived", label: "Archived", color: "gray" },
] as const;

export const COMPLEXITY_RATINGS = [
  { value: "straightforward", label: "Straightforward", color: "green" },
  { value: "moderate", label: "Moderate", color: "yellow" },
  { value: "complex", label: "Complex", color: "orange" },
  { value: "enterprise", label: "Enterprise", color: "red" },
] as const;
