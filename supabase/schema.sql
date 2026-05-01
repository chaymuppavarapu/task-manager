create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'member' check (role in ('admin', 'member'))
);
alter table profiles add column if not exists role text;
update profiles set role = coalesce(role, 'member');
alter table profiles alter column role set default 'member';
alter table profiles alter column role set not null;
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('admin', 'member'));

create table if not exists projects (
  id bigint generated always as identity primary key,
  name text not null,
  created_by uuid not null references profiles(id) on delete cascade
);

create table if not exists tasks (
  id bigint generated always as identity primary key,
  title text not null,
  status text not null default 'todo' check (status in ('todo', 'done')),
  assigned_to uuid not null references profiles(id) on delete cascade,
  project_id bigint not null references projects(id) on delete cascade,
  due_date date
);

create table if not exists project_members (
  id bigint generated always as identity primary key,
  project_id bigint not null references projects(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  unique (project_id, user_id)
);

alter table profiles disable row level security;
alter table projects disable row level security;
alter table tasks disable row level security;
alter table project_members disable row level security;
