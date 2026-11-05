import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Mail, Link2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { 
  shareViaWebAPI, 
  shareToTwitter, 
  shareToFacebook, 
  shareToLinkedIn, 
  shareViaEmail,
  copyToClipboard,
  isWebShareSupported 
} from '../utils/shareUtils';
import { useToast } from './Toast';

interface ShareButtonProps {
  data: {
    title: string;
    text: string;
    url: string;
    image?: string;
  };
  lang?: 'zh' | 'en';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  data,
  lang = 'zh',
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async (platform: string) => {
    try {
      let success = false;

      switch (platform) {
        case 'web':
          success = await shareViaWebAPI(data);
          break;
        case 'twitter':
          shareToTwitter(data);
          success = true;
          break;
        case 'facebook':
          shareToFacebook(data);
          success = true;
          break;
        case 'linkedin':
          shareToLinkedIn(data);
          success = true;
          break;
        case 'email':
          shareViaEmail(data);
          success = true;
          break;
        case 'copy':
          success = await copyToClipboard(data.url);
          if (success) {
            toast?.success(
              isZh ? '链接已复制到剪贴板' : 'Link copied to clipboard',
              2000
            );
          }
          break;
      }

      if (success && platform !== 'copy') {
        setShowMenu(false);
        toast?.success(
          isZh ? '分享成功' : 'Shared successfully',
          2000
        );
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast?.error(
        isZh ? '分享失败，请稍后重试' : 'Share failed, please try again',
        3000
      );
    }
  };

  return (
    <div className={clsx("relative", className)}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={clsx(
          "p-2 rounded-lg transition-all flex items-center gap-2",
          isDark
            ? "hover:bg-white/10 text-white"
            : "hover:bg-black/10 text-black"
        )}
        aria-label={isZh ? '分享' : 'Share'}
        aria-expanded={showMenu}
      >
        <Share2 size={18} />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className={clsx(
            "absolute bottom-full right-0 mb-2 z-50 w-56 rounded-xl shadow-2xl border overflow-hidden",
            isDark
              ? "bg-[#1c1c1e] border-white/10"
              : "bg-white border-black/10"
          )}>
            <div className="p-2">
              {/* Web Share API (if supported) */}
              {isWebShareSupported() && (
                <button
                  onClick={() => handleShare('web')}
                  className={clsx(
                    "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 mb-1",
                    isDark
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-black/5 text-black"
                  )}
                >
                  <Share2 size={18} />
                  <span className="text-sm">{isZh ? '分享...' : 'Share...'}</span>
                </button>
              )}

              {/* Social Platforms */}
              <button
                onClick={() => handleShare('twitter')}
                className={clsx(
                  "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 mb-1",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                )}
              >
                <Twitter size={18} />
                <span className="text-sm">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className={clsx(
                  "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 mb-1",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                )}
              >
                <Facebook size={18} />
                <span className="text-sm">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className={clsx(
                  "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 mb-1",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                )}
              >
                <Linkedin size={18} />
                <span className="text-sm">LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className={clsx(
                  "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 mb-1",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                )}
              >
                <Mail size={18} />
                <span className="text-sm">{isZh ? '邮件' : 'Email'}</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => handleShare('copy')}
                className={clsx(
                  "w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/5 text-black"
                )}
              >
                <Link2 size={18} />
                <span className="text-sm">{isZh ? '复制链接' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

