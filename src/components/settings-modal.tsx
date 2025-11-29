'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { downloadBackup, importData, BackupData } from '@/lib/backup';
import { Download, Upload, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      await downloadBackup();
    } catch (e) {
      console.error(e);
      setError('エクスポートに失敗しました。');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text) as BackupData;

      if (confirm('現在のデータはすべて上書きされます。よろしいですか？')) {
        await importData(data);
        onClose();
      }
    } catch (e) {
      console.error(e);
      setError('インポートに失敗しました。ファイル形式を確認してください。');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">データ管理</h3>
            <p className="text-sm text-text-sub">
              データのバックアップと復元を行います。
            </p>

            <div className="flex flex-col space-y-3">
              <Button onClick={handleExport} variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                データをエクスポート (バックアップ)
              </Button>

              <Button onClick={handleImportClick} variant="outline" className="w-full justify-start" disabled={isImporting}>
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'インポート中...' : 'データをインポート (復元)'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            {error && (
              <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
