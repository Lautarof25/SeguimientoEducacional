# SeguimientoEducacional

## Documentación del proyecto

La documentación completa del proyecto, incluyendo su objetivo, arquitectura, flujo de funcionamiento y configuración, está disponible en [docs/README.md](docs/README.md).

## Configuración de autenticación

La aplicación usa Supabase Auth para registro/login y guarda el avance de cada usuario en `lesson_progress`.

1. Crea un proyecto en Supabase.
2. En el SQL Editor ejecuta:

```sql
create table public.lesson_progress (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	course_id text not null,
	completed_lessons integer not null default 0 check (completed_lessons between 0 and 4),
	updated_at timestamptz not null default now(),
	unique (user_id, course_id)
);

create index if not exists idx_lesson_progress_user_id
on public.lesson_progress (user_id);

create index if not exists idx_lesson_progress_course_id
on public.lesson_progress (course_id);

alter table public.lesson_progress enable row level security;

create policy "Users can read their own progress"
	on public.lesson_progress for select
	using (auth.uid() = user_id);

create policy "Users can create their own progress"
	on public.lesson_progress for insert
	with check (auth.uid() = user_id);

create policy "Users can update their own progress"
	on public.lesson_progress for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);
```

3. Copia la URL del proyecto y la clave pública `anon` en `index.html`, dentro de `window.SUPABASE_CONFIG`:

```js
window.SUPABASE_CONFIG = {
		url: 'https://kqcttyhlncouqffucvda.supabase.co',
		anonKey: 'sb_publishable_1M2isbWbg2zwyfd9fMrytg_jpkNoK9b'
};
```

La clave `anon` puede estar en el frontend cuando RLS está correctamente configurado. Nunca publiques la `service_role`.

En Authentication > URL Configuration configura la URL local y la URL de producción. Si habilitas la confirmación de email, el usuario deberá verificar su cuenta antes de iniciar sesión.

El login protege esta aplicación y el progreso almacenado, pero no cambia los permisos de las páginas embebidas de Notion. Esas páginas deben protegerse desde Notion si contienen información privada.
