
import { createClient } from '@supabase/supabase-js';
import { CommunityPost } from '../data';

// NOTE: These should be in your .env file
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback if not configured (so app doesn't crash, just warns)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const cloudService = {
  // Posts
  getPosts: async (): Promise<CommunityPost[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    // 将数据库中的 snake_case 字段映射成前端的 camelCase 结构
    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userAvatar: undefined,
      productId: row.product_id,
      productName: row.product_name,
      productImage: row.product_image,
      rating: row.rating,
      title: row.title,
      content: row.content,
      images: [],
      createdAt: row.created_at,
      helpfulCount: row.helpful_count ?? 0,
      isVerifiedPurchase: row.is_verified_purchase ?? false,
    })) as CommunityPost[];
  },

  createPost: async (post: CommunityPost): Promise<CommunityPost | null> => {
    if (!supabase) return null;

    // 映射到数据库列（posts 表）
    const payload = {
      id: post.id,
      user_id: post.userId,
      user_name: post.userName,
      product_id: post.productId,
      product_name: post.productName,
      product_image: post.productImage,
      rating: post.rating,
      title: post.title,
      content: post.content,
      helpful_count: post.helpfulCount ?? 0,
      is_verified_purchase: post.isVerifiedPurchase ?? false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      return null;
    }

    // 返回映射后的前端结构
    return {
      ...post,
      createdAt: (data as any).created_at,
    };
  },

  updatePost: async (post: CommunityPost): Promise<CommunityPost | null> => {
    if (!supabase) return null;

    const payload = {
      user_id: post.userId,
      user_name: post.userName,
      product_id: post.productId,
      product_name: post.productName,
      product_image: post.productImage,
      rating: post.rating,
      title: post.title,
      content: post.content,
      helpful_count: post.helpfulCount ?? 0,
      is_verified_purchase: post.isVerifiedPurchase ?? false,
    };

    const { data, error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', post.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return null;
    }

    return {
      ...post,
      createdAt: (data as any).created_at,
    };
  },

  deletePost: async (id: string): Promise<void> => {
    if (!supabase) return;
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error);
    }
  },

  // Gallery (Storage)
  uploadImage: async (file: File): Promise<string | null> => {
    if (!supabase) return null;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  }
};

// --- Minimal analytics / event logging ---
// This is intentionally very defensive: if Supabase 未配置或表不存在，只在控制台报错，不影响正常体验。
export const logEvent = async (
  eventName: string,
  properties?: Record<string, any>
): Promise<void> => {
  if (!supabase) return;
  try {
    // 尝试获取当前登录用户，用于 user_id 记录（未登录则为 null）
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id ?? null;

    const payload: any = {
      event_name: eventName,
      properties: properties ?? {},
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('events').insert(payload);
    if (error) {
      // 这里仅提示，不打断前端逻辑
      console.warn('Supabase logEvent error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase logEvent exception:', err);
  }
};

