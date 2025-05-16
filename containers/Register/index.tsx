"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
  UploadProps,
  Modal,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import Router from "next/router";
import { useMutationEntity } from "@/hooks/mutation/useMutationEntity";
import { EntityType, EntityTypeGet } from "@/types/entity";
import { useMutationUpdateEntity } from "@/hooks/mutation/useMutationUpdateEntity";
import Loading from "@/components/Loading";

type props = {
  entity?: dataProps;
};

type dataProps = {
  category?: "JAC" | "CE";
  name?: string;
  nameEntity?: string;
  position?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  neighborhood?: string;
  commune?: number;
  acopio?: boolean;
  acopioName?: string;
  prae?: boolean;
  praeName?: string;
  proceda?: boolean;
  procedaProject?: string;
  committee?: boolean;
  attachment?: string;
  id?: number;
};

const Register = ({ entity }: props) => {
  const { useHandleCreateEntity } = useMutationEntity();
  const { useHandleUpdateEntity, useHandleGenerateEntityToken, useHandleConfirmEntityToken, loadingUpdate, loadingToken, loadingConfirm, useHandleGenerateDeleteToken,
    useHandleConfirmDeleteToken,
    loadingDeleteToken,
    loadingDeleteConfirm } = useMutationUpdateEntity();
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<"JAC" | "CE">(entity?.category ?? "JAC");
  const [attachmentState, setAttachmentState] = useState<File | undefined>();
  const [form] = Form.useForm();
  const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [updateData, setUpdateData] = useState<EntityTypeGet | null>(null);
  const [isDeleteTokenModalVisible, setIsDeleteTokenModalVisible] = useState(false);
  const [deleteTokenInput, setDeleteTokenInput] = useState("");

  useEffect(() => {
    if (entity) {
      form.setFieldsValue({
        ...entity,
      });
    }
  }, [entity, form]);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        if (info.fileList.length > 0) {
          setAttachmentState(info.fileList[0].originFileObj);
        } else {
          setAttachmentState(undefined);
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async (data: EntityType) => {
    setLoading(true);
    data.category = category;
    data.phone = data.phone ? data.phone.toString() : "";

    try {
      if (!attachmentState) {
        message.error("Por favor, adjunte el archivo requerido.");
        setLoading(false);
        return;
      }

      let attachmentUrl = "";
      const formData = new FormData();
      formData.append("file", attachmentState);
      const responseFile = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!responseFile.data.filePath) {
        throw new Error("No se recibió una URL válida para el archivo adjunto.");
      }
      attachmentUrl = responseFile.data.filePath;

      const dataToSend = {
        ...data,
        attachment: attachmentUrl,
        commune: data.commune?.valueOf() ?? 0,
        acopio: data.acopio ?? false,
        prae: data.prae ?? false,
        proceda: data.proceda ?? false,
        committee: data.committee ?? false,
      };

      const response = await useHandleCreateEntity(dataToSend);

      if (response.data?.createEntity) {
        message.success("Datos guardados correctamente");
        form.resetFields();
        setAttachmentState(undefined);
        setLoading(false);
      } else {
        throw new Error("No se recibieron datos de la entidad creada.");
      }
    } catch (error: any) {
      setLoading(false);

      if (error.graphQLErrors?.length > 0) {
        const errorMessage = error.graphQLErrors[0].message;
        if (errorMessage.includes("correo ya se encuentra registrado")) {
          message.error("El correo ya está registrado. Por favor, use otro.");
        } else if (errorMessage.includes("commune")) {
          message.error("El campo comuna es obligatorio o inválido.");
        } else {
          message.error(`Error del servidor: ${errorMessage}`);
        }
      } else if (error.networkError) {
        message.error("Error de red. Por favor, verifica tu conexión.");
      } else {
        message.error(`Error al guardar los datos: ${error.message}`);
      }
    }
  };

  const handleUpdate = async (data: EntityTypeGet) => {
    setLoading(true);
    data.phone = data.phone ? String(data.phone) : "";

    if (!entity?.id) {
      message.error("No se proporcionó un ID válido para la entidad.");
      setLoading(false);
      return;
    }

    const dataToUpdate: EntityTypeGet = {
      ...data,
      id: Number(entity.id),
      category,
      commune: data.commune ? Number(data.commune) : 0,
      acopio: data.acopio ?? false,
      prae: data.prae ?? false,
      proceda: data.proceda ?? false,
      committee: data.committee ?? false,
      attachment: entity.attachment || "",
    };

    try {
      let attachmentUrl = dataToUpdate.attachment;
      if (attachmentState) {
        const formData = new FormData();
        formData.append("file", attachmentState);
        const responseFile = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!responseFile.data.filePath) {
          throw new Error("No se recibió una URL válida para el archivo adjunto.");
        }
        attachmentUrl = responseFile.data.filePath;
      }

      const cleanedData = cleanObject({
        ...dataToUpdate,
        attachment: attachmentUrl,
      });

      setUpdateData(cleanedData);
      await useHandleGenerateEntityToken(cleanedData);
      message.success("Se ha enviado un token al correo registrado. Por favor, ingrésalo para confirmar.");
      setIsTokenModalVisible(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.graphQLErrors?.length > 0) {
        const errorMessage = error.graphQLErrors[0].message;
        message.error(`Error del servidor: ${errorMessage}`);
      } else if (error.networkError) {
        message.error("Error de red. Por favor, verifica tu conexión.");
      } else {
        message.error(`Error al generar el token: ${error.message}`);
      }
    }
  };

  const handleConfirmToken = async () => {
    if (!tokenInput) {
      message.warning("Por favor, ingrese el token.");
      return;
    }
    setLoading(true);
    try {
      await useHandleConfirmEntityToken(tokenInput);
      message.success("Entidad actualizada correctamente");
      setIsTokenModalVisible(false);
      setTokenInput("");
      setUpdateData(null);
      setLoading(false);
      form.resetFields();
      setAttachmentState(undefined);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Error al validar el token";
      message.error(errorMessage);
    }
  };

  const handleGenerateDeleteToken = async () => {
    if (!entity?.id) {
      message.error("No se proporcionó un ID válido para la entidad.");
      return;
    }
    setLoading(true);
    try {
      const response = await useHandleGenerateDeleteToken({ id: Number(entity.id) });
      message.success(response);
      setIsDeleteTokenModalVisible(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Error al generar el token de eliminación";
      message.error(errorMessage);
    }
  };

  const handleConfirmDeleteToken = async () => {
    if (!deleteTokenInput) {
      message.warning("Por favor, ingrese el token.");
      return;
    }
    setLoading(true);
    try {
      await useHandleConfirmDeleteToken(deleteTokenInput);
      message.success("Entidad eliminada correctamente. La página ha sido actualizada.");
      setIsDeleteTokenModalVisible(false);
      setDeleteTokenInput("");
      setLoading(false);
      Router.push('/reciclaje');
      setAttachmentState(undefined);
      setCategory("JAC");
      setUpdateData(null);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Error al validar el token de eliminación";
      message.error(errorMessage);
    }
  };

  function cleanObject<T extends object>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    ) as T;
  }

  return (
    <section className="w-full text-[#3C3C3B] py-16 px-2 flex flex-col items-center">
      {loading && <Loading text="Cargando..." type="spin" />}
      <div className="flex justify-center">
        <Image
          src="/images/logo-f.png"
          alt="Logo Top Left"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-center my-4 py-2">
        Formulario de registro
      </h1>

      <div className="flex justify-center gap-6 mb-6">
        <div
          onClick={() => setCategory("JAC")}
          className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-300 ${category == "JAC"
            ? "bg-transparent text-black font-bold text-xl scale-105"
            : "bg-transparent text-gray-600 text-base hover:scale-105"
            }`}
        >
          🏘️ Junta de Acción Comunal
        </div>
        <div
          onClick={() => setCategory("CE")}
          className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-300 ${category == "CE"
            ? "bg-transparent text-black font-bold text-xl scale-105"
            : "bg-transparent text-gray-600 text-base hover:scale-105"
            }`}
        >
          🎓 Comunidad Educativa
        </div>
      </div>
      <Form
        form={form}
        onFinish={entity?.name ? handleUpdate : handleSubmit}
        className="flex flex-wrap flex-col md:flex-row md:justify-between px-8 max-w-[100vw]"
      >
        {category && (
          <>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name="name"
              label={<p className="lg:text-xl text-base">Nombre de la entidad</p>}
              required
              className="md:w-1/2"
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Función o cargo</p>}
              wrapperCol={{ span: 23 }}
              name="position"
              required
              className="md:w-1/2"
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Correo de contacto</p>}
              className="w-full md:w-1/2"
              wrapperCol={{ span: 23 }}
              name="email"
              rules={[
                { type: "email", message: "Correo no válido" },
                { required: true, message: "El Correo es obligatorio" },
              ]}
              required
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Teléfono de contacto</p>}
              className="w-full md:w-1/2"
              wrapperCol={{ span: 23 }}
              name="phone"
              required
            >
              <InputNumber className="!w-full" placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={
                <p className="lg:text-xl text-base">
                  {category == "JAC"
                    ? "Nombre de la junta de acción comunal"
                    : "Nombre de la entidad educativa"}
                </p>
              }
              wrapperCol={{ span: 23 }}
              name="nameEntity"
              required
              className="md:w-1/2"
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Municipio</p>}
              className="w-full md:w-1/2"
              wrapperCol={{ span: 23 }}
              name="city"
              required
            >
              <Select className="text-sm" placeholder="">
                <Select.Option value="Cali">Cali</Select.Option>
                <Select.Option value="Guadalajara">Guadalajara de Buga</Select.Option>
                <Select.Option value="Yumbo">Yumbo</Select.Option>
                <Select.Option value="Tuluá">Tuluá</Select.Option>
                <Select.Option value="Jamundí">Jamundí</Select.Option>
                <Select.Option value="Candelaria">Candelaria</Select.Option>
                <Select.Option value="Buenaventura">Buenaventura</Select.Option>
                <Select.Option value="Palmira">Palmira</Select.Option>
                <Select.Option value="Cartago">Cartago</Select.Option>
                <Select.Option value="BugalaGrande">BugalaGrande</Select.Option>
                <Select.Option value="Cerrito">El Cerrito</Select.Option>
                <Select.Option value="Guacari">Guacari</Select.Option>
                <Select.Option value="Vijes">Vijes</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Dirección de la entidad</p>}
              className="w-full md:w-1/2"
              wrapperCol={{ span: 23 }}
              name="address"
              required
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Barrio</p>}
              className="w-full md:w-[24%]"
              wrapperCol={{ span: 23 }}
              name="neighborhood"
              required
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<p className="lg:text-xl text-base">Comuna</p>}
              className="w-full md:w-[25%] mr-[1%]"
              wrapperCol={{ span: 23 }}
              name="commune"
              required
            >
              <InputNumber className="!w-full" placeholder="" />
            </Form.Item>
            <Form.Item
              className="w-full md:w-1/2"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name="committee"
              label={<p className="lg:text-xl text-base">Cuenta con Comité Ambiental</p>}
              required
            >
              <Select
                placeholder="Si/No"
                options={[
                  { value: true, label: "Si" },
                  { value: false, label: "No" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="w-full md:w-1/2"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name="acopio"
              label={<p className="lg:text-xl text-base">Cuenta con punto de Acopio de Reciclaje</p>}
              required
            >
              <Select
                placeholder="Si/No"
                options={[
                  { value: true, label: "Si" },
                  { value: false, label: "No" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="w-full md:w-1/2 md:text-xl"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name="acopioName"
              label={<p className="lg:text-xl text-base">¿Con qué punto de acopio cuentan?</p>}
            >
              <Input />
            </Form.Item>
            {category == "CE" && (
              <>
                <Form.Item
                  className="w-full md:w-1/2 text-base"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                  name="prae"
                  label={<span className="lg:text-xl text-base">¿Cuenta con el PRAE?</span>}
                  required
                >
                  <Select
                    placeholder="Proyectos cuidadamos de educación"
                    options={[
                      { value: true, label: "Si" },
                      { value: false, label: "No" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  className="md:w-1/2"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                  name="praeName"
                  label={<span className="lg:text-xl text-base">Mencione el nombre del proyecto</span>}
                >
                  <Input />
                </Form.Item>
              </>
            )}
            {category == "JAC" && (
              <>
                <Form.Item
                  className="w-full md:w-1/2 md:text-2xl"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                  name="proceda"
                  label={<span className="lg:text-xl text-base">Cuenta con el PROCEDA</span>}
                  required
                >
                  <Select
                    placeholder="Proyectos Ciudadanos de Educación Ambiental"
                    options={[
                      { value: true, label: "Si" },
                      { value: false, label: "No" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                  name="procedaProject"
                  label={<span className="lg:text-xl text-base">Mencione el nombre del proyecto</span>}
                  className="md:w-1/2"
                >
                  <Input placeholder="" />
                </Form.Item>
              </>
            )}
            {entity?.attachment && (
              <Link href={entity.attachment ?? ""} target="_blank" className="text-blue-600">
                Ver Adjunto
              </Link>
            )}
            <Form.Item name="dragger" valuePropName="fileList" noStyle className="w-full">
              <label htmlFor="" className="md:text-2xl w-full mt-8">
                {category == "JAC" ? (
                  <p className="lg:text-xl text-base">
                    Adjuntar personería Jurídica de la Junta de Acción Comunal
                  </p>
                ) : (
                  <p className="lg:text-xl text-base">
                    Adjuntar resolución de reconocimiento de establecimiento educativo
                  </p>
                )}
              </label>
              <Upload.Dragger name="files" className="w-full mb-4" maxCount={1} {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text md:text-xl text-base">
                  Haga clic o arrastre el archivo a esta área para cargarlo.
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item className="w-full mt-6" wrapperCol={{ span: 24 }}>
              <Button
                className="w-full md:text-3xl md:py-7 font-bold"
                type="primary"
                htmlType="submit"
                loading={loadingUpdate || loadingToken || loadingConfirm}
              >
                {entity?.name ? <>Actualizar</> : <>Guardar</>}
              </Button>
            </Form.Item>

            {entity?.name && (
              <Form.Item className="w-full mt-4" wrapperCol={{ span: 24 }}>
                <Button
                  className="w-full md:text-3xl md:py-7 font-bold"
                  type="default"
                  danger
                  onClick={handleGenerateDeleteToken}
                  loading={loadingDeleteToken}
                >
                  Eliminar registro
                </Button>
              </Form.Item>
            )}

          </>
        )}
      </Form>

      <Modal
        title="Confirmar Actualización"
        open={isTokenModalVisible}
        onCancel={() => {
          setIsTokenModalVisible(false);
          setTokenInput("");
        }}
        footer={null}
      >
        <p>Se ha enviado un token al correo registrado. Por favor, ingrésalo para confirmar los cambios.</p>
        <Input
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Ingresa el token"
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          onClick={handleConfirmToken}
          loading={loadingConfirm}
          block
        >
          Confirmar
        </Button>
      </Modal>

      <Modal
        title="Confirmar eliminación"
        open={isDeleteTokenModalVisible}
        onCancel={() => {
          setIsDeleteTokenModalVisible(false);
          setDeleteTokenInput("");
        }}
        footer={null}
      >
        <p>Se ha enviado un token al correo del administrador. Por favor, ingresalo aquí para confirmar la eliminación.</p>
        <Input
          value={deleteTokenInput}
          onChange={(e) => setDeleteTokenInput(e.target.value)}
          placeholder="Ingresa el token"
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          danger
          onClick={handleConfirmDeleteToken}
          loading={loadingDeleteConfirm}
          block
        >
          Confirmar Eliminación
        </Button>
      </Modal>

    </section>
  );
};

export default Register;