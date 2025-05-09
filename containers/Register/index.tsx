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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

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
  const { useHandleUpdateEntity } = useMutationUpdateEntity();
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<"JAC" | "CE">(
    entity?.category ?? "JAC"
  );
  const [attachmentState, setAttachmentState] = useState<File | undefined>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (entity) {
      form.setFieldsValue({
        ...entity,
      });
    }
  }, []);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        // Verifica si fileList tiene elementos antes de acceder a fileList[0]
        if (info.fileList.length > 0) {
          setAttachmentState(info.fileList[0].originFileObj);
        } else {
          setAttachmentState(undefined); // Si no hay archivos, establece attachmentState como undefined
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
    data.phone = data.phone + "";
    try {
      if (attachmentState) {
        const formData = new FormData();
        formData.append("file", attachmentState);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const responseFile = await axios.post("/api/upload", formData, config);
        data.attachment = responseFile.data.filePath;
        await useHandleCreateEntity({
          ...data,
        });

        message.success({
          content: "Datos guardado correctamente",
        });
        form.resetFields();
      }
      setLoading(false);
      location.reload();
    } catch (error) {
      setLoading(false);
      message.error({
        content: "Error - El correo ya se encuentra registrado",
      });
      console.log("Error - " + error);
    }
  };

  const handleUpdate = async (data: EntityTypeGet) => {
    setLoading(true);
    data.phone = data.phone + "";
    const dataToUpdate: EntityTypeGet = data;
    try {
      await useHandleUpdateEntity({
        ...dataToUpdate,
        ...cleanObject(data),
      });
      setLoading(false);
    } catch (error) {
      message.error({
        content: "Error al actualizar los datos",
      });
      console.log("Error - " + error);
      setLoading(false);
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
    
      <section className="w-full text-[#3C3C3B] py-16 px-8 md:px-16 flex flex-col items-center">
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
            className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-300 ${
              category == "JAC"
                ? "bg-transparent text-black font-bold text-xl scale-105"
                : "bg-transparent text-gray-600 text-base hover:scale-105"
            }`}
          >
            🏘️ Junta de Acción Comunal
          </div>
          <div
            onClick={() => setCategory("CE")}
            className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-300 ${
              category == "CE"
                ? "bg-transparent text-black font-bold  text-xl scale-105"
                : "bg-transparent text-gray-600 text-base hover:scale-105"
            }`}
          >
            🎓 Comunidad Educativa
          </div>
        </div>
        <Form
          form={form}
          onFinish={entity?.name ? handleUpdate : handleSubmit}
          className={
            "flex flex-wrap flex-col md:flex-row md:justify-between px-8 max-w-[100vw]"
          }
        >
          {category && (
            <>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
                name="nameEntity"
                label={
                  <p className="md:text-xl text-base">Nombre de la entidad</p>
                }
                required
                className={"md:w-1/2"}
              >
                <Input className={""} placeholder="" />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<p className="md:text-xl text-base">Función o cargo </p>}
                wrapperCol={{ span: 23 }}
                name="position"
                required
                className={"md:w-1/2"}
              >
                <Input className={"w-full "} placeholder="" />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <p className="md:text-xl text-base">Correo de contacto</p>
                }
                className={"w-full md:w-1/2"}
                wrapperCol={{ span: 23 }}
                name="email"
                rules={[
                  { type: "email", message: "Correo no válido" },
                  { required: true, message: "El Correo es obligatorio" },
                ]}
                required
              >
                <Input className={"!w-full "} placeholder="" />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <p className="md:text-xl text-base">Teléfono de contacto</p>
                }
                className={"w-full md:w-1/2"}
                wrapperCol={{ span: 23 }}
                name="phone"
                required
              >
                <InputNumber
                  defaultValue={entity?.phone}
                  className={"!w-full "}
                  placeholder=""
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <p className="md:text-xl text-base">
                    {category == "JAC"
                      ? "Nombre de la junta de acción comunal"
                      : "Nombre de la entidad educativa"}
                  </p>
                }
                wrapperCol={{ span: 23 }}
                name="nameEntity"
                required
                className={"md:w-1/2"}
              >
                <Input
                  defaultValue={entity?.name}
                  className={"w-full "}
                  placeholder={``}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<p className="md:text-xl text-base">Municipio</p>}
                className={"w-full md:w-1/2 "}
                wrapperCol={{ span: 23 }}
                name="city"
                required
              >
                <Select className="text-sm" placeholder="">
                  <Select.Option value="Cali">Cali</Select.Option>
                  <Select.Option value="Guadalajara">
                    Guadalajara de Buga
                  </Select.Option>
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
                label={
                  <p className="md:text-xl text-base">
                    Dirección de la entidad
                  </p>
                }
                className={"w-full md:w-1/2"}
                wrapperCol={{ span: 23 }}
                name="address"
                required
              >
                <Input
                  defaultValue={entity?.address}
                  className={"!w-full "}
                  placeholder=""
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<p className="md:text-xl text-base">Barrio</p>}
                className={"w-full md:w-[24%]"}
                wrapperCol={{ span: 23 }}
                name="neighborhood"
                required
              >
                <Input
                  defaultValue={entity?.neighborhood}
                  className={"w-full "}
                  placeholder=""
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<p className="md:text-xl text-base">Comuna</p>}
                className={"w-full md:w-[25%] mr-[1%]"}
                wrapperCol={{ span: 23 }}
                name="commune"
                required
              >
                <InputNumber
                  defaultValue={entity?.commune}
                  className={"!w-full "}
                  placeholder=""
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                className={"w-full md:w-1/2"}
                wrapperCol={{ span: 10 }}
                name="acopio"
                label={
                  <p className="md:text-xl text-base">
                    Cuenta con punto de Acopio de Reciclaje
                  </p>
                }
                required
              >
                <Select
                  className={"!w-full "}
                  placeholder="Si/No"
                  options={[
                    { value: true, label: "Si" },
                    { value: false, label: "No" },
                  ]}
                />
              </Form.Item>
              {category == "CE" && (
                <>
                  <Form.Item
                    className={"w-full md:w-1/2 md:text-2xl pr-[2%]"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="acopioName"
                    label={
                      <p className="md:text-xl text-base">
                        ¿Con qué punto de acopio cuentan?
                      </p>
                    }
                  >
                    <Input
                      className="md:text-xl"
                      defaultValue={entity?.acopioName}
                    />
                  </Form.Item>
                  <Form.Item
                    className={"w-full md:w-1/2 md:text-2xl pr-[2%]"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 21 }}
                    name="prae"
                    label={
                      <span className="md:text-xl text-base">
                        ¿Cuenta con el PRAE? (Proyectos cuidadamos de
                        educación):
                      </span>
                    }
                    required
                  >
                    <Select
                      className={"!w-1/2"}
                      placeholder="Si/No"
                      options={[
                        { value: true, label: "Si" },
                        { value: false, label: "No" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    className={"md:w-1/2"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 23 }}
                    name="praeName"
                    label={
                      <span className=" md:text-xl text-base">
                        Mencione el nombre del proyecto{" "}
                      </span>
                    }
                  >
                    <Input className="" defaultValue={entity?.praeName} />
                  </Form.Item>
                </>
              )}
              {category == "JAC" && (
                <>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 23 }}
                    name="procedaProject"
                    label={
                      <span className="md:text-xl text-base">
                        Mencione el proyecto PROCEDA
                      </span>
                    }
                    className={"md:w-1/2 md:pr-[1%]"}
                  >
                    <Input
                      defaultValue={entity?.procedaProject}
                      className={"w-full "}
                      placeholder=""
                    />
                  </Form.Item>
                  <Form.Item
                    className={"w-full md:w-1/2 md:text-2xl pr-[2%]"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 21 }}
                    name="proceda"
                    label={
                      <span className="md:text-xl text-base">
                        Cuenta con el PROCEDA (Proyectos Ciudadanos de Educación
                        Ambiental)
                      </span>
                    }
                    required
                  >
                    <Select
                      className={"!w-1/2"}
                      placeholder="Si/No"
                      options={[
                        { value: true, label: "Si" },
                        { value: false, label: "No" },
                      ]}
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item
                className={"w-full md:w-1/2"}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 21 }}
                name="committee"
                label={
                  <p className="md:text-xl text-base">
                    Cuenta con con Comité Ambiental
                  </p>
                }
                required
              >
                <Select
                  className={"!w-1/2"}
                  placeholder="Si/No"
                  options={[
                    { value: true, label: "Si" },
                    { value: false, label: "No" },
                  ]}
                />
              </Form.Item>
              {entity?.attachment && (
                <Link
                  href={entity.attachment ?? ""}
                  target="_blank"
                  className="text-blue-600"
                >
                  Ver Adjunto
                </Link>
              )}
              {!entity?.attachment && (
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  noStyle
                  className={"w-full"}
                >
                  <label htmlFor="" className="md:text-2xl w-full mt-8">
                    {category == "JAC" ? (
                      <p className="md:text-xl text-base">
                        Adjuntar personería Jurídica de la Junta de Acción
                        Comunal
                      </p>
                    ) : (
                      <p className="md:text-xl text-base">
                        Adjuntar resolución de reconcomiendo de establecimiento
                        educativo
                      </p>
                    )}
                  </label>
                  <Upload.Dragger
                    name="files"
                    className={"w-full mb-4"}
                    maxCount={1}
                    {...props}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text md:text-xl text-base">
                      Haga clic o arrastre el archivo a esta área para cargarlo.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              )}

              <Form.Item className={"w-full  mt-6"} wrapperCol={{ span: 24 }}>
                <Button
                  className={"w-full md:text-3xl md:py-7 font-bold"}
                  type="primary"
                  htmlType="submit"
                >
                  {entity?.name ? <>Actualizar</> : <>Guardar</>}
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </section>
    
  );
};

export default Register;
