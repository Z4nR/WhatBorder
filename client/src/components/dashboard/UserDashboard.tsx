import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';
import { Col, Flex, Row, Skeleton, Table, TableProps, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { placeStatistic } from '@/utils/networks';
import { dateFormatter } from '@/utils/helper';

interface Statistic {
  buildingName: string;
  placeCount: number;
  color: string;
}

interface DataType {
  placeId: string;
  placeName: string;
  placeType: {
    name: string;
    label: string;
  };
  createdAt: Date;
}

const UserDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['place-statistic'],
    queryFn: async () => await placeStatistic(),
  });

  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'statistic',
      autoFit: true,
    });

    const chartData = data?.detail.map((item: Statistic) => ({
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
        range: chartData.map((item: Statistic) => item.color),
      });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
    },
    {
      title: 'Tipe',
      dataIndex: 'placeType',
      key: 'place-type',
      render: (_, { placeType }) => {
        return (
          <Tag style={{ margin: '0' }} color={placeType.label}>
            {placeType.name}
          </Tag>
        );
      },
    },
    {
      title: 'Ditambahkan Pada',
      dataIndex: 'createdAt',
      key: 'place-create',
      align: 'center',
      render: (_, { createdAt }) => {
        const date = dateFormatter(createdAt);
        return <p>{date}</p>;
      },
    },
  ];

  return (
    <Row wrap>
      <Col xs={{ flex: '100%' }} sm={{ flex: '30%' }} md={{ flex: '50%' }}>
        <Skeleton loading={isLoading} active>
          <div id="statistic"></div>
        </Skeleton>
      </Col>
      <Col xs={{ flex: '100%' }} sm={{ flex: '60%' }} md={{ flex: '50%' }}>
        <Flex vertical>
          <Table
            pagination={false}
            columns={columns}
            dataSource={data?.newPlace}
            rowKey={({ placeId }) => placeId}
          />
        </Flex>
      </Col>
    </Row>
  );
};

export default UserDashboard;
