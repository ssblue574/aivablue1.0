import React from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { CommunityPost, Product } from '../data';
import { Trash2, Shield, Database } from 'lucide-react';

interface AdminViewProps {
  t: (key: any) => string;
  products: Product[];
  milestones: Product[];
  posts: CommunityPost[];
  onDeletePost: (id: string) => void;
  currentUserEmail?: string | null;
}

export const AdminView: React.FC<AdminViewProps> = ({
  t,
  products,
  milestones,
  posts,
  onDeletePost,
  currentUserEmail,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);

  const allProducts = [...products, ...milestones];
  const isAuthed = !!currentUserEmail;

  return (
    <div className={clsx("min-h-screen pb-20", isDark ? "bg-black" : "bg-[#f5f5f7]")}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className={clsx(
            "text-xs uppercase tracking-[0.3em]",
            isDark ? "text-white/40" : "text-black/40"
          )}>
            Admin
          </p>
          <h1 className={clsx(
            "text-3xl md:text-4xl font-semibold",
            isDark ? "text-white" : "text-black"
          )}>
            内容管理面板
          </h1>
          <p className={clsx(
            "text-sm",
            isDark ? "text-white/60" : "text-black/60"
          )}>
            这是为开发者和运营准备的简易后台，可以快速查看产品和社区内容，并执行删除操作（立即生效）。
          </p>
        </header>

        {!isAuthed && (
          <div className={clsx(
            "p-4 rounded-2xl border flex items-center gap-3",
            isDark ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-100" : "border-yellow-500/40 bg-yellow-50 text-yellow-800"
          )}>
            <Shield size={18} />
            <div className="text-sm">
              请先登录后再使用 Admin 面板。当前操作仅在本地浏览器生效，仍建议仅开发者自己使用此入口。
            </div>
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-4">
          <div className={clsx(
            "p-5 rounded-2xl border",
            isDark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white"
          )}>
            <p className={clsx(
              "text-xs uppercase tracking-[0.3em] mb-1",
              isDark ? "text-white/40" : "text-black/40"
            )}>
              Products
            </p>
            <p className="text-3xl font-semibold">{allProducts.length}</p>
          </div>
          <div className={clsx(
            "p-5 rounded-2xl border",
            isDark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white"
          )}>
            <p className={clsx(
              "text-xs uppercase tracking-[0.3em] mb-1",
              isDark ? "text-white/40" : "text-black/40"
            )}>
              Community Posts
            </p>
            <p className="text-3xl font-semibold">{posts.length}</p>
          </div>
          <div className={clsx(
            "p-5 rounded-2xl border flex items-center gap-3",
            isDark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white"
          )}>
            <Database size={20} className={isDark ? "text-white/70" : "text-black/70"} />
            <div>
              <p className={clsx(
                "text-xs uppercase tracking-[0.3em] mb-1",
                isDark ? "text-white/40" : "text-black/40"
              )}>
                Data Source
              </p>
              <p className={clsx(
                "text-xs",
                isDark ? "text-white/70" : "text-black/70"
              )}>
                本地存储 + Supabase 云同步
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={clsx(
              "text-lg font-semibold",
              isDark ? "text-white" : "text-black"
            )}>
              社区帖子
            </h2>
            <span className={clsx(
              "text-xs",
              isDark ? "text-white/50" : "text-black/50"
            )}>
              点击「删除」会从本地和 Supabase 同步删除，请谨慎操作。
            </span>
          </div>

          {posts.length === 0 ? (
            <div className={clsx(
              "p-8 text-center border border-dashed rounded-2xl",
              isDark ? "border-white/20 text-white/50" : "border-black/20 text-black/50"
            )}>
              暂无社区内容。
            </div>
          ) : (
            <div className={clsx(
              "rounded-2xl border overflow-hidden",
              isDark ? "border-white/10 bg-[#090909]" : "border-black/10 bg-white"
            )}>
              <div className={clsx(
                "grid grid-cols-5 text-xs font-medium px-4 py-2",
                isDark ? "bg-white/[0.03] text-white/60" : "bg-black/[0.03] text-black/60"
              )}>
                <div>用户</div>
                <div>产品</div>
                <div>标题</div>
                <div>点赞</div>
                <div className="text-right">操作</div>
              </div>
              <div className="divide-y divide-white/5">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className={clsx(
                      "grid grid-cols-5 px-4 py-3 text-xs items-center",
                      isDark ? "text-white/80" : "text-black/80"
                    )}
                  >
                    <div className="truncate">{post.userName}</div>
                    <div className="truncate">{post.productName}</div>
                    <div className="truncate">{post.title}</div>
                    <div>{post.helpfulCount}</div>
                    <div className="text-right">
                      <button
                        type="button"
                        className={clsx(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border",
                          isDark ? "border-red-400/60 text-red-300 hover:bg-red-500/10" : "border-red-500/60 text-red-600 hover:bg-red-50"
                        )}
                        onClick={() => {
                          setDeleteConfirmPostId(post.id);
                        }}
                        disabled={!isAuthed}
                      >
                        <Trash2 size={12} />
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};


