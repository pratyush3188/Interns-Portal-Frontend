import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  Plus, 
  X, 
  Send, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  FolderKanban,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";
import { projects as initialProjects } from "../../mocks/index";
import { useAuthStore } from "../../store/useAuthStore";

export const FacultyProjects = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Active task for slide-out drawer
  const [newComment, setNewComment] = useState("");
  
  // Task fields for creation
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskColumn, setNewTaskColumn] = useState("todo");
  const [taskTargetIntern, setTaskTargetIntern] = useState("");
  const { user } = useAuthStore();

  const fetchInternsAndTasks = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [internRes, tasksRes] = await Promise.all([
        fetch("http://localhost:5000/api/faculty/interns", { headers }),
        fetch("http://localhost:5000/api/faculty/tasks", { headers })
      ]);
      if (internRes.ok && tasksRes.ok) {
        const internsData = await internRes.json();
        const tasksData = await tasksRes.json();
        const safeInterns = Array.isArray(internsData) ? internsData : [];
        const safeTasks = Array.isArray(tasksData) ? tasksData : [];
        setInterns(safeInterns);
        setTasks(safeTasks);
        if (safeInterns.length > 0 && !selectedInternId) {
          setSelectedInternId(safeInterns[0]._id);
        }
      }
    } catch (err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchInternsAndTasks();
  }, []);

  const selectedIntern = interns.find(i => i._id === selectedInternId) || interns[0];
  const selectedTasks = tasks.filter(t => t.internId?._id === selectedInternId || t.internId === selectedInternId);

  const columns = [
    { id: "todo", name: "Not Started" },
    { id: "in_progress", name: "In Progress" },
    { id: "review", name: "Under Review" },
    { id: "completed", name: "Completed" }
  ];

  const handleSelectProject = (internId) => {
    setSelectedInternId(internId);
    setSelectedTask(null);
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/faculty/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchInternsAndTasks();
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask({ ...selectedTask, status: newStatus });
        }
        toast.success("Task status updated!");
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDeadline || !taskTargetIntern) {
      toast.error("Please provide title, deadline, and target intern.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/faculty/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: "Task automatically created via Faculty Portal.",
          status: newTaskColumn,
          priority: newTaskPriority,
          dueDate: newTaskDeadline,
          internId: taskTargetIntern
        })
      });
      if (res.ok) {
        fetchInternsAndTasks();
        setIsAddingTask(false);
        setNewTaskTitle("");
        setNewTaskDeadline("");
        setTaskTargetIntern("");
        toast.success("Task successfully assigned!");
      }
    } catch (err) { toast.error("Error creating task"); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const updatedComments = [
        ...selectedTask.comments,
        { author: "faculty", text: newComment, createdAt: new Date() }
      ];

      const res = await fetch(`http://localhost:5000/api/faculty/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ comments: updatedComments })
      });
      if (res.ok) {
        fetchInternsAndTasks();
        setSelectedTask({ ...selectedTask, comments: updatedComments });
        setNewComment("");
        toast.success("Feedback comment added!");
      }
    } catch (err) { toast.error("Error adding comment"); }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-200/50";
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-200/50";
      default: return "bg-blue-500/10 text-blue-500 border-blue-200/50";
    }
  };

  return (
    <div className="space-y-6 text-foreground pb-12 relative min-h-[calc(100vh-120px)]">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Interns Project Monitoring</h1>
          <p className="text-xs text-text-secondary mt-1">
            Assign tasks, modify milestones, and evaluate active research kanban flows across student projects.
          </p>
        </div>

        {/* Project Selector tabs */}
        <div className="flex items-center space-x-2 bg-card border border-border p-1 rounded-xl shadow-sm overflow-x-auto max-w-full">
          {interns.map((p) => (
            <button
              key={p._id}
              onClick={() => handleSelectProject(p._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedInternId === p._id 
                  ? "bg-[#04376C] text-white dark:bg-[#1E6FD9]" 
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Project Status Banner */}
      <div className="bg-[#F8FAFC] border border-border rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <FolderKanban className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-[10px] text-text-secondary font-bold uppercase">Active Project Study</p>
            <h4 className="font-extrabold text-text-primary">{selectedIntern?.projectTitle || "Research Project"}</h4>
          </div>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Button onClick={() => setIsAddingTask(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center">
            <Plus className="w-4 h-4 mr-1.5" /> Assign Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = selectedTasks.filter(t => {
            // Map our mock values to target col ids
            if (col.id === "todo") return t.status === "todo";
            if (col.id === "in_progress") return t.status === "in_progress";
            if (col.id === "review") return t.status === "review" || t.status === "under_review";
            return t.status === "completed";
          });

          return (
            <div key={col.id} className="bg-card/50 border border-border rounded-2xl p-4 space-y-4 min-h-[480px]">
              <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border shadow-sm">
                <span className="text-xs font-black text-text-primary uppercase tracking-wide">{col.name}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-text-secondary px-2 py-0.5 rounded-full font-black">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layoutId={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-card border border-border rounded-xl p-4 hover-lift cursor-pointer space-y-3 shadow-card"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[9px] text-text-secondary flex items-center space-x-1 font-semibold">
                        <Clock className="w-3 h-3 text-text-secondary" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}</span>
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-text-primary leading-snug">{task.title}</h4>

                    <div className="flex justify-between items-center pt-2 border-t border-border text-text-secondary text-[10px] font-semibold">
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-text-secondary" />
                        <span>{(task.comments || []).length} feedbacks</span>
                      </span>
                      <div className="flex items-center space-x-1">
                        {col.id !== "completed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = columns.findIndex(c => c.id === col.id) + 1;
                              handleMoveTask(task._id, columns[nextIdx].id);
                            }}
                            className="p-1 rounded bg-[#04376C]/10 text-[#04376C] hover:bg-[#04376C] hover:text-white"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {colTasks.length === 0 && (
                  <div className="text-center py-10 text-[10px] font-bold text-text-secondary border-2 border-dashed border-border rounded-xl">
                    No tasks at this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary">Assign New Task</h3>
                <button onClick={() => setIsAddingTask(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Draft mid-term review slide deck"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Deadline</label>
                    <input
                      type="date"
                      required
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Assign To Intern</label>
                    <select
                      required
                      value={taskTargetIntern}
                      onChange={(e) => setTaskTargetIntern(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    >
                      <option value="">Select an intern</option>
                      {interns.map((i) => (
                        <option key={i._id} value={i._id}>{i.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Task Stage</label>
                    <select
                      value={newTaskColumn}
                      onChange={(e) => setNewTaskColumn(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    >
                      <option value="todo">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Under Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsAddingTask(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Assign Task</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Drawer details */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-lg h-full bg-card border-l border-border flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Task Details & Supervision</span>
                    <h2 className="text-md font-bold text-text-primary mt-1">{selectedTask.title}</h2>
                  </div>
                  <button onClick={() => setSelectedTask(null)} className="p-1 rounded hover:bg-slate-100 text-text-secondary cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border text-xs">
                  <div>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Assignee</p>
                    <span className="font-bold text-text-primary mt-1 inline-block">{selectedIntern?.name}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Deadline</p>
                    <span className="font-bold text-red-500 mt-1 inline-block">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : "None"}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Priority</p>
                    <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 border rounded-md mt-1 ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Task Stage</p>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleMoveTask(selectedTask._id, e.target.value)}
                      className="mt-1 bg-card border border-border rounded-lg px-2 py-1 text-xs text-text-primary font-bold outline-none"
                    >
                      <option value="todo">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Under Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* File attachments */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
                    <Paperclip className="w-4 h-4" />
                    <span>Uploaded Files</span>
                  </h4>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-border border-dashed text-center">
                    <p className="text-[11px] text-text-secondary">Drag files here or click to simulate upload</p>
                    <input
                      type="file"
                      onChange={() => toast.success("Simulated document upload successfully!")}
                      className="hidden"
                      id="drawer-file"
                    />
                    <label htmlFor="drawer-file" className="inline-block mt-2 px-3 py-1 bg-white border border-border text-[10px] font-bold text-text-primary rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      Choose Document File
                    </label>
                  </div>
                </div>

                {/* Feed Comments */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Evaluation Feedback Thread</span>
                  </h4>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {selectedTask.comments && selectedTask.comments.map((comment, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900/20 border border-border p-3 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-text-primary font-black">{comment.author === "faculty" ? "Supervisor" : selectedIntern?.name}</span>
                          <span className="text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed text-[11px]">{comment.text}</p>
                      </div>
                    ))}
                    {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                      <p className="text-[11px] text-text-secondary italic text-center py-2">No feedbacks posted. Start the conversation below.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type a feedback remark or instructions..."
                      className="flex-1 bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600"
                    />
                    <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>

              <div className="pt-6 border-t border-border">
                <Button onClick={() => setSelectedTask(null)} className="w-full font-bold text-xs uppercase">
                  Close Task Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
