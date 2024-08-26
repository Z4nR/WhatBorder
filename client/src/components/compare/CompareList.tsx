import { Button, Flex, Input, Space, Switch, Tag, Typography } from 'antd';
import type {
  GetRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
  TransferProps,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import TransferBox from './TransferBox';
import {
  DataType,
  DataUserPlaceType,
  TableTransferProps,
} from './compare.types';
import UserPlaceList from '../statistic/UserPlaceList';
import { useQuery } from '@tanstack/react-query';
import { compareList, myList } from '@/utils/networks';
import { dateFormatter, onEachFeature, originalStyle } from '@/utils/helper';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import FlyMapTo from '../map/FlyMapTo';

const { Link } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof DataUserPlaceType;

const filterOption = (input: string, item: DataType) =>
  item.placeName?.includes(input) ||
  item.type.name?.includes(input) ||
  item.placeAddress?.includes(input);

const CompareList: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [pcc, setPcc] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [geoJsonData, setGeoJsonData] = useState<any[]>([]);

  const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const toggleDisabled = (checked: boolean) => {
    setDisabled(checked);
  };

  const my = useQuery({
    queryKey: ['user-place'],
    queryFn: async () => await myList(),
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm({ closeDropdown: true });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataUserPlaceType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Hapus
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Tutup
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const addNewPlaceMap = (newPlaceMap: any) => {
    setGeoJsonData((prevData) => [...prevData, newPlaceMap]);
    console.log(geoJsonData);
  };

  const columnsUser: TableProps<DataUserPlaceType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
      ...getColumnSearchProps('placeName'),
    },
    {
      title: 'Alamat',
      dataIndex: 'placeAddress',
      key: 'place-address',
      responsive: ['lg'],
    },
    {
      title: 'Tipe',
      dataIndex: 'placeType',
      key: 'place-type',
      width: '150px',
      responsive: ['sm'],
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
      width: '150px',
      responsive: ['md'],
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      render: (_, { createdAt }) => {
        const date = dateFormatter(createdAt);
        return <p>{date}</p>;
      },
    },
    {
      title: 'Tindakan',
      key: 'place-action',
      align: 'center',
      width: '150px',
      render: (_, { placeId, placeMap, placeCenterPoint }) => (
        <Link
          onClick={() => {
            setUserId(placeId);
            setPcc(placeCenterPoint);
            addNewPlaceMap(placeMap.place_geojson); // Push new value to mapRef array
          }}
        >
          Pilih Tempat
        </Link>
      ),
    },
  ];

  const compare = useQuery({
    queryKey: ['compare-list', userId],
    queryFn: async () => {
      if (userId) {
        return await compareList(userId);
      }
      return [];
    },
  });

  const columnsSource: TableColumnsType<DataType> = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
    },
    {
      title: 'Tipe',
      dataIndex: 'placeType',
      key: 'place-type',
      width: '150px',
      render: (_, { type }) => {
        return (
          <Tag style={{ margin: '0' }} color={type.label}>
            {type.name}
          </Tag>
        );
      },
    },
    {
      title: 'Jarak Ke Pusat Lokasi',
      dataIndex: 'rangePlace',
      key: 'place-range',
    },
  ];

  const columnsTarget: TableColumnsType<DataType> = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
    },
    {
      title: 'Alamat Tempat',
      dataIndex: 'placeAddress',
      key: 'place-address',
      width: '200px',
    },
    {
      title: 'Tampilkan Tempat',
      key: 'place-map',
      align: 'center',
      width: '150px',
      render: (_, { placeMap }) => (
        <Space size={'middle'}>
          <Link
            onClick={() => {
              addNewPlaceMap(placeMap.place_geojson); // Push new value to mapRef array
            }}
          >
            Tampil
          </Link>
          <Link
            onClick={() => {
              addNewPlaceMap(placeMap.place_geojson); // Push new value to mapRef array
            }}
          >
            Hapus
          </Link>
        </Space>
      ),
    },
  ];

  const zoomToFeature = (e: any) => {
    const map = e.target._map;
    map.fitBounds(e.target.getBounds());
  };

  console.log(geoJsonData);

  return (
    <Flex align="end" gap="middle" vertical>
      <UserPlaceList
        rowKey={({ placeId }) => placeId}
        dataSource={my.data}
        columns={columnsUser}
      />
      <TransferBox
        rowKey={({ placeId }) => placeId}
        dataSource={compare.data}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={columnsSource}
        rightColumns={columnsTarget}
      />
      <Switch
        unCheckedChildren="Buka Pilihan"
        checkedChildren="Kunci Pilihan"
        checked={disabled}
        onChange={toggleDisabled}
      />
      <MapContainer center={[-1.2480891, 118]} zoom={17} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pcc && <FlyMapTo position={pcc} />}
        {geoJsonData &&
          geoJsonData.map((item: any, index: number) => (
            <GeoJSON
              key={index}
              data={item}
              style={{ ...originalStyle }}
              onEachFeature={(feature, layer) =>
                onEachFeature(feature, layer, zoomToFeature)
              }
            />
          ))}
      </MapContainer>
    </Flex>
  );
};

export default CompareList;
