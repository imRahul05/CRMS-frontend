export const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const isValidCache = (cacheEntry) => {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_TIMEOUT;
};

export const getCachedData = (cache, key) => {
  const cacheEntry = cache[key];
  return isValidCache(cacheEntry) ? cacheEntry.data : null;
};

export const setCacheData = (cache, key, data) => {
  return {
    ...cache,
    [key]: {
      data,
      timestamp: Date.now()
    }
  };
};
