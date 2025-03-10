import { metrics, trace } from "npm:@opentelemetry/api";

export const tracer = trace.getTracer("nus3-custom-service");

export const meter = metrics.getMeter("nus3-custom-service");

export const requestCounter = meter.createCounter("http.requests.total", {
  description: "Total number of HTTP requests",
});

export const responseTimeHistogram = meter.createHistogram(
  "http.response.duration",
  {
    description: "HTTP response duration in milliseconds",
    unit: "ms",
  },
);
