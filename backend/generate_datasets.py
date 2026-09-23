"""Generate deterministic, relational procurement intelligence datasets.

The CSVs are written to both backend/data and frontend/public/data because the
application uses the backend copy for analysis and the frontend copy for its
static dashboards. Re-run this script whenever a fresh synthetic data snapshot
is needed.
"""

from __future__ import annotations

import csv
import json
import math
import random
from calendar import monthrange
from datetime import date, timedelta
from pathlib import Path

SEED = 20260912
START_YEAR = 2015
MONTHS = 120
ROOT = Path(__file__).resolve().parent
OUTPUT_DIRS = [ROOT / "data", ROOT / ".." / "frontend" / "public" / "data"]
RNG = random.Random(SEED)

COUNTRIES = [
    {"code": "IN", "name": "India", "region": "Asia", "currency": "INR", "gdp_rank": 5, "manufacturing_index": 78, "risk_baseline": 35, "timezone": "Asia/Kolkata", "population": 1428.6, "gdp": 3730, "inflation": 5.4, "corruption": 40, "business_rank": 63, "political": 58, "infrastructure": 67, "agreements": ["WTO", "ASEAN-India", "SAFTA"]},
    {"code": "CN", "name": "China", "region": "Asia", "currency": "CNY", "gdp_rank": 2, "manufacturing_index": 95, "risk_baseline": 45, "timezone": "Asia/Shanghai", "population": 1410.7, "gdp": 17960, "inflation": 2.1, "corruption": 45, "business_rank": 31, "political": 52, "infrastructure": 91, "agreements": ["WTO", "RCEP", "ASEAN-China"]},
    {"code": "US", "name": "United States", "region": "North America", "currency": "USD", "gdp_rank": 1, "manufacturing_index": 88, "risk_baseline": 20, "timezone": "America/NY", "population": 334.9, "gdp": 27360, "inflation": 3.7, "corruption": 69, "business_rank": 6, "political": 68, "infrastructure": 86, "agreements": ["WTO", "USMCA", "US-Korea FTA"]},
    {"code": "DE", "name": "Germany", "region": "Europe", "currency": "EUR", "gdp_rank": 4, "manufacturing_index": 92, "risk_baseline": 15, "timezone": "Europe/Berlin", "population": 84.5, "gdp": 4457, "inflation": 2.8, "corruption": 79, "business_rank": 22, "political": 82, "infrastructure": 90, "agreements": ["WTO", "EU Single Market", "CETA"]},
    {"code": "JP", "name": "Japan", "region": "Asia", "currency": "JPY", "gdp_rank": 3, "manufacturing_index": 90, "risk_baseline": 12, "timezone": "Asia/Tokyo", "population": 124.5, "gdp": 4213, "inflation": 2.6, "corruption": 73, "business_rank": 29, "political": 78, "infrastructure": 94, "agreements": ["WTO", "CPTPP", "RCEP"]},
    {"code": "VN", "name": "Vietnam", "region": "Asia", "currency": "VND", "gdp_rank": 45, "manufacturing_index": 72, "risk_baseline": 30, "timezone": "Asia/Ho_Chi_Minh", "population": 100.3, "gdp": 430, "inflation": 3.3, "corruption": 41, "business_rank": 70, "political": 55, "infrastructure": 65, "agreements": ["WTO", "CPTPP", "RCEP", "EVFTA"]},
    {"code": "BR", "name": "Brazil", "region": "South America", "currency": "BRL", "gdp_rank": 9, "manufacturing_index": 68, "risk_baseline": 42, "timezone": "America/Sao_Paulo", "population": 216.4, "gdp": 2174, "inflation": 4.6, "corruption": 36, "business_rank": 124, "political": 51, "infrastructure": 60, "agreements": ["WTO", "MERCOSUR"]},
    {"code": "KR", "name": "South Korea", "region": "Asia", "currency": "KRW", "gdp_rank": 10, "manufacturing_index": 89, "risk_baseline": 22, "timezone": "Asia/Seoul", "population": 51.7, "gdp": 1713, "inflation": 3.6, "corruption": 63, "business_rank": 10, "political": 64, "infrastructure": 92, "agreements": ["WTO", "RCEP", "US-Korea FTA"]},
    {"code": "MX", "name": "Mexico", "region": "North America", "currency": "MXN", "gdp_rank": 15, "manufacturing_index": 74, "risk_baseline": 38, "timezone": "America/Mexico_City", "population": 128.5, "gdp": 1789, "inflation": 4.7, "corruption": 31, "business_rank": 60, "political": 48, "infrastructure": 69, "agreements": ["WTO", "USMCA", "CPTPP"]},
    {"code": "TH", "name": "Thailand", "region": "Asia", "currency": "THB", "gdp_rank": 22, "manufacturing_index": 71, "risk_baseline": 32, "timezone": "Asia/Bangkok", "population": 71.8, "gdp": 515, "inflation": 1.2, "corruption": 35, "business_rank": 21, "political": 45, "infrastructure": 73, "agreements": ["WTO", "RCEP", "ASEAN"]},
    {"code": "PL", "name": "Poland", "region": "Europe", "currency": "PLN", "gdp_rank": 21, "manufacturing_index": 76, "risk_baseline": 25, "timezone": "Europe/Warsaw", "population": 37.7, "gdp": 842, "inflation": 6.0, "corruption": 55, "business_rank": 40, "political": 61, "infrastructure": 78, "agreements": ["WTO", "EU Single Market", "CETA"]},
    {"code": "TR", "name": "Turkey", "region": "Middle East", "currency": "TRY", "gdp_rank": 19, "manufacturing_index": 70, "risk_baseline": 48, "timezone": "Europe/Istanbul", "population": 85.3, "gdp": 1108, "inflation": 53.9, "corruption": 36, "business_rank": 33, "political": 39, "infrastructure": 68, "agreements": ["WTO", "EU Customs Union"]},
    {"code": "ZA", "name": "South Africa", "region": "Africa", "currency": "ZAR", "gdp_rank": 33, "manufacturing_index": 62, "risk_baseline": 52, "timezone": "Africa/Johannesburg", "population": 60.4, "gdp": 377, "inflation": 5.9, "corruption": 43, "business_rank": 82, "political": 43, "infrastructure": 55, "agreements": ["WTO", "SACU", "AfCFTA"]},
    {"code": "AU", "name": "Australia", "region": "Oceania", "currency": "AUD", "gdp_rank": 13, "manufacturing_index": 80, "risk_baseline": 18, "timezone": "Australia/Sydney", "population": 26.6, "gdp": 1724, "inflation": 3.8, "corruption": 75, "business_rank": 14, "political": 83, "infrastructure": 88, "agreements": ["WTO", "CPTPP", "RCEP"]},
    {"code": "CA", "name": "Canada", "region": "North America", "currency": "CAD", "gdp_rank": 14, "manufacturing_index": 82, "risk_baseline": 16, "timezone": "America/Toronto", "population": 40.1, "gdp": 2140, "inflation": 3.9, "corruption": 74, "business_rank": 23, "political": 81, "infrastructure": 87, "agreements": ["WTO", "USMCA", "CPTPP", "CETA"]},
]

COMMODITIES = [
    {"code": "STL", "name": "Steel", "category": "Metals", "unit": "USD/ton", "base": 450, "volatility": .05, "trend": .020, "seasonality": "Q2-Q3 High"},
    {"code": "COP", "name": "Copper", "category": "Metals", "unit": "USD/ton", "base": 5800, "volatility": .08, "trend": .030, "seasonality": "Q1 High"},
    {"code": "PLA", "name": "Plastic", "category": "Polymers", "unit": "USD/ton", "base": 1100, "volatility": .04, "trend": .015, "seasonality": "Stable"},
    {"code": "CTN", "name": "Cotton", "category": "Textiles", "unit": "USD/ton", "base": 1500, "volatility": .06, "trend": .010, "seasonality": "Q4 High"},
    {"code": "SLC", "name": "Silicon", "category": "Electronics", "unit": "USD/ton", "base": 2200, "volatility": .09, "trend": .040, "seasonality": "Q3-Q4 High"},
    {"code": "ALM", "name": "Aluminum", "category": "Metals", "unit": "USD/ton", "base": 1900, "volatility": .05, "trend": .025, "seasonality": "Q2 High"},
    {"code": "LIT", "name": "Lithium", "category": "Battery", "unit": "USD/ton", "base": 15000, "volatility": .15, "trend": .150, "seasonality": "Q4 High"},
    {"code": "NIC", "name": "Nickel", "category": "Battery", "unit": "USD/ton", "base": 14000, "volatility": .12, "trend": .080, "seasonality": "Q3 High"},
    {"code": "REE", "name": "Rare Earth", "category": "Electronics", "unit": "USD/ton", "base": 45000, "volatility": .18, "trend": .100, "seasonality": "Stable"},
    {"code": "SEM", "name": "Semiconductors", "category": "Electronics", "unit": "USD/unit", "base": 5.50, "volatility": .10, "trend": .060, "seasonality": "Q3-Q4 High"},
    {"code": "RBR", "name": "Rubber", "category": "Polymers", "unit": "USD/ton", "base": 1400, "volatility": .06, "trend": .020, "seasonality": "Q2 High"},
    {"code": "TIM", "name": "Timber", "category": "Construction", "unit": "USD/m³", "base": 350, "volatility": .07, "trend": .030, "seasonality": "Q3 High"},
    {"code": "CEM", "name": "Cement", "category": "Construction", "unit": "USD/ton", "base": 120, "volatility": .04, "trend": .018, "seasonality": "Q2-Q3 High"},
    {"code": "GLS", "name": "Glass", "category": "Construction", "unit": "USD/ton", "base": 800, "volatility": .05, "trend": .022, "seasonality": "Stable"},
    {"code": "PAP", "name": "Paper", "category": "Packaging", "unit": "USD/ton", "base": 650, "volatility": .04, "trend": .012, "seasonality": "Q4 High"},
]

COUNTRY_MULTIPLIERS = {"IN": .80, "CN": .85, "US": 1.15, "DE": 1.10, "JP": 1.08, "VN": .82, "BR": .88, "KR": 1.05, "MX": .90, "TH": .83, "PL": .95, "TR": .87, "ZA": .85, "AU": 1.12, "CA": 1.10}
EXCHANGE_RATES = {"USD": 1, "EUR": .92, "CNY": 7.1, "INR": 83, "JPY": 149, "VND": 24500, "BRL": 4.95, "KRW": 1330, "MXN": 17.2, "THB": 35.5, "PLN": 4.0, "TRY": 27, "ZAR": 18.5, "AUD": 1.52, "CAD": 1.35}

COUNTS = {"CN": 35, "IN": 30, "US": 25, "DE": 18, "JP": 15, "VN": 15, "KR": 12, "BR": 10, "MX": 10, "TH": 8, "PL": 8, "TR": 6, "ZA": 4, "AU": 4, "CA": 5}
CITIES = {"CN": ["Shanghai", "Shenzhen", "Guangzhou", "Suzhou", "Ningbo"], "IN": ["Mumbai", "Pune", "Bengaluru", "Chennai", "Ahmedabad"], "US": ["Chicago", "Detroit", "Houston", "Austin", "San Jose"], "DE": ["Munich", "Stuttgart", "Hamburg", "Frankfurt"], "JP": ["Tokyo", "Osaka", "Nagoya", "Yokohama"], "VN": ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong"], "KR": ["Seoul", "Busan", "Incheon", "Daegu"], "BR": ["Sao Paulo", "Rio de Janeiro", "Curitiba"], "MX": ["Monterrey", "Mexico City", "Guadalajara"], "TH": ["Bangkok", "Chon Buri", "Rayong"], "PL": ["Warsaw", "Krakow", "Wroclaw"], "TR": ["Istanbul", "Bursa", "Ankara"], "ZA": ["Johannesburg", "Cape Town", "Durban"], "AU": ["Sydney", "Melbourne", "Brisbane"], "CA": ["Toronto", "Montreal", "Vancouver"]}


def months():
    return [(START_YEAR + i // 12, i % 12 + 1) for i in range(MONTHS)]


def clamp(value, low=0, high=100):
    return max(low, min(high, value))


def write_csv(name, rows, fieldnames):
    for directory in OUTPUT_DIRS:
        directory.mkdir(parents=True, exist_ok=True)
        with (directory / name).open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)


def get_exchange_rate(currency, month_idx):
    """Return a deterministic monthly local-currency-per-USD rate."""
    base = EXCHANGE_RATES[currency]
    return base * (1 + math.sin(month_idx / 14 + len(currency)) * .035 + RNG.gauss(0, .008))


def historical_event_factor(year, month, country_code, commodity_code):
    """Apply broad historical shocks without making future data affect the past."""
    factor = 1.0
    if year in (2015, 2016) and commodity_code in {"STL", "COP", "ALM", "NIC"}:
        factor *= .70
    if year == 2016 and country_code in {"DE", "PL", "TR"}:
        factor *= .95
    if year == 2017:
        factor *= 1.15
    if year in (2018, 2019) and country_code in {"CN", "US"} and commodity_code in {"STL", "COP", "ALM"}:
        factor *= 1.20
    if year == 2020 and month <= 6:
        factor *= .68 if commodity_code in {"STL", "COP", "ALM", "TIM", "CEM"} else .75
    if year == 2020 and month >= 7:
        factor *= 1.30
    if year == 2021:
        factor *= 1.40
    if year == 2022 and commodity_code in {"STL", "COP", "ALM", "NIC", "LIT"}:
        factor *= 1.50
    if year == 2022 and country_code in {"DE", "PL", "TR"}:
        factor *= 1.12
    if year == 2023:
        factor *= .92
    if year == 2024:
        factor *= 1.05
    return factor


def generate_countries():
    fields = ["code", "country_code", "name", "region", "currency", "gdp_rank", "manufacturing_index", "risk_baseline", "timezone", "population_millions", "gdp_usd_billions", "inflation_rate_avg", "corruption_index", "ease_of_doing_business_rank", "trade_agreements", "political_stability", "infrastructure_score", "country_multiplier"]
    rows = []
    for c in COUNTRIES:
        row = dict(c)
        row.update({"country_code": c["code"], "population_millions": c["population"], "gdp_usd_billions": c["gdp"], "inflation_rate_avg": c["inflation"], "corruption_index": c["corruption"], "ease_of_doing_business_rank": c["business_rank"], "trade_agreements": json.dumps(c["agreements"]), "political_stability": c["political"], "infrastructure_score": c["infrastructure"], "country_multiplier": COUNTRY_MULTIPLIERS[c["code"]]})
        rows.append(row)
    write_csv("countries.csv", rows, fields)


def generate_commodities():
    fields = ["commodity_code", "code", "name", "category", "unit", "base_price_usd", "volatility", "trend_annual", "seasonality", "seasonal_pattern"]
    rows = []
    for c in COMMODITIES:
        rows.append({"commodity_code": c["code"], "code": c["code"], "name": c["name"], "category": c["category"], "unit": c["unit"], "base_price_usd": c["base"], "volatility": c["volatility"], "trend_annual": c["trend"], "seasonality": c["seasonality"], "seasonal_pattern": c["seasonality"]})
    write_csv("commodities.csv", rows, fields)


def generate_suppliers():
    fields = ["supplier_id", "supplier_name", "name", "country_code", "country", "city", "industry", "established_year", "employee_count", "annual_revenue_usd", "annual_capacity_units", "commodity_codes", "certifications", "financial_stability_score", "quality_score", "delivery_score", "cost_score", "sustainability_score", "innovation_score", "response_time_hours", "minimum_order_quantity", "lead_time_days", "payment_terms", "contract_type", "preferred_currency", "risk_level", "risk_score", "risk_tier", "tier", "status", "preferred_supplier", "onboarding_date", "last_audit_date", "on_time_delivery", "performance_trend", "recent_risk_spike"]
    rows = []
    suppliers = []
    tier_weights = [("Tier 1", .30), ("Tier 2", .45), ("Tier 3", .25)]
    cert_pool = ["ISO 9001", "ISO 14001", "ISO 45001", "IATF 16949", "SA8000", "ResponsibleSteel", "LEED"]
    for country_code, count in COUNTS.items():
        country = next(c for c in COUNTRIES if c["code"] == country_code)
        for n in range(1, count + 1):
            idx = len(suppliers) + 1
            tier = RNG.choices([x[0] for x in tier_weights], weights=[x[1] for x in tier_weights])[0]
            tier_factor = {"Tier 1": 1.35, "Tier 2": 1.0, "Tier 3": .62}[tier]
            quality = clamp(RNG.gauss(77 + country["manufacturing_index"] * .12 + (8 if tier == "Tier 1" else 0), 6))
            delivery = clamp(RNG.gauss(74 + country["infrastructure"] * .12 + (7 if tier == "Tier 1" else 0), 7))
            cost = clamp(RNG.gauss(68 + country["manufacturing_index"] * .10, 8))
            sustainability = clamp(RNG.gauss(58 + country["political"] * .25, 10))
            innovation = clamp(RNG.gauss(55 + country["manufacturing_index"] * .30, 11))
            financial = clamp(RNG.gauss(62 + country["political"] * .30 + (8 if tier == "Tier 1" else 0), 8))
            risk = clamp(country["risk_baseline"] + (100 - financial) * .25 + RNG.gauss(0, 5))
            risk_level = "High" if risk >= 60 else "Medium" if risk >= 35 else "Low"
            established = RNG.randint(1975, 2018 if tier == "Tier 3" else 2010)
            onboarding = date(max(2017, established + 1), RNG.randint(1, 12), 1)
            audit = date(2024, RNG.randint(1, 12), RNG.randint(1, 26))
            commodity_codes = RNG.sample([c["code"] for c in COMMODITIES], RNG.randint(2, 5))
            certifications = RNG.sample(cert_pool, RNG.randint(1, 4))
            city = RNG.choice(CITIES[country_code])
            name = f"{country['name']} {['Advanced', 'Precision', 'Industrial', 'Global', 'Integrated'][n % 5]} {['Materials', 'Components', 'Works', 'Industries', 'Supply'][idx % 5]} {idx:03d}"
            trend = "declining" if idx <= 10 else "improving" if idx <= 25 else "stable"
            supplier = {"supplier_id": f"SUP-{idx:04d}", "supplier_name": name, "name": name, "country_code": country_code, "country": country["name"], "city": city, "industry": next(c["category"] for c in COMMODITIES if c["code"] == commodity_codes[0]), "established_year": established, "employee_count": int({"Tier 1": RNG.randint(2500, 25000), "Tier 2": RNG.randint(250, 2499), "Tier 3": RNG.randint(15, 249)}[tier]), "annual_revenue_usd": round(RNG.uniform(20, 900) * tier_factor * country["manufacturing_index"] / 80 * 1_000_000, 2), "annual_capacity_units": int(RNG.uniform(10000, 900000) * tier_factor), "commodity_codes": json.dumps(commodity_codes), "certifications": json.dumps(certifications), "financial_stability_score": round(financial, 2), "quality_score": round(quality, 2), "delivery_score": round(delivery, 2), "cost_score": round(cost, 2), "sustainability_score": round(sustainability, 2), "innovation_score": round(innovation, 2), "response_time_hours": round(RNG.uniform(2, 48) * (1.3 if tier == "Tier 3" else 1), 1), "minimum_order_quantity": RNG.randint(25, 5000), "lead_time_days": RNG.randint(7, 65) + (10 if country_code in {"BR", "ZA", "AU"} else 0), "payment_terms": RNG.choice(["Net 30", "Net 45", "Net 60", "Net 90"]), "contract_type": RNG.choice(["framework", "spot", "multi-year"]), "preferred_currency": country["currency"], "risk_level": risk_level, "risk_score": round(risk, 2), "risk_tier": risk_level, "tier": tier, "status": "inactive" if 181 <= idx <= 200 else "blacklisted" if idx > 200 else RNG.choices(["active", "inactive", "blacklisted"], weights=[.85, .10, .05])[0], "preferred_supplier": "true" if idx <= 15 else "false", "onboarding_date": onboarding.isoformat(), "last_audit_date": audit.isoformat(), "on_time_delivery": round(delivery, 2), "performance_trend": trend, "recent_risk_spike": "true" if 26 <= idx <= 30 else "false"}
            suppliers.append(supplier)
    for supplier in suppliers:
        # A few non-key fields are intentionally unavailable to exercise robust ingestion.
        if RNG.random() < .012:
            supplier["response_time_hours"] = ""
        if RNG.random() < .008:
            supplier["last_audit_date"] = ""
        rows.append(supplier)
    write_csv("suppliers.csv", rows, fields)
    return suppliers


def generate_market_prices():
    fields = ["date", "year", "month", "quarter", "country_code", "commodity_code", "country", "commodity", "unit", "price_usd", "price_local_currency", "currency_code", "exchange_rate", "volume_traded", "market_volatility_index", "economic_cycle_phase", "price_change_pct", "is_anomaly"]
    rows = []
    previous = {(c["code"], k["code"]): k["base"] for c in COUNTRIES for k in COMMODITIES}
    shocks = {("2020-04", "LIT"), ("2021-10", "SEM"), ("2022-03", "NIC"), ("2023-08", "REE")}
    for i, (year, month) in enumerate(months()):
        label = f"{year:04d}-{month:02d}"
        for country in COUNTRIES:
            for commodity in COMMODITIES:
                key = (country["code"], commodity["code"])
                seasonal_strength = {"STL": .08 if month in (5, 6, 7, 8) else 0, "COP": .05 if month in (1, 2, 3) else 0, "CTN": .12 if month in (10, 11, 12) else 0, "SLC": .10 if month in (7, 8, 9, 10, 11, 12) else 0, "LIT": .15 if month in (10, 11, 12) else 0, "TIM": .10 if month in (7, 8, 9) else 0, "CEM": .12 if month in (5, 6, 7, 8) else 0, "ALM": .03 if month in (4, 5, 6) else 0, "PAP": .08 if month in (10, 11, 12) else 0}.get(commodity["code"], 0)
                seasonal = 1 + seasonal_strength
                macro = 1 + (.025 * math.sin(i / 9) + .012 * math.sin(i / 3.5))
                shock = 1.0
                if (label, commodity["code"]) in shocks:
                    shock = RNG.choice([1.35, .68])
                price = commodity["base"] * (1 + commodity["trend"]) ** (i / 12) * seasonal * macro * historical_event_factor(year, month, country["code"], commodity["code"]) * shock * (1 + RNG.gauss(0, commodity["volatility"] / 4))
                price *= COUNTRY_MULTIPLIERS[country["code"]]
                price = max(commodity["base"] * .25, price)
                change = (price / previous[key] - 1) * 100
                exchange_rate = get_exchange_rate(country["currency"], i)
                volume = int(RNG.uniform(1000, 50000) * (2.2 if seasonal_strength else 1))
                rows.append({"date": label, "year": year, "month": month, "quarter": (month - 1) // 3 + 1, "country_code": country["code"], "commodity_code": commodity["code"], "country": country["name"], "commodity": commodity["name"], "unit": commodity["unit"], "price_usd": round(price, 4), "price_local_currency": round(price * exchange_rate, 4), "currency_code": country["currency"], "exchange_rate": round(exchange_rate, 6), "volume_traded": volume, "market_volatility_index": round(commodity["volatility"] * 100 + abs(change) * .35, 3), "economic_cycle_phase": "recession" if year == 2020 and month <= 6 else "recovery" if year in (2017, 2020) or year >= 2023 else "expansion", "price_change_pct": round(change, 3), "is_anomaly": "true" if abs(change) > 18 else "false"})
                previous[key] = price
    write_csv("market_prices.csv", rows, fields)


def generate_demand():
    fields = ["date", "commodity_code", "country_code", "region", "commodity", "historical_demand_units", "forecast_demand_units", "actual_demand_units", "demand_units", "demand_variance_percent", "seasonal_index", "trend_component", "cyclical_component", "irregular_component", "demand_type", "customer_segment_breakdown", "is_anomaly"]
    rows = []
    bases = {c["code"]: RNG.randint(5000, 50000) for c in COMMODITIES}
    for i, (year, month) in enumerate(months()):
        for country in COUNTRIES:
          for commodity in COMMODITIES:
            seasonal = 1 + (.16 if month in (10, 11, 12) else .08 if month in (6, 7) else -.04 if month == 2 else 0)
            trend = 1 + i * (.002 + commodity["trend"] * .35)
            anomaly = (i, commodity["code"], country["code"]) in {(50, "SEM", "KR"), (77, "LIT", "CN"), (102, "STL", "US")}
            country_factor = COUNTRY_MULTIPLIERS[country["code"]] * (1 + country["manufacturing_index"] / 200)
            baseline = bases[commodity["code"]] * seasonal * trend * country_factor
            actual = baseline * (2.2 if anomaly else 1) * (1 + RNG.gauss(0, .09))
            variance = (actual / baseline - 1) * 100
            rows.append({"date": f"{year:04d}-{month:02d}", "commodity_code": commodity["code"], "country_code": country["code"], "region": country["region"], "commodity": commodity["name"], "historical_demand_units": int(max(0, baseline)), "forecast_demand_units": int(max(0, baseline * (1 + RNG.gauss(0, .025)))), "actual_demand_units": int(max(0, actual)), "demand_units": int(max(0, actual)), "demand_variance_percent": round(variance, 3), "seasonal_index": round(seasonal, 4), "trend_component": round(trend, 4), "cyclical_component": round(math.sin(i / 10), 4), "irregular_component": round(actual / baseline - 1, 4), "demand_type": "anomalous" if anomaly else "seasonal" if seasonal != 1 else "baseline", "customer_segment_breakdown": json.dumps({"enterprise": round(actual * .42), "mid_market": round(actual * .33), "small_business": round(actual * .18), "startup": round(actual * .07)}), "is_anomaly": "true" if anomaly else "false"})
    write_csv("demand_history.csv", rows, fields)


def generate_economics_and_fx():
    economic_fields = ["date", "country_code", "country", "gdp_growth", "gdp_growth_rate", "inflation", "inflation_rate", "interest_rate", "industrial_production_index", "unemployment_rate", "manufacturing_pmi", "retail_sales_index", "consumer_confidence", "business_confidence", "exchange_rate_usd", "trade_balance_usd", "government_debt_percent_gdp", "credit_rating", "stock_market_index", "oil_price_usd", "gold_price_usd"]
    fx_fields = ["date", "currency", "country_code", "rate_to_usd", "volatility_30d"]
    economics, fx = [], []
    fx_base = {"USD": 1, "EUR": .92, "CNY": 7.1, "INR": 83, "JPY": 149, "VND": 24500, "BRL": 4.95, "KRW": 1330, "MXN": 17.2, "THB": 35.5, "PLN": 4.0, "TRY": 27, "ZAR": 18.5, "AUD": 1.52, "CAD": 1.35}
    for i, (year, month) in enumerate(months()):
        for country in COUNTRIES:
            cycle = math.sin(i / 10 + country["gdp_rank"] / 10)
            gdp_growth = round(2.2 + cycle * 1.4 - (1.9 if year == 2020 else 0), 3)
            inflation = round(max(.1, country["inflation"] + math.sin(i / 7) * 1.1 + RNG.gauss(0, .25)), 3)
            exchange_rate = get_exchange_rate(country["currency"], i)
            economics.append({"date": f"{year:04d}-{month:02d}", "country_code": country["code"], "country": country["name"], "gdp_growth": gdp_growth, "gdp_growth_rate": gdp_growth, "inflation": inflation, "inflation_rate": inflation, "interest_rate": round(max(.1, 3.2 + country["inflation"] * .45 + math.sin(i / 8)), 3), "industrial_production_index": round(country["manufacturing_index"] * (1 + cycle * .035), 3), "unemployment_rate": round(max(1.2, 6.4 - cycle * 1.2 + (2.2 if year == 2020 else 0)), 3), "manufacturing_pmi": round(50 + cycle * 7 + country["manufacturing_index"] / 20, 3), "retail_sales_index": round(100 + cycle * 5, 3), "consumer_confidence": round(65 + cycle * 8, 3), "business_confidence": round(68 + cycle * 9, 3), "exchange_rate_usd": round(exchange_rate, 6), "trade_balance_usd": round(RNG.uniform(-20, 80) * 1_000_000, 2), "government_debt_percent_gdp": round(RNG.uniform(25, 130), 3), "credit_rating": RNG.choice(["AAA", "AA", "A", "BBB", "BB"]), "stock_market_index": round(1000 * (1 + i * .004 + cycle * .08), 3), "oil_price_usd": round(55 + 18 * math.sin(i / 11) + (25 if year == 2022 else 0), 3), "gold_price_usd": round(1200 + i * 4 + 80 * math.sin(i / 9), 3)})
            currency = country["currency"]
            rate = fx_base[currency] * (1 + math.sin(i / 14 + country["gdp_rank"]) * .035 + RNG.gauss(0, .008))
            fx.append({"date": f"{year:04d}-{month:02d}", "currency": currency, "country_code": country["code"], "rate_to_usd": round(rate, 6), "volatility_30d": round(abs(math.sin(i / 6)) * .02 + .004, 5)})
    write_csv("economic_indicators.csv", economics, economic_fields)
    write_csv("exchange_rates.csv", fx, fx_fields)


def generate_risk(suppliers):
    fields = ["date", "country_code", "supplier_id", "financial_risk", "operational_risk", "geopolitical_risk", "compliance_risk", "cyber_risk", "climate_risk", "supply_chain_risk", "currency_risk", "overall_risk_score", "overall_risk", "risk_category", "risk_trend", "assessment_method", "assessed_by", "mitigation_plan", "next_review_date"]
    rows = []
    for i, (year, month) in enumerate(months()):
        for supplier in suppliers:
            country = next(c for c in COUNTRIES if c["code"] == supplier["country_code"])
            geopolitical = clamp(country["risk_baseline"] + 10 * math.sin(i / 15 + country["gdp_rank"]) + (18 if year == 2022 and country["code"] in {"PL", "TR", "DE"} else 0) + RNG.gauss(0, 3))
            financial = clamp(country["risk_baseline"] * .7 + 15 + 8 * math.sin(i / 12) + RNG.gauss(0, 4))
            compliance = clamp((100 - country["corruption"]) * .65 + 8 + RNG.gauss(0, 3))
            operational = clamp(100 - float(supplier["delivery_score"]) + 15 + (25 if year == 2020 else 0) + (20 if year == 2021 else 0) + RNG.gauss(0, 4))
            cyber = clamp(42 - float(supplier["innovation_score"]) * .12 + RNG.gauss(0, 4))
            climate = clamp((100 - country["infrastructure"]) * .45 + (10 if year == 2024 else 0) + RNG.gauss(0, 3))
            supply_chain = clamp((100 - float(supplier["delivery_score"])) * .6 + country["risk_baseline"] * .4 + RNG.gauss(0, 3))
            currency = clamp(abs(math.sin(i / 8 + country["gdp_rank"])) * 25 + (15 if country["currency"] == "TRY" else 0) + RNG.gauss(0, 3))
            overall = (financial + operational + geopolitical + compliance + cyber + climate + supply_chain + currency) / 8
            rows.append({"date": f"{year:04d}-{month:02d}", "country_code": country["code"], "supplier_id": supplier["supplier_id"], "financial_risk": round(financial, 2), "operational_risk": round(operational, 2), "geopolitical_risk": round(geopolitical, 2), "compliance_risk": round(compliance, 2), "cyber_risk": round(cyber, 2), "climate_risk": round(climate, 2), "supply_chain_risk": round(supply_chain, 2), "currency_risk": round(currency, 2), "overall_risk_score": round(overall, 2), "overall_risk": round(overall, 2), "risk_category": "High" if overall >= 60 else "Medium" if overall >= 35 else "Low", "risk_trend": "increasing" if i % 17 == 0 else "decreasing" if i % 23 == 0 else "stable", "assessment_method": "ensemble_score", "assessed_by": "risk-engine-v2", "mitigation_plan": "Diversify lanes and increase safety stock" if overall >= 60 else "Quarterly monitoring", "next_review_date": date(year + (1 if month == 12 else 0), 1 if month == 12 else month + 1, 15).isoformat()})
    write_csv("risk_assessments.csv", rows, fields)


def generate_customers():
    fields = ["customer_id", "company_name", "contact_person", "email", "phone", "country_code", "city", "industry", "customer_type", "tier", "annual_revenue_usd", "employee_count", "years_as_customer", "acquisition_date", "first_order_date", "last_order_date", "total_orders", "total_spend_usd", "avg_order_value_usd", "avg_payment_days", "satisfaction_score", "nps_score", "retention_probability", "churn_risk", "lifetime_value_usd", "credit_limit_usd", "current_outstanding_usd", "payment_terms", "preferred_currency", "preferred_language", "preferred_contact", "account_manager", "status", "segment", "tags"]
    industries = ["Manufacturing", "Retail", "Healthcare", "Technology", "Construction", "Automotive", "Aerospace", "Food & Beverage", "Fashion", "Electronics", "Energy", "Logistics", "Pharma", "Telecom", "Agriculture"]
    types = ["Enterprise", "Mid-Market", "Small Business", "Startup"]
    tiers = ["Platinum", "Gold", "Silver", "Bronze"]
    customers = []
    for idx in range(1, 321):
        country = RNG.choice(COUNTRIES)
        tier = RNG.choices(tiers, weights=[.15, .25, .35, .25])[0]
        customer_type = RNG.choices(types, weights=[.25, .35, .30, .10])[0]
        acquisition = date(RNG.randint(2015, 2023), RNG.randint(1, 12), RNG.randint(1, 25))
        years = max(1, 2024 - acquisition.year)
        nps = RNG.randint(-20, 85) if idx <= 15 else RNG.randint(5, 85)
        churn = RNG.uniform(72, 94) if idx <= 20 else RNG.uniform(3, 45)
        if idx <= 10:
            tier = "Platinum"
        revenue = RNG.uniform(5, 400) * {"Platinum": 5, "Gold": 2.5, "Silver": 1.2, "Bronze": .6}[tier] * 1_000_000
        total_orders = RNG.randint(8, 250)
        avg_value = revenue / max(total_orders, 1) * RNG.uniform(.15, .45)
        customers.append({"customer_id": f"CUS-{idx:04d}", "company_name": f"{country['name']} {RNG.choice(['Industrial', 'Commerce', 'Technology', 'Holdings', 'Supply'])} {idx:03d}", "contact_person": f"{RNG.choice(['Aarav', 'Maya', 'Liam', 'Sofia', 'Kenji', 'Elena'])} {RNG.choice(['Patel', 'Smith', 'Chen', 'Garcia', 'Muller', 'Kim'])}", "email": f"procurement{idx:03d}@customer.example.com", "phone": f"+1-555-{idx:04d}", "country_code": country["code"], "city": RNG.choice(CITIES[country["code"]]), "industry": RNG.choice(industries), "customer_type": customer_type, "tier": tier, "annual_revenue_usd": round(revenue, 2), "employee_count": RNG.randint(20, 50000), "years_as_customer": years, "acquisition_date": acquisition.isoformat(), "first_order_date": (acquisition + timedelta(days=RNG.randint(5, 90))).isoformat(), "last_order_date": date(2024, RNG.randint(1, 12), RNG.randint(1, 25)).isoformat(), "total_orders": total_orders, "total_spend_usd": round(revenue * RNG.uniform(.02, .15), 2), "avg_order_value_usd": round(avg_value, 2), "avg_payment_days": RNG.randint(18, 105), "satisfaction_score": round(RNG.uniform(45, 99), 2), "nps_score": nps, "retention_probability": round(100 - churn * .7, 2), "churn_risk": round(churn, 2), "lifetime_value_usd": round(revenue * RNG.uniform(.15, .8), 2), "credit_limit_usd": round(revenue * RNG.uniform(.01, .08), 2), "current_outstanding_usd": round(revenue * RNG.uniform(0, .015), 2), "payment_terms": RNG.choice(["Net 30", "Net 45", "Net 60", "Net 90"]), "preferred_currency": country["currency"], "preferred_language": RNG.choice(["en", "hi", "zh", "de", "ja", "es"]), "preferred_contact": RNG.choice(["email", "phone", "portal"]), "account_manager": f"AM-{RNG.randint(1, 24):02d}", "status": "suspended" if idx <= 3 else "active" if churn < 70 else "at_risk", "segment": tier.lower(), "tags": json.dumps(["vip" if idx <= 10 else "", "payment_dispute" if idx <= 5 else "loyal" if years >= 5 else ""])})
    write_csv("customers.csv", customers, fields)
    return customers


def generate_orders(suppliers, customers):
    fields = ["order_id", "date", "order_date", "customer_id", "supplier_id", "commodity_code", "commodity", "country_code", "country", "quantity", "unit_price_usd", "total_usd", "currency_code", "exchange_rate", "expected_delivery_date", "actual_delivery_date", "lead_time_days", "delay_days", "status", "payment_status", "quality_inspection_result", "returned_quantity", "return_reason", "shipment_mode", "incoterms", "port_of_origin", "port_of_destination", "priority_level", "discount_percent", "tax_amount", "insurance_amount", "tracking_number", "carrier_name", "notes", "payment_terms", "is_delayed", "is_anomaly"]
    rows = []
    supplier_by_id = {s["supplier_id"]: s for s in suppliers}
    weighted_ids = [s["supplier_id"] for s in suppliers for _ in range({"Tier 1": 5, "Tier 2": 3, "Tier 3": 1}[s["tier"]])]
    year_counts = {2015: 2500, 2016: 3000, 2017: 3500, 2018: 4000, 2019: 4500, 2020: 3200, 2021: 5500, 2022: 6500, 2023: 7500, 2024: 9800}
    order_years = [year for year, count in year_counts.items() for _ in range(count)]
    for i in range(50000):
        year = order_years[i]
        month_index = (year - START_YEAR) * 12 + RNG.randint(0, 11)
        month = month_index % 12 + 1
        supplier = supplier_by_id[RNG.choice(weighted_ids)]
        customer = RNG.choice(customers)
        commodity = next(c for c in COMMODITIES if c["code"] in json.loads(supplier["commodity_codes"])) if RNG.random() < .72 else RNG.choice(COMMODITIES)
        country = next(c for c in COUNTRIES if c["code"] == supplier["country_code"])
        day = RNG.randint(1, monthrange(year, month)[1])
        order_date = date(year, month, day)
        quantity = RNG.randint(max(1, int(supplier["minimum_order_quantity"] / 2)), max(10, int(supplier["minimum_order_quantity"] * 8)))
        if i < 50:
            quantity = RNG.randint(50001, 120000)
        unit_price = commodity["base"] * (1 + commodity["trend"]) ** (month_index / 12) * COUNTRY_MULTIPLIERS[country["code"]] * (1 + RNG.gauss(0, commodity["volatility"]))
        lead = max(3, int(supplier["lead_time_days"] + RNG.gauss(0, 5)))
        if i < 15:
            lead += RNG.randint(35, 56)
        expected = order_date + timedelta(days=lead)
        delayed = i < 15 or RNG.random() < (.035 + max(0, supplier["risk_score"] - 35) / 1600)
        cancelled = RNG.random() < (.018 + max(0, supplier["risk_score"] - 55) / 2500)
        actual = None
        status = "cancelled" if cancelled else "delivered"
        if not cancelled:
            actual = expected + timedelta(days=RNG.randint(35, 56) if i < 15 else RNG.randint(2, 22) if delayed else RNG.randint(-3, 3))
            if order_date > date(2024, 10, 15):
                status = "pending" if RNG.random() < .55 else "in_transit"
            elif delayed:
                status = "delayed"
            elif actual > date(2024, 12, 31):
                status = "in_transit"
        anomaly = delayed and RNG.random() < .12 or RNG.random() < .004
        returned = int(quantity * RNG.uniform(.02, .2)) if RNG.random() < .03 else 0
        payment_status = RNG.choices(["Paid", "Pending", "Overdue", "Refunded", "Disputed"], weights=[.82, .10, .05, .02, .01])[0]
        delay_days = max(0, (actual - expected).days) if actual else 0
        rows.append({"order_id": f"PO-{100000 + i}", "date": order_date.isoformat(), "order_date": order_date.isoformat(), "customer_id": customer["customer_id"], "supplier_id": supplier["supplier_id"], "commodity_code": commodity["code"], "commodity": commodity["name"], "country_code": country["code"], "country": country["name"], "quantity": quantity, "unit_price_usd": round(unit_price, 4), "total_usd": round(max(10, unit_price * quantity), 2), "currency_code": country["currency"], "exchange_rate": round(get_exchange_rate(country["currency"], month_index), 6), "expected_delivery_date": expected.isoformat(), "actual_delivery_date": actual.isoformat() if actual else "", "lead_time_days": lead, "delay_days": delay_days, "status": "returned" if returned else status, "payment_status": payment_status, "quality_inspection_result": "failed" if RNG.random() < .05 else "passed", "returned_quantity": returned, "return_reason": RNG.choice(["quality defect", "damage in transit", "specification mismatch"]) if returned else "", "shipment_mode": RNG.choices(["Sea", "Air", "Rail", "Road", "Multimodal"], weights=[.60, .15, .12, .10, .03])[0], "incoterms": RNG.choice(["FOB", "CIF", "EXW", "DDP", "DAP", "FCA"]), "port_of_origin": f"{country['code']}-PORT-{RNG.randint(1, 4)}", "port_of_destination": f"DEST-{RNG.randint(1, 12):02d}", "priority_level": "critical" if i < 25 else RNG.choices(["low", "normal", "high"], weights=[.2, .65, .15])[0], "discount_percent": round(RNG.uniform(0, 12), 2), "tax_amount": round(unit_price * quantity * RNG.uniform(.01, .18), 2), "insurance_amount": round(unit_price * quantity * RNG.uniform(.002, .02), 2), "tracking_number": f"TRK-{10000000 + i}" if status not in {"pending", "cancelled"} else "", "carrier_name": RNG.choice(["Maersk", "DHL", "FedEx", "Kuehne+Nagel", "DB Schenker"]), "notes": "force majeure review" if i < 250 else "", "payment_terms": supplier["payment_terms"], "is_delayed": "true" if delayed else "false", "is_anomaly": "true" if anomaly else "false"})
    write_csv("purchase_orders.csv", rows, fields)
    return rows


def generate_inventory():
    fields = ["item_id", "item_name", "commodity_code", "category", "country_code", "warehouse_location", "on_hand", "reorder_point", "lead_time_days", "unit_cost", "stockout_risk", "last_updated"]
    rows = []
    for country in COUNTRIES:
        for commodity in COMMODITIES:
            on_hand = RNG.randint(0, 50000)
            reorder = RNG.randint(2000, 18000)
            rows.append({"item_id": f"INV-{country['code']}-{commodity['code']}", "item_name": commodity["name"], "commodity_code": commodity["code"], "category": commodity["category"], "country_code": country["code"], "warehouse_location": f"{country['code']}-WH-{RNG.randint(1, 4)}", "on_hand": on_hand, "reorder_point": reorder, "lead_time_days": RNG.randint(7, 65), "unit_cost": commodity["base"], "stockout_risk": "High" if on_hand < reorder else "Medium" if on_hand < reorder * 1.5 else "Low", "last_updated": "2024-12-31"})
    write_csv("inventory_levels.csv", rows, fields)
    return rows


def generate_performance(suppliers):
    fields = ["date", "supplier_id", "country_code", "quality_score", "delivery_score", "cost_score", "sustainability_score", "overall_score", "response_time_hours", "on_time_delivery_rate", "on_time_delivery", "order_accuracy", "fill_rate", "defect_rate_ppm", "defect_rate_pct", "response_rate", "dispute_count", "escalation_count", "avg_resolution_days", "orders_count", "revenue_generated", "kpi_compliance", "audit_score", "incidents_count"]
    rows = []
    for i, (year, month) in enumerate(months()):
        for supplier in suppliers:
            quality = clamp(float(supplier["quality_score"]) + math.sin(i / 8) * 2 + RNG.gauss(0, 2))
            delivery = clamp(float(supplier["delivery_score"]) + math.sin(i / 10) * 3 + RNG.gauss(0, 3))
            cost = clamp(float(supplier["cost_score"]) + RNG.gauss(0, 2))
            sustainability = clamp(float(supplier["sustainability_score"]) + RNG.gauss(0, 2))
            overall = (quality + delivery + cost + sustainability) / 4
            defect_pct = max(.05, (100 - quality) / 12 + RNG.random())
            rows.append({"date": f"{year:04d}-{month:02d}", "supplier_id": supplier["supplier_id"], "country_code": supplier["country_code"], "quality_score": round(quality, 2), "delivery_score": round(delivery, 2), "cost_score": round(cost, 2), "sustainability_score": round(sustainability, 2), "overall_score": round(overall, 2), "response_time_hours": supplier["response_time_hours"], "on_time_delivery_rate": round(delivery, 2), "on_time_delivery": round(delivery, 2), "order_accuracy": round(clamp(quality + RNG.gauss(0, 2)), 2), "fill_rate": round(clamp(delivery + RNG.gauss(0, 2)), 2), "defect_rate_ppm": round(defect_pct * 10000), "defect_rate_pct": round(defect_pct, 3), "response_rate": round(clamp(100 - float(supplier["response_time_hours"] or 24) / 2 + RNG.gauss(0, 2)), 2), "dispute_count": RNG.choices([0, 1, 2, 3], weights=[.78, .15, .05, .02])[0], "escalation_count": RNG.choices([0, 1, 2], weights=[.88, .10, .02])[0], "avg_resolution_days": round(RNG.uniform(1, 14), 2), "orders_count": RNG.randint(5, 80), "revenue_generated": round(RNG.uniform(10000, 2000000), 2), "kpi_compliance": round(clamp(overall + RNG.gauss(0, 3)), 2), "audit_score": round(clamp(float(supplier["quality_score"]) + RNG.gauss(0, 4)), 2), "incidents_count": RNG.choices([0, 1, 2], weights=[.80, .16, .04])[0]})
    write_csv("supplier_performance.csv", rows, fields)


def generate_inventory_movements(inventory, orders):
    fields = ["movement_id", "date", "item_id", "item_name", "commodity_code", "warehouse_id", "movement_type", "quantity", "unit_cost_usd", "total_value_usd", "reference_id", "reference_type", "balance_after", "reorder_point", "max_capacity", "safety_stock", "status", "created_by", "notes"]
    rows = []
    balances = {item["item_id"]: int(item["on_hand"]) for item in inventory}
    for i in range(500000):
        item = inventory[RNG.randrange(len(inventory))]
        movement_type = RNG.choices(["INBOUND", "OUTBOUND", "TRANSFER", "ADJUSTMENT", "RETURN", "SCRAP"], weights=[.30, .40, .15, .10, .03, .02])[0]
        quantity = RNG.randint(1, 5000)
        if movement_type in {"OUTBOUND", "SCRAP"}:
            quantity = min(quantity, balances[item["item_id"]])
            balances[item["item_id"]] -= quantity
        else:
            balances[item["item_id"]] += quantity
        day_offset = RNG.randint(0, 3652)
        movement_date = date(2015, 1, 1) + timedelta(days=day_offset)
        rows.append({"movement_id": f"MOV-{i + 1:07d}", "date": movement_date.isoformat(), "item_id": item["item_id"], "item_name": item["item_name"], "commodity_code": item["commodity_code"], "warehouse_id": f"WH-{item['country_code']}-{RNG.randint(1, 2):02d}", "movement_type": movement_type, "quantity": quantity, "unit_cost_usd": item["unit_cost"], "total_value_usd": round(quantity * float(item["unit_cost"]), 2), "reference_id": orders[RNG.randrange(len(orders))]["order_id"] if movement_type in {"INBOUND", "OUTBOUND", "RETURN"} else f"ADJ-{i + 1:07d}", "reference_type": "purchase_order" if movement_type in {"INBOUND", "OUTBOUND", "RETURN"} else "inventory_event", "balance_after": balances[item["item_id"]], "reorder_point": item["reorder_point"], "max_capacity": int(item["reorder_point"]) * 5, "safety_stock": int(item["reorder_point"]) * 2, "status": "below_reorder" if balances[item["item_id"]] < int(item["reorder_point"]) else "posted", "created_by": f"system-{RNG.randint(1, 12):02d}", "notes": "manual cycle count" if movement_type == "ADJUSTMENT" else ""})
    write_csv("inventory_movements.csv", rows, fields)


def generate_contracts(customers, suppliers):
    fields = ["contract_id", "customer_id", "supplier_id", "commodity_code", "contract_type", "start_date", "end_date", "contract_value_usd", "payment_terms", "delivery_terms", "quality_requirements", "penalty_clauses", "termination_notice_days", "auto_renewal", "renewal_date", "signed_by_customer", "signed_by_supplier", "contract_status", "amendments_count", "version"]
    rows = []
    types = ["Fixed Price", "Cost Plus", "Time & Materials", "Volume Discount", "Framework"]
    for i in range(5000):
        start = date(RNG.randint(2015, 2023), RNG.randint(1, 12), RNG.randint(1, 25))
        end = start + timedelta(days=RNG.choice([365, 730, 1095]))
        customer, supplier = RNG.choice(customers), RNG.choice(suppliers)
        commodity = RNG.choice(COMMODITIES)
        rows.append({"contract_id": f"CON-{i + 1:05d}", "customer_id": customer["customer_id"], "supplier_id": supplier["supplier_id"], "commodity_code": commodity["code"], "contract_type": RNG.choices(types, weights=[.40, .20, .15, .15, .10])[0], "start_date": start.isoformat(), "end_date": end.isoformat(), "contract_value_usd": round(RNG.uniform(50000, 15000000), 2), "payment_terms": supplier["payment_terms"], "delivery_terms": RNG.choice(["FOB", "CIF", "DAP", "DDP"]), "quality_requirements": "ISO 9001; lot inspection; traceability", "penalty_clauses": "1% per late week, capped at 10%", "termination_notice_days": RNG.choice([30, 60, 90]), "auto_renewal": "true" if RNG.random() < .45 else "false", "renewal_date": (end - timedelta(days=30)).isoformat(), "signed_by_customer": "true", "signed_by_supplier": "true" if RNG.random() < .98 else "false", "contract_status": "expired" if end < date(2024, 1, 1) else "active" if start <= date(2024, 12, 31) else "draft", "amendments_count": RNG.randint(0, 5), "version": RNG.randint(1, 6)})
    write_csv("contracts.csv", rows, fields)


def generate_audit_logs(suppliers, customers, orders):
    fields = ["log_id", "timestamp", "user_id", "user_role", "action_type", "entity_type", "entity_id", "field_changed", "old_value", "new_value", "ip_address", "user_agent", "session_id", "result", "error_message", "duration_ms"]
    rows = []
    actions = ["CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT", "LOGIN", "LOGOUT", "APPROVE", "REJECT", "SUBMIT", "CANCEL", "ARCHIVE"]
    entities = [("supplier", s["supplier_id"]) for s in suppliers] + [("customer", c["customer_id"]) for c in customers] + [("purchase_order", o["order_id"]) for o in orders]
    for i in range(100000):
        event_date = date(2015, 1, 1) + timedelta(days=RNG.randint(0, 3652))
        entity_type, entity_id = RNG.choice(entities)
        action = RNG.choices(actions, weights=[.12, .27, .01, .28, .04, .08, .04, .06, .02, .04, .02, .02])[0]
        failed = RNG.random() < .015
        rows.append({"log_id": f"LOG-{i + 1:07d}", "timestamp": f"{event_date.isoformat()}T{RNG.randint(0, 23):02d}:{RNG.randint(0, 59):02d}:00Z", "user_id": f"USR-{RNG.randint(1, 85):04d}", "user_role": RNG.choice(["admin", "procurement_manager", "analyst", "viewer"]), "action_type": action, "entity_type": entity_type, "entity_id": entity_id, "field_changed": RNG.choice(["status", "risk_score", "total_usd", "payment_terms"]) if action in {"UPDATE", "APPROVE", "REJECT"} else "", "old_value": "pending" if action == "UPDATE" else "", "new_value": "approved" if action == "APPROVE" else "", "ip_address": f"10.{RNG.randint(1, 220)}.{RNG.randint(1, 254)}.{RNG.randint(1, 254)}", "user_agent": RNG.choice(["Chrome/macOS", "Safari/macOS", "Edge/Windows", "API-client/2.1"]), "session_id": f"SES-{RNG.randint(1, 25000):06d}", "result": "failure" if failed else "success", "error_message": "permission denied" if failed else "", "duration_ms": RNG.randint(20, 2400)})
    write_csv("audit_logs.csv", rows, fields)


def generate_financials(suppliers, customers):
    fields = ["date", "entity_type", "entity_id", "revenue_usd", "cost_usd", "gross_margin", "operating_expenses", "ebitda", "net_profit", "cash_flow", "accounts_receivable", "accounts_payable", "inventory_value", "working_capital", "roi_percent"]
    rows = []
    for i, (year, month) in enumerate(months()):
        for entity_type, entities in [("supplier", suppliers), ("customer", customers)]:
            for entity in entities:
                entity_id = entity["supplier_id"] if entity_type == "supplier" else entity["customer_id"]
                revenue = RNG.uniform(50000, 5000000) * (1 + i * .003)
                cost = revenue * RNG.uniform(.55, .88)
                gross = revenue - cost
                operating = revenue * RNG.uniform(.05, .18)
                rows.append({"date": f"{year:04d}-{month:02d}", "entity_type": entity_type, "entity_id": entity_id, "revenue_usd": round(revenue, 2), "cost_usd": round(cost, 2), "gross_margin": round(gross / revenue * 100, 3), "operating_expenses": round(operating, 2), "ebitda": round(gross - operating, 2), "net_profit": round(gross - operating - revenue * RNG.uniform(.02, .08), 2), "cash_flow": round(RNG.uniform(-.2, .3) * revenue, 2), "accounts_receivable": round(revenue * RNG.uniform(.05, .25), 2), "accounts_payable": round(cost * RNG.uniform(.05, .2), 2), "inventory_value": round(cost * RNG.uniform(.08, .4), 2), "working_capital": round(revenue * RNG.uniform(.05, .3), 2), "roi_percent": round(RNG.uniform(4, 32), 3)})
    write_csv("financials.csv", rows, fields)


def generate_alerts(suppliers, customers, orders, inventory):
    fields = ["alert_id", "created_at", "alert_type", "severity", "title", "description", "entity_type", "entity_id", "threshold_value", "actual_value", "status", "assigned_to", "resolved_at", "resolution_notes", "auto_generated", "escalation_level", "related_alerts"]
    rows = []
    alert_types = [("Price spike", "commodity", "High"), ("Supplier delay", "supplier", "High"), ("Quality failure", "supplier", "Critical"), ("Stock low", "inventory", "Medium"), ("Stock overstock", "inventory", "Low"), ("Payment overdue", "customer", "Medium"), ("Risk score spike", "supplier", "Critical"), ("Contract expiring", "supplier", "Medium"), ("Anomaly detected", "purchase_order", "High"), ("Demand surge", "commodity", "High")]
    entities = [("supplier", s["supplier_id"]) for s in suppliers] + [("customer", c["customer_id"]) for c in customers] + [("purchase_order", o["order_id"]) for o in orders] + [("inventory", x["item_id"]) for x in inventory]
    for i in range(10000):
        alert_type, default_entity, severity = RNG.choice(alert_types)
        candidates = [entity for entity in entities if entity[0] == default_entity]
        entity_type, entity_id = RNG.choice(candidates or entities)
        created = date(2015, 1, 1) + timedelta(days=RNG.randint(0, 3652))
        resolved = created + timedelta(days=RNG.randint(1, 30)) if RNG.random() < .68 else None
        rows.append({"alert_id": f"ALT-{i + 1:06d}", "created_at": f"{created.isoformat()}T{RNG.randint(0, 23):02d}:00:00Z", "alert_type": alert_type, "severity": severity, "title": f"{alert_type} detected for {entity_id}", "description": "Automated monitoring threshold exceeded; review recommended.", "entity_type": entity_type, "entity_id": entity_id, "threshold_value": round(RNG.uniform(10, 100), 2), "actual_value": round(RNG.uniform(12, 140), 2), "status": "resolved" if resolved else "open", "assigned_to": f"USR-{RNG.randint(1, 85):04d}", "resolved_at": f"{resolved.isoformat()}T12:00:00Z" if resolved else "", "resolution_notes": "Supplier contacted and mitigation recorded" if resolved else "", "auto_generated": "true", "escalation_level": RNG.randint(0, 3), "related_alerts": json.dumps([])})
    write_csv("alerts.csv", rows, fields)


def main():
    generate_countries()
    generate_commodities()
    suppliers = generate_suppliers()
    generate_market_prices()
    generate_demand()
    generate_economics_and_fx()
    generate_risk(suppliers)
    customers = generate_customers()
    orders = generate_orders(suppliers, customers)
    inventory = generate_inventory()
    generate_performance(suppliers)
    generate_inventory_movements(inventory, orders)
    generate_contracts(customers, suppliers)
    generate_audit_logs(suppliers, customers, orders)
    generate_financials(suppliers, customers)
    generate_alerts(suppliers, customers, orders, inventory)
    print(f"Generated datasets with seed {SEED} in {len(OUTPUT_DIRS)} directories.")
    print(f"Suppliers: {len(suppliers)} | Customers: {len(customers)} | Orders: {len(orders)} | Months: {MONTHS}")


if __name__ == "__main__":
    main()
