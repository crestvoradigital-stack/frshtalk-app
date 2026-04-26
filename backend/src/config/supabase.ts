import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for user-authenticated requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database helper functions
export const db = {
  supabaseAdmin,

  // Users
  async getUserByPhone(phoneNumber: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(userData: any) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Listeners
  async getListeners(filters: any = {}) {
    let query = supabaseAdmin
      .from('listener_profiles')
      .select(`
        *,
        users!listener_profiles_user_id_fkey (
          id,
          username,
          avatar_url,
          is_online,
          is_verified
        )
      `)
      .eq('is_available', true)
      .order('rating', { ascending: false });

    if (filters.location) {
      query = query.eq('location', filters.location);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  },

  async getListenerProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('listener_profiles')
      .select(`
        *,
        users!listener_profiles_user_id_fkey (
          id,
          username,
          avatar_url,
          phone_number,
          is_online,
          is_verified
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Calls
  async createCall(callData: any) {
    const { data, error } = await supabaseAdmin
      .from('calls')
      .insert([callData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCall(callId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('calls')
      .update(updates)
      .eq('id', callId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserCalls(userId: string, limit = 20) {
    const { data, error } = await supabaseAdmin
      .from('calls')
      .select(`
        *,
        customer:users!calls_customer_id_fkey (id, username, avatar_url),
        listener:users!calls_listener_id_fkey (id, username, avatar_url)
      `)
      .or(`customer_id.eq.${userId},listener_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Transactions
  async createTransaction(transactionData: any) {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTransactions(userId: string, limit = 50) {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Messages
  async createMessage(messageData: any) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCallMessages(callId: string) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey (id, username, avatar_url)
      `)
      .eq('call_id', callId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Favorites
  async addFavorite(userId: string, listenerId: string) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert([{ user_id: userId, listener_id: listenerId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId: string, listenerId: string) {
    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listener_id', listenerId);

    if (error) throw error;
  },

  async getUserFavorites(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        *,
        listener:users!favorites_listener_id_fkey (
          id,
          username,
          avatar_url,
          is_online
        ),
        listener_profile:listener_profiles!listener_profiles_user_id_fkey (
          rating,
          review_count,
          tags,
          location
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  // Coin Packages
  async getCoinPackages() {
    const { data, error } = await supabaseAdmin
      .from('coin_packages')
      .select('*')
      .eq('is_active', true)
      .order('coins', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Notifications
  async createNotification(notificationData: any) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserNotifications(userId: string, limit = 50) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async markNotificationRead(notificationId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },
};

export default { supabase, supabaseAdmin, db };
