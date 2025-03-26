// Analytics Database Types

export interface BasketMetrics {
    monetaryMean: number;
    monetaryMedian: number;
    basketItemCountMean: number;
    basketItemCountMedian: number;
    year: number;
    month: number;
}

export interface Store {
    storeId: string;
    storeVisits: number;
    vendorCustomerStoreId: string;
    storeName: string;
    countryCode: string;
    country: string;
    zip: string;
    city: string;
    street: string;
    number: string;
    latitude: number;
    longitude: number;
    year: number;
    month: number;
}

export interface CategoryProduct {
    category: string;
    product: string;
    productCount: number;
    categoryShare: number;
    year: number;
    month: number;
}

export interface CategoryBrand {
    category: string;
    brand: string;
    productCount: number;
    categoryShare: number;
    year: number;
    month: number;
}

// Analytics API Response Types
export interface AnalyticsData {
    metrics: BasketMetrics[];
    consumerMetrics: ConsumerMetrics[];
    topItems: Product[];
    topStores: Store[];
    flopItems?: Product[];
    topProductsByCategory?: CategoryProduct[];
    flopProductsByCategory?: CategoryProduct[];
    topBrandsByCategory?: CategoryBrand[];
    flopBrandsByCategory?: CategoryBrand[];
}

// Query Types
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
    year: number;
    month: number;
}

export interface Product {
    product: string;
    productCount: number;
    year: number;
    month: number;
}


export interface ConsumerMetrics {
    monetaryAggregationMean: number;
    basketItemCountAggregationMean: number;
    basketItemCountAggregationMedian: number;
    frequencyAggregation: number;
    recencyAggregation: number;
    customerLifetimeValue: number;
    year: number;
    month: number;
}