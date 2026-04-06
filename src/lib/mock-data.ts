import { ClassInfo } from "./types";

export const adminUser = { id: "admin-001", name: "Nguyễn Văn Admin", email: "admin@trungtamabc.vn", role: "admin" as const, phone: "0901234567" };

export const mainTeachers = [
  { id: "gv-001", name: "Trần Thị Mai", email: "mai.tran@trungtamabc.vn", type: "main" as const, phone: "0912345678", subject: "Văn", baseSalary: 4000000, perSessionRate: 150000, sessionsThisMonth: 18, status: "active" as const },
  { id: "gv-002", name: "Lê Hoàng Nam", email: "nam.le@trungtamabc.vn", type: "main" as const, phone: "0923456789", subject: "Toán", baseSalary: 4500000, perSessionRate: 160000, sessionsThisMonth: 20, status: "active" as const },
  { id: "gv-005", name: "Đỗ Quang Huy", email: "huy.do@trungtamabc.vn", type: "main" as const, phone: "0956789012", subject: "Toán", baseSalary: 4000000, perSessionRate: 150000, sessionsThisMonth: 16, status: "on_leave" as const }
];

export const assistants = [
  { id: "gv-003", name: "Phạm Minh Tú", email: "tu.pham@trungtamabc.vn", type: "assistant" as const, phone: "0934567890", subject: "Văn", hourlyRate: 60000, hoursThisMonth: 40, status: "active" as const },
  { id: "gv-004", name: "Ngô Thanh Hà", email: "ha.ngo@trungtamabc.vn", type: "assistant" as const, phone: "0945678901", subject: "Toán", hourlyRate: 55000, hoursThisMonth: 36, status: "active" as const }
];

export const accountants = [
  { id: "kt-001", name: "Võ Thị Hồng", email: "hong.vo@trungtamabc.vn", phone: "0961234567", status: "active" as const, baseSalary: 6500000 }
];

export const parentStudentAccounts = [
  { id: "ph-001", name: "Nguyễn Thị Lan", email: "lan.nguyen@gmail.com", phone: "0967890123", zaloPhone: "0967890123", children: [
    { id: "hs-001", name: "Nguyễn Minh Khôi", grade: 9, level: "advanced", classes: ["class-001","class-005"], dateOfBirth: "2011-03-15", status: "active" as const },
    { id: "hs-002", name: "Nguyễn Thị Hạ Vy", grade: 7, level: "intermediate", classes: ["class-003","class-007"], dateOfBirth: "2013-08-22", status: "active" as const }
  ]},
  { id: "ph-002", name: "Trương Văn Bình", email: "binh.truong@gmail.com", phone: "0978901234", zaloPhone: "0978901234", children: [
    { id: "hs-003", name: "Trương Đình Phúc", grade: 9, level: "advanced", classes: ["class-001","class-005","class-002"], dateOfBirth: "2011-06-10", status: "active" as const }
  ]},
  { id: "ph-003", name: "Lý Văn Tài", email: "tai.ly@gmail.com", phone: "0981234567", zaloPhone: "0981234567", children: [
    { id: "hs-004", name: "Lý Thanh Tâm", grade: 6, level: "beginner", classes: ["class-009","class-004"], dateOfBirth: "2014-12-01", status: "active" as const }
  ]},
  { id: "ph-004", name: "Hoàng Minh Tuấn", email: "tuan.hoang@gmail.com", phone: "0972345678", zaloPhone: "0972345678", children: [
    { id: "hs-005", name: "Hoàng Gia Bảo", grade: 8, level: "intermediate", classes: ["class-003","class-008","class-010"], dateOfBirth: "2012-04-18", status: "active" as const }
  ]}
];

export const classes: ClassInfo[] = [
  { id: "class-001", name: "Lớp 9A - Văn Cao cấp", subject: "Văn", grade: 9, level: "advanced", category: "chuyen", teacherId: "gv-001", assistantId: "gv-003", studentCount: 35, maxStudents: 40, schedule: [{ day: "Thứ 2", time: "18:00-20:00", type: "offline" }, { day: "Thứ 5", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/1234567890" }] },
  { id: "class-002", name: "Lớp 9B - Văn Cao cấp", subject: "Văn", grade: 9, level: "advanced", category: "chuyen", teacherId: "gv-001", assistantId: "gv-003", studentCount: 24, maxStudents: 30, schedule: [{ day: "Thứ 3", time: "18:00-20:00", type: "offline" }, { day: "Thứ 6", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/0987654321" }] },
  { id: "class-003", name: "Lớp 7 - Văn Trung cấp", subject: "Văn", grade: 7, level: "intermediate", category: "dai-tra", teacherId: "gv-001", assistantId: "gv-003", studentCount: 28, maxStudents: 35, schedule: [{ day: "Thứ 4", time: "18:00-20:00", type: "offline" }, { day: "Thứ 7", time: "09:00-11:00", type: "offline" }] },
  { id: "class-004", name: "Lớp 6 - Văn Sơ cấp", subject: "Văn", grade: 6, level: "beginner", category: "dai-tra", teacherId: "gv-001", assistantId: "gv-003", studentCount: 20, maxStudents: 30, schedule: [{ day: "Thứ 7", time: "14:00-16:00", type: "offline" }] },
  { id: "class-005", name: "Lớp 9A - Toán Cao cấp", subject: "Toán", grade: 9, level: "advanced", category: "luyen-thi", teacherId: "gv-002", assistantId: "gv-004", studentCount: 32, maxStudents: 35, schedule: [{ day: "Thứ 3", time: "18:00-20:00", type: "offline" }, { day: "Thứ 6", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/1111222233" }] },
  { id: "class-006", name: "Lớp 9B - Toán Trung cấp", subject: "Toán", grade: 9, level: "intermediate", category: "luyen-thi", teacherId: "gv-002", assistantId: "gv-004", studentCount: 30, maxStudents: 35, schedule: [{ day: "Thứ 2", time: "18:00-20:00", type: "offline" }, { day: "Thứ 5", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/4444555566" }] },
  { id: "class-007", name: "Lớp 7 - Toán Trung cấp", subject: "Toán", grade: 7, level: "intermediate", category: "dai-tra", teacherId: "gv-005", assistantId: "gv-004", studentCount: 25, maxStudents: 30, schedule: [{ day: "Thứ 4", time: "18:00-20:00", type: "offline" }] },
  { id: "class-008", name: "Lớp 8 - Toán Trung cấp", subject: "Toán", grade: 8, level: "intermediate", category: "dai-tra", teacherId: "gv-002", assistantId: "gv-004", studentCount: 22, maxStudents: 30, schedule: [{ day: "Thứ 7", time: "09:00-11:00", type: "offline" }] },
  { id: "class-009", name: "Lớp 6 - Toán Sơ cấp", subject: "Toán", grade: 6, level: "beginner", category: "dai-tra", teacherId: "gv-005", assistantId: "gv-004", studentCount: 18, maxStudents: 25, schedule: [{ day: "Thứ 7", time: "14:00-16:00", type: "offline" }] },
  { id: "class-010", name: "Lớp 8 - Văn Trung cấp", subject: "Văn", grade: 8, level: "intermediate", category: "dai-tra", teacherId: "gv-001", assistantId: "gv-003", studentCount: 26, maxStudents: 30, schedule: [{ day: "Chủ nhật", time: "09:00-11:00", type: "offline" }] },
  { id: "class-011", name: "Kèm 1-1 Gia Bảo", subject: "Toán", grade: 8, level: "intermediate", category: "kem", teacherId: "gv-002", assistantId: null, studentCount: 1, maxStudents: 2, schedule: [{ day: "Thứ 5", time: "16:00-17:30", type: "offline" }] },
  { id: "class-012", name: "Lớp Văn Online 9", subject: "Văn", grade: 9, level: "intermediate", category: "online", teacherId: "gv-001", assistantId: "gv-003", studentCount: 15, maxStudents: 50, schedule: [{ day: "Thứ 7", time: "20:00-21:30", type: "online", zoomLink: "https://zoom.us/j/online123" }] }
];

export const sessions = [
  { id: "s-001", classId: "class-001", date: "2025-01-20", day: "Thứ 2", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Lặng lẽ Sa Pa - P1" },
  { id: "s-002", classId: "class-001", date: "2025-01-23", day: "Thứ 5", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/1234567890", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Lặng lẽ Sa Pa - P2" },
  { id: "s-003", classId: "class-001", date: "2025-01-27", day: "Thứ 2", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-002", topic: "NLXH: Lòng dũng cảm" },
  { id: "s-004", classId: "class-001", date: "2025-01-30", day: "Thứ 5", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/1234567890", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-002", topic: "Luyện viết NLXH" },
  { id: "s-005", classId: "class-001", date: "2025-02-03", day: "Thứ 2", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-003", topic: "Đoạn văn NLVH" },
  { id: "s-006", classId: "class-002", date: "2025-01-21", day: "Thứ 3", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Lặng lẽ Sa Pa" },
  { id: "s-007", classId: "class-002", date: "2025-01-24", day: "Thứ 6", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/0987654321", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-002", topic: "NLXH: Lập dàn ý" },
  { id: "s-008", classId: "class-002", date: "2025-01-28", day: "Thứ 3", time: "18:00-20:00", type: "offline", status: "upcoming" as const, teacherId: "gv-001", lessonId: "lesson-003", topic: "Luyện viết đoạn văn" },
  { id: "s-009", classId: "class-003", date: "2025-01-22", day: "Thứ 4", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Thơ trung đại Việt Nam" },
  { id: "s-010", classId: "class-003", date: "2025-01-25", day: "Thứ 7", time: "09:00-11:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-002", topic: "Luyện tập thơ Đường luật" },
  { id: "s-011", classId: "class-004", date: "2025-01-25", day: "Thứ 7", time: "14:00-16:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Thế giới truyện cổ tích" },
  { id: "s-012", classId: "class-005", date: "2025-01-21", day: "Thứ 3", time: "18:00-20:00", type: "offline", status: "completed" as const, teacherId: "gv-002", lessonId: "lesson-004", topic: "H hệ phương trình: PP thế" },
  { id: "s-013", classId: "class-005", date: "2025-01-24", day: "Thứ 6", time: "18:00-20:00", type: "online", zoomLink: "https://zoom.us/j/1111222233", status: "completed" as const, teacherId: "gv-002", lessonId: "lesson-004", topic: "Hệ phương trình: PP cộng đại số" },
  { id: "s-014", classId: "class-010", date: "2025-01-26", day: "Chủ nhật", time: "09:00-11:00", type: "offline", status: "completed" as const, teacherId: "gv-001", lessonId: "lesson-001", topic: "Văn bản thuyết minh đa phương thức" }
];

export const sessionAttendance = [
  { sessionId: "s-001", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "present" as const, note: "" },
    { studentId: "hs-004", studentName: "Lý Thanh Tâm", status: "present" as const, note: "" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "absent_excused" as const, note: "PH xin nghỉ" }
  ]},
  { sessionId: "s-002", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "late" as const, note: "Trễ 15p" },
    { studentId: "hs-004", studentName: "Lý Thanh Tâm", status: "present" as const, note: "" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "absent_unexcused" as const, note: "" }
  ]},
  { sessionId: "s-003", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "present" as const, note: "" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "present" as const, note: "" }
  ]},
  { sessionId: "s-004", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "present" as const, note: "" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "late" as const, note: "Trễ 10p" }
  ]},
  { sessionId: "s-006", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "present" as const, note: "" }
  ]},
  { sessionId: "s-005", records: [
    { studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "present" as const, note: "" },
    { studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "present" as const, note: "" },
    { studentId: "hs-003", studentName: "Trương Đình Phúc", status: "late" as const, note: "Trễ 5p" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "present" as const, note: "" }
  ]},
  { sessionId: "s-009", records: [
    { studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "present" as const, note: "" },
    { studentId: "hs-005", studentName: "Hoàng Gia Bảo", status: "late" as const, note: "Trễ 5p" }
  ]}
];

export const sessionEvaluations = [
  { sessionId: "s-001", studentId: "hs-001", criteria: { knowledgeAbsorption: 9, classFocus: 8, examSkills: 8.5, selfStudy: 7, diligence: 9, interaction: 8 }, comment: "Tiếp thu tốt, tích cực phát biểu." },
  { sessionId: "s-001", studentId: "hs-002", criteria: { knowledgeAbsorption: 8, classFocus: 9, examSkills: 8, selfStudy: 8, diligence: 8.5, interaction: 9 }, comment: "Rất chăm chỉ và hòa đồng." },
  { sessionId: "s-001", studentId: "hs-003", criteria: { knowledgeAbsorption: 7, classFocus: 7, examSkills: 6.5, selfStudy: 8, diligence: 8, interaction: 6 }, comment: "Cần chủ động hơn trong thảo luận." },
  { sessionId: "s-001", studentId: "hs-004", criteria: { knowledgeAbsorption: 8.5, classFocus: 8.5, examSkills: 7.5, selfStudy: 9, diligence: 9, interaction: 8 }, comment: "Tự học rất tốt, tiến bộ nhanh." },
  { sessionId: "s-002", studentId: "hs-001", criteria: { knowledgeAbsorption: 8, classFocus: 9, examSkills: 8, selfStudy: 7.5, diligence: 9, interaction: 9 }, comment: "Online rất tập trung, trả lời bài nhanh." },
  { sessionId: "s-002", studentId: "hs-002", criteria: { knowledgeAbsorption: 8.5, classFocus: 8, examSkills: 8.5, selfStudy: 8, diligence: 9, interaction: 8.5 }, comment: "Phát biểu ý kiến hay trong giờ online." },
  { sessionId: "s-002", studentId: "hs-003", criteria: { knowledgeAbsorption: 7, classFocus: 6, examSkills: 6, selfStudy: 7, diligence: 6, interaction: 5 }, comment: "Vào trễ, chưa tập trung, cần cải thiện thái độ học online." },
  { sessionId: "s-003", studentId: "hs-001", criteria: { knowledgeAbsorption: 9, classFocus: 8, examSkills: 9, selfStudy: 8, diligence: 9, interaction: 8.5 }, comment: "NLXH tốt, lập luận chặt chẽ và sâu sắc." },
  { sessionId: "s-003", studentId: "hs-003", criteria: { knowledgeAbsorption: 8, classFocus: 8, examSkills: 7, selfStudy: 7, diligence: 8, interaction: 8 }, comment: "Có sự tiến bộ rõ rệt trong cách viết." },
  { sessionId: "s-004", studentId: "hs-001", criteria: { knowledgeAbsorption: 8.5, classFocus: 8, examSkills: 8.5, selfStudy: 8, diligence: 9, interaction: 8 }, comment: "Luyện viết tiến bộ, diễn đạt trôi chảy." },
  { 
    sessionId: "s-005", studentId: "hs-001",
    criteria: { knowledgeAbsorption: 9, classFocus: 9, examSkills: 8.5, selfStudy: 8, diligence: 9, interaction: 9 },
    comment: "Khôi nắm rất vững kỹ năng viết đoạn văn NLVH. Cần chú ý thêm cách dùng từ cho mượt mà hơn."
  },
  { 
    sessionId: "s-005", studentId: "hs-002",
    criteria: { knowledgeAbsorption: 8.5, classFocus: 8, examSkills: 8, selfStudy: 9, diligence: 9, interaction: 8 },
    comment: "Vy có tiến bộ vượt bậc trong cách lập dàn ý. Rất chăm chỉ phát biểu."
  }
];

export const lessons = [
  {
    id: "lesson-001", classId: "class-001", title: "Phân tích tác phẩm Lặng lẽ Sa Pa",
    description: "Tìm hiểu nội dung, nghệ thuật và ý nghĩa tác phẩm", order: 1,
    sessionIds: ["s-001", "s-002"],
    videos: [
      { id: "v-001", title: "Phần 1: Giới thiệu tác giả & tác phẩm", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: 1200, quizzes: [
        { id: "q-001", timestamp: 5, question: "Tác giả của Lặng lẽ Sa Pa là ai?", options: ["Nguyễn Thành Long", "Kim Lân", "Nguyễn Quang Sáng", "Bằng Việt"], correctAnswer: 0 },
        { id: "q-002", timestamp: 8, question: "Tác phẩm sáng tác năm nào?", options: ["1968", "1970", "1972", "1975"], correctAnswer: 1 }
      ]},
      { id: "v-002", title: "Phần 2: Phân tích nhân vật anh thanh niên", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: 1500, quizzes: [
        { id: "q-003", timestamp: 5, question: "Anh thanh niên làm công việc gì?", options: ["Kỹ sư", "Khí tượng thủy văn", "Bộ đội", "Giáo viên"], correctAnswer: 1 }
      ]},
      { id: "v-003", title: "Phần 3: Nghệ thuật và ý nghĩa", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: 1100, quizzes: [] }
    ],
    attachments: [
      { id: "att-001", name: "Văn bản tác phẩm.pdf", type: "pdf", size: "2.3 MB" },
      { id: "att-002", name: "Sơ đồ tư duy.png", type: "image", size: "450 KB" }
    ],
    summaryQuiz: { questions: [
      { id: "sq-001", question: "Nêu ý nghĩa nhan đề 'Lặng lẽ Sa Pa'?", type: "essay" },
      { id: "sq-002", question: "Phân tích vẻ đẹp nhân vật anh thanh niên", type: "essay" }
    ]},
    writingExercise: { title: "Bài viết kết nối", prompt: "Viết 200 chữ cảm nhận về lối sống anh thanh niên", type: "online_text" },
    status: "published" as const
  },
  {
    id: "lesson-002", classId: "class-001", title: "Nghị luận xã hội: Lòng dũng cảm",
    description: "Hướng dẫn viết NLXH", order: 2, sessionIds: ["s-003", "s-004"],
    videos: [{ id: "v-004", title: "Cách lập dàn ý NLXH", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: 1800, quizzes: [
      { id: "q-005", timestamp: 5, question: "Bước đầu tiên khi viết NLXH?", options: ["Viết mở bài", "Lập dàn ý", "Tìm dẫn chứng", "Viết kết bài"], correctAnswer: 1, passScore: 1 }
    ]}],
    attachments: [{ id: "att-003", name: "Dàn ý mẫu.docx", size: "150 KB" }],
    summaryQuiz: { questions: [
      { id: "sq-003", question: "Thế nào là lòng dũng cảm?", type: "essay" }
    ]},
    writingExercise: { title: "Bài nghị luận", prompt: "Viết NLXH: Suy nghĩ về lòng dũng cảm", type: "upload_image" },
    status: "published" as const
  },
  {
    id: "lesson-003", classId: "class-001", title: "Đoạn văn nghị luận văn học",
    description: "Phương pháp viết đoạn văn NLVH hiệu quả", order: 3, sessionIds: ["s-005"],
    videos: [{ 
      id: "v-006", 
      title: "Kỹ thuật viết đoạn văn NLVH", 
      url: "https://www.w3schools.com/html/mov_bbb.mp4", 
      duration: 3000, 
      quizzes: [],
      segments: [
        { id: "seg-1", startTime: 0, endTime: 300, label: "00:00 - Giới thiệu cấu trúc đoạn văn 200 chữ" },
        { id: "seg-2", startTime: 300, endTime: 600, label: "05:00 - Phân tích yêu cầu đề bài (Key terms)" },
        { id: "seg-3", startTime: 600, endTime: 900, label: "10:00 - Cách viết mở đoạn ấn tượng" },
        { id: "seg-4", startTime: 900, endTime: 1200, label: "15:00 - Triển khai luận điểm 1: Nội dung" },
        { id: "seg-5", startTime: 1200, endTime: 1500, label: "20:00 - Triển khai luận điểm 2: Nghệ thuật" },
        { id: "seg-6", startTime: 1500, endTime: 1800, label: "25:00 - Cách trích dẫn thơ/văn bản hiệu quả" },
        { id: "seg-7", startTime: 1800, endTime: 2100, label: "30:00 - Liên hệ thực tế và mở rộng vấn đề" },
        { id: "seg-8", startTime: 2100, endTime: 2400, label: "35:00 - Các lỗi diễn đạt thường gặp" },
        { id: "seg-9", startTime: 2400, endTime: 2700, label: "40:00 - Kỹ thuật viết kết đoạn súc tích" },
        { id: "seg-10", startTime: 2700, endTime: 3000, label: "45:00 - Tổng kết và sửa bài mẫu thực tế" }
      ]
    }], 
    attachments: [{ id: "att-004", name: "Mẫu đoạn văn.pdf", size: "800 KB" }],
    summaryQuiz: { questions: [
        { id: "sq-004", question: "Các bước triển khai đoạn văn NLVH?", type: "essay" }
    ]}, 
    writingExercise: { title: "Viết đoạn văn", prompt: "Viết đoạn văn phân tích khổ thơ đầu bài Sang thu", type: "online_text" }, 
    status: "published" as const
  },
  {
    id: "lesson-004", classId: "class-005", title: "Hệ phương trình bậc nhất hai ẩn",
    description: "Nắm vững phương pháp thế và cộng đại số", order: 1, sessionIds: ["s-012", "s-013"],
    videos: [{ id: "v-005", title: "Phương pháp thế", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: 1400, quizzes: [
      { id: "q-006", timestamp: 5, question: "PP thế là gì?", options: ["Rút 1 ẩn rồi thế", "Cộng 2 PT", "Nhân hai vế", "Đổi dấu"], correctAnswer: 0, passScore: 1 }
    ]}],
    attachments: [{ id: "att-005", name: "Bài tập tự luyện.pdf", size: "1.2 MB" }], 
    summaryQuiz: { questions: [
        { id: "sq-005", question: "Giải hệ PT sau bằng PP thế...", type: "essay" }
    ]}, 
    writingExercise: { title: "Giải bài tập", prompt: "Chụp ảnh bài giải các bài tập trong file đính kèm", type: "upload_image" }, 
    status: "published" as const
  }
];

export const assignments = [
  {
    id: "bt-001", sessionId: "s-002", lessonId: "lesson-001", classId: "class-001",
    title: "Bài tập: Phân tích Lặng lẽ Sa Pa", submitType: "online_or_upload", dueDate: "2025-02-01", totalPoints: 10,
    submissions: [
      { id: "sub-001", studentId: "hs-001", studentName: "Nguyễn Minh Khôi", submittedAt: "2025-01-28 20:30", type: "online_text", content: "Anh thanh niên trong Lặng lẽ Sa Pa là hình ảnh đẹp đẽ của người lao động...", score: 8.5, feedback: "Tốt, cần thêm dẫn chứng nghệ thuật.", status: "graded" as const },
      { id: "sub-002", studentId: "hs-003", studentName: "Trương Đình Phúc", submittedAt: "2025-01-29 15:00", type: "upload_image", imageUrls: ["/mock-sub-1.jpg"], score: 7.0, feedback: "Bài làm khá, cần chú ý cách trình bày.", status: "graded" as const },
      { id: "sub-003", studentId: "hs-001", studentName: "Nguyễn Minh Khôi", submittedAt: "2025-01-30 09:00", type: "online_text", content: "Tác phẩm để lại ấn tượng sâu sắc...", score: null, feedback: null, status: "submitted" as const }
    ]
  },
  {
    id: "bt-002", sessionId: "s-004", lessonId: "lesson-002", classId: "class-001",
    title: "Bài nghị luận: Lòng dũng cảm", submitType: "upload_image", dueDate: "2025-02-15", totalPoints: 10,
    submissions: [
      { id: "sub-004", studentId: "hs-001", studentName: "Nguyễn Minh Khôi", submittedAt: "2025-02-12", type: "upload_image", score: 7.5, feedback: "Luận điểm rõ, dẫn chứng chung.", status: "graded" as const },
      { id: "sub-005", studentId: "hs-003", studentName: "Trương Đình Phúc", submittedAt: "2025-02-13", type: "upload_image", score: 8.0, feedback: "Rất tốt, sáng tạo.", status: "graded" as const }
    ]
  },
  {
    id: "assgn-s005-001", sessionId: "s-005", lessonId: "lesson-003", classId: "class-001",
    title: "Viết đoạn văn NLVH về khổ 1 bài Mùa xuân nho nhỏ",
    submitType: "online_or_upload" as const, dueDate: "2025-02-05", totalPoints: 10,
    submissions: [
      { id: "sub-005-1", studentId: "hs-001", studentName: "Nguyễn Minh Khôi", status: "submitted" as const, score: 0, submittedAt: "2025-02-04 14:00", feedback: "", imageUrls: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000"] },
      { id: "sub-005-2", studentId: "hs-002", studentName: "Nguyễn Thị Hạ Vy", status: "graded" as const, score: 9, submittedAt: "2025-02-04 15:30", feedback: "Phân tích hay, giàu cảm xúc.", imageUrls: ["https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000"] },
      { id: "sub-005-3", studentId: "hs-003", studentName: "Trương Đình Phúc", status: "submitted" as const, score: 0, submittedAt: "2025-02-04 19:45", feedback: "", imageUrls: ["https://images.unsplash.com/photo-1531346761392-51f938217036?q=80&w=1000"] }
    ]
  }
];

export const practiceExams = [
  { id: "de-001", classId: "class-001", title: "Đề thi thử giữa kỳ 1 - Văn 9", subject: "Văn", duration: 90, totalPoints: 10, rankings: [
    { studentName: "Nguyễn Minh Khôi", score: 8.5, rank: 1 },
    { studentName: "Trương Đình Phúc", score: 7.0, rank: 2 },
    { studentName: "Hoàng Gia Bảo", score: 6.5, rank: 3 }
  ], status: "completed" as const },
  { id: "de-002", classId: "class-005", title: "Đề thi thử cuối kỳ 1 - Toán 9", subject: "Toán", duration: 120, totalPoints: 10, rankings: [
    { studentName: "Nguyễn Minh Khôi", score: 9.5, rank: 1 },
    { studentName: "Trương Đình Phúc", score: 8.5, rank: 2 }
  ], status: "completed" as const }
];

export const tuitionFees = [
  { studentName: "Nguyễn Minh Khôi", parentName: "Nguyễn Thị Lan", zaloPhone: "0967890123", month: "01/2025", amount: 2500000, dueDate: "2025-01-10", status: "paid" as const, transactionRef: "SEPAY-20250108-001" },
  { studentName: "Nguyễn Minh Khôi", parentName: "Nguyễn Thị Lan", zaloPhone: "0967890123", month: "02/2025", amount: 2500000, dueDate: "2025-02-10", status: "paid" as const, transactionRef: "SEPAY-20250209-042" },
  { studentName: "Nguyễn Minh Khôi", parentName: "Nguyễn Thị Lan", zaloPhone: "0967890123", month: "03/2025", amount: 2500000, dueDate: "2025-03-10", status: "pending" as const, transactionRef: "REF-PENDING-001" },
  { studentName: "Trương Đình Phúc", parentName: "Trương Văn Bình", zaloPhone: "0978901234", month: "01/2025", amount: 2500000, dueDate: "2025-01-10", status: "paid" as const, transactionRef: "SEPAY-20250107-015" },
  { studentName: "Trương Đình Phúc", parentName: "Trương Văn Bình", zaloPhone: "0978901234", month: "02/2025", amount: 2500000, dueDate: "2025-02-10", status: "overdue" as const, transactionRef: "REF-OVERDUE-001" },
  { studentName: "Nguyễn Thị Hạ Vy", parentName: "Nguyễn Thị Lan", zaloPhone: "0967890123", month: "01/2025", amount: 1800000, dueDate: "2025-01-10", status: "paid" as const, transactionRef: "SEPAY-20250105-008" },
  { studentName: "Nguyễn Thị Hạ Vy", parentName: "Nguyễn Thị Lan", zaloPhone: "0967890123", month: "02/2025", amount: 1800000, dueDate: "2025-02-10", status: "paid" as const, transactionRef: "SEPAY-20250208-019" },
  { studentName: "Lý Thanh Tâm", parentName: "Lý Văn Tài", zaloPhone: "0981234567", month: "02/2025", amount: 2000000, dueDate: "2025-02-10", status: "paid" as const, transactionRef: "SEPAY-20250205-011" }
];

export const calendarEvents = [
  { dayOfWeek: 1, startTime: "18:00", endTime: "20:00", className: "Lớp 9A Văn CC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" },
  { dayOfWeek: 1, startTime: "18:00", endTime: "20:00", className: "Lớp 9B Toán TC", teacherName: "Lê Hoàng Nam", type: "offline", color: "#2563EB" },
  { dayOfWeek: 2, startTime: "18:00", endTime: "20:00", className: "Lớp 9B Văn CC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" },
  { dayOfWeek: 2, startTime: "18:00", endTime: "20:00", className: "Lớp 9A Toán CC", teacherName: "Lê Hoàng Nam", type: "offline", color: "#2563EB" },
  { dayOfWeek: 3, startTime: "18:00", endTime: "20:00", className: "Lớp 7 Văn TC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" },
  { dayOfWeek: 3, startTime: "18:00", endTime: "20:00", className: "Lớp 7 Toán TC", teacherName: "Đỗ Quang Huy", type: "offline", color: "#059669" },
  { dayOfWeek: 4, startTime: "18:00", endTime: "20:00", className: "Lớp 9A Văn CC", teacherName: "Trần Thị Mai", type: "online", color: "#7C3AED" },
  { dayOfWeek: 4, startTime: "18:00", endTime: "20:00", className: "Lớp 9B Toán TC", teacherName: "Lê Hoàng Nam", type: "online", color: "#2563EB" },
  { dayOfWeek: 5, startTime: "18:00", endTime: "20:00", className: "Lớp 9B Văn CC", teacherName: "Trần Thị Mai", type: "online", color: "#7C3AED" },
  { dayOfWeek: 5, startTime: "18:00", endTime: "20:00", className: "Lớp 9A Toán CC", teacherName: "Lê Hoàng Nam", type: "online", color: "#2563EB" },
  { dayOfWeek: 6, startTime: "09:00", endTime: "11:00", className: "Lớp 7 Văn TC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" },
  { dayOfWeek: 6, startTime: "09:00", endTime: "11:00", className: "Lớp 8 Toán TC", teacherName: "Lê Hoàng Nam", type: "offline", color: "#2563EB" },
  { dayOfWeek: 6, startTime: "14:00", endTime: "16:00", className: "Lớp 6 Văn SC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" },
  { dayOfWeek: 6, startTime: "14:00", endTime: "16:00", className: "Lớp 6 Toán SC", teacherName: "Đỗ Quang Huy", type: "offline", color: "#059669" },
  { dayOfWeek: 0, startTime: "09:00", endTime: "11:00", className: "Lớp 8 Văn TC", teacherName: "Trần Thị Mai", type: "offline", color: "#7C3AED" }
];

export const teacherPayroll = [
  { teacherName: "Trần Thị Mai", type: "main" as const, month: "01/2025", sessions: 18, hours: 36, salary: { base: 4000000, bonus: 2700000, total: 6700000 } },
  { teacherName: "Lê Hoàng Nam", type: "main" as const, month: "01/2025", sessions: 20, hours: 40, salary: { base: 4500000, bonus: 3200000, total: 7700000 } },
  { teacherName: "Đỗ Quang Huy", type: "main" as const, month: "01/2025", sessions: 16, hours: 32, salary: { base: 4000000, bonus: 2400000, total: 6400000 } },
  { teacherName: "Phạm Minh Tú", type: "assistant" as const, month: "01/2025", sessions: 0, hours: 40, salary: { hourlyRate: 60000, total: 2400000 } },
  { teacherName: "Ngô Thanh Hà", type: "assistant" as const, month: "01/2025", sessions: 0, hours: 36, salary: { hourlyRate: 55000, total: 1980000 } }
];

export const communityPosts = [
  { id: "post-001", authorName: "Trần Thị Mai", authorRole: "teacher", content: "Các em lớp 9A ôn tập Lặng lẽ Sa Pa cho kiểm tra tuần sau! Cô đã cập nhật tài liệu mới trong thư viện.", likes: 15, comments: [
    { authorName: "Nguyễn Minh Khôi", authorRole: "student", content: "Dạ em cảm ơn cô nhiều ạ!", createdAt: "2025-01-25 20:15" },
    { authorName: "Nguyễn Thị Lan", authorRole: "parent", content: "Cảm ơn cô đã tận tình nhắc nhở các con.", createdAt: "2025-01-25 21:00" }
  ], createdAt: "2025-01-25 18:30", isPinned: true },
  { id: "post-002", authorName: "Nguyễn Văn Admin", authorRole: "admin", content: "Thông báo nghỉ Tết từ ngày 25/01 đến 02/02. Chúc các em và gia đình năm mới bình an!", likes: 42, comments: [
    { authorName: "Lê Hoàng Nam", authorRole: "teacher", content: "Chúc mừng năm mới trung tâm!", createdAt: "2025-01-20 10:00" }
  ], createdAt: "2025-01-20 09:00", isPinned: true },
  { id: "post-003", authorName: "Trương Văn Bình", authorRole: "parent", content: "Xin hỏi lịch thi thử cuối kỳ 1 cho các lớp khối 9 khi nào bắt đầu ạ?", likes: 3, comments: [
    { authorName: "Nguyễn Văn Admin", authorRole: "admin", content: "Chào anh, lịch thi dự kiến từ 15/03 đến 20/03. Trung tâm sẽ gửi thông báo chi tiết sớm ạ.", createdAt: "2025-02-01 10:30" }
  ], createdAt: "2025-02-01 08:45", isPinned: false }
];

export const library = [
  // Tài liệu bồi dưỡng học sinh giỏi
  { title: "Bồi dưỡng HSG Toán 9 - Chuyên đề Hình học", subject: "Toán", grade: 9, category: "hsg", fileSize: "4.5 MB", downloadCount: 128 },
  { title: "Tuyển tập đề thi HSG Văn 9 cấp Thành phố", subject: "Văn", grade: 9, category: "hsg", fileSize: "3.2 MB", downloadCount: 85 },
  { title: "Nâng cao và phát triển Toán 8 - Tập 1", subject: "Toán", grade: 8, category: "hsg", fileSize: "5.8 MB", downloadCount: 156 },
  { title: "Chuyên đề bồi dưỡng HSG Tiếng Anh 9", subject: "Anh", grade: 9, category: "hsg", fileSize: "4.1 MB", downloadCount: 92 },
  
  // Thư viện sách tham khảo
  { title: "Từ điển Tiếng Việt dành cho học sinh", subject: "Văn", grade: null, category: "reference", fileSize: "12.5 MB", downloadCount: 450 },
  { title: "Sổ tay công thức Toán học cấp 2", subject: "Toán", grade: null, category: "reference", fileSize: "2.8 MB", downloadCount: 890 },
  { title: "100 câu chuyện quà tặng cuộc sống", subject: "Văn", grade: null, category: "reference", fileSize: "1.5 MB", downloadCount: 312 },
  { title: "Atlas Địa lý Việt Nam (Bản mới nhất)", subject: "Địa", grade: null, category: "reference", fileSize: "8.4 MB", downloadCount: 215 },

  // Tài liệu học tập
  { title: "Tổng hợp đề thi vào 10 Văn 2020-2024", subject: "Văn", grade: 9, category: "learning", fileSize: "5.2 MB", downloadCount: 156 },
  { title: "Công thức Toán 9 - Tổng hợp trọn bộ", subject: "Toán", grade: 9, category: "learning", fileSize: "3.8 MB", downloadCount: 203 },
  { title: "Phương pháp viết đoạn văn nghị luận văn học", subject: "Văn", grade: 9, category: "learning", fileSize: "1.5 MB", downloadCount: 312 },
  { title: "Đề thi thử Toán vào 10 - Quản Lộ", subject: "Toán", grade: 9, category: "learning", fileSize: "2.1 MB", downloadCount: 45 },
  { title: "Đề cương ôn tập học kỳ 2 - Toán 7", subject: "Toán", grade: 7, category: "learning", fileSize: "1.1 MB", downloadCount: 78 }
];
