// Real Market API Service for Live NSE / BSE Quotes (48 Companies + 4 Indices)

export interface RealQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
}

export const TICKER_MAP: { [key: string]: { yahooSymbol: string; name: string } } = {
  // Benchmark Indices
  'NIFTY 50': { yahooSymbol: '^NSEI', name: 'NIFTY 50' },
  'SENSEX': { yahooSymbol: '^BSESN', name: 'SENSEX' },
  'BANK NIFTY': { yahooSymbol: '^NSEBANK', name: 'BANK NIFTY' },
  'NIFTY IT': { yahooSymbol: '^CNXIT', name: 'NIFTY IT' },

  // Banking & Finance
  'hdfcbank': { yahooSymbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  'icicibank': { yahooSymbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  'sbin': { yahooSymbol: 'SBIN.NS', name: 'State Bank of India' },
  'kotakbank': { yahooSymbol: 'KOTAKBANK.NS', name: 'Kotak Bank' },
  'axisbank': { yahooSymbol: 'AXISBANK.NS', name: 'Axis Bank' },
  'bajfinance': { yahooSymbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
  'bajajfinsv': { yahooSymbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv' },

  // IT & Tech
  'tcs': { yahooSymbol: 'TCS.NS', name: 'TCS' },
  'infy': { yahooSymbol: 'INFY.NS', name: 'Infosys' },
  'wipro': { yahooSymbol: 'WIPRO.NS', name: 'Wipro' },
  'hcltech': { yahooSymbol: 'HCLTECH.NS', name: 'HCL Tech' },
  'techm': { yahooSymbol: 'TECHM.NS', name: 'Tech Mahindra' },

  // Automobiles
  'tatamotors': { yahooSymbol: 'TMPV.NS', name: 'Tata Motors' },
  'maruti': { yahooSymbol: 'MARUTI.NS', name: 'Maruti Suzuki' },
  'mm': { yahooSymbol: 'M&M.NS', name: 'Mahindra & Mahindra' },
  'bajajauto': { yahooSymbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto' },
  'eichermot': { yahooSymbol: 'EICHERMOT.NS', name: 'Eicher Motors' },

  // Energy & Power
  'reliance': { yahooSymbol: 'RELIANCE.NS', name: 'Reliance' },
  'ntpc': { yahooSymbol: 'NTPC.NS', name: 'NTPC' },
  'powergrid': { yahooSymbol: 'POWERGRID.NS', name: 'Power Grid' },
  'coalindia': { yahooSymbol: 'COALINDIA.NS', name: 'Coal India' },
  'ongc': { yahooSymbol: 'ONGC.NS', name: 'ONGC' },
  'tatapower': { yahooSymbol: 'TATAPOWER.NS', name: 'Tata Power' },

  // FMCG & Retail
  'itc': { yahooSymbol: 'ITC.NS', name: 'ITC' },
  'hindunilvr': { yahooSymbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever' },
  'titan': { yahooSymbol: 'TITAN.NS', name: 'Titan' },
  'nestleind': { yahooSymbol: 'NESTLEIND.NS', name: 'Nestle India' },
  'trent': { yahooSymbol: 'TRENT.NS', name: 'Trent (Zudio)' },
  'dmart': { yahooSymbol: 'DMART.NS', name: 'Avenue Supermarts' },

  // Consumer Internet
  'zomato': { yahooSymbol: 'ETERNAL.NS', name: 'Zomato (Eternal)' },
  'paytm': { yahooSymbol: 'PAYTM.NS', name: 'Paytm' },
  'nykaa': { yahooSymbol: 'NYKAA.NS', name: 'Nykaa' },

  // Metals & Mining
  'tatasteel': { yahooSymbol: 'TATASTEEL.NS', name: 'Tata Steel' },
  'jswsteel': { yahooSymbol: 'JSWSTEEL.NS', name: 'JSW Steel' },
  'hindalco': { yahooSymbol: 'HINDALCO.NS', name: 'Hindalco' },
  'vedl': { yahooSymbol: 'VEDL.NS', name: 'Vedanta' },

  // Pharma & Health
  'sunpharma': { yahooSymbol: 'SUNPHARMA.NS', name: 'Sun Pharma' },
  'cipla': { yahooSymbol: 'CIPLA.NS', name: 'Cipla' },
  'drreddy': { yahooSymbol: 'DRREDDY.NS', name: 'Dr. Reddy' },
  'apollohosp': { yahooSymbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals' },

  // Infrastructure & Conglomerates
  'lt': { yahooSymbol: 'LT.NS', name: 'Larsen & Toubro' },
  'adanient': { yahooSymbol: 'ADANIENT.NS', name: 'Adani Enterprises' },
  'adaniports': { yahooSymbol: 'ADANIPORTS.NS', name: 'Adani Ports' },
  'ultracemco': { yahooSymbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement' },

  // Telecom, Defense & Paints
  'bhartiartl': { yahooSymbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
  'hal': { yahooSymbol: 'HAL.NS', name: 'HAL Defense' },
  'bel': { yahooSymbol: 'BEL.NS', name: 'Bharat Electronics' },
  'asianpaint': { yahooSymbol: 'ASIANPAINT.NS', name: 'Asian Paints' },
};

export async function fetchLiveQuote(yahooSymbol: string): Promise<RealQuote | null> {
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
  
  // Try 3 sources: Local / Netlify Proxy -> AllOrigins Proxy -> Direct
  const endpoints = [
    `/api/market?symbol=${encodeURIComponent(yahooSymbol)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    targetUrl,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const data = await res.json();
      
      const result = data?.chart?.result?.[0];
      if (!result?.meta) continue;

      const meta = result.meta;
      const price = Number(meta.regularMarketPrice?.toFixed(2)) || 0;
      const prevClose = Number(meta.chartPreviousClose?.toFixed(2)) || price;
      const change = Number((price - prevClose).toFixed(2));
      const percentChange = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
      const high = Number(meta.regularMarketDayHigh?.toFixed(2)) || price;
      const low = Number(meta.regularMarketDayLow?.toFixed(2)) || price;
      const volume = meta.regularMarketVolume || 100000;

      return {
        symbol: yahooSymbol,
        name: meta.shortName || yahooSymbol,
        price,
        change,
        percentChange,
        high,
        low,
        prevClose,
        volume,
      };
    } catch {
      // Continue to next endpoint
    }
  }

  return null;
}

// Fetch in parallel chunks of 12 for maximum performance
export async function fetchAllLiveMarketQuotes(): Promise<{ [id: string]: RealQuote }> {
  const results: { [id: string]: RealQuote } = {};
  const entries = Object.entries(TICKER_MAP);
  const chunkSize = 12;

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async ([id, item]) => {
        const quote = await fetchLiveQuote(item.yahooSymbol);
        if (quote && quote.price > 0) {
          results[id] = quote;
        }
      })
    );
  }

  return results;
}
