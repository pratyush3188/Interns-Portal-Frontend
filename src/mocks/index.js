// Consolidated Mock Data for IAESTE SEP Portal

export const internProfile = {
  name: "Sophia Müller",
  role: "intern",
  country: "Germany",
  university: "Technical University of Munich (TUM)",
  duration: "12 Weeks",
  startDate: "2026-06-01",
  endDate: "2026-08-24",
  projectTitle: "Smart Water Quality Monitoring using IoT and Machine Learning",
  department: "Computer Science & Engineering",
  supervisor: "Dr. Alok Kumar",
  email: "sophia.mueller@tum.de",
  phone: "+49 176 12345678",
  phone1: "+91 9079968792",
  skills: ["React", "Python", "IoT", "Machine Learning", "Data Analysis"],
  languages: ["German (Native)", "English (Fluent)", "Hindi (Basic)"],
  hostel: "JECRC International Hostel Block A",
  roomNo: "304",
  stats: {
    eventsAttended: 4,
    tripsJoined: 2,
    tasksCompleted: 12,
  }
};

export const tasks = [
  {
    id: "task-1",
    title: "IoT Node Calibration",
    description: "Calibrate the pH and turbidity sensors connected to the ESP32 microcontroller and write test scripts in Python.",
    status: "in_progress",
    priority: "high",
    deadline: "2026-06-20",
    attachments: [
      { name: "sensor_specs.pdf", size: "1.2 MB", type: "pdf" }
    ],
    comments: [
      { author: "Dr. Alok Kumar", text: "Ensure the calibration curves match the manufacturer's manual.", date: "1 day ago" }
    ],
    progress: 60
  },
  {
    id: "task-2",
    title: "Draft Midterm Report",
    description: "Document the research progress, sensor specifications, calibration results, and system architecture for the midterm review.",
    status: "todo",
    priority: "high",
    deadline: "2026-07-05",
    attachments: [],
    comments: [],
    progress: 0
  },
  {
    id: "task-3",
    title: "Literature Review on IoT Water Quality Systems",
    description: "Read and summarize at least 5 IEEE papers on recent IoT architectures for water quality management.",
    status: "completed",
    priority: "medium",
    deadline: "2026-06-10",
    attachments: [
      { name: "literature_notes.pdf", size: "850 KB", type: "pdf" }
    ],
    comments: [
      { author: "Sophia Müller", text: "Uploaded notes in the documents tab.", date: "5 days ago" }
    ],
    progress: 100
  },
  {
    id: "task-4",
    title: "React Web Dashboard Mockups",
    description: "Design mockups for showcasing the real-time sensor graphs, alerts list, and data export tables.",
    status: "review",
    priority: "medium",
    deadline: "2026-06-18",
    attachments: [
      { name: "dashboard_ui.png", size: "2.4 MB", type: "image" }
    ],
    comments: [
      { author: "Aarav Sharma", text: "Clean layout, maybe add a chart zoom feature.", date: "12 hours ago" }
    ],
    progress: 90
  },
  {
    id: "task-5",
    title: "Setup Local SQL Database",
    description: "Create standard table schemas for storing hourly sensor readings including timestamp, pH, turbidity, and temperature.",
    status: "completed",
    priority: "low",
    deadline: "2026-06-08",
    attachments: [],
    comments: [],
    progress: 100
  }
];

export const trips = [
  {
    id: "trip-1",
    destination: "Jaisalmer Desert Safari",
    duration: "3 Days, 2 Nights",
    cost: "₹5,500 ($66)",
    seatsAvailable: 4,
    seatsTotal: 25,
    registeredCount: 21,
    waitingListCount: 2,
    date: "2026-06-26 to 2026-06-28",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Will fallback/work or generate
    description: "Experience the magic of the golden sand dunes of Rajasthan. Includes camel rides, overnight desert camp, traditional Rajasthani folk dances, and visits to the historical Jaisalmer Fort and Kuldhara haunted village.",
    schedule: [
      { day: "Day 1", detail: "Departure from JECRC campus at 9 PM (Overnight travel by AC Sleeper Bus)." },
      { day: "Day 2", detail: "Arrival, hotel check-in. Explore Jaisalmer Fort and Gadisar Lake. Head to Sam Dunes for camel safari, sunset view, and traditional musical night." },
      { day: "Day 3", detail: "Sunrise dune walk. Visit Kuldhara Haunted Village. Departure back to Jaipur in the evening." }
    ],
    meetingPoint: "Main Gate, JECRC University Campus",
    packingChecklist: [
      "Lightweight cotton clothes (highly recommended)",
      "Sunglasses and sunscreen",
      "Hat or scarf for sun protection",
      "Camera & powerbank",
      "Personal medications"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "trip-2",
    destination: "Udaipur Lakes Tour",
    duration: "2 Days, 2 Nights",
    cost: "₹4,800 ($58)",
    seatsAvailable: 8,
    seatsTotal: 20,
    registeredCount: 12,
    waitingListCount: 0,
    date: "2026-07-10 to 2026-07-12",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    description: "Explore the 'Venice of the East'. Udaipur is famous for its history, culture, scenic locations and Rajput-era palaces. We'll enjoy scenic boat rides and tour the heritage forts.",
    schedule: [
      { day: "Day 1", detail: "Overnight journey by train. Reach Udaipur early morning, check-in to lake-view hostel. Tour the massive City Palace and take a boat ride on Lake Pichola." },
      { day: "Day 2", detail: "Visit Monsoon Palace, Sajjangarh for panoramic views. Explore Saheliyon-ki-Bari gardens. Journey back to Jaipur." }
    ],
    meetingPoint: "Jaipur Junction Railway Station, Platform 1",
    packingChecklist: [
      "Camera",
      "Comfortable walking shoes",
      "Smart-casual clothing for palace visits",
      "Water bottle"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80"
    ]
  }
];

export const events = [
  {
    id: "event-1",
    title: "Cultural Exchange & Food Fest",
    coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    date: "2026-06-22",
    time: "6:00 PM - 9:00 PM",
    venue: "JECRC Auditorium Ground",
    category: "cultural",
    description: "An evening dedicated to global culture. Share your country's traditional dishes, music, and traditions. Local students will present classical and Rajasthani folk dances, and setting up food stalls.",
    organizer: "IAESTE JECRC Local Committee",
    attendees: ["Sophia", "Markus", "Aarav", "Elena", "Dev", "Priya"]
  },
  {
    id: "event-2",
    title: "Jaipur Heritage Photo Walk",
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    date: "2026-06-18",
    time: "7:00 AM - 11:00 AM",
    venue: "Hawa Mahal (Pink City)",
    category: "social",
    description: "A photogenic morning walk through the historical lanes of the Pink City. Capture the morning sunlight lighting up the Hawa Mahal, explore spice markets, and sip local lassi at Lassiwala.",
    organizer: "JECRC Photography Club",
    attendees: ["Sophia", "Elena", "Aarav", "Tushar"]
  }
];

export const announcements = [
  {
    id: "announce-1",
    title: "Urgent: FRRO Registration Documents Needed",
    message: "All international interns who arrived this week must submit their visa page copy, photo, and host agreement copy to the IAESTE Office by tomorrow 2 PM to initiate FRRO local authority registration.",
    category: "Urgent",
    date: "2026-06-15",
    pinned: true,
    author: "Prof. Rajesh Gupta (Coordinator)"
  },
  {
    id: "announce-2",
    title: "Upcoming Academic Seminar Guidelines",
    message: "A quick reminder that you are requested to present a brief 5-slide research plan for your internship projects during the weekly seminar on Friday morning. Please coordinate with your faculty supervisors.",
    category: "Academic",
    date: "2026-06-14",
    pinned: false,
    author: "Academic Coordinator"
  },
  {
    id: "announce-3",
    title: "Logistics: Hostels Mess Timing Updates",
    message: "The International Hostel Mess will operate on revised summer timings: Breakfast (7:30 AM - 9:00 AM), Lunch (12:30 PM - 2:00 PM), and Dinner (7:30 PM - 9:30 PM). Please adhere to these timings.",
    category: "Logistics",
    date: "2026-06-12",
    pinned: false,
    author: "Hostel Warden"
  }
];

export const documents = [
  {
    id: "doc-1",
    name: "IAESTE Offer Letter",
    category: "Offer Letter",
    date: "2026-04-15",
    size: "420 KB",
    previewUrl: "Offer Letter Content: Official IAESTE exchange confirmation, naming JECRC University as Host, duration 12 Weeks, stipend ₹10,000/month."
  },
  {
    id: "doc-2",
    name: "Indian Visa Copy",
    category: "Visa Information",
    date: "2026-05-10",
    size: "980 KB",
    previewUrl: "Visa Document Copy: Sophia Müller, Student Visa, Multiple Entry, Valid for 180 Days. Registered local sponsor: JECRC University, Jaipur."
  },
  {
    id: "doc-3",
    name: "Travel Health Insurance Certificate",
    category: "Insurance",
    date: "2026-05-20",
    size: "1.5 MB",
    previewUrl: "Insurance Confirmation: Allianz Travel Global, Sophia Müller. Medical coverage, repatriation, emergency dental, liability limit €1,000,000."
  },
  {
    id: "doc-4",
    name: "JU Host Acceptance Certificate",
    category: "Internship Letter",
    date: "2026-06-02",
    size: "280 KB",
    previewUrl: "Host Acceptance: JECRC University, signed by Registrar. Welcoming Ms. Sophia Müller under CSE department for research training starting June 1, 2026."
  }
];

export const buddy = {
  name: "Aarav Sharma",
  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  department: "B.Tech Computer Science (3rd Year)",
  phone: "+91 98765 43210",
  email: "aarav.sharma@jecrc.edu.in",
  languages: ["English", "Hindi", "Rajasthani"],
  interests: ["Photography", "Web Dev", "Cricket", "Jaipur Street Food"],
  availability: "Weekdays (after 4 PM), Weekends (Full day)"
};

export const calendarEvents = [
  { id: "1", title: "Arrival & Welcome", start: "2026-06-01", className: "bg-blue-500 border-blue-500 text-white" },
  { id: "2", title: "IoT Calibration Deadline", start: "2026-06-20", className: "bg-red-500 border-red-500 text-white" },
  { id: "3", title: "Jaisalmer Excursion", start: "2026-06-26", end: "2026-06-29", className: "bg-green-500 border-green-500 text-white" },
  { id: "4", title: "Cultural Food Fest", start: "2026-06-22", className: "bg-blue-500 border-blue-500 text-white" },
  { id: "5", title: "Indian Independence Day (Holiday)", start: "2026-08-15", className: "bg-orange-500 border-orange-500 text-white" },
  { id: "6", title: "Midterm Evaluation Seminars", start: "2026-07-08", className: "bg-blue-500 border-blue-500 text-white" }
];

export const accommodation = {
  hostelName: "JECRC International Hostel Block A",
  roomNumber: "304 (Double Occupancy)",
  checkInDate: "2026-06-01",
  checkOutDate: "2026-08-25",
  wifiSsid: "JU_International_Guest",
  wifiPass: "WelcomeJU2026!",
  messTimings: {
    breakfast: "7:30 AM - 9:00 AM",
    lunch: "12:30 PM - 2:00 PM",
    dinner: "7:30 PM - 9:30 PM"
  },
  laundryDays: "Tuesdays & Saturdays (Drop at Basement by 9 AM)",
  rules: [
    "Curfew time is 10:00 PM for all international residents.",
    "Please switch off ACs and lights when leaving the room.",
    "No outsiders allowed inside rooms without Warden's approval.",
    "Report maintenance issues through the support tickets system."
  ],
  tickets: [
    { id: "tick-101", category: "WiFi", title: "Frequent disconnection in room 304", status: "Resolved", date: "2026-06-03" },
    { id: "tick-102", category: "Cleaning", title: "Room dust cleaning request", status: "Open", date: "2026-06-14" }
  ]
};

export const facultyUsers = [
  {
    id: "fac-1",
    name: "Dr. Michael Schneider",
    email: "faculty@iaeste.org",
    role: "faculty",
    department: "Computer Science & Engineering",
    designation: "Professor & Lab Director",
    avatarUrl: "",
    assignedInternsCount: 3,
    pendingReviewsCount: 2,
    upcomingMeetingsCount: 2,
    completionRate: 72,
  }
];

export const adminUsers = [
  {
    id: "adm-1",
    name: "IAESTE Coordinator",
    email: "admin@iaeste.org",
    role: "admin",
    department: "International Relations Cell",
    designation: "Chief Administrative Officer",
    avatarUrl: ""
  }
];

export const internDirectory = [
  {
    id: "int-1",
    name: "Sophia Müller",
    email: "sophia.mueller@tum.de",
    country: "Germany",
    university: "Technical University of Munich (TUM)",
    department: "Computer Science & Engineering",
    projectTitle: "Smart Water Quality Monitoring using IoT and Machine Learning",
    progress: 75,
    status: "Internship Started",
    arrivalDate: "2026-06-01",
    departureDate: "2026-08-24",
    supervisor: "Dr. Alok Kumar",
    gender: "Female",
    phone: "+49 176 12345678",
    emergencyContact: {
      name: "Hans Müller",
      relation: "Father",
      phone: "+49 176 87654321"
    },
    accommodation: {
      hostelName: "JECRC International Hostel Block A",
      roomNo: "304",
      status: "Occupied"
    },
    attendance: 94,
    logbooksCompleted: 2,
    tasksCompleted: 12,
    reviewsReceived: 4
  },
  {
    id: "int-2",
    name: "Markus Fischer",
    email: "markus.fischer@ethz.ch",
    country: "Switzerland",
    university: "ETH Zurich",
    department: "Computer Science & Engineering",
    projectTitle: "Decentralized Smart Grid Optimizations",
    progress: 88,
    status: "Mid-Term Review",
    arrivalDate: "2026-05-15",
    departureDate: "2026-08-10",
    supervisor: "Dr. Michael Schneider",
    gender: "Male",
    phone: "+41 79 123 45 67",
    emergencyContact: {
      name: "Lena Fischer",
      relation: "Mother",
      phone: "+41 79 765 43 21"
    },
    accommodation: {
      hostelName: "JECRC International Hostel Block A",
      roomNo: "306",
      status: "Occupied"
    },
    attendance: 98,
    logbooksCompleted: 4,
    tasksCompleted: 15,
    reviewsReceived: 5
  },
  {
    id: "int-3",
    name: "Elena Rostova",
    email: "elena.rostova@spbu.ru",
    country: "Russia",
    university: "Saint Petersburg State University",
    department: "AI & ML",
    projectTitle: "AI Vision for Heritage Preservation Scans",
    progress: 45,
    status: "Internship Started",
    arrivalDate: "2026-06-10",
    departureDate: "2026-09-05",
    supervisor: "Dr. Michael Schneider",
    gender: "Female",
    phone: "+7 911 123-45-67",
    emergencyContact: {
      name: "Petr Rostov",
      relation: "Father",
      phone: "+7 911 765-43-21"
    },
    accommodation: {
      hostelName: "JECRC International Hostel Block B",
      roomNo: "102",
      status: "Occupied"
    },
    attendance: 90,
    logbooksCompleted: 1,
    tasksCompleted: 5,
    reviewsReceived: 2
  },
  {
    id: "int-4",
    name: "Lucas Dupont",
    email: "lucas.dupont@polytechnique.edu",
    country: "France",
    university: "École Polytechnique",
    department: "Mechanical",
    projectTitle: "Aerodynamic Testing for Solar Racing Prototypes",
    progress: 10,
    status: "Arrival",
    arrivalDate: "2026-06-18",
    departureDate: "2026-09-12",
    supervisor: "Dr. Rajesh Gupta",
    gender: "Male",
    phone: "+33 6 1234 5678",
    emergencyContact: {
      name: "Marie Dupont",
      relation: "Mother",
      phone: "+33 6 8765 4321"
    },
    accommodation: {
      hostelName: "JECRC International Hostel Block A",
      roomNo: "210",
      status: "Occupied"
    },
    attendance: 100,
    logbooksCompleted: 0,
    tasksCompleted: 1,
    reviewsReceived: 0
  },
  {
    id: "int-5",
    name: "Anna Nowak",
    email: "anna.nowak@pw.edu.pl",
    country: "Poland",
    university: "Warsaw University of Technology",
    department: "AI & ML",
    projectTitle: "Natural Language Chatbots for Student Admissions",
    progress: 95,
    status: "Final Review",
    arrivalDate: "2026-05-01",
    departureDate: "2026-07-25",
    supervisor: "Dr. Michael Schneider",
    gender: "Female",
    phone: "+48 22 123 45 67",
    emergencyContact: {
      name: "Jan Nowak",
      relation: "Father",
      phone: "+48 22 765 43 21"
    },
    accommodation: {
      hostelName: "JECRC International Hostel Block B",
      roomNo: "204",
      status: "Occupied"
    },
    attendance: 96,
    logbooksCompleted: 6,
    tasksCompleted: 18,
    reviewsReceived: 7
  }
];

export const projects = [
  {
    id: "proj-1",
    title: "Smart Water Quality Monitoring",
    student: "Sophia Müller",
    status: "In Progress",
    tasks: [
      { id: "pt-1", title: "ESP32 calibration", status: "completed", priority: "high", deadline: "2026-06-20", comments: [] },
      { id: "pt-2", title: "Literature submission", status: "completed", priority: "medium", deadline: "2026-06-10", comments: [] },
      { id: "pt-3", title: "Midterm report drafting", status: "in_progress", priority: "high", deadline: "2026-07-05", comments: [] },
      { id: "pt-4", title: "SQL Schema config", status: "todo", priority: "low", deadline: "2026-07-15", comments: [] }
    ]
  },
  {
    id: "proj-2",
    title: "Decentralized Smart Grid Optimizations",
    student: "Markus Fischer",
    status: "In Progress",
    tasks: [
      { id: "pt-5", title: "Smart meter telemetry client", status: "completed", priority: "high", deadline: "2026-06-15", comments: [] },
      { id: "pt-6", title: "Load forecasting algorithm implementation", status: "in_progress", priority: "high", deadline: "2026-07-01", comments: [] },
      { id: "pt-7", title: "Docker orchestration config", status: "under_review", priority: "medium", deadline: "2026-06-25", comments: [] }
    ]
  },
  {
    id: "proj-3",
    title: "AI Vision for Heritage Scans",
    student: "Elena Rostova",
    status: "In Progress",
    tasks: [
      { id: "pt-8", title: "PyTorch model training scripts", status: "in_progress", priority: "high", deadline: "2026-06-30", comments: [] },
      { id: "pt-9", title: "Prepare baseline annotations", status: "completed", priority: "high", deadline: "2026-06-18", comments: [] }
    ]
  }
];

export const logbookReviews = [
  {
    id: "rev-1",
    student: "Sophia Müller",
    week: 2,
    submittedOn: "2026-06-12",
    status: "Pending",
    workDone: "Configured ESP32 and calibrated the turbidity sensors under various light levels. Structured SQL database tables for reading logs.",
    challenges: "Intermittent WiFi connectivity in the lab causing data packet loss.",
    learnings: "Learned standard calibration methodologies for water sensors and Python database scripts.",
    goals: "Establish a smooth wireless stream to the dashboard prototype.",
    history: [
      { date: "2026-06-05", action: "Approved", reviewer: "Dr. Alok Kumar", comment: "Excellent progress for the first week!" }
    ]
  },
  {
    id: "rev-2",
    student: "Elena Rostova",
    week: 1,
    submittedOn: "2026-06-16",
    status: "Pending",
    workDone: "Initial setup of Jupyter notebook instances, downloaded architectural photography dataset.",
    challenges: "Downloading high-resolution photos took time due to local bandwidth throttling.",
    learnings: "Learned dataset cleanup and filtration routines in Pandas.",
    goals: "Train a simple CNN classifier over the PINK City dataset.",
    history: []
  },
  {
    id: "rev-3",
    student: "Markus Fischer",
    week: 3,
    submittedOn: "2026-06-14",
    status: "Approved",
    workDone: "Coded standard grid optimization mathematical models in Python and simulated in MATLAB.",
    challenges: "MATLAB licensing issues on JECRC computers resolved with guest key.",
    learnings: "Deep understanding of energy dispatch constraint calculations.",
    goals: "Begin smart contract solidity code outline.",
    history: [
      { date: "2026-06-15", action: "Approved", reviewer: "Dr. Michael Schneider", comment: "Very comprehensive simulation data. Keep it up!" }
    ]
  }
];

export const meetings = [
  {
    id: "meet-1",
    title: "Weekly Project Sync",
    student: "Sophia Müller",
    date: "2026-06-21",
    time: "11:00 AM - 11:30 AM",
    status: "Upcoming",
    gmeetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Review ESP32 calibration progress and SQL database schemas.",
    actionItems: [
      "Fix sensor packet loss code",
      "Plot baseline graphs in Jupiter"
    ],
    studentFeedback: "Need Dr. Alok's help with standard curves."
  },
  {
    id: "meet-2",
    title: "Midterm Setup Checkup",
    student: "Elena Rostova",
    date: "2026-06-23",
    time: "2:00 PM - 2:45 PM",
    status: "Upcoming",
    gmeetLink: "https://meet.google.com/xyz-pqrs-tuv",
    notes: "Verify GPU server allocation limits and review dataset cleanup.",
    actionItems: [
      "Verify access to the GPU cluster",
      "Complete the initial dataset stats"
    ],
    studentFeedback: "None logged yet"
  },
  {
    id: "meet-3",
    title: "Solidry Code Review",
    student: "Markus Fischer",
    date: "2026-06-19",
    time: "4:00 PM - 5:00 PM",
    status: "Completed",
    gmeetLink: "https://meet.google.com/qwe-rtyu-iop",
    notes: "Reviewed smart contract solidity structures. Gas optimizations were highlighted.",
    actionItems: [
      "Refactor loops to avoid excessive gas burn",
      "Draft unit testing assertions"
    ],
    studentFeedback: "The feedback was extremely helpful to understand solidity optimization limits."
  }
];

export const accommodations = [
  { id: "acc-1", hostelName: "JECRC International Hostel Block A", roomNo: "304", capacity: 2, occupancy: 2, status: "Occupied" },
  { id: "acc-2", hostelName: "JECRC International Hostel Block A", roomNo: "306", capacity: 2, occupancy: 1, status: "Occupied" },
  { id: "acc-3", hostelName: "JECRC International Hostel Block A", roomNo: "210", capacity: 2, occupancy: 2, status: "Occupied" },
  { id: "acc-4", hostelName: "JECRC International Hostel Block B", roomNo: "102", capacity: 1, occupancy: 1, status: "Occupied" },
  { id: "acc-5", hostelName: "JECRC International Hostel Block B", roomNo: "204", capacity: 1, occupancy: 1, status: "Occupied" },
  { id: "acc-6", hostelName: "JECRC Guest House Suite 1", roomNo: "101", capacity: 2, occupancy: 0, status: "Available" },
  { id: "acc-7", hostelName: "JECRC International Hostel Block A", roomNo: "312", capacity: 2, occupancy: 0, status: "Maintenance" }
];

export const travelRecords = [
  { id: "tr-1", student: "Sophia Müller", flightNo: "LH-760", arrivalDate: "2026-06-01", arrivalTime: "10:30 AM", pickupStatus: "Completed", transportAssigned: "Cab DL-1C-1234", returnFlight: "LH-761", departureDate: "2026-08-25" },
  { id: "tr-2", student: "Markus Fischer", flightNo: "LX-146", arrivalDate: "2026-05-15", arrivalTime: "08:15 AM", pickupStatus: "Completed", transportAssigned: "JU Bus Route 4", returnFlight: "LX-147", departureDate: "2026-08-11" },
  { id: "tr-3", student: "Elena Rostova", flightNo: "SU-232", arrivalDate: "2026-06-10", arrivalTime: "11:45 PM", pickupStatus: "Completed", transportAssigned: "Cab RJ-14-3452", returnFlight: "SU-233", departureDate: "2026-09-06" },
  { id: "tr-4", student: "Lucas Dupont", flightNo: "AF-226", arrivalDate: "2026-06-18", arrivalTime: "06:20 AM", pickupStatus: "Pending", transportAssigned: "Cab RJ-14-9988", returnFlight: "AF-227", departureDate: "2026-09-13" }
];

export const incidentReports = [
  { id: "inc-1", student: "Sophia Müller", title: "Heat Exhaustion", description: "Felt dizzy during the photo walk under high temperature.", status: "Resolved", date: "2026-06-18", resolution: "Provided ORS and moved to air-conditioned lounge. Consulted university medical nurse. Discharged in 1 hour." },
  { id: "inc-2", student: "Elena Rostova", title: "Lost Hostel Guest Keycard", description: "Keycard dropped somewhere inside the canteen area.", status: "Open", date: "2026-06-19", resolution: "Temporary guest access granted by warden. Main gate requested to log entry manually." }
];

export const auditLogs = [
  { id: "aud-1", user: "IAESTE Coordinator", action: "User Registration Approval", module: "Users", timestamp: "2026-06-18 10:15:30" },
  { id: "aud-2", user: "Dr. Michael Schneider", action: "Approve Logbook Week 3", module: "Logbooks", timestamp: "2026-06-15 02:44:12" },
  { id: "aud-3", user: "IAESTE Coordinator", action: "Create Announcement: FRRO Registration", module: "Announcements", timestamp: "2026-06-15 09:00:00" },
  { id: "aud-4", user: "Sophia Müller", action: "Submit Logbook Week 2", module: "Logbooks", timestamp: "2026-06-12 18:22:04" },
  { id: "aud-5", user: "Dr. Alok Kumar", action: "Create Task: ESP32 calibration", module: "Projects", timestamp: "2026-06-08 14:10:00" }
];

export const analyticsData = {
  countryDistribution: [
    { name: "Germany", value: 3 },
    { name: "France", value: 2 },
    { name: "Spain", value: 1 },
    { name: "Switzerland", value: 1 },
    { name: "Russia", value: 1 },
    { name: "Poland", value: 1 }
  ],
  departmentDistribution: [
    { name: "CSE", interns: 5, faculty: 3 },
    { name: "AI & ML", interns: 3, faculty: 2 },
    { name: "Mechanical", interns: 2, faculty: 1 },
    { name: "Electronics", interns: 1, faculty: 1 }
  ],
  internshipStatus: [
    { stage: "Arrival", count: 2 },
    { stage: "Started", count: 4 },
    { stage: "Mid-Term", count: 2 },
    { stage: "Final Review", count: 1 },
    { stage: "Completed", count: 3 }
  ],
  monthlyParticipation: [
    { month: "Jan", active: 2 },
    { month: "Feb", active: 2 },
    { month: "Mar", active: 3 },
    { month: "Apr", active: 5 },
    { month: "May", active: 8 },
    { month: "Jun", active: 10 }
  ]
};

