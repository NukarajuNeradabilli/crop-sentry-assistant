
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUpload = ({ onImageUpload, isLoading }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all duration-300",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragActive ? "border-primary bg-accent" : "border-border",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {preview ? (
            <div className="relative w-full aspect-video">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg object-contain w-full h-full"
              />
            </div>
          ) : (
            <>
              <div className="p-4 bg-background rounded-full border-2">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Drop your crop image here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to select a file
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
                <span>JPG, PNG or WEBP (max. 5MB)</span>
              </div>
            </>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="space-y-2">
          <Progress value={40} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">
            Analyzing image...
          </p>
        </div>
      )}
    </div>
  );
};
