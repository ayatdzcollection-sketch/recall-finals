-- Crowd calibration: a READ-ONLY aggregate view over events.
-- Exposes only per-item counts/rates (no raw rows, no anon IDs), so the
-- anonymous client can read crowd difficulty while raw events stay private.
-- Run this once in the Supabase SQL editor.

create or replace view public.item_stats as
select
  item,
  count(*)                                as attempts,
  count(*) filter (where correct = 1)     as correct,
  round(avg(rt))                          as avg_rt,
  count(distinct anon)                    as learners
from public.events
where app = 'recall' and item is not null and correct is not null
group by item;

-- let the anonymous (publishable-key) client read the aggregates...
grant select on public.item_stats to anon;
-- ...without ever granting it the raw events table (it can only INSERT there).

-- If a GET /rest/v1/item_stats returns 404 right after, nudge PostgREST:
--   notify pgrst, 'reload schema';
