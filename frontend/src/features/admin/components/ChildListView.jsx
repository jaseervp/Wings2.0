import React from 'react';

const AVATAR_BG_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-teal-500',
];

const getAvatarBg = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
};

const getDiagnosisBadge = (diag = '') => {
  const upper = (diag || '').toUpperCase();
  if (upper.includes('MODERATE')) {
    return { label: diag, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (upper.includes('MILD')) {
    return { label: diag, style: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
  if (upper.includes('SEVERE')) {
    return { label: diag, style: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  if (upper.includes('PROFOUND')) {
    return { label: diag, style: 'bg-red-50 text-red-700 border-red-200' };
  }
  return { label: diag || 'PENDING', style: 'bg-gray-50 text-gray-600 border-gray-200' };
};

export const ChildListView = ({ children = [], onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
            <th className="px-6 py-4 w-12 text-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="px-6 py-4">Child Details</th>
            <th className="px-6 py-4">Parent / Guardian</th>
            <th className="px-6 py-4 text-center">Age</th>
            <th className="px-6 py-4">Diagnosis</th>
            <th className="px-6 py-4">Last Assessment</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-50 font-medium">
          {children.map((child) => {
            const displayName = child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim() || 'Child Profile';
            const initial = displayName.charAt(0).toUpperCase() || 'C';
            const avatarBg = getAvatarBg(displayName);
            const diagBadge = getDiagnosisBadge(child.diagnosis);

            return (
              <tr key={child.id || child._id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 w-12 text-center align-middle">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${avatarBg} text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm border-2 border-white`}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">
                        {displayName}
                      </p>
                      {child.gender && (
                        <span className="text-[10px] text-gray-400 uppercase font-mono">
                          {child.gender}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm align-middle">
                  <div>
                    <span className="font-semibold text-text">{child.parent || 'Unassigned'}</span>
                    {child.parentEmail && (
                      <p className="text-xs text-gray-400">{child.parentEmail}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-mono font-bold text-xs border border-gray-200">
                    {child.age || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${diagBadge.style}`}
                  >
                    {diagBadge.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs font-semibold align-middle font-mono">
                  {child.lastExam || 'Never'}
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <button
                    onClick={() => onViewDetails(child)}
                    className="text-xs font-bold text-primary hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
