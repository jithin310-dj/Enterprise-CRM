/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// Common interfaces
interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
}

export const LineChart: React.FC<ChartProps> = ({ data, height = 220, color = '#4f46e5', secondaryColor = '#06b6d4' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 100);
  const paddingX = 40;
  const paddingY = 20;
  const chartHeight = height - paddingY * 2;

  // Generate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (400 - paddingX * 2);
    const y = height - paddingY - (d.value / maxValue) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Generate SVG path for line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Generate area path for gradient fill under the line
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingY + ratio * chartHeight;
          const labelVal = Math.round(maxValue * (1 - ratio));
          return (
            <g key={i} className="opacity-40">
              <line
                x1={paddingX}
                y1={y}
                x2={400 - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text x={10} y={y + 4} fill="#94a3b8" className="text-[10px] font-mono font-medium">
                {labelVal >= 1000 ? `$${(labelVal / 1000).toFixed(1)}k` : labelVal}
              </text>
            </g>
          );
        })}

        {/* Gradient Area Fill */}
        {areaPath && <path d={areaPath} fill="url(#chart-grad)" />}

        {/* The Curve Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactivity Hotspots & Data Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              fill="#ffffff"
              stroke={color}
              strokeWidth={hoveredIndex === i ? 3 : 2}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Invisibly expanded touch targets */}
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}

        {/* X-Axis labels */}
        {data.map((d, i) => {
          const x = paddingX + (i / (data.length - 1)) * (400 - paddingX * 2);
          return (
            <text
              key={i}
              x={x}
              y={height - 4}
              textAnchor="middle"
              fill="#64748b"
              className="text-[10px] font-sans font-medium"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-md animate-in fade-in duration-100"
          style={{
            left: `${(points[hoveredIndex].x / 400) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 45}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-[10px] opacity-75">{points[hoveredIndex].label}</div>
          <div className="font-mono font-bold">${points[hoveredIndex].value.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({ data, height = 220, color = '#4f46e5' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const paddingX = 40;
  const paddingY = 20;
  const chartHeight = height - paddingY * 2;
  const barWidth = Math.max(8, Math.min(24, (280 - paddingX) / data.length));

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingY + ratio * chartHeight;
          const labelVal = Math.round(maxValue * (1 - ratio));
          return (
            <g key={i} className="opacity-40">
              <line
                x1={paddingX}
                y1={y}
                x2={400 - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text x={10} y={y + 4} fill="#94a3b8" className="text-[10px] font-mono font-medium">
                {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(0)}k` : labelVal}
              </text>
            </g>
          );
        })}

        {/* Draw Bars */}
        {data.map((d, i) => {
          const x = paddingX + (i / data.length) * (400 - paddingX * 2) + 10;
          const barHeight = (d.value / maxValue) * chartHeight;
          const y = height - paddingY - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="4"
                fill={hoveredIndex === i ? '#312e81' : color}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Invisible full height touch sensor */}
              <rect
                x={x - 4}
                y={paddingY}
                width={barWidth + 8}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* X Axis Labels */}
              <text
                x={x + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fill="#64748b"
                className="text-[9px] font-sans font-semibold"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-md animate-in fade-in duration-100"
          style={{
            left: `${((paddingX + (hoveredIndex / data.length) * (400 - paddingX * 2) + 10 + barWidth / 2) / 400) * 100}%`,
            top: `${((height - paddingY - (data[hoveredIndex].value / maxValue) * chartHeight) / height) * 100 - 45}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-[10px] opacity-75">{data[hoveredIndex].label}</div>
          <div className="font-mono font-bold">{data[hoveredIndex].value.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
      {/* Circle rendering */}
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
          {data.map((d, i) => {
            const percentage = total > 0 ? (d.value / total) * 100 : 0;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = 100 - accumulatedAngle;
            accumulatedAngle += percentage;

            return (
              <circle
                key={i}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={d.color}
                strokeWidth="5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:stroke-[6px]"
              />
            );
          })}
        </svg>
        {/* Central hole stats */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
          <span className="font-mono text-lg font-extrabold text-slate-800">{total}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Units</span>
        </div>
      </div>

      {/* Legends */}
      <div className="flex-1 space-y-2">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white shadow-xs" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600">{d.label}</span>
              </div>
              <span className="font-mono text-slate-800">
                {d.value} <span className="text-slate-400 font-medium text-[10px]">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
