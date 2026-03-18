import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MemberAvatarUploadProps {
  currentUrl?: string;
  memberId?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onUploaded?: (url: string) => void;
  fallbackInitials: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-lg',
};

const MemberAvatar = ({
  currentUrl,
  memberId,
  size = 'md',
  editable = false,
  onUploaded,
  fallbackInitials,
}: MemberAvatarUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 2 MB.',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        toast({
          title: 'Not signed in',
          description: 'Please sign in to upload a photo.',
          variant: 'destructive',
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const url = publicData.publicUrl;
      setAvatarUrl(url);
      onUploaded?.(url);

      toast({
        title: 'Photo uploaded',
        description: 'Your profile picture has been updated.',
      });
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message || 'Could not upload photo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          className={`${sizeClasses[size]} rounded-lg object-cover flex-shrink-0`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-display font-bold flex-shrink-0`}
        >
          {fallbackInitials}
        </div>
      )}
      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default MemberAvatar;
