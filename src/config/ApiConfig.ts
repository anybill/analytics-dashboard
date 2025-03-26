

export default class ApiConfig {

  static dataAnalyticsUrlTest = "https://analytics.test.anybill.de/api";
  static dataAnalyticsUrlStg = "https://analytics.stg.anybill.de/api";
  static dataAnalyticsUrlProd = "https://analytics.anybill.de/api";
  static dataAnalyticsUrlLocal = "https://localhost:61010/api";


  static vendorCustomerId = import.meta.env.VITE_ANYBILL_VCID;

  static dataAnalyticsUrl(env?: string): string {
    if (env === "test") return this.dataAnalyticsUrlTest;
    if (env === "staging") return this.dataAnalyticsUrlStg;
    if (env === "prod") return this.dataAnalyticsUrlProd;

    return this.dataAnalyticsUrlLocal;
  }
}
