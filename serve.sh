#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  serve.sh — serve this folder, and say which build it is.
#
#  The demo is static, so there are only two ways to end up looking at
#  the wrong thing: serve the wrong folder, or be handed a cached file.
#  This closes both. It serves its own directory rather than trusting
#  the shell's, it names the commit on screen, it says out loud when a
#  server is already holding the port, and the URL it prints carries
#  the commit so a new build is always a new URL.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
root="$(pwd)"

# ── which build is this ──────────────────────────────────────

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no checkout")"
hash="$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")"
dirty=""
if ! git diff --quiet HEAD 2>/dev/null; then
  dirty="dirty"
fi

stamp="$hash · $branch · $(date -u +%Y-%m-%dT%H:%MZ)"
[ -n "$dirty" ] && stamp="$stamp · $dirty"

printf 'serving   %s\n' "$root"
printf 'commit    %s · %s%s\n' "$hash" "$branch" "${dirty:+ · $dirty}"

# ── and is it the one on the remote ──────────────────────────

if git rev-parse --git-dir >/dev/null 2>&1; then
  git fetch -q origin main 2>/dev/null || true
  remote="$(git rev-parse --short origin/main 2>/dev/null || true)"
  if [ -n "$remote" ] && [ "$hash" != "$remote" ]; then
    printf '\n  ! this is not origin/main (%s). Serving it anyway. To move:\n' "$remote"
    printf '      git fetch --prune origin && git checkout main && git reset --hard origin/main\n\n'
  fi
fi

# ── a free port, and a name for whatever holds the taken ones ─

in_use() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }

describe() {
  local p="$1" code
  code="$(curl -s -m 2 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$p/assets/js/system.js" 2>/dev/null || true)"
  if [ "$code" = "200" ]; then
    printf 'another copy of this demo'
  else
    printf 'not this demo — assets/js/system.js returns %s' "${code:-nothing}"
  fi
}

port=""
for p in 8080 8081 8082 8083 8084 8085 8086 8087 8088 8089 8090; do
  if in_use "$p"; then
    printf 'port %s   in use — %s\n' "$p" "$(describe "$p")"
    if command -v lsof >/dev/null 2>&1; then
      lsof -nP -iTCP:"$p" -sTCP:LISTEN 2>/dev/null | tail -n +2 |
        awk '{ printf "           held by %s (pid %s)\n", $1, $2 }'
    fi
  else
    port="$p"
    break
  fi
done

if [ -z "$port" ]; then
  printf '\nno free port between 8080 and 8090. Free one and run this again.\n' >&2
  exit 1
fi

# ── the stamp the presenter overlay reads ────────────────────

# the port belongs in it: run two of these and neither claims the other's
stamp="$stamp · :$port"
printf '%s\n' "$stamp" > build.txt

printf '\nopen      http://localhost:%s/?v=%s#rest\n' "$port" "$hash"
printf 'press P on the page to see the commit it is serving\n\n'

# ── whatever static server this machine has ──────────────────

# Edit a stylesheet, reload, see the edit. Python's plain http.server sends no
# Cache-Control at all, which lets a browser decide for itself how long to keep
# a file — so an edit can sit there invisible until a hard reload. This says
# no-store on every response instead.
no_cache_server='
import sys, http.server, socketserver

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", int(sys.argv[1])), Handler) as httpd:
    print("serving with no-store on port " + sys.argv[1], flush=True)
    httpd.serve_forever()
'

server=()
may_cache=""
if command -v python3 >/dev/null 2>&1; then
  server=(python3 -c "$no_cache_server" "$port")
elif command -v python >/dev/null 2>&1; then
  may_cache="yes"
  if python -c 'import sys; sys.exit(0 if sys.version_info[0] > 2 else 1)' 2>/dev/null; then
    server=(python -m http.server "$port")
  else
    server=(python -m SimpleHTTPServer "$port")
  fi
elif command -v npx >/dev/null 2>&1; then
  may_cache="yes"
  server=(npx --yes serve -l "$port" .)
elif command -v php >/dev/null 2>&1; then
  may_cache="yes"
  server=(php -S "localhost:$port")
else
  printf 'no static server found. Install python3, node, or php.\n' >&2
  rm -f build.txt
  exit 1
fi

if [ -n "$may_cache" ]; then
  printf 'note: no python3 here, so this server may cache — hard-reload after an edit\n\n'
fi

"${server[@]}" &
pid=$!

# The stamp describes a running server, so it goes when the server does —
# unless another instance has since written its own, which stays.
cleanup() {
  if [ -f build.txt ] && [ "$(cat build.txt)" = "$stamp" ]; then
    rm -f build.txt
  fi
  kill "$pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait "$pid"
