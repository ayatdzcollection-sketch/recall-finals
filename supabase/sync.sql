-- Recall cross-device sync (run once in the Supabase SQL editor).
-- One row per secret "sync code". The row is reachable ONLY through the two
-- SECURITY DEFINER functions below, so the public anon key can never list or
-- read other people's rows: you must already know the exact code.

create table if not exists public.sync (
  code       text primary key,
  data       text not null,
  rev        bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.sync enable row level security;
-- (intentionally NO policies => all direct anon table access is blocked)

-- read one row by its secret code
create or replace function public.sync_get(p_code text)
returns table(data text, rev bigint)
language sql
security definer
set search_path = public
as $$
  select s.data, s.rev from public.sync s where s.code = p_code;
$$;

-- create or update one row by code, with optimistic concurrency on rev
create or replace function public.sync_put(p_code text, p_data text, p_rev bigint)
returns table(rev bigint, conflict boolean)
language plpgsql
security definer
set search_path = public
as $$
declare cur bigint;
begin
  if p_code is null or length(p_code) < 12 then
    raise exception 'code too short';
  end if;
  select s.rev into cur from public.sync s where s.code = p_code;
  if cur is null then
    insert into public.sync(code, data, rev) values (p_code, p_data, 1);
    rev := 1; conflict := false; return next; return;
  end if;
  if p_rev is not null and p_rev <> cur then
    rev := cur; conflict := true; return next; return;   -- caller re-pulls, merges, retries
  end if;
  update public.sync set data = p_data, rev = cur + 1, updated_at = now() where code = p_code;
  rev := cur + 1; conflict := false; return next; return;
end;
$$;

-- expose ONLY the two functions to the anon (publishable) key, not the table
revoke all on function public.sync_get(text) from public;
revoke all on function public.sync_put(text, text, bigint) from public;
grant execute on function public.sync_get(text) to anon;
grant execute on function public.sync_put(text, text, bigint) to anon;
