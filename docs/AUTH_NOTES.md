# 認証・データ保存 方針（ドラフト）

## ゴール
- Google/LINE ログインを用いて「勝利予想」をユーザー毎に保存・集計し、勝率などをマイページで共有可能にする。

## 段階導入
1. S2: Googleログインのみ導入（開発容易・審査不要に近い）
2. S3: LINEログイン追加（Auth.jsのLINE Provider or OIDC直）

## 実装オプション
- Supabase（推奨: MVP〜スモール運用向け）
  - Auth（Google/LINE対応）+ Postgres + Row Level Security
  - クライアントSDKから安全にRLS越しで読み書き（API最小化）
- Auth.js（NextAuth）+ 低コードDB
  - サーバレス関数でコールバックを処理し、JWTをAstroに引き渡す
  - DBはNeon/Postgres等

## 最小データモデル（例: Postgres）
```
users(id, provider, provider_user_id, display_name, created_at)
events(id, name, event_date)
fights(id, event_id, fighter_id, opponent_id)
predictions(id, user_id, fight_id, pick_fighter_id, created_at)
results(fight_id, winner_fighter_id, method, round)
user_stats(user_id, total, wins, losses, draws, updated_at)
```
RLS例:
- `predictions.user_id = auth.uid()` の行のみ読書き許可

## Astro連携
- SSGは継続。Authが必要なページはクライアント境界（islands）で処理
- マイページはCSRで表示、SSGはシェルのみ
- ページ例: `/predict`（公開: ログイン誘導表示あり）, `/me`（要ログイン）

## 最初の着手
1) Supabaseプロジェクト作成、Google OAuth有効化（LINEは後続）
2) RLSルール下で `predictions` へのCRUD を確認
3) AstroにAuthクライアントを組み込み、`/me` で自分の予想一覧を表示

