import { useState, useCallback, useMemo } from 'react';
import { fetchAnalyticsData } from '../api/api';
import { isValidCache, setCacheData } from './cacheManager';
import { toast } from 'react-toastify';

export const useAnalytics = () => {
  const [graphType, setGraphType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [layout, setLayout] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [cache, setCache] = useState({});

  const getData = useCallback(async (type) => {
    const cacheEntry = cache[type];
    
    if (isValidCache(cacheEntry)) {
      return cacheEntry.data;
    }

    const response = await fetchAnalyticsData(type);
    setCache(prevCache => setCacheData(prevCache, type, response));
    return response;
  }, [cache]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setStatsData(null); // Reset data before fetching
      setData(null);
      setLayout(null);
      
      const response = await getData(graphType);
      
      if (!response) {
        throw new Error('No data received from server');
      }

      if (response.type === 'stats') {
        if (!response.data || !response.data.counts) {
          throw new Error('Invalid stats data format');
        }
        setStatsData(response.data);
      } else {
        if (!response.data || !response.layout) {
          throw new Error('Invalid graph data format');
        }
        setData(response.data);
        setLayout(response.layout);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch analytics data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [graphType, getData]);

  const refreshData = useCallback(() => {
    setCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[graphType];
      return newCache;
    });
    fetchData();
  }, [graphType, fetchData]);

  return {
    graphType,
    setGraphType,
    loading,
    data,
    layout,
    statsData,
    fetchData,
    refreshData
  };
};
