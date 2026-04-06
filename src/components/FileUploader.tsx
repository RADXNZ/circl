import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { ParserService } from '../services/ParserService';
import { IGUser } from '../types';

type FileUploaderProps = {
  label: string;
  onDataParsed: (data: IGUser[]) => void;
  isUploaded?: boolean;
};

export const FileUploader: React.FC<FileUploaderProps> = ({ label, onDataParsed, isUploaded }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.endsWith('.html') && !file.name.endsWith('.json')) {
      setError('Please upload .html or .json files');
      return;
    }

    try {
      const text = await file.text();
      const users = ParserService.parse(text);
      if (users.length === 0) {
        setError('No valid Instagram users found in file.');
      } else {
        onDataParsed(users);
      }
    } catch (e) {
      setError('Failed to parse file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`card flex flex-col items-center justify-center gap-4 ${isHovering ? 'border-primary' : ''}`}
      style={{
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isHovering ? 'var(--primary-color)' : isUploaded ? 'var(--success-color)' : 'var(--border-color)',
        minHeight: 160,
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
      onDragLeave={() => setIsHovering(false)}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept=".html,.json" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      
      {isUploaded ? (
        <>
          <CheckCircle size={32} color="var(--success-color)" />
          <p style={{ fontWeight: 500 }}>{label} Uploaded</p>
        </>
      ) : (
        <>
          <UploadCloud size={32} color="var(--primary-color)" />
          <p style={{ fontWeight: 500, textAlign: 'center' }}>Upload {label}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Accepts .html or .json</p>
        </>
      )}
      
      {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
};
