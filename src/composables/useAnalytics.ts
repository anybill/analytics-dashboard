import { authService } from '@/services/authService'
import ApiConfig from "@/config/ApiConfig";

export interface ColumnDto {
    name: string;
    aggregator?: string;
}

export interface ExpressionDto {
    column: string;
    operator: string;
    values: string[];
}

export interface SelectorDto {
    table: string;
    columns: ColumnDto[];
}

export interface QueryDto {
    vendorCustomerIds: string[];
    selector: SelectorDto;
    expressions?: ExpressionDto[];
}

export interface MetricData {
    monetaryMean: number;
    monetaryMedian: number;
    basketItemCountMean: number;
    basketItemCountMedian: number;
}

export interface Product {
    mappedProduct: string;
    productCount: number;
}

export interface Store {
    storeName: string;
    storeVisits: number;
    country: string;
    city: string;
    zip: string;
    street: string;
    number: string;
    latitude: number;
    longitude: number;
}

export interface AnalyticsData {
    metrics: MetricData;
    topItems: Product[];
    topStores: Store[];
}

function normalizeKeys<T>(data: any): T {
    if (Array.isArray(data)) {
        return data.map((item) => normalizeKeys(item)) as T;
    } else if (typeof data === "object" && data !== null) {
        return Object.keys(data).reduce((acc, key) => {
            const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[normalizedKey] = normalizeKeys(data[key]);
            return acc;
        }, {} as any);
    }
    return data as T;
}

async function getDataByQuery<T>(queryDto: QueryDto): Promise<T> {
    const url = 'api/v1/analytics/data';
    const token = await authService.ensureValidToken()
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(queryDto),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
            const [basketMetrics, topProducts, topStores] = await Promise.all([
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
            ]);

            return {
                metrics: basketMetrics[0] ?? {} as MetricData,
                topItems: topProducts ?? [],
                topStores: topStores ?? [],
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
        fetchAnalytics,
    };
}
