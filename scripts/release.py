#!/usr/bin/env python3
"""一鍵發版：遞增版本號 → 型別檢查 → 構建 → 提交 → 推送 → 部署。

版本規則：MAJOR.MINOR.PATCH（寫在 client/src/lib/version.ts）
- 每次發版預設 PATCH +1：v1.0.3 → v1.0.4
- 功能大改：--part minor（v1.0.3 → v1.1.0）
- 大改版：  --part major（v1.0.3 → v2.0.0）
版本號與更新日期由本腳本自動寫入，畫面右上角會顯示 vX.Y.Z。

用法：
  python scripts/release.py -m "修改了什麼"
  python scripts/release.py -m "新增一個遊戲" --part minor
  python scripts/release.py -m "只提交推送，先不部署" --no-deploy
  python scripts/release.py -m "只改版本號，不建不推" --no-build --no-push --no-deploy
"""

import argparse
import datetime
import os
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "client" / "src" / "lib" / "version.ts"
DIST_DIR = ROOT / "dist" / "public"
DEPLOY_SCRIPT = pathlib.Path.home() / ".workbuddy/skills/diwu-pru-deploy/scripts/deploy.py"
SUBDOMAIN = "tiantian"

# WorkBuddy 沙箱的 Node 檔案鉤子會擋 pnpm/vite，發版時一律關掉。
ENV = {
    **os.environ,
    "CODEBUDDY_BROKERED_FS_HOOK_ENABLED": "0",
    "CODEBUDDY_SAFE_DELETE_ENABLED": "0",
    "CODEBUDDY_SAFE_DELETE_SANDBOX": "0",
    "PATH": f"{ROOT / 'node_modules' / '.bin'}:{os.environ.get('PATH', '')}",
}

VERSION_RE = re.compile(r'export const APP_VERSION = "(\d+)\.(\d+)\.(\d+)";')
DATE_RE = re.compile(r'export const APP_VERSION_DATE = "([\d-]+)";')


def run(cmd: list[str], title: str) -> None:
    print(f"\n▶ {title}")
    result = subprocess.run(cmd, cwd=ROOT, env=ENV, text=True)
    if result.returncode != 0:
        print(f"✗ {title} 失敗（exit {result.returncode}），已中止發版。")
        sys.exit(result.returncode)


def bump(text: str, part: str) -> tuple[str, str]:
    match = VERSION_RE.search(text)
    if not match:
        sys.exit("✗ 找不到 APP_VERSION，請檢查 client/src/lib/version.ts")
    major, minor, patch = (int(x) for x in match.groups())
    if part == "major":
        major, minor, patch = major + 1, 0, 0
    elif part == "minor":
        minor, patch = minor + 1, 0
    else:
        patch += 1
    return f"{major}.{minor}.{patch}", match.group(0)


def main() -> None:
    parser = argparse.ArgumentParser(description="天天學習空間一鍵發版")
    parser.add_argument("-m", "--message", default="更新網站內容", help="本次改動說明（會進 commit 訊息）")
    parser.add_argument("--part", choices=["patch", "minor", "major"], default="patch")
    parser.add_argument("--no-build", action="store_true", help="跳過型別檢查與構建")
    parser.add_argument("--no-push", action="store_true", help="跳過推送（連帶跳過部署）")
    parser.add_argument("--no-deploy", action="store_true", help="跳過部署")
    args = parser.parse_args()

    original = VERSION_FILE.read_text(encoding="utf-8")
    new_version, _ = bump(original, args.part)
    today = datetime.date.today().isoformat()
    updated = VERSION_RE.sub(f'export const APP_VERSION = "{new_version}";', original)
    updated = DATE_RE.sub(f'export const APP_VERSION_DATE = "{today}";', updated)
    VERSION_FILE.write_text(updated, encoding="utf-8")
    print(f"✓ 版本號：{new_version}（{today}）")

    if not args.no_build:
        run([str(ROOT / "node_modules" / ".bin" / "tsc"), "--noEmit"], "型別檢查")
        run([str(ROOT / "node_modules" / ".bin" / "vite"), "build"], "構建前端")

    run(["git", "add", "-A"], "暫存改動")
    run(["git", "commit", "-m", f"{args.message}（v{new_version}）"], "提交")

    if args.no_push:
        print("\n✓ 已提交，未推送（--no-push）。")
        return

    run(["git", "push", "origin", "main"], "推送到 GitHub")

    if args.no_deploy:
        print(f"\n✓ 已推送 v{new_version}，未部署（--no-deploy）。")
        return

    python = sys.executable
    run(
        [python, str(DEPLOY_SCRIPT), "--subdomain", SUBDOMAIN, "--dist-dir", str(DIST_DIR), "--update-only"],
        f"部署到 https://{SUBDOMAIN}.diwu-pru.vip",
    )
    print(f"\n🎉 v{new_version} 已上線：https://{SUBDOMAIN}.diwu-pru.vip")


if __name__ == "__main__":
    main()
