import { ArrowLeft, TrendingUp, Users, DollarSign, Clock, BarChart3, Calendar, Star, PhoneCall } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

type TimeRange = 'week' | 'month' | 'all';

interface MetricData {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const metricsData: Record<TimeRange, {
    acquisition: MetricData[];
    engagement: MetricData[];
    monetization: MetricData[];
    retention: MetricData[];
  }> = {
    week: {
      acquisition: [
        { label: 'New Signups', value: '42', change: '+12%', trend: 'up' },
        { label: 'Conversion Rate', value: '68%', change: '+5%', trend: 'up' },
        { label: 'Referral Signups', value: '8', change: '+3', trend: 'up' },
      ],
      engagement: [
        { label: 'DAU/MAU Ratio', value: '0.45', change: '+0.05', trend: 'up' },
        { label: 'Avg Sessions/User', value: '3.2', change: '+0.4', trend: 'up' },
        { label: 'Session Completion', value: '89%', change: '-2%', trend: 'down' },
        { label: 'Favorite Usage', value: '34%', change: '+6%', trend: 'up' },
      ],
      monetization: [
        { label: 'ARPU', value: '₹145', change: '+₹12', trend: 'up' },
        { label: 'Coin Conv. Rate', value: '23%', change: '+3%', trend: 'up' },
        { label: 'LTV', value: '₹890', change: '+₹45', trend: 'up' },
      ],
      retention: [
        { label: 'Day 1 Retention', value: '72%', change: '+4%', trend: 'up' },
        { label: 'Day 7 Retention', value: '48%', change: '+2%', trend: 'up' },
        { label: 'Day 30 Retention', value: '28%', change: '+1%', trend: 'up' },
        { label: 'Churn Rate', value: '15%', change: '-3%', trend: 'up' },
      ],
    },
    month: {
      acquisition: [
        { label: 'New Signups', value: '187', change: '+24%', trend: 'up' },
        { label: 'Conversion Rate', value: '64%', change: '+8%', trend: 'up' },
        { label: 'Referral Signups', value: '34', change: '+12', trend: 'up' },
      ],
      engagement: [
        { label: 'DAU/MAU Ratio', value: '0.42', change: '+0.03', trend: 'up' },
        { label: 'Avg Sessions/User', value: '4.1', change: '+0.6', trend: 'up' },
        { label: 'Session Completion', value: '91%', change: '+1%', trend: 'up' },
        { label: 'Favorite Usage', value: '31%', change: '+4%', trend: 'up' },
      ],
      monetization: [
        { label: 'ARPU', value: '₹162', change: '+₹18', trend: 'up' },
        { label: 'Coin Conv. Rate', value: '26%', change: '+5%', trend: 'up' },
        { label: 'LTV', value: '₹1,240', change: '+₹120', trend: 'up' },
      ],
      retention: [
        { label: 'Day 1 Retention', value: '70%', change: '+2%', trend: 'up' },
        { label: 'Day 7 Retention', value: '46%', change: '+3%', trend: 'up' },
        { label: 'Day 30 Retention', value: '27%', change: '+2%', trend: 'up' },
        { label: 'Churn Rate', value: '18%', change: '-2%', trend: 'up' },
      ],
    },
    all: {
      acquisition: [
        { label: 'Total Signups', value: '1,245', change: '+187', trend: 'up' },
        { label: 'Avg Conversion Rate', value: '62%', trend: 'neutral' },
        { label: 'Total Referrals', value: '198', change: '+34', trend: 'up' },
      ],
      engagement: [
        { label: 'Overall DAU/MAU', value: '0.38', trend: 'neutral' },
        { label: 'Total Sessions', value: '8,942', change: '+1,234', trend: 'up' },
        { label: 'Avg Completion', value: '88%', trend: 'neutral' },
        { label: 'Favorite Adoption', value: '29%', change: '+7%', trend: 'up' },
      ],
      monetization: [
        { label: 'Total Revenue', value: '₹1.8L', change: '+₹42K', trend: 'up' },
        { label: 'Overall ARPU', value: '₹145', trend: 'neutral' },
        { label: 'Avg LTV', value: '₹1,180', change: '+₹95', trend: 'up' },
      ],
      retention: [
        { label: 'Overall Day 1', value: '68%', trend: 'neutral' },
        { label: 'Overall Day 7', value: '44%', trend: 'neutral' },
        { label: 'Overall Day 30', value: '25%', trend: 'neutral' },
        { label: 'Avg Churn', value: '19%', change: '-4%', trend: 'up' },
      ],
    },
  };

  const currentMetrics = metricsData[timeRange];

  function getTrendIcon(trend?: 'up' | 'down' | 'neutral') {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➖';
  }

  function getTrendColor(trend?: 'up' | 'down' | 'neutral') {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-white/60';
  }

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 flex-shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl font-semibold ml-4">Analytics</h1>
        </div>
        <BarChart3 className="w-6 h-6 text-purple-400" />
      </header>

      {/* Time Range Selector */}
      <div className="flex gap-2 px-4 pb-4 flex-shrink-0">
        {[
          { label: 'Week', value: 'week' as TimeRange },
          { label: 'Month', value: 'month' as TimeRange },
          { label: 'All Time', value: 'all' as TimeRange },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === range.value
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-white/60 hover:bg-[#2a2a2a]'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* User Acquisition */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            User Acquisition
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {currentMetrics.acquisition.map((metric, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-white text-2xl font-bold">{metric.value}</p>
                  {metric.change && (
                    <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                      <span className="text-sm font-medium">{metric.change}</span>
                      <span>{getTrendIcon(metric.trend)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-green-400" />
            Engagement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {currentMetrics.engagement.map((metric, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">{metric.label}</p>
                <p className="text-white text-xl font-bold mb-1">{metric.value}</p>
                {metric.change && (
                  <p className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {metric.change} {getTrendIcon(metric.trend)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Monetization */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Monetization
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {currentMetrics.monetization.map((metric, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-white text-2xl font-bold">{metric.value}</p>
                  {metric.change && (
                    <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                      <span className="text-sm font-medium">{metric.change}</span>
                      <span>{getTrendIcon(metric.trend)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Retention
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {currentMetrics.retention.map((metric, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">{metric.label}</p>
                <p className="text-white text-xl font-bold mb-1">{metric.value}</p>
                {metric.change && (
                  <p className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {metric.change} {getTrendIcon(metric.trend)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-white" />
            <h3 className="text-white font-semibold">Key Insights</h3>
          </div>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>• User acquisition is up 24% this month</li>
            <li>• Engagement metrics showing positive trends</li>
            <li>• ARPU increased by ₹18 compared to last period</li>
            <li>• Day 7 retention improved to 46%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
