---
title: "Object scanning"
description: "Control the RustFS background scanner, its bit-rot cycle, and the metrics that show scans are still running."
---

The background scanner walks buckets and drives, records usage, and can queue objects for healing. A separate cycle runs deeper bit-rot checks. Use this page to see what the scanner does, how to slow it down, and which metrics show that it is still running.

## What the scanner does

On each cycle the scanner visits objects and directories and updates usage data. When it finds storage that needs repair, it can queue that object for healing. Healing runs on its own schedule. See [Node healing](/operations/high-availability/node-healing) for how reconstructed data is written back.

Deep bit-rot scans use a separate interval. `RUSTFS_SCANNER_BITROT_CYCLE_SECS` defaults to `2592000` (30 days). Set it to `0`, `true`, or `on` to make every cycle a deep scan, or to `false` or `off` to turn deep scans off.

Reads can also discover damage and submit repair work. That path is separate from the background cycle.

## Control the scan rate

`RUSTFS_SCANNER_SPEED` selects a preset: `fastest`, `fast`, `default`, `slow`, or `slowest`. The preset sets how long the scanner sleeps between objects, the maximum sleep, and the cycle interval. Override one value at a time:

| Variable | Default | Purpose |
| --- | --- | --- |
| `RUSTFS_SCANNER_DELAY` | preset | Sleep multiplier, for example `30.0` |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | preset | Maximum sleep, in seconds |
| `RUSTFS_SCANNER_CYCLE` | preset | Cycle interval, in seconds. An example override is `3600` |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | When `true`, the scanner throttles itself |

Cycle budgets, startup delay, and concurrency caps are listed in the [environment variable reference](/reference/environment-variables).

## Monitor scans

With OpenTelemetry export enabled, use the scanner series documented in [Observability](/operations/observability):

- `rustfs_scanner_cycles_total` counts finished cycles and is labeled by result.
- `rustfs_scanner_objects_scanned_total` counts objects visited.
- `rustfs_scanner_inline_heal_total` counts objects the scanner queued for healing.
- `rustfs_scanner_cycle_duration_seconds` is the duration of the last completed cycle.

If `rustfs_scanner_cycles_total` does not increase, treat the scanner as stalled and follow the alert hint on that page. Per-drive online state is shown on the Console and through the admin API, not as a dedicated scanner metric.

## Next steps

- [Replace a failed drive](/troubleshooting/driver)
- [Recover a failed node](/troubleshooting/node)
- [Monitor healing](/operations/high-availability/node-healing)
