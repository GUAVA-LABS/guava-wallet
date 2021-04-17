import React from 'react';
import { ApolloClient, InMemoryCache, graphql, useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const TransactionHistory = () => {
  const client = new ApolloClient({
    uri: "https://graphql.avascan.info/",
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}></ApolloProvider>;
};

export default TransactionHistory;