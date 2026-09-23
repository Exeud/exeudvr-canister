# Scaffold registration — known gap

This directory exists so `staging/scripts/load-scaffold.sh` picks up
`legacy@0.31.0` and it becomes a second, selectable option next to `default`
in the Studio's "build new stage" form (see `../../docs/SCAFFOLD_CONTRACT.md`
in `stage-scaffold` for the registration convention this mirrors).

**Front only, for now.** `assetstorage.wasm.gz` here is the same official
DFINITY SDK 0.31.0 asset canister `stage-scaffold` pins — legitimate, since
`dfx.json`'s `frontend` canister (`type: "assets"`) is that exact wasm. A
stage built with `legacy@0.31.0` today gets a working front canister and
nothing else; `buildStage` installs no backstage for it.

**Not done: the real backstage.** `backend/Backend.mo` (this repo) is the
legacy scaffold's actual value — EXT coin/token logic — but it targets
`mo:base` via `dfx`'s bundled moc, a different toolchain than the
`mo:core`/`icp-cli` stack this portal now builds against (see
`exeu6/documents/ICP_DEV.md` §0). It has not been rebuilt/verified against
the pinned `moc` here, gzip-pinned into `backend.wasm.gz`, or wired into
`buildStage`'s dual-canister install. Nor has the webpack `frontend/` app
(the actual legacy UI/Unity bridge, as opposed to the bare asset canister)
been baked in as the front's initial content the way `stage-scaffold`'s
`placeholder/index.html` is. Both are follow-up work, not attempted here.
