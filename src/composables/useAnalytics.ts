import { authService } from "@/services/authService";
import ApiConfig from "@/config/ApiConfig";
import type { AnalyticsData, CategoryBrand, CategoryProduct, ConsumerMetrics, MetricData, Product, QueryDto, Store } from "@/types/analytics";


function normalizeKeys<T>(data: unknown): T {
    if (Array.isArray(data)) {
        return data.map((item) => normalizeKeys(item)) as T;
    } else if (typeof data === "object" && data !== null) {
        return Object.keys(data as Record<string, unknown>).reduce<Record<string, unknown>>((acc, key) => {
            const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[normalizedKey] = normalizeKeys((data as Record<string, unknown>)[key]);
            return acc;
        }, {}) as T;
    }
    return data as T;
}

async function getDataByQuery<T>(queryDto: QueryDto): Promise<T> {
    const url = "api/v1/analytics/data";
    const token = await authService.ensureValidToken();
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(queryDto),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
        },
    });

    const rawData = await response.json();
    return normalizeKeys<T>(rawData);
}

export function useAnalytics() {
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchAnalytics(timeframe?: string): Promise<AnalyticsData> {
        isLoading.value = true;
        error.value = null;

        try {
            await authService.ensureValidToken();
            const [basketMetrics, topProducts, topStores, consumerMetrics, topCategories, flopCategories, topBrands, flopBrands, flopProducts] = await Promise.all([
                getDataByQuery<MetricData[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "BasketMetrics", columns: [{ name: "all" }] },
                }),
                getDataByQuery<Product[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "TopNProducts", columns: [{ name: "all" }] },
                }),
                getDataByQuery<Store[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "TopStores", columns: [{ name: "all" }] },
                }),
                getDataByQuery<ConsumerMetrics[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "ConsumerMetrics", columns: [{ name: "all" }] },
                }),
                getDataByQuery<CategoryProduct[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "TopNProductsPerCategory", columns: [{ name: "all" }] },
                }),
                getDataByQuery<CategoryProduct[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "FlopNProductsPerCategory", columns: [{ name: "all" }] },
                }),
                getDataByQuery<CategoryBrand[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "TopNBrandsPerCategory", columns: [{ name: "all" }] },
                }),
                getDataByQuery<CategoryBrand[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "FlopNBrandsPerCategory", columns: [{ name: "all" }] },
                }),
                getDataByQuery<Product[]>({
                    vendorCustomerIds: [ApiConfig.vendorCustomerId],
                    selector: { table: "FlopNProducts", columns: [{ name: "all" }] },
                })
            ]);
            // Capitalize first letter of product and brand names
            if (Array.isArray(topProducts)) {
                topProducts.forEach(product => {
                    if (product.product) {
                        product.product = product.product.charAt(0).toUpperCase() + product.product.slice(1);
                    }
                });
            }

            if (Array.isArray(flopProducts)) {
                flopProducts.forEach(product => {
                    if (product.product) {
                        product.product = product.product.charAt(0).toUpperCase() + product.product.slice(1);
                    }
                });
            }

            if (Array.isArray(topCategories)) {
                topCategories.forEach(item => {
                    if (item.product) {
                        item.product = item.product.charAt(0).toUpperCase() + item.product.slice(1);
                    }
                });
            }

            if (Array.isArray(flopCategories)) {
                flopCategories.forEach(item => {
                    if (item.product) {
                        item.product = item.product.charAt(0).toUpperCase() + item.product.slice(1);
                    }
                });
            }

            if (Array.isArray(topBrands)) {
                topBrands.forEach(item => {
                    if (item.brand) {
                        item.brand = item.brand.charAt(0).toUpperCase() + item.brand.slice(1);
                    }
                });
            }

            if (Array.isArray(flopBrands)) {
                flopBrands.forEach(item => {
                    if (item.brand) {
                        item.brand = item.brand.charAt(0).toUpperCase() + item.brand.slice(1);
                    }
                });
            }

            return {
                metrics: Array.isArray(basketMetrics)
                    ? basketMetrics
                    : [],
                consumerMetrics: Array.isArray(consumerMetrics)
                    ? consumerMetrics
                    : [],
                topItems: Array.isArray(topProducts)
                    ? topProducts.sort((a, b) => b.productCount - a.productCount)
                    : [],
                topStores: Array.isArray(topStores)
                    ? topStores.sort((a, b) => b.storeVisits - a.storeVisits)
                    : [],
                flopItems: Array.isArray(flopProducts)
                    ? flopProducts.sort((a, b) => a.productCount - b.productCount)
                    : [],
                topProductsByCategory: Array.isArray(topCategories)
                    ? topCategories.sort((a, b) => b.productCount - a.productCount)
                    : [],
                flopProductsByCategory: Array.isArray(flopCategories)
                    ? flopCategories.sort((a, b) => a.productCount - b.productCount)
                    : [],
                topBrandsByCategory: Array.isArray(topBrands)
                    ? topBrands.sort((a, b) => b.productCount - a.productCount)
                    : [],
                flopBrandsByCategory: Array.isArray(flopBrands)
                    ? flopBrands.sort((a, b) => a.productCount - b.productCount)
                    : [],
            };
        } catch (e) {
            error.value = e instanceof Error ? e.message : "An error occurred";
            return {} as AnalyticsData;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        error,
        fetchAnalytics
    };
}
