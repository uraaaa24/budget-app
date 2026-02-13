# 技術仕様書（Budget App）

## 1. 目的
本アプリは家計管理（Budget）を対象としたモバイルアプリ + API サーバー構成で開発する。

- フロントエンド: React Native（Expo）
- バックエンド: Hono（Node.js）
- リポジトリ: pnpm + Turborepo のモノレポ

## 2. リポジトリ構成

```text
apps/
  mobile/    # React Native (Expo)
  backend/   # Hono API (Onion Architecture)
  docs/      # ドキュメント
packages/
  eslint-config/
  typescript-config/
  ui/
```

## 3. 共通基盤

### 3.1 モノレポ管理
- Package Manager: `pnpm@9`
- Task Runner: `turbo`
- Workspace: `pnpm-workspace.yaml` で `apps/*`, `packages/*` を管理

### 3.2 TypeScript
- ルートは TypeScript を採用
- 共通 TS 設定は `@repo/typescript-config` に集約

### 3.3 Lint
- 共通 ESLint 設定は `@repo/eslint-config`
- 各アプリ側ではそれを読み込み運用

## 4. Mobile（apps/mobile）

### 4.1 技術
- Expo SDK: `~54.0.33`
- React: `19.1.0`
- React Native: `0.81.5`
- Router: `expo-router`
- Web 対応: `react-native-web`

## 5. Backend（apps/backend）

### 5.1 技術
- Framework: `hono`
- Node 実行: `@hono/node-server`
- 実行/開発: `tsx`
- ビルド: `tsc` + `tsc-alias`

### 5.2 オニオンアーキテクチャ

```text
apps/backend/src/
  domain/          # ドメインモデル・抽象（Interface）
  application/     # ユースケース
  infrastructure/  # 外部I/O実装（DB, API, 時刻など）
  presentation/    # HTTPルート/コントローラ
  index.ts         # エントリポイント
```

責務分離ルール:
- `domain` は外部実装に依存しない
- `application` は `domain` の抽象に依存する
- `infrastructure` は `domain` の抽象を実装する
- `presentation` は HTTP 入出力を扱い、ユースケースを呼び出す

依存方向:
- 外側 -> 内側 のみ
- 内側（domain/application）から外側（presentation/infrastructure）へ直接依存しない

### 5.4 現在の API
- `GET /health`
- 返却値: `service`, `status`, `timestamp`

