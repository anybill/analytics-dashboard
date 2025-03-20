

export default class ApiConfig {

  static dataAnalyticsUrlTest = "https://analytics.test.anybill.de/api";
  static dataAnalyticsUrlStg = "https://analytics.stg.anybill.de/api";
  static dataAnalyticsUrlProd = "https://analytics.anybill.de/api";
  static dataAnalyticsUrlLocal = "https://localhost:61010/api";

  static vendorCustomerId = "D8D84435-5904-4276-133A-08DD66F5882B";
  static authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiIyMTc3MzZlZi0wYTRhLTRkNzUtODI4Ni01NzQyY2EwODk5MTkiLCJpc3MiOiJodHRwczovL2FkYW55YmlsbC5iMmNsb2dpbi5jb20vZDYyMWFjMjctMjAxZS00NTlmLWI5Y2EtNDU3ZTBhNTk4Nzc1L3YyLjAvIiwiZXhwIjoxNzQyNDc0NzYxLCJuYmYiOjE3NDI0NzExNjEsImlkcCI6IkxvY2FsQWNjb3VudCIsInN1YiI6ImI2MzhhYmViLTFjZTgtNDQ2My1iNTZhLTZjNzYyZmE4ODU3ZiIsInRmcCI6IkIyQ18xX3JvcGNfY3VzdG9tZXIiLCJzY3AiOiJ1c2VyX2N1c3RvbWVyIiwiYXpwIjoiZjRmNzdhMTgtODYwZi00ODhlLTllMTUtOWMyZDhmMGQzNDc1IiwidmVyIjoiMS4wIiwiaWF0IjoxNzQyNDcxMTYxfQ.HgETb3qr4NeJpaJdBDePQz7uad9AXbwcUaE6G1H1DDxrkQOMYt1lDCCptiVzLQQVpWIoaBuSu5oxkAa9hvm3hB0hzSGVAws8x-POHrXTyK4uPE75PXe3F44Wfj9xikCZhvggO7m_iCqQPvXOscjbaE0yKFV_Q72xk1Lg9mz3hzVYiy1aO6Ur9cX0qtkkIeWuY8Xma4u37JBNATjA297H37yNcUl3lS2dI1FHdFmmvPtD9NxoZtZwMh1Bxl6-WxZbERlJCUxikGCUCStLmDiewhXrfQp3JfLZX1RKRXxchI1gFVMRSWYcxtXVNwV1eL4ZVF6ESpd-9AKDSbMR-wmoYw";

  static dataAnalyticsUrl(env?: string): string {
    if (env === "test") return this.dataAnalyticsUrlTest;
    if (env === "staging") return this.dataAnalyticsUrlStg;
    if (env === "prod") return this.dataAnalyticsUrlProd;

    return this.dataAnalyticsUrlLocal;
  }
}
