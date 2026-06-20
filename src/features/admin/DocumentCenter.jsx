import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Filter, 
  X,
  Search,
  BookOpen
} from "lucide-react";
import { documents as initialDocs } from "../../mocks/index";

export const DocumentCenter = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  // Filter logic
  const filtered = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !activeCategory || doc.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleUpload = () => {
    toast.success("Simulated document upload successfully!");
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

        <Button onClick={handleUpload} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Upload className="w-4 h-4 mr-1.5" /> Upload Document
        </Button>
      </div>

      {/* Search & Category Tabs */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-card grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shrink-0 cursor-pointer ${
              activeCategory === "" 
                ? "bg-[#04376C] text-white" 
                : "bg-slate-100 hover:bg-slate-200 text-text-secondary"
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shrink-0 cursor-pointer ${
                activeCategory === cat 
                  ? "bg-[#04376C] text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {filtered.map((doc) => (
          <Card key={doc.id} hoverEffect className="p-5 border border-border flex items-center justify-between gap-6">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-text-primary truncate max-w-[200px] sm:max-w-xs">{doc.name}</h4>
                <p className="text-[9px] text-text-secondary font-black uppercase mt-0.5">{doc.category} • {doc.size}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button onClick={() => setPreviewDoc(doc)} className="p-2 rounded-lg hover:bg-slate-100 text-blue-500 cursor-pointer" title="Preview"><Eye className="w-4.5 h-4.5" /></button>
              <button onClick={() => toast.success(`Simulating download for: ${doc.name}`)} className="p-2 rounded-lg hover:bg-slate-100 text-emerald-600 cursor-pointer" title="Download"><Download className="w-4.5 h-4.5" /></button>
              <button onClick={() => handleArchive(doc.id)} className="p-2 rounded-lg hover:bg-slate-100 text-red-500 cursor-pointer" title="Archive"><Trash2 className="w-4.5 h-4.5" /></button>
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
                  <p className="text-[9px] text-text-secondary font-black uppercase">{previewDoc.name}</p>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4 leading-relaxed">
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border text-[11px] font-medium text-text-secondary italic">
                  "{previewDoc.previewUrl}"
                </div>
                <div className="flex justify-between text-[10px] text-text-secondary font-bold">
                  <span>File size: {previewDoc.size}</span>
                  <span>Date: {previewDoc.date}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border space-x-2">
                <Button onClick={() => setPreviewDoc(null)} variant="secondary" size="sm">
                  Close Preview
                </Button>
                <Button onClick={() => toast.success(`Simulating download for: ${previewDoc.name}`)} size="sm" className="bg-[#04376C] text-white">
                  Download File
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default DocumentCenter;
