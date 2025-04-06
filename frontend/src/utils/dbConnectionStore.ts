// dbConnectionStore.ts

let connectionString = "";

export const setConnectionString = (value: string) => {
  connectionString = value;
};

export const getConnectionString = () => connectionString;
