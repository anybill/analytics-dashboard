

export default class ApiConfig {

  static dataAnalyticsUrlTest = "https://analytics.test.anybill.de/api";
  static dataAnalyticsUrlStg = "https://analytics.stg.anybill.de/api";
  static dataAnalyticsUrlProd = "https://analytics.anybill.de/api";
  static dataAnalyticsUrlLocal = "https://localhost:61010/api";

  static vendorCustomerId = "D8D84435-5904-4276-133A-08DD66F5882B";
  static authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiIyMTc3MzZlZi0wYTRhLTRkNzUtODI4Ni01NzQyY2EwODk5MTkiLCJpc3MiOiJodHRwczovL2FkYW55YmlsbC5iMmNsb2dpbi5jb20vZDYyMWFjMjctMjAxZS00NTlmLWI5Y2EtNDU3ZTBhNTk4Nzc1L3YyLjAvIiwiZXhwIjoxNzQyNDg2MzQxLCJuYmYiOjE3NDI0ODI3NDEsImlkcCI6IkxvY2FsQWNjb3VudCIsInN1YiI6ImI2MzhhYmViLTFjZTgtNDQ2My1iNTZhLTZjNzYyZmE4ODU3ZiIsInRmcCI6IkIyQ18xX3JvcGNfY3VzdG9tZXIiLCJzY3AiOiJ1c2VyX2N1c3RvbWVyIiwiYXpwIjoiZjRmNzdhMTgtODYwZi00ODhlLTllMTUtOWMyZDhmMGQzNDc1IiwidmVyIjoiMS4wIiwiaWF0IjoxNzQyNDgyNzQxfQ.IPvZUNOR6BKVBU1CHChGMljWe2FBEK1L6pThafBFpQLsSS8lNb4GaOCR-Oz0fySvpoaUjgmdE0HXgQqKkgPmkEJCQKbErhLrE8kLeYaQN87GsA_u5VfuYNG8IH1a2sU5e5HQHfEO0fF0w9N6P5pyoC2dk5E1DJ9VSc9hb_Ijp0aIiLddhMMPPSLcRiCeJREjFShRIo_1Hrh7yLcXMQAgF8L5ATY5gtfbzJ7MiDSbcvWH0YhAN_gZIsYS8HHZJ9c2s7fwfY3fKVOiZfiLTYG-5MQb34El9OifJNuQhiAqGSGsgN1RQSU04iYd2-FI_HAM8OVjKKrhQa84kUJbENNWTw";

  static dataAnalyticsUrl(env?: string): string {
    if (env === "test") return this.dataAnalyticsUrlTest;
    if (env === "staging") return this.dataAnalyticsUrlStg;
    if (env === "prod") return this.dataAnalyticsUrlProd;

    return this.dataAnalyticsUrlLocal;
  }
}
