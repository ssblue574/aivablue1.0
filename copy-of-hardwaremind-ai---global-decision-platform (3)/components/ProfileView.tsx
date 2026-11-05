import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { User, Mail, Info, Heart } from 'lucide-react';
import { UserProfile } from '../data';
import { AccessibilityPanel } from './AccessibilityPanel';
import { FeedbackWidget } from './FeedbackWidget';

interface ProfileViewProps {
  t: (key: any) => string;
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
  onSave: (payload: { name?: string; bio?: string; avatarUrl?: string }) => Promise<void> | void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  t,
  currentUser,
  onRequireLogin,
  onSave,
  favoritesCount = 0,
  onOpenFavorites,
  onLogout,
  onSwitchAccount,
}) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <User className="mx-auto mb-4 text-black/60" size={32} />
          <h2 className="text-xl font-semibold mb-2">{t('profile_login_title')}</h2>
          <p className="text-sm text-black/60 mb-6">
            {t('profile_login_desc')}
          </p>
          <button
            onClick={onRequireLogin}
            className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
          >
            {t('profile_login_button')}
          </button>
        </div>
      </div>
    );
  }

  const initial = currentUser.email.charAt(0).toUpperCase();
  const displayEmail = currentUser.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await onSave({ name, bio, avatarUrl });
      setMessage(t('profile_saved'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 mb-2">
            {t('profile_badge')}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            {t('profile_title')}
          </h1>
          <p className="text-sm text-black/60">
            {t('profile_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-[220px,1fr] gap-8 items-start">
          {/* Avatar + Basic */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-6 flex flex-col items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border border-black/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-semibold">
                  {initial}
                </div>
              )}
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold">
                  {name || displayEmail.split('@')[0]}
                </p>
                <p className="text-xs text-black/50 flex items-center justify-center gap-1">
                  <Mail size={12} />
                  {displayEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-black/10 bg-white p-6 space-y-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-black/70">
                {t('profile_name_label')}
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-gray-50 text-sm focus:outline-none focus:border-black/40"
                placeholder={displayEmail.split('@')[0]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-black/70 flex items-center gap-1">
                <Info size={12} /> {t('profile_bio_label')}
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-gray-50 text-sm focus:outline-none focus:border-black/40 resize-none"
                placeholder={t('profile_bio_placeholder')}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-black/70">
                {t('profile_avatar_label')}
              </label>
              <input
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-gray-50 text-sm focus:outline-none focus:border-black/40"
                placeholder="https://..."
              />
              <p className="text-[11px] text-black/40">
                {t('profile_avatar_help')}
              </p>
            </div>

            {message && (
              <p className="text-xs text-emerald-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className={clsx(
                "px-6 py-3 rounded-full text-sm font-medium",
                "bg-black text-white hover:bg-black/80 transition-colors",
                saving && "opacity-60 cursor-not-allowed"
              )}
            >
              {saving ? t('profile_saving') : t('profile_save')}
            </button>
          </form>
        </div>

        {/* Favorites Section - only show when user has favorites */}
        {favoritesCount > 0 && (
          <div className="rounded-3xl border border-black/10 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center">
                <Heart size={16} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-1">
                  {t('favorites_badge')}
                </p>
                <h2 className="text-sm font-semibold mb-1">
                  {t('favorites_title')}
                </h2>
                <p className="text-xs text-black/60">
                  {t('favorites_subtitle')}
                </p>
                <p className="text-xs text-black/60 mt-2">
                  {t('home_date_format') === 'zh-CN'
                    ? `你已收藏 ${favoritesCount} 款产品。`
                    : `You have saved ${favoritesCount} devices.`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenFavorites && onOpenFavorites()}
              className={clsx(
                "px-5 py-2 rounded-full text-xs font-medium border",
                "bg-black text-white hover:bg-black/80 border-black/80"
              )}
            >
              {t('home_date_format') === 'zh-CN' ? '进入我的收藏' : 'View all favorites'}
            </button>
          </div>
        )}

        {/* Account Settings Section */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-1">
              {t('home_date_format') === 'zh-CN' ? '账户设置' : 'Account Settings'}
            </p>
            <p className="text-sm font-semibold mb-1">
              {t('home_date_format') === 'zh-CN' ? '登录与安全' : 'Sign-in & Security'}
            </p>
            <p className="text-xs text-black/60">
              {t('home_date_format') === 'zh-CN'
                ? '在这里切换登录邮箱或安全退出当前账号。'
                : 'Switch email accounts or safely sign out from here.'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={() => onSwitchAccount && onSwitchAccount()}
              className="px-5 py-2 rounded-full text-xs font-medium border border-black/80 bg-black text-white hover:bg-black/80"
            >
              {t('home_date_format') === 'zh-CN' ? '切换账号' : 'Switch account'}
            </button>
            <button
              type="button"
              onClick={() => onLogout && onLogout()}
              className="px-5 py-2 rounded-full text-xs font-medium border border-black/20 text-black hover:bg-black/5"
            >
              {t('home_date_format') === 'zh-CN' ? '退出登录' : 'Sign out'}
            </button>
          </div>
        </div>

        {/* Accessibility Settings Section */}
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-1">
              {t('home_date_format') === 'zh-CN' ? '无障碍设置' : 'Accessibility Settings'}
            </p>
            <p className="text-sm text-black/60 mb-4">
              {t('home_date_format') === 'zh-CN'
                ? '调整字体大小、对比度等无障碍选项'
                : 'Adjust font size, contrast, and other accessibility options'}
            </p>
          </div>
          <AccessibilityPanel 
            lang={t('home_date_format') === 'zh-CN' ? 'zh' : 'en'} 
            inline={true}
          />
        </div>

        {/* Feedback Section */}
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-1">
              {t('home_date_format') === 'zh-CN' ? '反馈' : 'Feedback'}
            </p>
            <p className="text-sm text-black/60 mb-4">
              {t('home_date_format') === 'zh-CN'
                ? '向我们提供您的反馈和建议'
                : 'Share your feedback and suggestions with us'}
            </p>
          </div>
          <FeedbackWidget 
            lang={t('home_date_format') === 'zh-CN' ? 'zh' : 'en'} 
            inline={true}
          />
        </div>
      </div>
    </div>
  );
};


