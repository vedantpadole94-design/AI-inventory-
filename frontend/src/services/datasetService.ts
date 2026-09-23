import axios from 'axios';
import Papa from 'papaparse';

const API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL ||
  'http://localhost:8000';

class DatasetService {
  private cache = new Map<string, Record<string, any>[]>();

  async loadCSV(fileName: string): Promise<Record<string, any>[]> {
    if (this.cache.has(fileName)) {
      return this.cache.get(fileName) ?? [];
    }

    const urls = [`/data/${fileName}`, `${API_BASE_URL}/data/${fileName}`];

    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          responseType: 'text',
          timeout: 15000,
        });

        const parsed = Papa.parse<Record<string, any>>(response.data, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        const rows = (parsed.data ?? []).filter((row) =>
          Object.values(row ?? {}).some((value) => value !== null && value !== undefined && String(value).trim() !== ''),
        );

        this.cache.set(fileName, rows);
        return rows;
      } catch (error) {
        console.warn(`Failed to load ${fileName} from ${url}:`, error);
      }
    }

    console.error(`Unable to load ${fileName} from either frontend or backend static data sources.`);
    return [];
  }

  async getMarketPrices(): Promise<Record<string, any>[]> {
    return this.loadCSV('market_prices.csv');
  }

  async getSuppliers(): Promise<Record<string, any>[]> {
    return this.loadCSV('suppliers.csv');
  }

  async getCountries(): Promise<Record<string, any>[]> {
    return this.loadCSV('countries.csv');
  }

  async getCommodities(): Promise<Record<string, any>[]> {
    return this.loadCSV('commodities.csv');
  }

  async getPurchaseOrders(): Promise<Record<string, any>[]> {
    return this.loadCSV('purchase_orders.csv');
  }

  async getInventoryLevels(): Promise<Record<string, any>[]> {
    return this.loadCSV('inventory_levels.csv');
  }

  async getInventoryMovements(): Promise<Record<string, any>[]> {
    return this.loadCSV('inventory_movements.csv');
  }

  async getSupplierPerformance(): Promise<Record<string, any>[]> {
    return this.loadCSV('supplier_performance.csv');
  }

  async getRiskAssessments(): Promise<Record<string, any>[]> {
    return this.loadCSV('risk_assessments.csv');
  }

  async getDemandHistory(): Promise<Record<string, any>[]> {
    return this.loadCSV('demand_history.csv');
  }

  async getExchangeRates(): Promise<Record<string, any>[]> {
    return this.loadCSV('exchange_rates.csv');
  }

  async getEconomicIndicators(): Promise<Record<string, any>[]> {
    return this.loadCSV('economic_indicators.csv');
  }

  async getCustomers(): Promise<Record<string, any>[]> {
    return this.loadCSV('customers.csv');
  }

  async getContracts(): Promise<Record<string, any>[]> {
    return this.loadCSV('contracts.csv');
  }

  async getFinancials(): Promise<Record<string, any>[]> {
    return this.loadCSV('financials.csv');
  }

  async getAlerts(): Promise<Record<string, any>[]> {
    return this.loadCSV('alerts.csv');
  }

  async getAuditLogs(): Promise<Record<string, any>[]> {
    return this.loadCSV('audit_logs.csv');
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const datasetService = new DatasetService();
