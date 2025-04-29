export async function DataProvider(coin) {
  const fetchDetails = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }

  };

  let data = await fetchDetails();
  return data;
}
