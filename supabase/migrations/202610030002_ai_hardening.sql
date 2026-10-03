-- JYC AI assistant hardening: distributed rate limit + response contract.

begin;

create table if not exists public.jyc_ai_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default date_trunc('minute', now()),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.jyc_ai_rate_limits enable row level security;
revoke all on public.jyc_ai_rate_limits from anon, authenticated;

create or replace function public.jyc_allow_ai_request(p_user_id uuid, p_limit integer default 20)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := date_trunc('minute', now());
  v_count integer;
begin
  if p_user_id is null or p_limit < 1 or p_limit > 100 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('jyc:ai-rate:' || p_user_id::text, 0));

  insert into public.jyc_ai_rate_limits(user_id,window_started_at,request_count,updated_at)
  values(p_user_id,v_window,1,now())
  on conflict (user_id) do update
    set window_started_at = case
      when public.jyc_ai_rate_limits.window_started_at < v_window then v_window
      else public.jyc_ai_rate_limits.window_started_at
    end,
    request_count = case
      when public.jyc_ai_rate_limits.window_started_at < v_window then 1
      else public.jyc_ai_rate_limits.request_count + 1
    end,
    updated_at = now();

  select request_count into v_count
  from public.jyc_ai_rate_limits
  where user_id=p_user_id;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.jyc_allow_ai_request(uuid,integer) from public;
grant execute on function public.jyc_allow_ai_request(uuid,integer) to service_role;

commit;

select 'JYC AI hardening migration complete.' as result;
