export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string | null;
  is_active: boolean;
  is_highlighted: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  user_id: string;
  theme_id: string;
  primary_color: string;
  button_style: 'rounded-none' | 'rounded-md' | 'rounded-full';
  button_variant: 'solid' | 'outline' | 'soft';
  background_type: 'color' | 'gradient' | 'image';
  background_value: string;
  font_family: string;
  show_branding: boolean;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: 'free' | 'pro' | 'premium';
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  current_period_end: string | null;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  features: {
    max_links: number;
    branding: boolean;
    themes: string[] | 'all';
    analytics?: boolean;
    custom_domain?: boolean;
  };
};
