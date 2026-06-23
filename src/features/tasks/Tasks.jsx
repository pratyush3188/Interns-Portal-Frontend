import React, { useState } from "react";
import { tasks as initialTasks } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  Kanban,
  Paperclip,
  MessageSquare,
  Clock,
  ArrowRight,
  Plus,
  Send,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Tasks = () => {
  const [tasksList, setTasksList] = useState([]);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "table"
  const [selectedTask, setSelectedTask] = useState(null); // Task object for detail drawer
  const [newComment, setNewComment] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTasksList(data.map(d => ({ ...d, id: d._id })));
        } else {
          setTasksList([]);
        }
      }
    } catch (err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  // Kanban Columns
  const columns = [
    { id: "todo", name: "To Do" },
    { id: "in_progress", name: "In Progress" },
    { id: "review", name: "Review" },
    { id: "completed", name: "Completed" }
  ];

  // Move task to another column
  const moveTask = async (taskId, targetStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/intern/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        fetchTasks();
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({ ...selectedTask, status: targetStatus });
        }
        toast.success("Task status updated!");
      }
    } catch (err) { toast.error("Error updating status"); }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const updatedComments = [
        ...(selectedTask.comments || []),
        { author: "intern", text: newComment, createdAt: new Date() }
      ];
      const res = await fetch(`http://localhost:5000/api/intern/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ comments: updatedComments })
      });
      if (res.ok) {
        fetchTasks();
        setSelectedTask({ ...selectedTask, comments: updatedComments });
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (err) { toast.error("Error adding comment"); }
  };

  // Status indicators colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-200/50";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-200/50";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-200/50";
    }
  };

  return (
    <div className="space-y-6 text-foreground relative min-h-[calc(100vh-120px)] pb-12">
      <Toaster position="top-right" />
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Internship Tasks</h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage your daily tasks, literature studies, and research dashboard logs.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 bg-card border border-border p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "kanban"
                ? "bg-[#04376C] text-white dark:bg-[#1E6FD9]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-[#04376C] text-white dark:bg-[#1E6FD9]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === "kanban" ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start"
          >
            {columns.map((col) => {
              const colTasks = tasksList.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="bg-card/50 dark:bg-slate-900/40 border border-border rounded-2xl p-4 space-y-4 min-h-[500px]">
                  <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                      {col.name}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-text-secondary px-2 py-0.5 rounded-full font-black">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layoutId={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-card border border-border rounded-xl p-4 hover-lift cursor-pointer space-y-3 shadow-card"
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] text-text-secondary flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Deadline"}</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-text-primary leading-snug">
                          {task.title}
                        </h4>
                        
                        {/* Progress line */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-text-secondary font-bold">
                            <span>Progress</span>
                            <span>{task.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#04376C] dark:bg-[#1E6FD9] h-full" style={{ width: `${task.progress || 0}%` }}></div>
                          </div>
                        </div>

                        {/* Footer counts */}
                        <div className="flex justify-between items-center pt-2 border-t border-border text-text-secondary text-[10px] font-semibold">
                          <div className="flex items-center space-x-3">
                            {task.attachments && task.attachments.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <Paperclip className="w-3 h-3" />
                                <span>{task.attachments.length}</span>
                              </span>
                            )}
                            {task.comments && task.comments.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{task.comments.length}</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Fast move trigger buttons */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {col.id !== "completed" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextIdx = columns.findIndex((c) => c.id === col.id) + 1;
                                  moveTask(task.id, columns[nextIdx].id);
                                }}
                                className="p-1 rounded bg-[#04376C]/10 text-[#04376C] hover:bg-[#04376C] hover:text-white"
                                title="Move Forward"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-center py-8 text-[11px] text-text-secondary border-2 border-dashed border-border rounded-xl">
                        No tasks in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tasksList.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-bold text-text-primary max-w-sm truncate">
                        {task.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary font-semibold">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 w-32">
                          <span className="font-bold shrink-0">{task.progress}%</span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#04376C] dark:bg-[#1E6FD9] h-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-950/20"
                            : task.status === "review"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800/40"
                        }`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Side Drawer Component */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-lg h-full bg-card border-l border-border flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                  <span className="text-xs font-bold text-text-secondary uppercase">
                    Task Details
                  </span>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-text-primary leading-snug">
                      {selectedTask.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed mt-2">
                      {selectedTask.description}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border text-xs">
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">Priority</p>
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border mt-1 ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">Deadline</p>
                      <span className="font-bold text-text-primary mt-1 inline-block">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : "None"}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">Status State</p>
                      <select
                        value={selectedTask.status}
                        onChange={(e) => moveTask(selectedTask.id, e.target.value)}
                        className="mt-1 bg-card border border-border rounded-lg px-2 py-1 font-bold text-text-primary outline-none focus:border-[#1E6FD9]"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">Progress slider</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedTask.progress}
                          onChange={(e) => {
                            const prog = Number(e.target.value);
                            setTasksList(tasksList.map((t) => (t.id === selectedTask.id ? { ...t, progress: prog } : t)));
                            setSelectedTask({ ...selectedTask, progress: prog });
                          }}
                          className="w-24 accent-[#04376C] dark:accent-[#1E6FD9] cursor-pointer"
                        />
                        <span className="font-bold">{selectedTask.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Attachments</h4>
                    {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedTask.attachments.map((file, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/20 border border-border rounded-xl">
                            <div className="flex items-center space-x-2 text-xs">
                              <Paperclip className="w-4 h-4 text-text-secondary" />
                              <div>
                                <p className="font-bold text-text-primary">{file.name}</p>
                                <p className="text-[10px] text-text-secondary">{file.size}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toast.success(`Simulated download for: ${file.name}`)}
                              className="text-[10px] font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-text-secondary italic">No attachments uploaded</p>
                    )}
                  </div>

                  {/* Comments Feed */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Comments Feed</h4>
                    
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                      {selectedTask.comments && selectedTask.comments.map((comment, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/30 border border-border rounded-xl p-3 space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-extrabold text-text-primary">{comment.author === "intern" ? "Me" : "Supervisor"}</span>
                            <span className="text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{comment.text}</p>
                        </div>
                      ))}
                      {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                        <p className="text-xs text-text-secondary italic">No comments yet. Write one below.</p>
                      )}
                    </div>

                    {/* New Comment Input */}
                    <form onSubmit={handleAddComment} className="flex space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a feedback or note..."
                        className="flex-1 bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-[#04376C] dark:bg-[#1E6FD9] text-white rounded-xl hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
