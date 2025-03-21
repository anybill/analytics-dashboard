

export default class ApiConfig {

  static dataAnalyticsUrlTest = "https://analytics.test.anybill.de/api";
  static dataAnalyticsUrlStg = "https://analytics.stg.anybill.de/api";
  static dataAnalyticsUrlProd = "https://analytics.anybill.de/api";
  static dataAnalyticsUrlLocal = "https://localhost:61010/api";

  static vendorCustomerId = "D8D84435-5904-4276-133A-08DD66F5882B";
  static username = "oscar.rembold+19032025@anybill.de";
  static password = "Password1!";

  static dataAnalyticsUrl(env?: string): string {
    if (env === "test") return this.dataAnalyticsUrlTest;
    if (env === "staging") return this.dataAnalyticsUrlStg;
    if (env === "prod") return this.dataAnalyticsUrlProd;

    return this.dataAnalyticsUrlLocal;
  }
}
