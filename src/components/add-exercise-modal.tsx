'use client';

import { useMasterDataStore } from '@/stores/master-data-store';
import { useSessionStore } from '@/stores/session-store';
import { useState } from 'react';

interface AddExerciseModalProps {
  onClose: () => void;
}

export const AddExerciseModal = ({ onClose }: AddExerciseModalProps) => {
  const {
    masterExerciseList,
    exerciseHistory,
    addExerciseToHistory,
    addNewExerciseToMasterList,
  } = useMasterDataStore();
  const { addExerciseToSession } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectExercise = (exercise: { id: string; name: string }) => {
    addExerciseToSession(exercise);
    addExerciseToHistory(exercise.id);
    onClose();
  };

  const handleAddNewExercise = () => {
    const newExercise = addNewExerciseToMasterList(searchQuery);
    handleSelectExercise(newExercise);
  };

  const filteredList = masterExerciseList.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const historyExercises = exerciseHistory
    .map((id) => masterExerciseList.find((ex) => ex.id === id))
    .filter((ex) => ex !== undefined);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder="種目を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background text-text-main rounded-lg px-4 py-2 border-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {/* History List */}
          {searchQuery.length === 0 && historyExercises.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-sub mb-2">履歴</h3>
              <ul className="space-y-2">
                {historyExercises.map((ex) => (
                  <li key={`hist-${ex!.id}`}>
                    <button
                      onClick={() => handleSelectExercise(ex!)}
                      className="w-full text-left p-3 bg-background rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      {ex!.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filtered List */}
          <h3 className="text-lg font-bold text-text-sub mb-2">種目一覧</h3>
          {filteredList.length > 0 && (
            <ul className="space-y-2">
              {filteredList.map((ex) => (
                <li key={ex.id}>
                  <button
                    onClick={() => handleSelectExercise(ex)}
                    className="w-full text-left p-3 bg-background rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {ex.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {filteredList.length === 0 && searchQuery.length > 0 && (
            <div className="text-center p-4">
              <p className="text-text-sub mb-4">「{searchQuery}」に一致する種目はありません。</p>
            </div>
          )}

          {searchQuery.length > 0 && (
            <div className="text-center p-4">
              <button
                onClick={handleAddNewExercise}
                className="bg-accent text-white font-bold rounded-lg px-6 py-3"
              >
                新しい種目として追加
              </button>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border text-center">
          <button onClick={onClose} className="text-text-sub hover:text-text-main">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
