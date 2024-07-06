import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';
import { Flex, Table, TableProps, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { placeStatistic } from '@/utils/networks';
import { dateFormatter } from '@/utils/helper';

interface Statistic {
  buildingName: string;
  placeCount: number;
}

interface DataType {
  place_name: string;
  type: {
    name: string;
    label: string;
  };
  created_at: Date;
}

const UserDashboard: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['place-statistic'],
    queryFn: async () => await placeStatistic(),
  });

  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'statistic',
      autoFit: true,
      height: 530,
    });

    chart.coordinate({ type: 'radial', endAngle: Math.PI });

    chart
      .interval()
      .data({
        value: data.detail.map((item: Statistic) => ({
          name: item.buildingName,
          star: item.placeCount,
        })),
        transform: [{ type: 'sortBy', fields: [['star', true]] }],
      })
      .encode('x', 'name')
      .encode('y', 'star')
      .scale('y', { type: 'sqrt' })
      .encode('color', 'name')
      .encode('size', 40)
      .style('radius', 20)
      .label({
        text: 'star',
        position: 'outside',
        autoRotate: true,
        rotateToAlignArc: true,
        dx: 4,
      })
      .axis('x', { title: false })
      .axis('y', false)
      .animate('enter', { type: 'waveIn', duration: 1000 });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'place_name',
      key: 'place-name',
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'place-type',
      render: (_, { type }) => {
        return (
          <Tag style={{ margin: '0' }} color={type.label}>
            {type.name}
          </Tag>
        );
      },
    },
    {
      title: 'Ditambahkan Pada',
      dataIndex: 'createdAt',
      key: 'place-create',
      align: 'center',
      render: (_, { created_at }) => {
        const date = dateFormatter(created_at);
        return <p>{date}</p>;
      },
    },
  ];

  return (
    <Flex>
      <div id="statistic"></div>
      <Table pagination={false} columns={columns} dataSource={data.newPlace} />
    </Flex>
  );
};

export default UserDashboard;
