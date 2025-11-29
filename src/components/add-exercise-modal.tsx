'use client';

import { useMasterDataStore } from '@/stores/master-data-store';
import { useSessionStore } from '@/stores/session-store';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExerciseModal = ({ isOpen, onClose }: AddExerciseModalProps) => {
  const {
    exerciseHistory,
    addExerciseToHistory,
  } = useMasterDataStore();
  const { addExerciseToSession } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState('');

  const exercises = useLiveQuery(() => db.exercises.toArray());
  const masterExerciseList = exercises || [];

  const handleSelectExercise = (exercise: { id: string; name: string }) => {
    addExerciseToSession(exercise);
    addExerciseToHistory(exercise.id);
    onClose();
  };

  const handleAddNewExercise = async () => {
    const newExercise = {
      id: searchQuery.toLowerCase().replace(/\s+/g, '-'),
      name: searchQuery,
    };
    await db.exercises.add(newExercise);
    handleSelectExercise(newExercise);
  };

  const filteredList = masterExerciseList.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const historyExercises = exerciseHistory
    .map((id) => masterExerciseList.find((ex) => ex.id === id))
    .filter((ex) => ex !== undefined);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="種目を追加"
      className="h-[80vh] flex flex-col"
      footer={
        <Button onClick={onClose} variant="ghost">
          閉じる
        </Button>
      }
    >
      <div className="p-4 border-b border-border">
        <Input
          type="text"
          placeholder="種目を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelectExercise(ex!)}
                  >
                    {ex!.name}
                  </Button>
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
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelectExercise(ex)}
                >
                  {ex.name}
                </Button>
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
            <Button onClick={handleAddNewExercise} variant="default">
              新しい種目として追加
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
