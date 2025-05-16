"use client";

import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";
import { Eye, PlusSquare } from "react-bootstrap-icons";
import { Button, Input, InputNumber, Space, Table, TableColumnsType, TableColumnType, message, InputRef } from "antd";
import Link from "next/link";

import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useQueryEntityByRecicling } from "@/hooks/queries/useQueryEntityByRecicling";
import { useMutationReciclyn } from "@/hooks/mutation/useMutationReciclyn";
import Layout from "@/components/layout";

interface DataType {
  key: string;
  name: string;
  nameEntity: string;
  weight: number;
  category: string;
}

type DataIndex = keyof DataType;

const Reciclaje = () => {
  const { status } = useAuth();
  const [weightUpdate, setWeightUpdate] = useState<number>(0);
  const [showFormSum, setShowFormSum] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [isTokenSent, setIsTokenSent] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState("");

  const { entities, loading: loadingEntities, refetch } = useQueryEntityByRecicling();
  const { HandleGenerateToken, HandleConfirmToken, loadingToken, loadingConfirm } = useMutationReciclyn();

  const [formUpdate, setFormUpdate] = useState({
    id: 0,
    name: "",
    currentWeight: 0,
  });

  useEffect(() => {

    refetch();
  }, [refetch]);

  if (status === "loading") {
    return <Loading text="Cargando..." type="bars" />;
  }

  const handleAddRecycling = async () => {
    if (weightUpdate === 0) {
      message.warning("Por favor, ingrese un valor diferente de cero.");
      return;
    }
    try {
      await HandleGenerateToken({
        entityId: formUpdate.id,
        weight: weightUpdate,
      });
      setIsTokenSent(true);
      message.success("Se ha enviado un token al correo registrado. Por favor, ingrésalo para confirmar cambios.");
    } catch (error: any) {
      const errorMessage = error.graphQLErrors?.[0]?.message || "Error al enviar el token";
      message.error(errorMessage);
    }
  };

  const handleConfirmToken = async () => {
    if (!tokenInput) {
      message.warning("Por favor, ingrese el token.");
      return;
    }
    try {
      await HandleConfirmToken(tokenInput);
      message.success(`Se han ${weightUpdate > 0 ? "agregado" : "restado"} ${Math.abs(weightUpdate)} KL correctamente.`);
      setShowFormSum(false);
      setIsTokenSent(false);
      setTokenInput("");
      await refetch();
    } catch (error: any) {
      const errorMessage = error.graphQLErrors?.[0]?.message || "Error al validar el token";
      message.error(errorMessage);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
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
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Cat",
      dataIndex: "category",
      key: "category",
      width: "90px",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "50%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Entidad",
      dataIndex: "nameEntity",
      key: "nameEntity",
      width: "50%",
      ...getColumnSearchProps("nameEntity"),
    },
    {
      title: "Peso Total",
      dataIndex: "weight",
      key: "weight",
      ...getColumnSearchProps("weight"),
      sorter: (a, b) => a.weight - b.weight,
      sortDirections: ["descend", "ascend"],
      render: (text) => <>{text} KL</>,
    },
    {
      title: "Acciones",
      dataIndex: "",
      key: "x",
      render: (text) => (
        <section className="flex gap-4">
          <PlusSquare
            onClick={() => {
              setFormUpdate({
                id: parseInt(text.id),
                name: text.name,
                currentWeight: text.weight,
              });
              setWeightUpdate(0);
              setShowFormSum(true);
            }}
            size={30}
            className="text-blue-600 cursor-pointer"
            title="Añadir/Restar Kilos"
          />
          <Link href={`/reciclaje/${text.id}`}>
            <Eye size={30} className="text-yellow-600 cursor-pointer" title="Ver/Editar" />
          </Link>
        </section>
      ),
    },
  ];

  return (<Layout>
    <>

      <main className="bg-[url(/images/bg.png)] bg-cover flex flex-col items-center p-4">
        {/* Modal para agregar/restar kilos */}
        {showFormSum && (
          <section
            className="fixed left-0 top-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
            onClick={() => setShowFormSum(false)}
          >
            <section
              className="px-6 w-[90%] md:w-96 h-80 rounded-3xl bg-white flex flex-col justify-center items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFormSum(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
              >
                X
              </button>
              <h2 className="text-xl font-bold text-black/50 pt-10">
                {isTokenSent ? "Confirmar token" : "Agregar o restar kilos"}
              </h2>
              <section className="w-full m-auto flex flex-col gap-3 items-center justify-center">
                {!isTokenSent ? (
                  <>
                    <InputNumber
                      value={weightUpdate}
                      onChange={(value) => value !== null && setWeightUpdate(value)}
                      addonAfter={<>KL</>}
                      style={{ width: "50%" }}
                    />
                    <span className="text-lg font-semibold text-black/80">
                      Total: {formUpdate.currentWeight + weightUpdate} KL
                    </span>
                  </>
                ) : (
                  <Input
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Ingrese el token para guardar cambios"
                    style={{ width: "80%" }}
                  />
                )}
              </section>
              <div className="flex gap-3}">
                {!isTokenSent ? (
                  <Button
                    onClick={handleAddRecycling}
                    loading={loadingToken}
                    className="bg-green-500 px-5 py-5 mb-4 text-white rounded-xl"
                  >
                    Aplicar
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirmToken}
                    loading={loadingConfirm}
                    className="bg-blue-500 px-5 py-5 mb-4 text-white rounded-xl"
                  >
                    Confirmar
                  </Button>
                )}
              </div>
            </section>
          </section>
        )}

        <div className="flex flex-col w-full mt-20">

          <section className="w-11/12 mx-auto my-4">
            {loadingEntities ? (
              <div className="min-h-[300px] flex justify-center items-center">
                <Loading text="Cargando datos..." type="bars" />
              </div>
            ) : (
              <Table<DataType>
                columns={columns}
                dataSource={entities}
                scroll={{ x: 'max-content' }}
              />
            )}
          </section>
        </div>
      </main>

    </>
  </Layout>
  );

};

export default Reciclaje;