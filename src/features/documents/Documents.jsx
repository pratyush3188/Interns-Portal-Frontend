import { useState, useEffect } from "react";
import { documents as initialDocuments } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder, FileText, Download, Eye, X, CheckCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Documents = () => {
  const [docsList, setDocsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewDoc, setPreviewDoc] = useState(null); // Selected document for PDF preview modal
  const [loadingPreview, setLoadingPreview] = useState(false);

  const categories = ["All", "Offer Letter", "Visa Information", "Insurance", "Internship Letter"];

  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/documents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        const safeData = Array.isArray(data) ? data : [];
        // Always show whatever DB returns (even empty); don't use mock data
        setDocsList(safeData);
      } else {
        setDocsList([]);
      }
    } catch (err) { 
      console.error(err);
      setDocsList([]);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = docsList.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handlePreview = (doc) => {
    setLoadingPreview(true);
    setPreviewDoc(doc);
    // Simulate loading a heavy PDF file
    setTimeout(() => {
      setLoadingPreview(false);
    }, 800);
  };

  const handleDownload = (docName) => {
    toast.success(`Downloaded: ${docName}`);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Internship Documents Vault</h1>
        <p className="text-xs text-text-secondary mt-1">
          Access official letters, visa details, university agreements, and certificates issued during your exchange program.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card border border-border p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-[#1E6FD9]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document name..."
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#1E6FD9] focus:bg-card text-text-primary placeholder-text-secondary"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#04376C] text-white dark:bg-[#1E6FD9]"
                  : "bg-slate-100 dark:bg-slate-800 text-text-secondary hover:text-text-primary border border-transparent hover:border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDocs.map((doc, idx) => (
          <motion.div
            key={doc._id || idx}
            layoutId={`doc-card-${doc._id || idx}`}
            className="bg-card border border-border rounded-2xl p-5 shadow-card flex flex-col justify-between h-48 hover-lift"
          >
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary line-clamp-2 leading-snug">
                  {doc.title}
                </h4>
                <p className="text-[10px] text-text-secondary mt-1 uppercase font-semibold">
                  {doc.category || "Official Document"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border mt-4 text-[10px] text-text-secondary font-semibold shrink-0">
              <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePreview(doc)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary cursor-pointer"
                  title="Preview document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(doc.title)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[#04376C] dark:text-[#1E6FD9] cursor-pointer"
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full text-center py-16 text-xs text-text-secondary border-2 border-dashed border-border rounded-2xl">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-bold">No documents have been assigned to you yet.</p>
            <p className="mt-1 opacity-70">Your admin will upload relevant documents here soon.</p>
          </div>
        )}
      </div>

      {/* PDF simulated Viewer Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-slate-950 backdrop-blur-xs"
            />
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-[450px] text-slate-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#1E6FD9]" />
                  <span className="text-xs font-bold text-white max-w-sm truncate">{previewDoc.title}</span>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl my-4 p-6 border border-slate-800/50 flex flex-col items-center justify-center relative">
                {loadingPreview ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-[#1E6FD9] animate-spin"></div>
                    <span className="text-[10px] text-slate-500 font-bold">Rendering Document Layers...</span>
                  </div>
                ) : (
                  <div className="w-full h-full text-xs font-mono space-y-4 text-slate-400">
                    <div className="text-[10px] bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-slate-500 font-bold uppercase w-fit">
                      SIMULATED PDF PREVIEW - PAGE 1
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">
                      URL: {previewDoc.fileUrl}
                      <br /><br />
                      Description: {previewDoc.description || "N/A"}
                    </p>
                    <div className="h-px bg-slate-900 my-4"></div>
                    <div className="text-[10px] text-slate-600 flex justify-between">
                      <span>IAESTE SEP Jaipur Node</span>
                      <span>Verified: {new Date(previewDoc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs text-slate-400 shrink-0">
                <span>Page 1 of 1</span>
                <button
                  onClick={() => handleDownload(previewDoc.title)}
                  className="inline-flex items-center space-x-2 bg-[#1E6FD9] hover:bg-[#1E6FD9]/95 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
