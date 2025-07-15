import React, { useRef, useState } from 'react';
import TransferList from '@/components/desktop/compare/TransferList';
import FlyMapTo from '@/components/general/map/FlyMapTo';
import { colorTransferMap, dateFormatter, onEachFeature } from '@/utils/helper';
import { compareList, userComparePlaceList } from '@/utils/networks';
import {
  ComparePlaceProps,
  PlaceListToCompareProps,
  PlaceMapProps,
  TableTransferProps,
} from '@/utils/types/compare.types';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Flex,
  GetRef,
  Input,
  Result,
  Space,
  Switch,
  TableColumnsType,
  TableColumnType,
  TableProps,
  Tag,
  TransferProps,
  Typography,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useMediaQuery } from 'react-responsive';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import PlaceCompareList from '@/components/desktop/compare/PlaceCompareList';

const { Link, Text } = Typography;

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof PlaceListToCompareProps;

const filterOption = (input: string, item: ComparePlaceProps) =>
  item.placeName?.includes(input) ||
  item.type.name?.includes(input) ||
  item.placeAddress?.includes(input);

const CompareUserMapPages: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [placeId, setPlaceId] = useState<string>();
  const [pcc, setPcc] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState<PlaceMapProps[]>([]);
  const [userPlace, setUserPlace] = useState<string | null>();

  const isEnoughSpace = useMediaQuery({
    query: '(min-width: 700px)',
  });

  const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const toggleDisabled = (checked: boolean) => {
    setDisabled(checked);
  };

  const userPlaceToCompare = useQuery({
    queryKey: ['user-place-to-compare'],
    queryFn: async () => await userComparePlaceList(),
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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
  ): TableColumnType<PlaceListToCompareProps> => ({
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

  const addNewPlaceMap = (newPlaceMap: PlaceMapProps) => {
    setGeoJsonData((prevData) => [...prevData, newPlaceMap]);
    console.log(geoJsonData);
  };

  const deletePlaceById = (placeId: string) => {
    setGeoJsonData((prevData) =>
      prevData.filter((item) => item.placeId !== placeId)
    );
  };

  const columnsUser: TableProps<PlaceListToCompareProps>['columns'] = [
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
            {type.name.toUpperCase()}
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
      title: 'Aksi',
      key: 'place-action',
      align: 'center',
      width: '150px',
      render: (_, { placeId, placeMap, placeCenterPoint }) => {
        const userPlaceSelected = userPlace === placeId ? true : false;

        return (
          <Space>
            <Link
              disabled={userPlaceSelected || geoJsonData.length !== 0}
              onClick={() => {
                setPlaceId(placeId);
                setPcc(placeCenterPoint);
                const placeGeo = placeMap.placeGeojson;
                addNewPlaceMap({ placeId, placeGeo });
                setUserPlace(placeId);
              }}
            >
              Pilih Tempat
            </Link>
            <Link
              disabled={!userPlaceSelected}
              onClick={() => {
                setGeoJsonData([]);
                setPlaceId('');
                setPcc(null);
                setUserPlace(null);
              }}
            >
              Reset Tempat
            </Link>
          </Space>
        );
      },
    },
  ];

  const compare = useQuery({
    queryKey: ['compare-list', placeId],
    queryFn: async () => await compareList(placeId),
    enabled: placeId != null,
  });

  const columnsSource: TableColumnsType<ComparePlaceProps> = [
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
            {type.name.toUpperCase()}
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

  const columnsTarget: TableColumnsType<ComparePlaceProps> = [
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
      render: (_, { placeId, placeMap }) => {
        const isInGeoJsonData = geoJsonData.some(
          (item) => item.placeId === placeId
        );

        return (
          <Space size={'middle'}>
            <Link
              onClick={() => {
                const placeGeo = placeMap.placeGeojson;
                addNewPlaceMap({ placeId, placeGeo });
              }}
              disabled={isInGeoJsonData}
            >
              Tampil
            </Link>
            <Link
              type="danger"
              onClick={() => {
                deletePlaceById(placeId);
              }}
              disabled={!isInGeoJsonData}
            >
              Hapus
            </Link>
          </Space>
        );
      },
    },
  ];

  const zoomToFeature = (e: any) => {
    const map = e.target._map;
    map.fitBounds(e.target.getBounds());
  };

  if (!isEnoughSpace) {
    return (
      <Result
        status="404"
        title="Perangkat anda terlalu kecil"
        subTitle="Maaf, halaman yang Anda kunjungi tidak dapat ditampilkan secara baik pada perangkat Anda."
        extra={
          <Text style={{ fontSize: '12px' }}>
            Petunjuk: Buka secara lanskap / coba gunakan perangkat lainnya
          </Text>
        }
      />
    );
  }

  return (
    <Flex align="end" gap="middle" vertical>
      <PlaceCompareList
        rowKey={({ placeId }) => placeId}
        dataSource={userPlaceToCompare.data}
        columns={columnsUser}
      />
      <TransferList
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
        unCheckedChildren="Kunci Pilihan"
        checkedChildren="Buka Pilihan"
        checked={disabled}
        onChange={toggleDisabled}
      />
      <MapContainer
        center={[-1.2480891, 118]}
        zoom={19}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pcc && <FlyMapTo position={pcc} />}
        {geoJsonData &&
          geoJsonData.map((item: PlaceMapProps, index: number) => (
            <GeoJSON
              key={index}
              data={item.placeGeo}
              style={{
                weight: 2,
                dashArray: '3',
                fillColor: 'transparent',
                color: colorTransferMap(index),
              }}
              onEachFeature={(feature, layer) =>
                onEachFeature(feature, layer, zoomToFeature)
              }
            />
          ))}
      </MapContainer>
    </Flex>
  );
};

export default CompareUserMapPages;
