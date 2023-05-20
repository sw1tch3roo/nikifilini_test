import { createClient, fetchExchange } from 'urql';
console.log(process.env.API_URL);

const client = createClient({
  url: process.env.API_URL || 'http://localhost:3000/graphql',
  fetchOptions: () => {
    // Token?
    return {
      headers: {
        'X-API-KEY': 'FVEfJ2H6ykLIva2KWPIizzte4XwgzqjW',
      },
    };
  },
  exchanges: [fetchExchange],
});

export default client;
