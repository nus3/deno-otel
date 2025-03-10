import { SpanStatusCode } from "npm:@opentelemetry/api";
import {
  requestCounter,
  responseTimeHistogram,
  tracer,
} from "./opentelemetry.ts";

// Deno.serve(async (req) => {
//   console.log("Incoming request", req.url);
//   const res = await fetch("https://jsonplaceholder.typicode.com/todos");

//   const todos = await res.json();

//   if (!res.ok) {
//     console.error("Failed to fetch todos:", res.statusText);
//     return new Response("Error fetching todos", { status: 500 });
//   }

//   console.log("fetch todos", todos);

//   return new Response(JSON.stringify(todos), {
//     headers: { "content-type": "application/json" },
//   });
// });

Deno.serve(async (req) => {
  // リクエストカウンターをインクリメント
  requestCounter.add(1, {
    method: req.method,
    path: new URL(req.url).pathname,
  });

  // リクエスト処理の開始時間を記録
  const startTime = performance.now();
  // レスポンスステータスを追跡するための変数
  let responseStatus = 200;

  // カスタムスパンの作成
  return await tracer.startActiveSpan("handle_request", async (span) => {
    try {
      // リクエスト情報をスパンに追加
      span.setAttribute("http.method", req.method);
      span.setAttribute("http.url", req.url);
      span.setAttribute(
        "http.user_agent",
        req.headers.get("user-agent") || "unknown",
      );

      console.log("Incoming request", req.url);

      // 外部APIへのリクエストをトレース
      const todos = await tracer.startActiveSpan(
        "fetch_todos",
        async (fetchSpan) => {
          fetchSpan.setAttribute(
            "http.url",
            "https://jsonplaceholder.typicode.com/todos",
          );

          try {
            const res = await fetch(
              "https://jsonplaceholder.typicode.com/todos",
            );

            // レスポンスステータスをスパンに記録
            fetchSpan.setAttribute("http.status_code", res.status);

            if (!res.ok) {
              // エラー情報をスパンに記録
              fetchSpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: `Failed with status: ${res.status}`,
              });
              console.error("Failed to fetch todos:", res.statusText);
              throw new Error(res.statusText);
            }

            const data = await res.json();
            // データサイズをスパンに記録
            fetchSpan.setAttribute(
              "response.size",
              JSON.stringify(data).length,
            );

            return data;
          } catch (error) {
            // エラー情報をスパンに記録 - 型安全に処理
            const errorMessage = error instanceof Error
              ? error.message
              : String(error);
            fetchSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: errorMessage,
            });

            // Errorオブジェクトとして記録
            if (error instanceof Error) {
              fetchSpan.recordException(error);
            } else {
              fetchSpan.recordException(new Error(String(error)));
            }

            throw error;
          } finally {
            // スパンを終了
            fetchSpan.end();
          }
        },
      );

      console.log("fetch todos", todos);

      // カスタムイベントを記録
      span.addEvent("todos_processed", {
        count: todos.length,
        first_todo_title: todos[0]?.title || "none",
      });

      // 正常なレスポンスを返す
      const response = new Response(JSON.stringify(todos), {
        headers: { "content-type": "application/json" },
      });

      // レスポンスステータスを記録
      responseStatus = response.status;
      span.setAttribute("http.status_code", responseStatus);

      return response;
    } catch (error) {
      // エラー情報をスパンに記録 - 型安全に処理
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorMessage,
      });

      // Errorオブジェクトとして記録
      if (error instanceof Error) {
        span.recordException(error);
      } else {
        span.recordException(new Error(String(error)));
      }

      // エラーステータスを設定
      responseStatus = 500;
      span.setAttribute("http.status_code", responseStatus);

      // エラーレスポンスを返す
      return new Response("Error fetching todos", { status: 500 });
    } finally {
      // 処理時間を計測してヒストグラムに記録
      const duration = performance.now() - startTime;
      responseTimeHistogram.record(duration, {
        method: req.method,
        path: new URL(req.url).pathname,
        status: responseStatus,
      });

      // メインスパンを終了
      span.end();
    }
  });
});

console.log("Server running at http://localhost:8000");
