import { Table, TableProps, Transfer } from 'antd';
import {
  TableTransferProps,
  TransferItem,
} from '@/utils/state/compare/compare.types';
import EmptyData from '../../general/utils/EmptyData';
import React from 'react';

type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

const TransferList: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;

  return (
    <Transfer
      locale={{ itemsUnit: 'Daftar Tempat', itemUnit: 'Tempat Dibandingkan' }}
      style={{ width: '100%' }}
      {...restProps}
    >
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            locale={{
              emptyText:
                direction === 'left' ? (
                  <EmptyData description="Tidak Ada Tempat Lain Yang Bersinggungan" />
                ) : (
                  <EmptyData description="Tidak Ada Tempat Lain Sebagai Pembanding" />
                ),
            }}
            onRow={
              direction === 'left'
                ? ({ key, disabled: itemDisabled }) => ({
                    onClick: () => {
                      if (itemDisabled || listDisabled) {
                        return;
                      }
                      onItemSelect(key, !listSelectedKeys.includes(key));
                    },
                  })
                : undefined
            }
          />
        );
      }}
    </Transfer>
  );
};

export default TransferList;
