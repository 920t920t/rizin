# RIZIN 選手名鑑（テキスト先行MVP）

このリポジトリはAstroで静的生成(SSG)されたサイトです。画像無し・日本語UI・Wikipediaテキスト(一部)の再利用(CC BY-SA 4.0)に対応しています。

## まずサイトを見る（非エンジニア向け）

1. Node.jsを入れる
   - 既に入っている場合はスキップ。なければ Node.js 20 をインストール。
2. 本フォルダを開く（このREADMEが見える場所）。
3. 依存を入れる
   - ターミナルで: `npm install`
4. 開発サーバを起動
   - `npm run dev`
   - ブラウザで `http://localhost:4321` を開く
   - 見どころ: 「選手一覧」「クイズ」「注目マッチアップ」「見たい投票(ローカル)」
5. 本番ビルドして確認（静的HTML出力）
   - `ASTRO_TELEMETRY_DISABLED=1 npm run build`
   - 生成物は `dist/` に出力
   - `npm run preview` で簡易サーバで閲覧可

※ エラーや警告に「.tsxが未対応」と出る場合は、既存の `src/pages/*.tsx` を `_index.tsx` のように先頭に`_`を付けて一時的に無視してください（Astroが同名ページを拾わないようにするため）。

## データについて
- `data/*.json` のみ参照します（ネットワーク通信なし）
- 最低限のファイル: `fighters.json`, `featured_bouts.json`, `votes.json`

## GitHub Pages で公開（任意・推奨）
1) GitHubに空のリポジトリを作成（例: `rizin-fighters`）。
2) ローカルから接続
```
# まだ未初期化なら
git init
git add .
git commit -m "feat: initial MVP (Astro)"
git branch -M main
git remote add origin git@github.com:<YOUR_ACCOUNT>/rizin-fighters.git
git push -u origin main
```
3) GitHubのリポジトリ設定 → Pages → Source を「GitHub Actions」に設定。
4) `.github/workflows/deploy.yml` が自動でビルド＆デプロイします。
   - 反映先URLは `https://<YOUR_ACCOUNT>.github.io/<REPO>/` です。

補足: 本プロジェクトの内部リンクは `import.meta.env.BASE_URL` を使っており、GitHub Pagesのサブパス配信（`/<REPO>/`）でも動作します。

## ライセンスとクレジット
- 本サイトのテキストの一部はWikipediaを [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ja) で再利用しています。
- フッターに再利用表記とライセンス/出典リンクを常時表示しています。

## コマンド一覧
- `npm run dev` 開発サーバ（http://localhost:4321）
- `npm run build` 本番ビルド（`dist/`出力）
- `npm run preview` 本番ビルドのプレビュー

