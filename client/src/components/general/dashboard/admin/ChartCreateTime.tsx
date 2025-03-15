import React, { useEffect } from 'react';
import { DashboardAdminChartProps } from '@/utils/types/admin.types';
import { DashboardChartProps } from '@/utils/types/statistic.types';
import { Chart } from '@antv/g2';
import { Skeleton } from 'antd';

const ChartCreateTime: React.FC<DashboardAdminChartProps> = ({
  data,
  loading,
}) => {
  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'create-statistic',
      autoFit: true,
    });

    const chartData = data?.detailCreate.map((item: DashboardChartProps) => ({
      Jenis: item.buildingName,
      Jumlah: item.placeCount,
      Bulan: item.month,
      color: item.color,
    }));

    // Extract unique colors from transformedData
    const uniqueColors = [...new Set(chartData.map((item) => item.color))];

    chart
      .line()
      .data(chartData)
      .encode('x', 'Bulan')
      .encode('y', 'Jumlah')
      .encode('color', 'Jenis')
      .scale('color', {
        range: uniqueColors,
      })
      .style('minHeight', 10)
      .animate('enter', { type: 'pathIn', duration: 1000 });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <Skeleton style={{ marginTop: '1rem' }} loading={loading} active>
      <div id="create-statistic"></div>
    </Skeleton>
  );
};

export default ChartCreateTime;
