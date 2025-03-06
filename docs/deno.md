# Deno 2.2

https://deno.com/blog/v2.2

- Deno 2.2 で OpenTelemetry の機能がビルトイン
- console.log や Deno.serve、fetch などの API を自動的に計測できるように
- 簡単に試す方法として local に Docker を使い、LGTM stack を起動させるのが良い
  - https://github.com/grafana/docker-otel-lgtm/tree/main
- OpenTelemetry 用の API は今後も変更される可能性がある
  - `--unstable-otel`のフラグを使って利用できる

https://docs.deno.com/runtime/fundamentals/open_telemetry/

- ログ、メトリクス、トレースなどの計測機能を備えた OpenTelemetry observability ツールで、Deno のアプリケーションをモニタリングできるように
- OpenTelemetry プロトコルを使用して、収集されたメトリクス、トレースおよびログをサーバーにエクスポートする
- OpenTelemetry のメトリクス、トレース、ログを使用した Deno ランタイムの自動計装（Auto Instrumentatio）
- `npm:@opentelemetry/api`で提供されるユーザー定義のメトリクス、トレース、ログの収集
- 自動計装
