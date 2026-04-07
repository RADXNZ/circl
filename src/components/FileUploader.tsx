import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle, FilePlus } from 'lucide-react';
import { ParserService } from '../services/ParserService';
import { IGUser } from '../types';

type FileUploaderProps = {
  label: string;
  onDataParsed: (data: IGUser[]) => void;
  isUploaded?: boolean;
  existingData?: IGUser[] | null; // For append mode
  supportsMultiple?: boolean;     // Show "add more files" hint
};

// Merge & deduplicate two user arrays (case-insensitive)
function mergeUsers(existing: IGUser[], incoming: IGUser[]): IGUser[] {
  const map = new Map<string, IGUser>();
  for (const u of existing) map.set(u.username.toLowerCase(), u);
  for (const u of incoming) {
    const key = u.username.toLowerCase();
    if (!map.has(key)) map.set(key, u);
  }
  return Array.from(map.values());
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onDataParsed,
  isUploaded,
  existingData,
  supportsMultiple = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList) => {
    setError(null);
    let allUsers: IGUser[] = existingData ? [...existingData] : [];
    let parsed = 0;
    let filesLoaded = 0;

    for (const file of Array.from(files)) {
      if (!file.name.endsWith('.html') && !file.name.endsWith('.json')) {
        setError(`"${file.name}" is not a .html or .json file`);
        continue;
      }
      try {
        const text = await file.text();
        const users = ParserService.parse(text);
        if (users.length === 0) {
          setError(`No users found in "${file.name}"`);
        } else {
          allUsers = mergeUsers(allUsers, users);
          parsed += users.length;
          filesLoaded++;
        }
      } catch {
        setError(`Failed to read "${file.name}"`);
      }
    }

    if (allUsers.length > 0) {
      onDataParsed(allUsers);
      setParsedCount(allUsers.length);
      setFileCount(prev => prev + filesLoaded);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const totalCount = parsedCount ?? (existingData?.length ?? null);

  return (
    <div
      className={`card flex flex-col items-center justify-center gap-4`}
      style={{
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isHovering
          ? 'var(--primary-color)'
          : isUploaded
          ? 'var(--success-color)'
          : 'var(--border-color)',
        minHeight: 160,
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
      onDragLeave={() => setIsHovering(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".html,.json"
        multiple={supportsMultiple}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            // Reset so same file can trigger onChange again
            e.target.value = '';
          }
        }}
      />

      {isUploaded ? (
        <>
          <CheckCircle size={32} color="var(--success-color)" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600 }}>{label}</p>
            {totalCount !== null && (
              <p style={{ fontSize: '0.875rem', color: 'var(--success-color)', fontWeight: 500 }}>
                ✓ {totalCount.toLocaleString()} accounts loaded
                {fileCount > 1 && ` from ${fileCount} files`}
              </p>
            )}
          </div>
          {supportsMultiple && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <FilePlus size={13} /> Click to add more files
            </p>
          )}
        </>
      ) : (
        <>
          <UploadCloud size={32} color="var(--primary-color)" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 500 }}>Upload {label}</p>
            {supportsMultiple && (
              <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 500, marginTop: 2 }}>
                💡 Select all files at once (followers_1, followers_2…)
              </p>
            )}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Accepts .html or .json
            </p>
          </div>
        </>
      )}

      {error && (
        <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
};
