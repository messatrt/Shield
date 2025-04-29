// context.svelte.js
export const CoinProvider = async (name = "usd", symbol = "$") => {
  let allCoin = $state()
  let currency = {
    name: name,
    symbol: symbol
  };

  const fetchCoin = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  allCoin = await fetchCoin();
  return allCoin;
};

