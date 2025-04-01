
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { SalesForecastChart } from './SalesForecastChart';
import { DownloadPDF } from './DownloadPDF';
import { EmailForecast } from './EmailForecast';
import { Calculator, ArrowDown, ArrowUp, HelpCircle } from 'lucide-react';

interface SalesData {
  label: string;
  value: number;
}

const SalesForecastCalculator = () => {
  const { toast } = useToast();
  const [initialSales, setInitialSales] = useState<number>(100000);
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [timeframe, setTimeframe] = useState<number>(12);
  const [forecastData, setForecastData] = useState<SalesData[]>([]);
  const [totalForecast, setTotalForecast] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Format currency in Indian Rupees
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateForecast = () => {
    if (initialSales <= 0) {
      toast({
        title: "Invalid Input",
        description: "Initial sales must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const data: SalesData[] = [];
    let total = 0;
    let currentSales = initialSales;

    for (let i = 1; i <= timeframe; i++) {
      currentSales = currentSales * (1 + growthRate / 100);
      total += currentSales;
      data.push({
        label: `Month ${i}`,
        value: Math.round(currentSales),
      });
    }

    setForecastData(data);
    setTotalForecast(total);
    setIsCalculated(true);
    
    toast({
      title: "Forecast Calculated",
      description: `Your ${timeframe}-month sales forecast has been generated.`,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setGrowthRate(value[0]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="h-10 w-10 text-sage-primary mr-2" />
          <h1 className="text-4xl font-bold text-sage-primary">Sales Forecast Calculator</h1>
        </div>
        <p className="text-lg text-sage-text mt-2 max-w-3xl mx-auto">
          Predict your future sales growth with precision using our advanced forecasting tool designed for businesses of all sizes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="p-6 sage-card lg:col-span-5">
          <h2 className="sage-section-title flex items-center">
            <span>Input Parameters</span>
            <HelpCircle className="h-5 w-5 ml-2 text-sage-secondary cursor-help" />
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initialSales">Initial Monthly Sales (₹)</Label>
              <Input
                id="initialSales"
                type="number"
                value={initialSales}
                onChange={(e) => setInitialSales(Number(e.target.value))}
                className="sage-input"
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
                <span className="text-sm font-medium text-sage-primary">{growthRate}%</span>
              </div>
              <Slider
                id="growthRate"
                min={-10}
                max={50}
                step={0.5}
                value={[growthRate]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>-10%</span>
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
              <div className="flex items-center text-sm mt-1">
                {growthRate < 0 ? (
                  <ArrowDown className="h-4 w-4 text-destructive mr-1" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-sage-secondary mr-1" />
                )}
                <span className={growthRate < 0 ? "text-destructive" : "text-sage-secondary"}>
                  {growthRate < 0 ? "Decline" : "Growth"} Rate
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Forecast Period (Months)</Label>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeframe === 3 ? "bg-sage-secondary text-white" : ""}
                  onClick={() => setTimeframe(3)}
                >
                  3
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeframe === 6 ? "bg-sage-secondary text-white" : ""}
                  onClick={() => setTimeframe(6)}
                >
                  6
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeframe === 12 ? "bg-sage-secondary text-white" : ""}
                  onClick={() => setTimeframe(12)}
                >
                  12
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeframe === 24 ? "bg-sage-secondary text-white" : ""}
                  onClick={() => setTimeframe(24)}
                >
                  24
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={calculateForecast} 
              className="w-full bg-sage-primary hover:bg-opacity-90 text-white"
            >
              Calculate Forecast
            </Button>
          </div>
        </Card>
        
        <div className="lg:col-span-7">
          {isCalculated ? (
            <Card className="sage-card h-full">
              <Tabs defaultValue="chart">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="sage-section-title">Sales Forecast Results</h2>
                  <TabsList>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chart" className="mt-0">
                  <div className="h-[300px]">
                    <SalesForecastChart data={forecastData} />
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="mt-0">
                  <div className="overflow-auto max-h-[300px]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-sage-text">Period</th>
                          <th className="px-4 py-2 text-right font-medium text-sage-text">Forecasted Sales</th>
                          <th className="px-4 py-2 text-right font-medium text-sage-text">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecastData.map((data, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="px-4 py-2 text-left">{data.label}</td>
                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(data.value)}</td>
                            <td className={`px-4 py-2 text-right ${growthRate < 0 ? "text-destructive" : "text-sage-secondary"}`}>
                              {growthRate >= 0 ? "+" : ""}{growthRate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Projected Sales for {timeframe} Months</p>
                    <p className="text-2xl font-bold text-sage-primary">{formatCurrency(totalForecast)}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <DownloadPDF 
                      forecastData={forecastData} 
                      initialSales={initialSales}
                      growthRate={growthRate}
                      timeframe={timeframe}
                      totalForecast={totalForecast}
                      formatCurrency={formatCurrency}
                    />
                    <EmailForecast 
                      forecastData={forecastData} 
                      initialSales={initialSales}
                      growthRate={growthRate}
                      timeframe={timeframe}
                      totalForecast={totalForecast}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="sage-card flex flex-col items-center justify-center h-full py-12">
              <Calculator className="h-20 w-20 text-sage-secondary opacity-30 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Forecast Data Yet</h3>
              <p className="text-gray-400 text-center max-w-md">
                Enter your initial sales, growth rate, and timeframe, then click "Calculate Forecast" to see your projections.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-12 sage-card">
        <h2 className="sage-section-title">Understanding Sales Forecasting</h2>
        
        <div className="prose max-w-none text-sage-text">
          <h3 className="text-xl font-semibold text-sage-primary mb-2">What is Sales Forecasting?</h3>
          <p className="mb-4">
            Sales forecasting is the process of estimating future sales by predicting the amount of product or services a sales unit can sell in a defined time period. Accurate sales forecasts enable companies to make informed business decisions and predict short-term and long-term performance.
          </p>
          
          <h3 className="text-xl font-semibold text-sage-primary mb-2">Benefits of Sales Forecasting</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Strategic Planning:</strong> Develop better strategies with data-driven insights about future revenue.</li>
            <li><strong>Resource Allocation:</strong> Efficiently distribute resources based on projected sales demands.</li>
            <li><strong>Cash Flow Management:</strong> Anticipate future cash flow to ensure business stability and growth.</li>
            <li><strong>Performance Metrics:</strong> Establish realistic targets for sales teams and evaluate progress.</li>
            <li><strong>Risk Mitigation:</strong> Identify potential challenges early and develop contingency plans.</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-sage-primary mb-2">How Our Calculator Works</h3>
          <p className="mb-4">
            Our Sales Forecast Calculator uses the compound growth method to project your future sales. Starting with your initial monthly sales figure, we apply your specified growth rate for each month in the forecast period. This approach accounts for the compounding effect of growth over time.
          </p>
          
          <h3 className="text-xl font-semibold text-sage-primary mb-2">Using the Results Effectively</h3>
          <p className="mb-4">
            The projections provided by this calculator should be used as one of several inputs for your business planning. For most accurate results, consider:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Adjusting growth rates seasonally if your business has predictable fluctuations</li>
            <li>Regularly updating your forecast with actual data</li>
            <li>Creating multiple scenarios (conservative, expected, and optimistic)</li>
            <li>Incorporating market trends and competitive analysis</li>
          </ul>
          
          <div className="bg-sage-secondary bg-opacity-10 p-4 rounded-md border-l-4 border-sage-primary mt-6">
            <h4 className="text-lg font-semibold text-sage-primary mb-1">Pro Tip:</h4>
            <p className="text-sage-text">
              For businesses with seasonal variations, break down your annual forecast into quarterly or monthly projections with different growth rates for more accurate planning. Use our calculator to create multiple scenarios and compare the results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForecastCalculator;
