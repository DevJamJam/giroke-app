-- 계정·설정 owner isolation 검증 (23장 Security: owner / unrelated user / anon)
begin;
select plan(26);

-- 준비: 사용자 A(owner), B(unrelated)
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'b@test.local');

create function pg_temp.login(uid uuid) returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
$$;
create function pg_temp.logout() returns void language sql as $$
  select set_config('role', 'postgres', true), set_config('request.jwt.claims', '', true);
$$;

-- RLS baseline: public schema의 모든 테이블에 RLS가 켜져 있다
select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity),
  0, 'public 테이블은 모두 RLS 활성');

-- 온보딩
select pg_temp.login('00000000-0000-0000-0000-00000000000a');
select lives_ok($$ select public.complete_onboarding('  에이  ', 'Asia/Seoul') $$, 'A 온보딩 성공');
select is((select nickname from public.profiles), '에이', '닉네임 앞뒤 공백 제거');
select is((select theme_preference::text from public.user_settings), 'system', '테마 기본값 system');
select throws_ok($$ select public.complete_onboarding('다시', 'Asia/Seoul') $$, '23505', null, '온보딩 두 번은 거부');

select pg_temp.login('00000000-0000-0000-0000-00000000000b');
select throws_ok($$ select public.complete_onboarding('비', 'Mars/Base') $$, '22023', null, '잘못된 timezone 거부');
select is((select count(*)::int from public.profiles where id = auth.uid()), 0, 'timezone 실패 시 profile도 남지 않음(한 transaction)');
select throws_ok($$ select public.complete_onboarding('   ', 'Asia/Seoul') $$, '23514', null, '빈 닉네임 거부');
select throws_ok($$ select public.complete_onboarding(repeat('가', 21), 'Asia/Seoul') $$, '23514', null, '21자 닉네임 거부');
select lives_ok($$ select public.complete_onboarding('비', 'America/New_York') $$, 'B 온보딩 성공');

-- 직접 INSERT·DELETE 금지 (RPC만)
select throws_ok($$ insert into public.profiles (id, nickname) values (auth.uid(), 'x') $$, '42501', null, 'profiles 직접 insert 금지');
select throws_ok($$ delete from public.user_settings $$, '42501', null, 'user_settings 직접 delete 금지');

-- B는 자기 것만 보인다
select results_eq($$ select nickname from public.profiles $$, array['비'], 'B는 자기 profile만 조회');
select is((select count(*)::int from public.user_settings), 1, 'B는 자기 settings만 조회');

-- B가 A를 수정하려 해도 0행
update public.profiles set nickname = '해킹' where id = '00000000-0000-0000-0000-00000000000a';
update public.user_settings set theme_preference = 'dark' where user_id = '00000000-0000-0000-0000-00000000000a';

-- 허용되지 않은 열 수정 금지
select throws_ok($$ update public.profiles set id = gen_random_uuid() $$, '42501', null, 'profiles.id 수정 금지');
select throws_ok($$ update public.user_settings set user_id = gen_random_uuid() $$, '42501', null, 'user_settings.user_id 수정 금지');

-- 본인 수정은 허용, timezone 검증은 수정에도 적용
select lives_ok($$ update public.user_settings set theme_preference = 'dark' $$, 'B 자기 테마 수정');
select throws_ok($$ update public.profiles set nickname = ' 공백 ' $$, '23514', null, '직접 수정도 앞뒤 공백 닉네임 거부');
select throws_ok($$ update public.profiles set nickname = E'　' $$, '23514', null, '전각 공백만 있는 닉네임 거부');
select throws_ok($$ update public.user_settings set timezone = 'Nowhere/City' $$, '22023', null, '수정 시에도 잘못된 timezone 거부');

-- 소유자(postgres)로 확인: A의 데이터는 B의 시도에 영향받지 않음
select pg_temp.logout();
select is((select nickname from public.profiles where id = '00000000-0000-0000-0000-00000000000a'), '에이', 'B가 A 닉네임을 못 바꿈');
select is((select theme_preference::text from public.user_settings where user_id = '00000000-0000-0000-0000-00000000000a'), 'system', 'B가 A 테마를 못 바꿈');
select is((select theme_preference::text from public.user_settings where user_id = '00000000-0000-0000-0000-00000000000b'), 'dark', 'B 자기 테마는 바뀜');

-- anon: 아무것도 못 봄, RPC 실행 불가
select set_config('role', 'anon', true);
select throws_ok($$ select * from public.profiles $$, '42501', null, 'anon은 profiles 조회 불가');
select throws_ok($$ select public.complete_onboarding('익명', 'Asia/Seoul') $$, '42501', null, 'anon은 온보딩 RPC 불가');
select pg_temp.logout();

-- updated_at 트리거
select ok(
  (select updated_at >= created_at from public.user_settings where user_id = '00000000-0000-0000-0000-00000000000b'),
  'updated_at 갱신');

select * from finish();
rollback;
