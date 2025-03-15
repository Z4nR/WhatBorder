import React, { useEffect } from 'react';
import { DashboardAdminChartProps } from '@/utils/types/admin.types';
import { DashboardChartProps } from '@/utils/types/statistic.types';
import { Chart } from '@antv/g2';
import { Skeleton } from 'antd';

const ChartTotalBuilding: React.FC<DashboardAdminChartProps> = ({
  data,
  loading,
}) => {
  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'type-statistic',
      autoFit: true,
    });

    const chartData = data?.detailType.map((item: DashboardChartProps) => ({
      Jenis: item.buildingName,
      Jumlah: item.placeCount,
      color: item.color,
    }));

    chart
      .interval()
      .data(chartData)
      .encode('x', 'Jenis')
      .encode('y', 'Jumlah')
      .encode('color', 'Jenis')
      .style('minHeight', 10)
      .scale('color', {
        range: chartData.map((item) => item.color),
      })
      .animate('enter', { type: 'scaleInY', duration: 1000 })
      .animate('exit', { type: 'scaleOutY', duration: 2000 });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <Skeleton style={{ marginTop: '1rem' }} loading={loading} active>
      <div id="type-statistic"></div>
    </Skeleton>
  );
};

export default ChartTotalBuilding;
