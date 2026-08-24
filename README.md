# Oregon Vehicle Guide

Oregon DMVの車両title、登録、名義変更を日本語で案内するWebアプリです。選択式ガイドはAPIキーなしで利用でき、自由質問はOpenAI Responses APIをサーバー側から呼び出します。

> 非公式の一般案内です。手続き前に必ずOregon DMVの公式情報を確認してください。

## ローカル起動

Node.js 20以上を用意し、リポジトリ直下で実行します。

```bash
npm run dev
```

ブラウザで `http://127.0.0.1:3000` を開きます。選択式ガイドはこのまま動作します。

AI質問機能も使う場合は、`.env.example` を参考に環境変数を設定してから起動してください。`.env` やAPIキーはGitへコミットしないでください。

PowerShellの例：

```powershell
$env:OPENAI_API_KEY="your_api_key"
$env:OPENAI_MODEL="gpt-5.4-mini"
npm run dev
```

## テスト

```bash
npm test
```

## GitHubとRenderへの公開

1. GitHubで空のリポジトリを作る
2. このプロジェクトをcommitしてpushする
3. Render Dashboardで **New > Blueprint** を選ぶ
4. GitHubリポジトリを接続する（`render.yaml` が自動検出されます）
5. `OPENAI_API_KEY` の値をRender上で登録する
6. Blueprintを作成してデプロイする

手動でWeb Serviceを作る場合、Build Commandは `npm install`、Start Commandは `npm start`、Health Check Pathは `/health` にします。APIキーはRenderのEnvironmentへ登録し、GitHubへは保存しません。

## 情報の更新

公式情報と選択式フローは `data/knowledge.js` で管理します。内容を更新したら `LAST_REVIEWED` も更新し、`npm test` を実行してください。

## セキュリティ方針

- APIキーはサーバー環境変数だけに保存
- OpenAI APIへのリクエストは `store: false`
- VIN、SSN、免許証番号、生年月日、住所などを入力しないよう表示
- エラー時のログに質問本文やAPIレスポンス本文を残さない
- 回答はOregon DMV公式情報に限定し、不明な場合は「あっぷる」と明示
