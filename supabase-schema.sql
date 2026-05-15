-- =============================================
-- ProfitPulse Full Database Schema v2
-- Run this in Supabase SQL Editor
-- =============================================

create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  store_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  uploads_this_month integer default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  openai_key_hint text, -- just last 4 chars for display
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- ─── PRODUCT COSTS ────────────────────────────
-- Persisted cost prices per user per product
create table if not exists public.product_costs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_name text not null,
  selling_price numeric default 0,
  cost_price numeric not null,
  category text not null,
  commission_rate numeric not null,
  sku text,
  updated_at timestamptz default now(),
  unique(user_id, product_name)
);

alter table public.product_costs enable row level security;
create policy "Users manage own costs" on public.product_costs for all using (auth.uid() = user_id);

-- ─── UPLOADS ──────────────────────────────────
create table if not exists public.uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text not null,
  file_type text default 'orders' check (file_type in ('orders', 'finance', 'ads')),
  row_count integer default 0,
  date_range_start date,
  date_range_end date,
  status text default 'complete' check (status in ('processing', 'complete', 'error')),
  created_at timestamptz default now()
);

alter table public.uploads enable row level security;
create policy "Users manage own uploads" on public.uploads for all using (auth.uid() = user_id);

-- ─── ORDERS (persisted parsed orders) ─────────
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  upload_id uuid references public.uploads(id) on delete cascade not null,
  order_id text not null,
  order_date date,
  product_name text,
  sku text,
  quantity integer default 1,
  selling_price numeric default 0,
  shipping_fee numeric default 0,
  daraz_commission numeric default 0,
  payment_fee numeric default 0,
  handling_fee numeric default 0,
  tax_wht numeric default 0,
  ad_cost numeric default 0,
  cost_price numeric default 0,
  return_status text default 'none',
  status text default 'completed',
  category text,
  created_at timestamptz default now(),
  unique(user_id, order_id)
);

alter table public.orders enable row level security;
create policy "Users manage own orders" on public.orders for all using (auth.uid() = user_id);
create index on public.orders(user_id, order_date desc);
create index on public.orders(user_id, product_name);

-- ─── ANALYSIS CACHE ───────────────────────────
create table if not exists public.analysis_cache (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  upload_id uuid references public.uploads(id) on delete cascade,
  stats jsonb not null,
  products jsonb not null,
  monthly_metrics jsonb not null,
  fee_breakdown jsonb not null,
  insights jsonb not null,
  created_at timestamptz default now()
);

alter table public.analysis_cache enable row level security;
create policy "Users view own analysis" on public.analysis_cache for all using (auth.uid() = user_id);

-- ─── NOTIFICATIONS ────────────────────────────
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'return_spike', 'profit_drop', 'weekly_summary', 'sale_event'
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- ─── AUTO CREATE PROFILE ─────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, store_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'store_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── RESET MONTHLY UPLOAD COUNT ──────────────
create or replace function public.reset_monthly_uploads()
returns void as $$
begin
  update public.profiles set uploads_this_month = 0;
end;
$$ language plpgsql security definer;
