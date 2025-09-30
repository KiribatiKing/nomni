import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  used: 'hsl(var(--primary))',
  remaining: 'hsl(var(--secondary))',
};

interface FundingData {
  name: string;
  value: number;
}

const FundingChart = () => {
  // Mock data - will be connected to real shifts data later
  const totalFunding = 50000;
  const usedFunding = 18500;
  const remainingFunding = totalFunding - usedFunding;

  const data: FundingData[] = [
    { name: 'Used', value: usedFunding },
    { name: 'Remaining', value: remainingFunding },
  ];

  const chartConfig = {
    used: {
      label: "Used Funding",
      color: COLORS.used,
    },
    remaining: {
      label: "Remaining Funding",
      color: COLORS.remaining,
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Funding Overview</CardTitle>
        <CardDescription>Your NDIS plan funding breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.used : COLORS.remaining} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Funding:</span>
            <span className="font-semibold">${totalFunding.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used:</span>
            <span className="font-semibold text-primary">${usedFunding.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-semibold text-secondary">${remainingFunding.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingChart;
