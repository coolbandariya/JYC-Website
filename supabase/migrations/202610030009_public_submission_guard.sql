-- JYC public submission abuse boundary.
begin;

create table if not exists public.jyc_public_submission_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.jyc_public_submission_rate_limits enable row level security;
revoke all on public.jyc_public_submission_rate_limits from anon, authenticated;
revoke insert on public.jyc_contact_submissions from anon, authenticated;
revoke insert on public.jyc_project_submissions from anon, authenticated;

create or replace function public.jyc_allow_public_submission(
  p_fingerprint text,
  p_limit integer default 5,
  p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  now_ts timestamptz := now();
  row_data public.jyc_public_submission_rate_limits;
begin
  if random() < 0.02 then
    delete from public.jyc_public_submission_rate_limits
    where updated_at < now() - interval '2 days';
  end if;
  if coalesce(trim(p_fingerprint),'') = '' then return false; end if;
  p_limit := greatest(1, least(coalesce(p_limit,5),50));
  p_window_seconds := greatest(60, least(coalesce(p_window_seconds,3600),86400));
  insert into public.jyc_public_submission_rate_limits(fingerprint,window_started_at,request_count,updated_at)
  values(trim(p_fingerprint),now_ts,1,now_ts)
  on conflict(fingerprint) do update
    set request_count = case
      when now_ts - jyc_public_submission_rate_limits.window_started_at >= make_interval(secs => p_window_seconds)
        then 1
      else jyc_public_submission_rate_limits.request_count + 1
    end,
    window_started_at = case
      when now_ts - jyc_public_submission_rate_limits.window_started_at >= make_interval(secs => p_window_seconds)
        then now_ts
      else jyc_public_submission_rate_limits.window_started_at
    end,
    updated_at = now_ts
  returning * into row_data;
  return row_data.request_count <= p_limit;
end;
$$;
-- Keep the limiter table bounded without requiring a separate scheduler extension.
create or replace function public.jyc_prune_public_submission_limits()
returns void
language sql
security definer
set search_path = public
as $
  delete from public.jyc_public_submission_rate_limits
  where updated_at < now() - interval '2 days';
$;
revoke all on function public.jyc_prune_public_submission_limits() from public;
grant execute on function public.jyc_prune_public_submission_limits() to service_role;

revoke all on function public.jyc_allow_public_submission(text,integer,integer) from public;
grant execute on function public.jyc_allow_public_submission(text,integer,integer) to service_role;

commit;
select 'JYC public submission abuse limiter enabled.' as result;