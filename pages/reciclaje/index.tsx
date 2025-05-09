"use client"

import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { Eye, PlusSquare } from 'react-bootstrap-icons';
import { Button, Form, Input, InputNumber, InputRef, Space, Table, TableColumnsType, TableColumnType } from 'antd';
import Link from 'next/link';

import Loading from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import Register from '@/containers/Register';
import { useQueryEntityByRecicling } from '@/hooks/queries/useQueryEntityByRecicling';
import { useMutationReciclyn } from '@/hooks/mutation/useMutationReciclyn';

interface DataType {
  key: string;
  name: string;
  nameEntity: string;
  weight: string;
  category: string;
}

type DataIndex = keyof DataType;

const Reciclaje = () => {
  const { logout, session, status } = useAuth();
  const [weightUpdate, setWeightUpdate] = useState(0);
  const [showFormSum, setShowFormSum] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  
  const { entities, loading: loadingEntities } = useQueryEntityByRecicling();
  const { HandleCreateReciclyn } = useMutationReciclyn();

  const [formUpdate, setFormUpdate] = useState({
    id: 0,
    name: '',
    weight: ''
  });
  const [form] = Form.useForm();

  if (status == "loading") {
    return <Loading text="Cargando..." type="bars"/>
  }

  
  const handleSum = async () => {
    const newW = String(parseFloat(formUpdate.weight) + weightUpdate);

    HandleCreateReciclyn({
      entityId: formUpdate.id,
      weight: newW
    });
  };

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
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
      <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{marginBottom: 8, display: 'block'}}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90}}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{width: 90}}
          >
            Reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
                confirm({closeDropdown: false});
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
            }}
          >
              Filtrar
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
        <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
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
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
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
      title: 'Cat',
      dataIndex: 'category',
      key: 'category',
      width: '90px',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      ...getColumnSearchProps('name'),
    },
    {
        title: 'Entidad',
        dataIndex: 'nameEntity',
        key: 'nameEntity',
        width: '50%',
        ...getColumnSearchProps('nameEntity'),
    },
    {
        title: 'Peso',
        dataIndex: 'weight',
        key: 'weight',
        ...getColumnSearchProps('weight'),
        sorter: (a, b) => a.category.length - b.category.length,
        sortDirections: ['descend', 'ascend'],
        render: (text) => <>{text + ' KL'}</>
    },
    {
        title: 'Acciones',
        dataIndex: '',
        key: 'x',
        render: (text) => <section className='flex gap-4'>
          <PlusSquare onClick={() => {
            setFormUpdate({
              id: parseInt(text.id),
              name: text.name,
              weight: text.weight
            })
            setShowFormSum(true)
          }} size={30} className='text-blue-600 cursor-pointer' title='Añadir Kilos'/>
          <Link href={`/reciclaje/${text.id}`}><Eye size={30} className='text-yellow-600 cursor-pointer' title='Ver/Editar'/></Link>
        </section>,
    },
  ];


  
  return <main className='debug p-6 md:py-16 lg:p-24 min-w-screen min-h-screen box-border bg-[url(/images/bg.png)] bg-no-repeat bg-cover'>
    {
      session && session.user && <p>{session.user.name}</p>
    }
    
    <button onClick={() => logout()}>Salir</button>
    {
      showFormSum && <section className='fixed left-0 top-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center'>
        <section className='px-6 w-[90%] md:w-96 h-56 rounded-3xl bg-white flex justify-center items-center'>
          <section className='w-full m-auto flex gap-3'>
            <InputNumber value={weightUpdate} onChange={e => e && setWeightUpdate(e)} addonAfter={<>KL</>} style={{width: '100%'}}/>
            <button onClick={handleSum} className='bg-blue-500 px-3 py-1 text-white rounded-xl'> Sumar</button>
            <button onClick={() => setShowFormSum(false)} className='text-blue-500  underline text-sm'>Ocultar</button>
          </section>
        </section>
      </section>
    }
    {
      showFormUpdate &&
      <section className='fixed left-0 top-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center'>
        <section className='w-2/6 py-10 rounded-3xl bg-white flex justify-center items-center'>
          <Form
            labelCol={{span: 6}}
            wrapperCol={{span: 16}}
            form={form}>
            <Form.Item
                label="Nombre"
                required>
                <Input value={formUpdate.name}
                        onChange={e => setFormUpdate({...formUpdate, name: e.target.value})}/>
            </Form.Item>
            <Form.Item
                label="Peso"
                required>
                <InputNumber value={formUpdate.weight}
                              onChange={e => setFormUpdate({...formUpdate, weight: e ?? ''})}
                              addonAfter={<>KL</>}/>
            </Form.Item>
            <Form.Item wrapperCol={{offset: 8, span: 10}}>
                <Button className='w-full' type="primary" htmlType="submit">
                    Guardar
                </Button>
                <button onClick={() => setShowFormUpdate(false)}
                        className='text-gray-500  underline text-sm w-full'>Ocultar
                </button>
            </Form.Item>
          </Form>
        </section>
      </section>
    }
    <Register/>
    {
      loadingEntities ? <Loading text="Cargando datos..." type="bars"/>
      :
      <Table<DataType> columns={columns} dataSource={entities}/>
    }
    
  </main>;
}

export default Reciclaje;