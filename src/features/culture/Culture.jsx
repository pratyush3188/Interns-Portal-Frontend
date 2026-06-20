import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, CreditCard, MessageSquare, Compass, Play, Smartphone } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Culture = () => {
  // Hindi Flashcards data
  const phrases = [
    { hindi: "नमस्ते (Namaste)", English: "Hello / Greetings", pronunciation: "nuh-mus-tay" },
    { hindi: "धन्यवाद (Dhanyavaad)", English: "Thank You", pronunciation: "dhun-yuh-vaadh" },
    { hindi: "मदद (Madad)", English: "Help", pronunciation: "muh-dudh" },
    { hindi: "क्षमा कीजिये (Kshama Keejiyee)", English: "Excuse Me / Sorry", pronunciation: "kshuh-mah kee-jee-yay" },
    { hindi: "कितने का है? (Kitne ka hai?)", English: "How much is this?", pronunciation: "kith-nay kah hai" },
    { hindi: "हाँ / नहीं (Haan / Nahi)", English: "Yes / No", pronunciation: "haan / nuh-hee" }
  ];

  const [activeFlash, setActiveFlash] = useState(null); // Index of clicked flashcard

  const handlePlayAudioSim = (phrase) => {
    toast.success(`Playing simulated audio guide: "${phrase.hindi}" Pronounced: [${phrase.pronunciation}]`);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">India Onboarding & Culture Guide</h1>
        <p className="text-xs text-text-secondary mt-1">
          Essential guidelines on UPI setup, SIM cards, local Rajasthan travel guides, and basic Hindi vocabulary.
        </p>
      </div>

      {/* India Essentials Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
          <CreditCard className="w-4 h-4 text-[#04376C] dark:text-[#1E6FD9]" />
          <span>India Essentials Guide</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
            <Smartphone className="w-6 h-6 text-blue-500" />
            <h4 className="text-xs font-bold text-text-primary">SIM Card Setup</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Visit the Airtel/Jio store near campus with passport, visa, and host letter. Buddy will help activate within 4 hours.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
            <CreditCard className="w-6 h-6 text-green-500" />
            <h4 className="text-xs font-bold text-text-primary">UPI Payments</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              India is mostly cashless. Set up UPI using PhonePe/GPay linked to your international/local SIM wallet once active.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
            <Globe className="w-6 h-6 text-blue-500" />
            <h4 className="text-xs font-bold text-text-primary">Local Currency</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Keep ₹1,000 in cash for small auto-rickshaws. JECRC ATMs inside campus support foreign cards.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
            <Compass className="w-6 h-6 text-orange-500" />
            <h4 className="text-xs font-bold text-text-primary">Transportation</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Use Ola, Uber or Rapido mobile apps for safe and pre-priced cab or auto rides within Jaipur city.
            </p>
          </div>

        </div>
      </div>

      {/* Rajasthan Tourism Guides */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
          <Compass className="w-4 h-4 text-blue-500" />
          <span>Exploring Rajasthan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80')" }}></div>
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-text-primary">Jaipur (Pink City)</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Amer Fort, City Palace, Hawa Mahal, and local bazaar shopping for handicraft items.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80')" }}></div>
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-text-primary">Udaipur (City of Lakes)</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Lake Pichola palace views, Monsoon palace hikes, and heritage arts.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80')" }}></div>
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-text-primary">Jaisalmer (Golden City)</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Camel desert camping, Sam sand dunes safari, and sand forts.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80')" }}></div>
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-text-primary">Pushkar (Holy City)</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Holy ghats, annual camel cultural fair, and sunset hills views.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hindi Flashcards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          <span>Interactive Hindi Phrase Cards</span>
        </h3>
        <p className="text-[11px] text-text-secondary">Click on any card to flip and view the English meaning and pronunciation guide.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {phrases.map((phrase, idx) => {
            const isFlipped = activeFlash === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveFlash(isFlipped ? null : idx)}
                className="bg-card border border-border rounded-2xl p-6 shadow-card min-h-[140px] flex flex-col justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[8%] h-[100%] bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none"></div>
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3 h-full flex flex-col justify-between flex-1"
                    >
                      <h4 className="text-lg font-black text-[#04376C] dark:text-[#1E6FD9]">{phrase.hindi}</h4>
                      <p className="text-[10px] text-text-secondary uppercase font-semibold">Click to translate</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3 h-full flex flex-col justify-between flex-1"
                    >
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">Meaning</p>
                        <h4 className="text-sm font-extrabold text-text-primary mt-0.5">{phrase.English}</h4>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">Pronunciation</p>
                        <p className="text-xs text-text-primary italic mt-0.5 font-medium">{phrase.pronunciation}</p>
                      </div>
                      
                      {/* Audio Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudioSim(phrase);
                        }}
                        className="inline-flex items-center space-x-1.5 text-[10px] text-[#1E6FD9] font-bold hover:underline bg-blue-500/10 px-2 py-1 rounded w-fit self-end cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-[#1E6FD9]" />
                        <span>Play Audio</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
