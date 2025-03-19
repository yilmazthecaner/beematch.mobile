import React from 'react';
import { useUploadThing } from '../lib/uploadthing';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const { startUpload, isUploading } = useUploadThing({
    endpoint: "imageUploader",
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onUploadComplete(res[0].url);
      }
    },
  });

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) startUpload([file]);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex items-center justify-center w-full h-full">
        {isUploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600" />
        ) : (
          <Upload className="h-6 w-6 text-gray-400" />
        )}
      </div>
    </div>
  );
}