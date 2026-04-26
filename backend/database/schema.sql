-- ============================================
-- FRSHTALK DATABASE SCHEMA (Supabase)
-- Free Tier: 500MB database, Unlimited API requests
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'listener', 'admin')),
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  is_verified BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LISTENER PROFILES TABLE
-- ============================================
CREATE TABLE listener_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT,
  voice_rate INTEGER DEFAULT 1 CHECK (voice_rate >= 0),
  video_rate INTEGER DEFAULT 6 CHECK (video_rate >= 0),
  tags TEXT[], -- Array of expertise tags
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  total_calls INTEGER DEFAULT 0 CHECK (total_calls >= 0),
  total_minutes INTEGER DEFAULT 0 CHECK (total_minutes >= 0),
  location VARCHAR(100),
  languages TEXT[], -- Array of languages
  is_available BOOLEAN DEFAULT true,
  is_on_call BOOLEAN DEFAULT false,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CALLS TABLE
-- ============================================
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  listener_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('voice', 'video')),
  status VARCHAR(20) DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'connected', 'ended', 'cancelled', 'failed')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0 CHECK (duration_seconds >= 0),
  cost INTEGER DEFAULT 0 CHECK (cost >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'system')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'deduct', 'refund', 'bonus', 'referral')),
  amount INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_gateway VARCHAR(50),
  payment_id VARCHAR(255),
  order_id VARCHAR(255),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  listener_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listener_id)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  listener_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COIN PACKAGES TABLE
-- ============================================
CREATE TABLE coin_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coins INTEGER NOT NULL CHECK (coins > 0),
  price INTEGER NOT NULL CHECK (price > 0),
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_online ON users(is_online);

-- Listener profiles indexes
CREATE INDEX idx_listener_user_id ON listener_profiles(user_id);
CREATE INDEX idx_listener_available ON listener_profiles(is_available);
CREATE INDEX idx_listener_rating ON listener_profiles(rating DESC);
CREATE INDEX idx_listener_location ON listener_profiles(location);

-- Calls indexes
CREATE INDEX idx_calls_customer ON calls(customer_id);
CREATE INDEX idx_calls_listener ON calls(listener_id);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_created ON calls(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_call ON messages(call_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Transactions indexes
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listener ON favorites(listener_id);

-- Reviews indexes
CREATE INDEX idx_reviews_listener ON reviews(listener_id);
CREATE INDEX idx_reviews_call ON reviews(call_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listener_profiles_updated_at BEFORE UPDATE ON listener_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coin_packages_updated_at BEFORE UPDATE ON coin_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listener_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Listener profiles policies
CREATE POLICY "Anyone can view listener profiles" ON listener_profiles
  FOR SELECT USING (true);

CREATE POLICY "Listeners can update their own profile" ON listener_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Calls policies
CREATE POLICY "Users can view their own calls" ON calls
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = listener_id);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert default coin packages
INSERT INTO coin_packages (coins, price, discount_percentage, is_active) VALUES
  (100, 99, 0, true),
  (500, 449, 10, true),
  (1000, 799, 20, true),
  (2500, 1699, 32, true),
  (5000, 2999, 40, true);

-- ============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function to update listener rating
CREATE OR REPLACE FUNCTION update_listener_rating(listener_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE listener_profiles
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE listener_id = listener_uuid
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE listener_id = listener_uuid
    )
  WHERE user_id = listener_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct coins for call
CREATE OR REPLACE FUNCTION deduct_call_cost(
  customer_uuid UUID,
  call_cost INTEGER
)
RETURNS boolean AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT coins INTO current_balance
  FROM users
  WHERE id = customer_uuid;

  -- Check if sufficient balance
  IF current_balance < call_cost THEN
    RETURN false;
  END IF;

  -- Deduct coins
  UPDATE users
  SET coins = coins - call_cost
  WHERE id = customer_uuid;

  -- Create transaction record
  INSERT INTO transactions (user_id, transaction_type, amount, coins, status, description)
  VALUES (customer_uuid, 'deduct', call_cost, call_cost, 'completed', 'Call cost deduction');

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to add coins
CREATE OR REPLACE FUNCTION add_coins(
  user_uuid UUID,
  coin_amount INTEGER,
  payment_method VARCHAR(50),
  payment_ref VARCHAR(255)
)
RETURNS void AS $$
BEGIN
  -- Add coins to user
  UPDATE users
  SET coins = coins + coin_amount
  WHERE id = user_uuid;

  -- Create transaction record
  INSERT INTO transactions (
    user_id,
    transaction_type,
    amount,
    coins,
    status,
    payment_gateway,
    payment_id,
    description
  )
  VALUES (
    user_uuid,
    'purchase',
    0, -- Will be updated by backend
    coin_amount,
    'completed',
    payment_method,
    payment_ref,
    'Coin purchase'
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- REALTIME SUBSCRIPTIONS (Supabase Feature)
-- ============================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for calls
ALTER PUBLICATION supabase_realtime ADD TABLE calls;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE users IS 'Main users table - stores both customers and listeners';
COMMENT ON TABLE listener_profiles IS 'Extended profile data for listeners';
COMMENT ON TABLE calls IS 'Call sessions between customers and listeners';
COMMENT ON TABLE messages IS 'Chat messages during calls';
COMMENT ON TABLE transactions IS 'Financial transactions and coin purchases';
COMMENT ON TABLE favorites IS 'User favorite listeners';
COMMENT ON TABLE reviews IS 'Call reviews and ratings';
COMMENT ON TABLE coin_packages IS 'Available coin packages for purchase';
COMMENT ON TABLE notifications IS 'Push notifications for users';

-- ============================================
-- END OF SCHEMA
-- ============================================
