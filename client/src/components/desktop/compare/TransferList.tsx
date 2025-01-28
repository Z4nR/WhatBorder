import React, { useState } from 'react';
import { Table, TableProps, Transfer, message } from 'antd';
import { TableTransferProps, TransferItem } from '@/utils/types/compare.types';
import EmptyData from '../../general/utils/EmptyData';

type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

const TransferList: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;

  const [rightTableCount, setRightTableCount] = useState(0);

  // Maximum number of items allowed in the right table
  const maxItemsInRightTable = 3;

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

        // Handle individual item selection
        const handleItemSelect = (key: string, selected: boolean) => {
          const newCount = rightTableCount + (selected ? 1 : -1);
          if (
            direction === 'left' &&
            selected &&
            rightTableCount >= maxItemsInRightTable
          ) {
            message.warning(
              `You can only select up to ${maxItemsInRightTable} items in the right table.`
            );
            return;
          }
          setRightTableCount(newCount);
          onItemSelect(key, selected);
        };

        // Handle selecting/deselecting multiple items at once
        const handleItemSelectAll = (keys: string[], type: 'replace') => {
          if (
            direction === 'left' &&
            type === 'replace' &&
            keys.length > maxItemsInRightTable - rightTableCount
          ) {
            message.warning(
              `Kamu hanya dapat memilih tempak sampai ${maxItemsInRightTable} tempat di tabel kanan.`
            );
            return;
          }
          setRightTableCount(keys.length); // Update count based on the new selection
          onItemSelectAll(keys, type);
        };

        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            handleItemSelectAll(selectedRowKeys as string[], 'replace');
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
                      handleItemSelect(key, !listSelectedKeys.includes(key));
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
