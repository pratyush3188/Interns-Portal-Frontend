import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  FileText, Upload, Download, Eye, Trash2, Plus, Filter, X, Search, BookOpen
} from "lucide-react";

export const DocumentCenter = () => {
  const [docs, setDocs] = useState([]);
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    targetIntern: ""
  });
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [docRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/documents", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers })
      ]);
      
      if (docRes.ok) setDocs(await docRes.json());
      if (userRes.ok) {
        const users = await userRes.json();
        setInterns(users.interns || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logic
  const filtered = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.targetIntern?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl || !formData.targetIntern) {
      return toast.error("Title, File URL, and Target Intern are required!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/admin/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Document uploaded successfully!");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to upload document");
      }
    } catch (err) { toast.error("Error connecting to server"); }
  };

  const handleArchive = (id) => {
    setDocs(docs.filter(d => d.id !== id));
    toast.success("Document successfully moved to archives.");
  };

  const categories = [
    "Offer Letter",
    "Visa Information",
    "Insurance",
    "Internship Letter",
    "Certificates"
  ];

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Global Document Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Store, preview, and download passport scans, visa information sheets, and health insurance contracts.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Upload className="w-4 h-4 mr-1.5" /> Upload Document
        </Button>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl shadow-card flex items-center text-xs font-semibold">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search documents by title or intern name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {filtered.map((doc) => (
          <Card key={doc._id} hoverEffect className="p-5 border border-border flex items-center justify-between gap-6">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-text-primary truncate max-w-[200px] sm:max-w-xs">{doc.title}</h4>
                <p className="text-[9px] text-text-secondary font-black uppercase mt-0.5">
                  Target: {doc.targetIntern?.name || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button onClick={() => setPreviewDoc(doc)} className="p-2 rounded-lg hover:bg-slate-100 text-blue-500 cursor-pointer" title="Preview"><Eye className="w-4.5 h-4.5" /></button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 font-bold text-text-secondary border-2 border-dashed border-border rounded-2xl bg-card">
            No documents matching the criteria found.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-black text-text-primary">Preview Document</h3>
                  <p className="text-[9px] text-text-secondary font-black uppercase">{previewDoc.title}</p>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4 leading-relaxed">
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border text-[11px] font-medium text-text-secondary italic">
                  URL/Path: "{previewDoc.fileUrl}"
                </div>
                <div className="flex justify-between text-[10px] text-text-secondary font-bold">
                  <span>Description: {previewDoc.description || "N/A"}</span>
                  <span>Date: {new Date(previewDoc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border space-x-2">
                <Button onClick={() => setPreviewDoc(null)} variant="secondary" size="sm">
                  Close Preview
                </Button>
                <Button onClick={() => toast.success(`Simulating download for: ${previewDoc.title}`)} size="sm" className="bg-[#04376C] text-white">
                  Download File
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Upload Intern Document</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Select Target Intern</label>
                <select
                  required
                  value={formData.targetIntern}
                  onChange={e => setFormData({...formData, targetIntern: e.target.value})}
                  className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="">Select Intern...</option>
                  {interns.map(i => <option key={i._id} value={i._id}>{i.name} ({i.email})</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Document Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
              </div>

              {/* Upload Mode Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase">Upload Source</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, uploadMode: "url"})}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      (formData.uploadMode || "url") === "url"
                        ? "bg-[#04376C] text-white border-[#04376C] dark:bg-[#1E6FD9] dark:border-[#1E6FD9]"
                        : "bg-slate-50 dark:bg-slate-800 text-text-secondary border-border hover:border-slate-400"
                    }`}
                  >
                    🔗 Paste URL / Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, uploadMode: "file"})}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      formData.uploadMode === "file"
                        ? "bg-[#04376C] text-white border-[#04376C] dark:bg-[#1E6FD9] dark:border-[#1E6FD9]"
                        : "bg-slate-50 dark:bg-slate-800 text-text-secondary border-border hover:border-slate-400"
                    }`}
                  >
                    💻 Upload from Computer
                  </button>
                </div>
              </div>

              {(formData.uploadMode || "url") === "url" ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">File Link / URL</label>
                  <input type="text" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://drive.google.com/... or /uploads/..." className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Select File from Computer</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error("File must be smaller than 10 MB");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData(prev => ({
                            ...prev,
                            fileUrl: reader.result,
                            selectedFileName: file.name
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#04376C] file:text-white dark:file:bg-[#1E6FD9] cursor-pointer"
                    />
                    {formData.selectedFileName && (
                      <p className="text-[10px] font-bold text-emerald-600 mt-1.5 flex items-center space-x-1">
                        <span>✓</span>
                        <span>Selected: {formData.selectedFileName}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Upload Document</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default DocumentCenter;
