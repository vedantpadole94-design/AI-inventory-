import { useEffect, useState } from 'react';
import { datasetService } from '../services/datasetService';

export const useMarketPrices = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    datasetService.getMarketPrices().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};

export const useSuppliers = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    datasetService.getSuppliers().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};

export const usePurchaseOrders = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    datasetService.getPurchaseOrders().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};

export const useDemandHistory = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    datasetService.getDemandHistory().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};

export const useRiskAssessments = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    datasetService.getRiskAssessments().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};
