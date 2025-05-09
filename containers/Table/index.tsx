"use client"

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState,  } from 'react';
import { Button, Input, InputRef, Space, Table, TableColumnsType, TableColumnType } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useQueryEntityByRecicling } from '@/hooks/queries/useQueryEntityByRecicling';

interface DataType {
  key: string;
  name: string;
  weight: string;
  category: string;
  city: string;
  nameEntity: string
}

type DataIndex = keyof DataType;

const TableData = forwardRef((props, ref) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState<DataType[]>([]);
  const searchInput = useRef<InputRef>(null);

  const { entities, loading: loadingEntities } = useQueryEntityByRecicling();

  useEffect(() => {
    if(entities) {
      setData(entities);
    }
  }, [entities, loadingEntities]);

  const search = (text: string) => {
    if(text !== '') {
      setData(entities.filter((item: DataType) => item.name.toString().toLowerCase().includes(text.toLowerCase())));
    }else {
      setData(entities)
    }
  }

  useImperativeHandle(ref, () => ({
    search: search,
  }));

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtro
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
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

  const columns: TableColumnsType<DataType> = [
    {
      title: 'CAT',
      dataIndex: 'category',
      key: 'category',
      width: '90px',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Municipio',
      dataIndex: 'city',
      key: 'city',
      width: '200px',
      ...getColumnSearchProps('city'),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '25vw',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Entidad',
      dataIndex: 'nameEntity',
      key: 'nameEntity',
      width: '40vw',
      ...getColumnSearchProps('nameEntity'),
    },
    {
      title: 'Reciclado',
      dataIndex: 'weight',
      key: 'weight',
      ...getColumnSearchProps('weight'),
      sorter: (a: { weight: string | string[]; }, b: { weight: string | string[]; }) => a.weight.length - b.weight.length,
      sortDirections: ['descend', 'ascend'],
      render: (text) => <>{text} {text == 0 ? '' : 'kl'}</>,
    }
  ];
  return <>
  {
    entities && <Table<DataType> className='w-full' scroll={{ y: 350 }} columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
  }
  </>
})
TableData.displayName = 'TableData';
export default TableData;