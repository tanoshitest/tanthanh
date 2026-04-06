export type Role = "admin" | "teacher" | "parent";
export type UserStatus = "active" | "on_leave" | "suspended";
export type AttendanceStatus = "present" | "late" | "absent_excused" | "absent_unexcused";
export type FeeStatus = "paid" | "pending" | "overdue";
export type SessionStatus = "completed" | "upcoming" | "cancelled";
export type LessonStatus = "published" | "draft";
export type SubmissionStatus = "graded" | "submitted" | "not_submitted";
export type ClassCategory = "kem" | "luyen-thi" | "dai-tra" | "chuyen" | "online";

export interface Student {
  id: string;
  name: string;
  grade: number;
  level: string;
  classes: string[];
  dateOfBirth: string;
  status: UserStatus;
}

export interface ParentAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  zaloPhone: string;
  children: Student[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  type: "main" | "assistant";
  phone: string;
  subject: string;
  baseSalary?: number;
  perSessionRate?: number;
  sessionsThisMonth?: number;
  hourlyRate?: number;
  hoursThisMonth?: number;
  status: UserStatus;
}

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  level: string;
  category: ClassCategory;
  teacherId: string;
  assistantId: string | null;
  studentCount: number;
  maxStudents: number;
  schedule: { day: string; time: string; type: string; zoomLink?: string }[];
}

export interface Session {
  id: string;
  classId: string;
  date: string;
  day: string;
  time: string;
  type: string;
  status: SessionStatus;
  teacherId: string;
  lessonId: string | null;
  topic: string;
  zoomLink?: string;
}

export interface Quiz {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correctAnswer: number;
  passScore?: number; // Added to block playback until correct
}

export interface VideoSegment {
  id: string;
  startTime: number; // Renamed from timestamp
  endTime: number;   // Added
  label: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
  quizzes: Quiz[];
  segments?: VideoSegment[];
}

export interface Lesson {
  id: string;
  classId: string;
  title: string;
  description: string;
  order: number;
  sessionIds: string[];
  videos: Video[];
  attachments: { id: string; name: string; type?: string; size: string }[];
  summaryQuiz: { questions: { id: string; question: string; type: string }[] } | null;
  writingExercise: { title: string; prompt: string; type: string } | null;
  status: LessonStatus;
}

export interface CalendarEvent {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  className: string;
  teacherName: string;
  type: string;
  color: string;
}
