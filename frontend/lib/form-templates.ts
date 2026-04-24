import type { FormField, FormSettings } from "@form-builder/shared";

export interface FormTemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  accent: string;
  icon: string;
  tags: string[];
  fields: FormField[];
  settings?: Partial<FormSettings>;
}

function baseSettings(customSlug: string): Partial<FormSettings> {
  return {
    customSlug,
    requireAuth: false,
    passwordProtected: false
  };
}

export const formTemplates: FormTemplateDefinition[] = [
  {
    id: "party",
    title: "Party RSVP",
    description: "Perfect for birthdays, reunions, and private events.",
    category: "Events",
    accent: "from-rose-500 via-orange-400 to-amber-300",
    icon: "Sparkles",
    tags: ["RSVP", "Guests", "Celebration"],
    settings: baseSettings("party-rsvp"),
    fields: [
      { id: "name", type: "short_text", label: "Guest name", required: true, placeholder: "Enter guest name" },
      { id: "email", type: "email", label: "Email address", required: true, placeholder: "guest@example.com" },
      {
        id: "attendance",
        type: "select",
        label: "Will you attend?",
        required: true,
        options: [
          { id: "yes", label: "Yes, I'll be there", value: "yes" },
          { id: "no", label: "Sorry, can't make it", value: "no" },
          { id: "maybe", label: "Maybe", value: "maybe" }
        ]
      },
      { id: "guests", type: "number", label: "Number of guests", required: false, placeholder: "2" },
      {
        id: "food",
        type: "multi_select",
        label: "Food preferences",
        required: false,
        options: [
          { id: "veg", label: "Vegetarian", value: "vegetarian" },
          { id: "vegan", label: "Vegan", value: "vegan" },
          { id: "halal", label: "Halal", value: "halal" },
          { id: "no_pref", label: "No preference", value: "none" }
        ]
      },
      { id: "message", type: "long_text", label: "Message for host", required: false, placeholder: "Add a note" }
    ]
  },
  {
    id: "school",
    title: "School Feedback",
    description: "Collect parent or student feedback with structured ratings.",
    category: "Education",
    accent: "from-sky-500 via-cyan-400 to-teal-300",
    icon: "GraduationCap",
    tags: ["School", "Parents", "Feedback"],
    settings: baseSettings("school-feedback"),
    fields: [
      { id: "student_name", type: "short_text", label: "Student name", required: true, placeholder: "Student full name" },
      {
        id: "class_name",
        type: "select",
        label: "Class / Grade",
        required: true,
        options: [
          { id: "g6", label: "Grade 6", value: "grade_6" },
          { id: "g7", label: "Grade 7", value: "grade_7" },
          { id: "g8", label: "Grade 8", value: "grade_8" },
          { id: "g9", label: "Grade 9", value: "grade_9" }
        ]
      },
      { id: "teacher_rating", type: "rating", label: "Teacher support rating", required: true, min: 1, max: 5 },
      { id: "facility_rating", type: "rating", label: "School facilities rating", required: true, min: 1, max: 5 },
      { id: "safety", type: "checkbox", label: "Do you feel the school environment is safe?", required: false },
      { id: "improvements", type: "long_text", label: "Suggested improvements", required: false, placeholder: "Share your suggestions" }
    ]
  },
  {
    id: "college",
    title: "College Event Registration",
    description: "A ready-made event registration form for clubs and departments.",
    category: "Campus",
    accent: "from-violet-500 via-indigo-400 to-sky-300",
    icon: "LibraryBig",
    tags: ["Registration", "Event", "College"],
    settings: baseSettings("college-event-registration"),
    fields: [
      { id: "full_name", type: "short_text", label: "Full name", required: true, placeholder: "Enter full name" },
      {
        id: "department",
        type: "select",
        label: "Department",
        required: true,
        options: [
          { id: "cs", label: "Computer Science", value: "computer_science" },
          { id: "bca", label: "BCA", value: "bca" },
          { id: "commerce", label: "Commerce", value: "commerce" },
          { id: "arts", label: "Arts", value: "arts" }
        ]
      },
      {
        id: "semester",
        type: "select",
        label: "Semester",
        required: true,
        options: [
          { id: "sem1", label: "Semester 1", value: "1" },
          { id: "sem2", label: "Semester 2", value: "2" },
          { id: "sem3", label: "Semester 3", value: "3" },
          { id: "sem4", label: "Semester 4", value: "4" }
        ]
      },
      { id: "phone", type: "phone", label: "Phone number", required: true, placeholder: "+94 77 123 4567" },
      {
        id: "event_role",
        type: "select",
        label: "Interested role",
        required: true,
        options: [
          { id: "attendee", label: "Attendee", value: "attendee" },
          { id: "volunteer", label: "Volunteer", value: "volunteer" },
          { id: "speaker", label: "Speaker", value: "speaker" }
        ]
      },
      { id: "notes", type: "long_text", label: "Anything we should know?", required: false, placeholder: "Optional note" }
    ]
  },
  {
    id: "office",
    title: "Team Pulse Survey",
    description: "Run quick internal surveys for engagement and productivity.",
    category: "Workplace",
    accent: "from-slate-700 via-slate-600 to-cyan-400",
    icon: "BriefcaseBusiness",
    tags: ["HR", "Office", "Internal"],
    settings: baseSettings("team-pulse-survey"),
    fields: [
      {
        id: "team",
        type: "select",
        label: "Team",
        required: true,
        options: [
          { id: "product", label: "Product", value: "product" },
          { id: "engineering", label: "Engineering", value: "engineering" },
          { id: "design", label: "Design", value: "design" },
          { id: "operations", label: "Operations", value: "operations" }
        ]
      },
      { id: "role", type: "short_text", label: "Role", required: true, placeholder: "Your role" },
      { id: "workload", type: "linear_scale", label: "Workload balance", required: true, min: 1, max: 10 },
      { id: "clarity", type: "rating", label: "Clarity of goals", required: true, min: 1, max: 5 },
      {
        id: "tools",
        type: "multi_select",
        label: "Tools causing friction",
        required: false,
        options: [
          { id: "chat", label: "Communication tools", value: "communication" },
          { id: "task", label: "Task management", value: "task_management" },
          { id: "docs", label: "Documentation", value: "documentation" },
          { id: "none", label: "No friction", value: "none" }
        ]
      },
      { id: "feedback", type: "long_text", label: "What should improve next sprint?", required: false, placeholder: "Share your thoughts" }
    ]
  },
  {
    id: "jobs",
    title: "Job Application",
    description: "A clean starter template for internships and hiring forms.",
    category: "Hiring",
    accent: "from-emerald-500 via-teal-400 to-lime-300",
    icon: "BadgeCheck",
    tags: ["Hiring", "Recruitment", "Applications"],
    settings: baseSettings("job-application"),
    fields: [
      { id: "candidate_name", type: "short_text", label: "Full name", required: true, placeholder: "Candidate full name" },
      { id: "candidate_email", type: "email", label: "Email", required: true, placeholder: "candidate@example.com" },
      { id: "candidate_phone", type: "phone", label: "Phone", required: true, placeholder: "+94 77 123 4567" },
      {
        id: "position",
        type: "select",
        label: "Position applying for",
        required: true,
        options: [
          { id: "intern", label: "Intern", value: "intern" },
          { id: "designer", label: "UI/UX Designer", value: "designer" },
          { id: "developer", label: "Frontend Developer", value: "developer" },
          { id: "analyst", label: "Business Analyst", value: "analyst" }
        ]
      },
      { id: "experience", type: "number", label: "Years of experience", required: true, placeholder: "2" },
      { id: "cover_letter", type: "long_text", label: "Why should we hire you?", required: true, placeholder: "Tell us about yourself" }
    ]
  },
  {
    id: "survey",
    title: "Customer Experience Survey",
    description: "A survey template focused on feedback and insights generation.",
    category: "Research",
    accent: "from-fuchsia-500 via-pink-400 to-orange-300",
    icon: "ChartColumnBig",
    tags: ["Survey", "CX", "Insights"],
    settings: baseSettings("customer-experience-survey"),
    fields: [
      { id: "customer_name", type: "short_text", label: "Name", required: false, placeholder: "Optional" },
      { id: "service_rating", type: "rating", label: "Service quality rating", required: true, min: 1, max: 5 },
      { id: "product_rating", type: "rating", label: "Product quality rating", required: true, min: 1, max: 5 },
      {
        id: "delivery_speed",
        type: "select",
        label: "Delivery experience",
        required: true,
        options: [
          { id: "fast", label: "Fast", value: "fast" },
          { id: "okay", label: "Okay", value: "okay" },
          { id: "slow", label: "Slow", value: "slow" }
        ]
      },
      {
        id: "issues",
        type: "multi_select",
        label: "Which issues did you face?",
        required: false,
        options: [
          { id: "delay", label: "Delivery delay", value: "delay" },
          { id: "support", label: "Slow support", value: "support" },
          { id: "quality", label: "Product quality issue", value: "quality" },
          { id: "none", label: "No issues", value: "none" }
        ]
      },
      { id: "feedback", type: "long_text", label: "Detailed feedback", required: false, placeholder: "What stood out in your experience?" }
    ]
  },
  {
    id: "technical-interview",
    title: "Technical Interview Screening",
    description: "Shortlist engineering candidates with stack, portfolio, and problem-solving inputs.",
    category: "Interview",
    accent: "from-slate-900 via-blue-600 to-sky-400",
    icon: "BadgeCheck",
    tags: ["Tech Stack", "Portfolio", "Screening"],
    settings: baseSettings("technical-interview-screening"),
    fields: [
      { id: "candidate_name", type: "short_text", label: "Candidate Name", required: true, placeholder: "Enter candidate name" },
      { id: "candidate_email", type: "email", label: "Email", required: true, placeholder: "candidate@example.com" },
      { id: "tech_stack", type: "long_text", label: "Tech Stack", required: true, placeholder: "React, Node.js, Python..." },
      { id: "experience_years", type: "number", label: "Years of Experience", required: true, placeholder: "3" },
      { id: "portfolio_link", type: "short_text", label: "GitHub / Portfolio Link", required: false, placeholder: "https://github.com/username" },
      { id: "problem_solving", type: "long_text", label: "Problem-Solving Questions", required: true, placeholder: "Describe approach to a technical challenge" }
    ]
  },
  {
    id: "hr-interview",
    title: "HR Interview Evaluation",
    description: "Capture communication, cultural fit, strengths, and final hiring decision.",
    category: "Interview",
    accent: "from-violet-700 via-purple-500 to-indigo-300",
    icon: "Users",
    tags: ["HR", "Evaluation", "Hiring"],
    settings: baseSettings("hr-interview-evaluation"),
    fields: [
      { id: "candidate_name", type: "short_text", label: "Candidate Name", required: true, placeholder: "Enter candidate name" },
      { id: "communication_rating", type: "rating", label: "Communication Rating", required: true, min: 1, max: 5 },
      { id: "cultural_fit", type: "rating", label: "Cultural Fit", required: true, min: 1, max: 5 },
      { id: "strengths", type: "long_text", label: "Strengths", required: true, placeholder: "Write strengths" },
      { id: "weaknesses", type: "long_text", label: "Weaknesses", required: false, placeholder: "Write weaknesses" },
      {
        id: "final_decision",
        type: "select",
        label: "Final Decision",
        required: true,
        options: [
          { id: "hire", label: "Hire", value: "hire" },
          { id: "reject", label: "Reject", value: "reject" },
          { id: "hold", label: "Hold", value: "hold" }
        ]
      }
    ]
  },
  {
    id: "internship-application",
    title: "Internship Application",
    description: "A student-friendly template for internship applications and shortlisting.",
    category: "Hiring",
    accent: "from-teal-700 via-cyan-500 to-sky-300",
    icon: "BriefcaseBusiness",
    tags: ["Internship", "Students", "Resume"],
    settings: baseSettings("internship-application"),
    fields: [
      { id: "name", type: "short_text", label: "Name", required: true, placeholder: "Enter full name" },
      { id: "college", type: "short_text", label: "College / University", required: true, placeholder: "Enter college name" },
      { id: "course", type: "short_text", label: "Course / Degree", required: true, placeholder: "BCA, BTech..." },
      { id: "year_of_study", type: "select", label: "Year of Study", required: true, options: [
        { id: "year1", label: "1st Year", value: "1" },
        { id: "year2", label: "2nd Year", value: "2" },
        { id: "year3", label: "3rd Year", value: "3" },
        { id: "year4", label: "4th Year", value: "4" }
      ] },
      { id: "skills", type: "long_text", label: "Skills", required: true, placeholder: "List relevant skills" },
      { id: "resume_upload", type: "file_upload", label: "Resume Upload", required: false },
      { id: "availability", type: "short_text", label: "Availability", required: true, placeholder: "Full-time / Part-time / Dates" }
    ]
  },
  {
    id: "freelancer-hiring",
    title: "Freelancer Hiring Request",
    description: "Collect client needs, budget, timeline, and skills for freelance project requests.",
    category: "Hiring",
    accent: "from-gray-700 via-orange-500 to-amber-300",
    icon: "BriefcaseBusiness",
    tags: ["Client", "Budget", "Project"],
    settings: baseSettings("freelancer-hiring-request"),
    fields: [
      { id: "client_name", type: "short_text", label: "Client Name", required: true, placeholder: "Enter client name" },
      { id: "project_description", type: "long_text", label: "Project Description", required: true, placeholder: "Describe the project" },
      { id: "budget_range", type: "short_text", label: "Budget Range", required: true, placeholder: "$500 - $2000" },
      { id: "timeline", type: "short_text", label: "Timeline", required: true, placeholder: "2 weeks / 1 month" },
      { id: "required_skills", type: "long_text", label: "Required Skills", required: true, placeholder: "React, Figma, SEO..." }
    ]
  },
  {
    id: "csat",
    title: "Customer Satisfaction (CSAT)",
    description: "A quick satisfaction form built for ratings, feedback, and suggestions.",
    category: "Analytics",
    accent: "from-pink-600 via-rose-500 to-orange-300",
    icon: "ChartColumnBig",
    tags: ["CSAT", "Rating", "Feedback"],
    settings: baseSettings("customer-satisfaction-csat"),
    fields: [
      { id: "customer_name", type: "short_text", label: "Customer Name (Optional)", required: false, placeholder: "Optional name" },
      { id: "rating", type: "rating", label: "Rating (1-5)", required: true, min: 1, max: 5 },
      { id: "service_quality", type: "rating", label: "Service Quality", required: true, min: 1, max: 5 },
      { id: "feedback", type: "long_text", label: "Feedback", required: false, placeholder: "Share your feedback" },
      { id: "suggestions", type: "long_text", label: "Suggestions", required: false, placeholder: "Any suggestions?" }
    ]
  },
  {
    id: "employee-engagement",
    title: "Employee Engagement Survey",
    description: "Track internal satisfaction, collaboration, manager feedback, and improvement ideas.",
    category: "Analytics",
    accent: "from-blue-700 via-cyan-500 to-sky-200",
    icon: "Users",
    tags: ["Employees", "Engagement", "Internal"],
    settings: baseSettings("employee-engagement-survey"),
    fields: [
      { id: "employee_name", type: "short_text", label: "Employee ID / Name", required: true, placeholder: "EMP-102 / Name" },
      { id: "work_satisfaction", type: "rating", label: "Work Satisfaction Rating", required: true, min: 1, max: 5 },
      { id: "team_collaboration", type: "rating", label: "Team Collaboration Rating", required: true, min: 1, max: 5 },
      { id: "manager_feedback", type: "long_text", label: "Manager Feedback", required: false, placeholder: "Share thoughts about management" },
      { id: "suggestions", type: "long_text", label: "Suggestions", required: false, placeholder: "How can the workplace improve?" }
    ]
  },
  {
    id: "user-research",
    title: "User Research / Product Feedback",
    description: "Understand demographics, usage habits, favorite features, and product pain points.",
    category: "Analytics",
    accent: "from-orange-700 via-amber-500 to-yellow-200",
    icon: "ChartColumnBig",
    tags: ["Research", "Product", "Pain Points"],
    settings: baseSettings("user-research-product-feedback"),
    fields: [
      { id: "age_demographics", type: "short_text", label: "Age / Demographics", required: false, placeholder: "Age group / city / role" },
      { id: "usage_frequency", type: "select", label: "Product Usage Frequency", required: true, options: [
        { id: "daily", label: "Daily", value: "daily" },
        { id: "weekly", label: "Weekly", value: "weekly" },
        { id: "monthly", label: "Monthly", value: "monthly" },
        { id: "rarely", label: "Rarely", value: "rarely" }
      ] },
      { id: "favorite_features", type: "long_text", label: "Favorite Features", required: false, placeholder: "What features do you love?" },
      { id: "pain_points", type: "long_text", label: "Pain Points", required: false, placeholder: "What problems do you face?" },
      { id: "suggestions", type: "long_text", label: "Suggestions", required: false, placeholder: "What should improve?" }
    ]
  },
  {
    id: "startup-pitch",
    title: "Startup Idea Pitch",
    description: "Collect startup concepts, target audience, solution, and revenue model in one form.",
    category: "Innovation",
    accent: "from-purple-800 via-fuchsia-500 to-pink-300",
    icon: "Sparkles",
    tags: ["Startup", "Pitch", "Idea"],
    settings: baseSettings("startup-idea-pitch"),
    fields: [
      { id: "idea_title", type: "short_text", label: "Idea Title", required: true, placeholder: "Enter idea title" },
      { id: "problem_statement", type: "long_text", label: "Problem Statement", required: true, placeholder: "What problem are you solving?" },
      { id: "proposed_solution", type: "long_text", label: "Proposed Solution", required: true, placeholder: "Describe the solution" },
      { id: "target_audience", type: "long_text", label: "Target Audience", required: true, placeholder: "Who is the customer?" },
      { id: "revenue_model", type: "long_text", label: "Revenue Model", required: true, placeholder: "How will the startup make money?" }
    ]
  }
];

export function getTemplateById(templateId?: string | null) {
  return formTemplates.find((template) => template.id === templateId);
}
