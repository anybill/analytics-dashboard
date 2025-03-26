import type { AnalyticsData } from "@/types/analytics";

export function filterDataByMonth(data: AnalyticsData, month: number): AnalyticsData {
    return {
        metrics: data.metrics.filter(item => item.month === month),
        consumerMetrics: data.consumerMetrics.filter(item => item.month === month),
        topItems: data.topItems.filter(item => item.month === month),
        topStores: data.topStores.filter(item => item.month === month),

        flopItems: data.flopItems?.filter(item => item.month === month) ?? [],

        topProductsByCategory: data.topProductsByCategory?.filter(item => item.month === month) ?? [],
        flopProductsByCategory: data.flopProductsByCategory?.filter(item => item.month === month) ?? [],

        topBrandsByCategory: data.topBrandsByCategory?.filter(item => item.month === month) ?? [],
        flopBrandsByCategory: data.flopBrandsByCategory?.filter(item => item.month === month) ?? [],
    };
}