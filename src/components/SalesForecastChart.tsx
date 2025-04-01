
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SalesData {
  label: string;
  value: number;
}

interface SalesForecastChartProps {
  data: SalesData[];
}

export const SalesForecastChart: React.FC<SalesForecastChartProps> = ({ data }) => {
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-sage-primary">{label}</p>
          <p className="text-sage-text font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="area">
      <div className="flex justify-end mb-2">
        <TabsList>
          <TabsTrigger value="area">Area</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="area" className="mt-0 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#245e4f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7ac9a7" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value) => value.replace('Month ', 'M')}
            />
            <YAxis 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Sales" 
              stroke="#245e4f" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="bar" className="mt-0 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value) => value.replace('Month ', 'M')}
            />
            <YAxis 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Sales" 
              fill="#7ac9a7" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
};
