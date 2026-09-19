import React from 'react';

interface NotesSectionProps {
  notes?: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1 font-bold text-[9.5px] uppercase tracking-wider">
        NOTES
      </div>
      <div className="p-2.5 bg-blue-50/50 text-[9px] text-slate-800 leading-relaxed font-medium border-t border-slate-200">
        {notes}
      </div>
    </div>
  );
};
