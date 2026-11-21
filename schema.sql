-- ILM Books: initial Supabase schema
-- Run in Supabase Dashboard > SQL Editor. Review before running on a live project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  biography text,
  photo_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.authors(id) on delete set null,
  title text not null,
  slug text unique,
  description text,
  category text,
  language text not null default 'English',
  cover_path text,
  pdf_path text, -- Store private object path only, never a public paid-PDF URL.
  price_kes integer not null default 0 check (price_kes >= 0),
  is_free boolean not null default true,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((is_free and price_kes = 0) or (not is_free and price_kes > 0))
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete restrict,
  amount_kes integer not null check (amount_kes >= 0),
  payment_provider text,
  provider_reference text unique,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.books enable row level security;
alter table public.purchases enable row level security;
alter table public.wishlist enable row level security;

-- Public can read published book catalogue and author profiles.
create policy "Public can view published books" on public.books
for select using (status = 'published');

create policy "Public can view authors" on public.authors
for select using (true);

-- Customers can read/update only their own profile (role is not client-editable).
create policy "Users read own profile" on public.profiles
for select to authenticated using (auth.uid() = id);
create policy "Users update own display name" on public.profiles
for update to authenticated using (auth.uid() = id)
with check (auth.uid() = id and role = 'customer');

-- Customers can view only their own purchases.
create policy "Users read own purchases" on public.purchases
for select to authenticated using (auth.uid() = user_id);

-- Customers manage only their own wishlist.
create policy "Users read own wishlist" on public.wishlist
for select to authenticated using (auth.uid() = user_id);
create policy "Users add own wishlist items" on public.wishlist
for insert to authenticated with check (auth.uid() = user_id);
create policy "Users remove own wishlist items" on public.wishlist
for delete to authenticated using (auth.uid() = user_id);

-- IMPORTANT:
-- Do not add public INSERT/UPDATE policies for purchases or books.
-- Payment verification and privileged admin actions must run server-side
-- (e.g. Supabase Edge Functions using the service role key stored as a secret).
-- Never put the service_role key in browser JavaScript.
-- Create a private Storage bucket named "book-files". Paid PDFs must remain private.
-- Only issue short-lived signed URLs after server-side purchase verification.
