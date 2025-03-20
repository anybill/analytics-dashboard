import basketsData from '@/assets/baskets.csv'
import topNProductsData from '@/assets/top_n_products.csv'
import topNStoresData from '@/assets/top_n_stores.csv'

// Interfaces for the data models
export interface BasketMetrics {
    monetaryMean: number
    monetaryMedian: number
    basketItemCountMean: number
    basketItemCountMedian: number
}

export interface TopProduct {
    mappedProduct: string
    productCount: number
}

export interface Store {
    storeId: string
    storeVisits: number
    vendorCustomerStoreId: string
    storeName: string
    countryCode: string
    country: string
    zip: string
    city: string
    street: string
    number: string
    latitude: number
    longitude: number
}

export class CsvMapper {
    private static parseCsv(csvContent: string): string[][] {
        return csvContent
            .split('\n')
            .map(line => line.split(','))
            .filter(row => row.length > 1) // Skip empty lines
    }

    private static parseNumber(value: string): number {
        return parseFloat(value) || 0
    }

    static getBasketMetrics(): BasketMetrics {
        const rows = this.parseCsv(basketsData)
        const headers = rows[0]
        const data = rows[1]

        return {
            monetaryMean: this.parseNumber(data[headers.indexOf('MonetaryMean')]),
            monetaryMedian: this.parseNumber(data[headers.indexOf('MonetaryMedian')]),
            basketItemCountMean: this.parseNumber(data[headers.indexOf('BasketItemCountMean')]),
            basketItemCountMedian: this.parseNumber(data[headers.indexOf('BasketItemCountMedian')])
        }
    }

    static getTopProducts(): TopProduct[] {
        const rows = this.parseCsv(topNProductsData)
        const headers = rows[0]

        return rows.slice(1).map(row => ({
            mappedProduct: row[headers.indexOf('MappedProduct')],
            productCount: this.parseNumber(row[headers.indexOf('ProductCount')])
        }))
    }

    static getTopStores(): Store[] {
        const rows = this.parseCsv(topNStoresData)
        const headers = rows[0]

        return rows.slice(1).map(row => ({
            storeId: row[headers.indexOf('StoreId')],
            storeVisits: this.parseNumber(row[headers.indexOf('StoreVisits')]),
            vendorCustomerStoreId: row[headers.indexOf('VendorCustomerStoreId')],
            storeName: row[headers.indexOf('StoreName')],
            countryCode: row[headers.indexOf('CountryCode')],
            country: row[headers.indexOf('Country')],
            zip: row[headers.indexOf('Zip')],
            city: row[headers.indexOf('City')],
            street: row[headers.indexOf('Street')],
            number: row[headers.indexOf('Number')],
            latitude: this.parseNumber(row[headers.indexOf('Latitude')]),
            longitude: this.parseNumber(row[headers.indexOf('Longitude')])
        }))
    }
} 