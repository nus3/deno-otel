# OpenTelemetry

https://opentelemetry.io/

## GPT-4o に聞いてみた

- OpenTelemetry は、ソフトウェアのパフォーマンスと動作を監視するためのオープンソースのツールセット
- 主に 3 つのデータを収集することが目的
  - Tracing: リクエストがシステム内をどのように流れるかを追跡
    - 例えばリクエストが Web サーバーから DB までどのように処理されるかを可視化
  - Metrics: システムのパフォーマンスを数値で表す
  - Logs: システムの動作に関する詳細な情報を記録
- 特徴
  - OpenTelemetry は、異なるツールやサービス間でのデータ収集を統一する標準を提供する
  - オープンソース
  - ベンダーに依存しない
- SDK を使いアプリケーションに組み込める
- エクスポーターを使い、収集したデータを外部の監視ツールに送信できる
- データ収集の自動化（自動計装？）

## ドキュメント

### OpenTelemetry とは

https://opentelemetry.io/ja/docs/what-is-opentelemetry/

- OpenTelemetry とは
  - オブザーバビリティフレームワーク
  - トレース、メトリクス、ログのようなテレメトリーデータを作成管理するためのツールキット
    - テレメトリーデータとはシステムや機器の状態を表すデーター
  - ベンダーやツールにとらわれない
  - テレメトリの生成、収集、管理、エクスポートにフォーカス
    - 主な目的は言語、インフラ、ランタイム環境に関係なく、簡単に計装できるようにすること
  - テレメトリーの保存と可視化は意図的に他のツールに任せていることを理解するのが重要
- オブザーバビリティ
  - システムの出力を調べることで、システムの内部状態を理解する能力
  - システムがオブザーバビリティがある状態にするには計装が必要
  - コードがトレース、メトリクス、ログを出力する必要がある
  - 計装されたデータは送信される必要がある
- OpenTelemetry は多くのベンダーによってサポートされている
  - https://opentelemetry.io/ecosystem/vendors/

### Observability 入門

https://opentelemetry.io/ja/docs/concepts/observability-primer/

- 分散トレース
  - マイクロサービスやサーバレスアプリケーションのようなマルチサービスアーキテクチャを伝搬するリクエストがたどった経路を記録する
  - 1 つ以上のスパンで構成
  - スパンは作業、または操作の単位
  - 詳細はこれ
    - https://opentelemetry.io/ja/docs/concepts/observability-primer/#distributed-traces

https://opentelemetry.io/ja/docs/concepts/context-propagation/

- コンテキスト伝搬

https://opentelemetry.io/ja/docs/concepts/signals/

- シグナル
  - OS やプラットフォーム上のアプリの活動を記述するシステム出力
  - トレース、メトリクス、ログ、バゲッジをサポートしている
- トレース: アプリケーションを通過するリクエストの経路
- メトリクス: 実行時に取得された測定値
- ログ: イベントの記録
- バゲッジ: シグナル間でやり取りされるコンテキスト情報

https://opentelemetry.io/ja/docs/concepts/instrumentation/

- システムがオブザーバビリティを持つためには計装されてる必要がある
  - 計装されているとは、トレース、メトリクス、ログといったテレメトリシグナルを送信しなければいけない
- OpenTelemetry では二つの方法で計装ができる
  - 公式の API と SDK を使ったコードベースのもの
  - ゼロコードのもの
- コードベースの場合、OpenTelemetry API を使って、アプリからテレメトリを生成できる
  - ゼロコードのものをい保管する役割もある
- ゼロコードベース
  - コードを書かずにアプリケーションにオブザーバビリティを追加する

https://opentelemetry.io/ja/docs/concepts/instrumentation/zero-code/

- 自動計装は、開発者がコードを変更するこなく、アプリケーションに計装を追加する方法
- ゼロコード軽装は、自動計装の一つだが、コードの変更が全く不要な点が強調されてる
- ゼロコード計装の対象は、リクエスト、レスポンス、DB 呼び出し、メッセージキューなどが対象
  - アプリケーションコードは通常、計装されない。これにはコードベース計装が必要

https://opentelemetry.io/ja/docs/concepts/instrumentation/code-based/

- コードベース計装のセットアップ
  - API と SDK をインポート
  - API の設定
  - SDK の設定
  - テレメトリデータの作成
  - テレメトリデータの送信

https://opentelemetry.io/ja/docs/concepts/signals/traces/

- トレース
- アプリケーションを通過するリクエストの経路
- トレースの際には決まった json フォーマットを使い、各サービス間で一貫してトレースできるようにする

https://opentelemetry.io/ja/docs/concepts/signals/metrics/

- メトリクス
- 実行時の測定値

https://opentelemetry.io/ja/docs/concepts/signals/logs/

- ログ
- 構造化、非構造化された任意のメタデータを含む、タイムスタンプ追記のテキストレコード
