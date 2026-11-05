import React, { useState } from 'react';
import { MessageSquare, X, Send, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { useToast } from './Toast';

interface FeedbackWidgetProps {
  lang?: 'zh' | 'en';
  inline?: boolean; // If true, render as inline component instead of fixed position
}

type FeedbackType = 'bug' | 'suggestion' | 'question' | 'praise';

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  lang = 'zh',
  inline = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(inline); // In inline mode, start open
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackType || !message.trim()) {
      toast?.error(
        isZh ? '请选择反馈类型并填写内容' : 'Please select feedback type and enter content',
        3000
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would send feedback to your backend
      // For now, we'll just store it locally
      const feedback = {
        type: feedbackType,
        rating,
        message: message.trim(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Store in localStorage (in production, send to server)
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast?.success(
        isZh ? '感谢您的反馈！' : 'Thank you for your feedback!',
        3000
      );

      // Reset form
      setFeedbackType(null);
      setRating(null);
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast?.error(
        isZh ? '提交失败，请稍后重试' : 'Submission failed, please try again later',
        3000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !inline) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "fixed bottom-6 left-6 z-40 p-4 rounded-full shadow-lg transition-all",
          "hover:scale-110 active:scale-95",
          isDark
            ? "bg-[#1c1c1e] text-white border border-white/10 hover:bg-[#2c2c2e]"
            : "bg-white text-black border border-black/10 hover:bg-gray-50",
          "flex items-center justify-center"
        )}
        aria-label={isZh ? '反馈' : 'Feedback'}
        title={isZh ? '反馈' : 'Feedback'}
      >
        <MessageSquare size={20} />
      </button>
    );
  }

  if (!isOpen && inline) {
    return null;
  }

  return (
    <div className={clsx(
      inline
        ? "w-full rounded-2xl border overflow-hidden"
        : "fixed bottom-6 left-6 z-50 w-96 max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden",
      "flex flex-col",
      isDark
        ? "bg-[#1c1c1e] border-white/10"
        : "bg-white border-black/10"
    )}>
      {/* Header */}
      <div className={clsx(
        "flex items-center justify-between p-4 border-b",
        isDark ? "border-white/10" : "border-black/10"
      )}>
        <h3 className={clsx(
          "font-semibold",
          isDark ? "text-white" : "text-black"
        )}>
          {isZh ? '反馈' : 'Feedback'}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className={clsx(
            "p-1.5 rounded-lg transition-all",
            isDark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-black/10 text-black"
          )}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Feedback Type */}
        <div>
          <label className={clsx(
            "text-sm font-medium mb-2 block",
            isDark ? "text-white" : "text-black"
          )}>
            {isZh ? '反馈类型' : 'Feedback Type'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'bug' as FeedbackType, label: isZh ? '错误报告' : 'Bug Report', icon: ThumbsDown },
              { type: 'suggestion' as FeedbackType, label: isZh ? '建议' : 'Suggestion', icon: ThumbsUp },
              { type: 'question' as FeedbackType, label: isZh ? '问题' : 'Question', icon: MessageSquare },
              { type: 'praise' as FeedbackType, label: isZh ? '表扬' : 'Praise', icon: Star },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setFeedbackType(type)}
                className={clsx(
                  "p-3 rounded-lg border transition-all flex items-center gap-2",
                  feedbackType === type
                    ? isDark
                      ? "bg-[#00FFC6]/20 border-[#00FFC6] text-[#00FFC6]"
                      : "bg-[#0071e3]/10 border-[#0071e3] text-[#0071e3]"
                    : isDark
                    ? "border-white/10 hover:bg-white/5 text-white"
                    : "border-black/10 hover:bg-black/5 text-black"
                )}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rating (optional) */}
        {feedbackType && (
          <div>
            <label className={clsx(
              "text-sm font-medium mb-2 block",
              isDark ? "text-white" : "text-black"
            )}>
              {isZh ? '评分（可选）' : 'Rating (Optional)'}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={clsx(
                    "p-2 rounded transition-all",
                    rating && rating >= value
                      ? "text-yellow-400"
                      : isDark
                      ? "text-white/40 hover:text-white/60"
                      : "text-gray-300 hover:text-gray-400"
                  )}
                >
                  <Star size={20} fill={rating && rating >= value ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className={clsx(
            "text-sm font-medium mb-2 block",
            isDark ? "text-white" : "text-black"
          )}>
            {isZh ? '详细说明' : 'Details'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isZh ? '请描述您的反馈...' : 'Please describe your feedback...'}
            rows={4}
            className={clsx(
              "w-full p-3 rounded-lg border resize-none",
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder-white/40"
                : "bg-gray-50 border-black/10 text-black placeholder-gray-400"
            )}
          />
        </div>
      </div>

      {/* Footer */}
      <div className={clsx(
        "p-4 border-t flex gap-2",
        isDark ? "border-white/10" : "border-black/10"
      )}>
        <button
          onClick={() => setIsOpen(false)}
          className={clsx(
            "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
            isDark
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-gray-100 text-black hover:bg-gray-200"
          )}
        >
          {isZh ? '取消' : 'Cancel'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !feedbackType || !message.trim()}
          className={clsx(
            "flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isDark
              ? "bg-[#00FFC6] text-black hover:bg-[#00FFC6]/90"
              : "bg-[#0071e3] text-white hover:bg-[#0077ED]"
          )}
        >
          {isSubmitting ? (
            <>
              <div className={clsx(
                "w-4 h-4 border-2 rounded-full animate-spin",
                isDark ? "border-black/20 border-t-black" : "border-white/20 border-t-white"
              )} />
              {isZh ? '提交中...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Send size={16} />
              {isZh ? '提交' : 'Submit'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

