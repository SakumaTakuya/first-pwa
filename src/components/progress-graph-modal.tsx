'use client';

import { useMemo } from 'react';
import type { CompletedWorkout } from '@/lib/db';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProgressGraphModalProps {
  workouts: CompletedWorkout[];
  exerciseId: string;
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProgressGraphModal = ({ 
  workouts, 
  exerciseId, 
  exerciseName,
  isOpen,
  onClose 
}: ProgressGraphModalProps) => {

  const data = useMemo(() => {
    const progressData: { date: string; maxWeight: number }[] = [];
    workouts.forEach(workout => {
      let maxWeightForDay = 0;
      workout.exercises.forEach(ex => {
        if (ex.exerciseId === exerciseId) {
          ex.sets.forEach(set => {
            if (set.weight > maxWeightForDay) {
              maxWeightForDay = set.weight;
            }
          });
        }
      });
      if (maxWeightForDay > 0) {
        progressData.push({
          date: workout.date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
          maxWeight: maxWeightForDay,
        });
      }
    });
    return progressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workouts, exerciseId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{exerciseName} の成長記録</DialogTitle>
        </DialogHeader>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" unit="kg" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} 
                        labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Line type="monotone" dataKey="maxWeight" name="最大重量 (kg)" stroke="#34D399" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <DialogFooter>
            <Button onClick={onClose}>
                閉じる
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
