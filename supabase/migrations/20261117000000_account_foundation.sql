-- 계정·설정 기반: profiles, user_settings, 온보딩 RPC, RLS baseline
-- 원칙: base 테이블은 owner only, 여러 테이블을 바꾸는 동작은 RPC 하나로 처리한다.

-- 공통: updated_at 자동 갱신
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create type public.theme_preference as enum ('light', 'dark', 'system');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- 앞뒤 공백(전각 공백 포함)은 저장하지 않는다: RPC든 직접 UPDATE든 같은 규칙
  nickname text not null check (
    nickname = btrim(nickname, E' \t\n\r　') and char_length(nickname) between 1 and 20
  ),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  timezone text not null,
  theme_preference public.theme_preference not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- timezone은 IANA 이름만 허용 (pg_timezone_names는 immutable이 아니라 check 대신 트리거로 검사)
create function public.validate_timezone()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then
    raise exception 'invalid timezone: %', new.timezone using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger user_settings_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();
create trigger user_settings_timezone before insert or update of timezone on public.user_settings
  for each row execute function public.validate_timezone();

-- RLS: owner only. 행 생성은 complete_onboarding RPC만, 삭제는 회원탈퇴(Edge Function)만.
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

revoke all on public.profiles, public.user_settings from anon, authenticated;
grant select on public.profiles, public.user_settings to authenticated;
grant update (nickname, avatar_path) on public.profiles to authenticated;
grant update (timezone, theme_preference) on public.user_settings to authenticated;

create policy "profiles: owner select" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: owner update" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "user_settings: owner select" on public.user_settings
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_settings: owner update" on public.user_settings
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- 온보딩: profile과 settings를 한 transaction에서 만든다(18장). 이미 했으면 오류.
create function public.complete_onboarding(p_nickname text, p_timezone text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if exists (select 1 from public.profiles where id = uid) then
    raise exception 'already onboarded' using errcode = '23505';
  end if;

  insert into public.profiles (id, nickname) values (uid, btrim(p_nickname, E' \t\n\r　'));
  insert into public.user_settings (user_id, timezone) values (uid, p_timezone);
end;
$$;

revoke all on function public.complete_onboarding(text, text) from public, anon;
grant execute on function public.complete_onboarding(text, text) to authenticated;

-- 트리거 함수는 직접 호출할 일이 없다
revoke all on function public.set_updated_at(), public.validate_timezone() from public, anon, authenticated;
