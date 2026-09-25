'use client';
import { SimulationResult } from '@/lib/model';
import { formatCurrency } from '@/lib/formatting';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from 'recharts';
import { useState, useEffect } from 'react';

export default function VolumeChart({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const data = result.monthly.map((m, i) => {
    return {
      name: `M${m.month}`,
      Baseline: baseline.monthly[i].tradingVolume,
      BITREBELS: m.tradingVolume,
    };
  });

  return (
    <div className="bg-white border border-app-border rounded-lg shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-app-border">
        <div>
          <h3 className="font-serif-display text-[17px] font-semibold text-ink-primary">Year-1 trading volume</h3>
          <p className="text-xs text-ink-secondary mt-0.5">Cumulative monthly volume trajectory (in ₹ Crores)</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs num">
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <span className="w-3.5 h-0.5 bg-slate-400 inline-block border-t border-dashed border-slate-500"></span>
            <span>Baseline ({formatCurrency(baseline.monthly[11].tradingVolume)} at M12)</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-primary font-medium">
            <span className="w-3.5 h-0.5 bg-teal-brand inline-block rounded-full"></span>
            <span>BITREBELS ({formatCurrency(result.monthly[11].tradingVolume)} at M12)</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-72 pt-4 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBitrebels" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94A3B8' }} 
              tickFormatter={(val) => `₹${(val / 10000000).toFixed(0)}Cr`}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E5E0" />
            <Tooltip 
              formatter={(value: any, name: any) => [formatCurrency(Number(value) || 0), String(name)]}
              contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E4E5E0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="Baseline" 
              stroke="#94A3B8" 
              strokeWidth={1.5} 
              strokeDasharray="4 4" 
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={isInitialLoad ? 800 : 350}
              animationEasing="ease-out"
            />
            <Area 
              type="monotone" 
              dataKey="BITREBELS" 
              stroke="#2EC4B6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorBitrebels)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2EC4B6' }}
              animationDuration={isInitialLoad ? 800 : 350}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
