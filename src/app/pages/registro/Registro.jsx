import React, { useState } from "react";
import { Button, Container, Form, Radio, Message } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { saveFormularioRequest } from "../../api/FormRequest";
import idfront from "./img/id-Card-front.png";
import idback from "./img/id-Card-back.png";
import selfie from "./img/Selfie_cedula_Ejemplo.png";
import cartaAutorizacion from "./img/Carta_autorizacion_icon.jpg";
import { sub } from "date-fns/fp";
import { useEffect } from "react";
import { CiudadesRequest, ProvinciasRequest } from "../../api/CatalogoRequest";
import { authState } from "../../recoil/auth";
import { useRecoilState } from "recoil";

const Registro = () => {
  const [contenedor, setContenedor] = useState(false);
  const [tipoIdentificacion, setTipoIdentificacion] = useState();
  const [maxLengthIdentificacion, setMaxLengthIdentificacion] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [provincias, setProvincias] = useState();
  const [selectedProvincia, setSelectedProvincia] = useState();
  const [ciudadesTodas, setCiudadesTodas] = useState();
  const [ciudades, setCiudades] = useState();
  const [conRuc, setConRuc] = useState(false);
  const [clicGuardar, setClicGuardar] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [userAuth, setUserAuth] = useRecoilState(authState);

  const IdentificacionOption = [
    { key: 1, value: "CEDULA", text: "CEDULA" },
    { key: 2, value: "PASAPORTE", text: "PASAPORTE" },
    // { key: 3, value: "RUC", text: "RUC" },
  ];

  const Nacionalidad = [
    { key: 13, value: "COLOMBIANA", text: "COLOMBIANA" },
    { key: 19, value: "ECUATORIANA", text: "ECUATORIANA" },
    { key: 73, value: "VENEZOLANA", text: "VENEZOLANA" },
  ];

  const Sexo = [
    { key: 1, value: "HOMBRE", text: "HOMBRE" },
    { key: 2, value: "MUJER", text: "MUJER" },
  ];

  const Formato = [
    // { key: 1, value: "FIRMA EN LA NUBE", text: "FIRMA EN LA NUBE" },
    { key: 2, value: "ARCHIVO .P12", text: "ARCHIVO .P12" },
    // { key: 3, value: "EN TOKEN", text: "EN TOKEN" },
  ];

  const Vigencia = [
    { key: 1, value: "1 año", text: "1 año" },
    { key: 2, value: "2 años", text: "2 años" },
    { key: 3, value: "3 años", text: "3 años" },
    { key: 4, value: "4 años", text: "4 años" },
    { key: 5, value: "5 años", text: "5 años" },
    { key: 6, value: "7 días", text: "7 días" },
  ];

  const NombresCampo = [
    { interno: "nombreCompleto", externo: "Nombres Completos" },
    { interno: "fechaNacimiento", externo: "Fecha de Nacimiento" },
    { interno: "tipoIdentificacion", externo: "Tipo de Identificación" },
    { interno: "identificacion", externo: "Identificación" },
    { interno: "nacionalidad", externo: "Nacionalidad" },
    { interno: "apellidoUno", externo: "Primer Apellido" },
    { interno: "apellidoDos", externo: "Segundo Apellido" },
    { interno: "codigoDactilar", externo: "Código Dactilar" },
    { interno: "sexo", externo: "Sexo" },
    { interno: "celular", externo: "Celular" },
    { interno: "celularDos", externo: "Celular Dos" },
    { interno: "mail", externo: "Correo electrónico" },
    { interno: "mailDos", externo: "Correo electrónico alternativo" },
    { interno: "provincias", externo: "Provincia" },
    { interno: "ciudades", externo: "Ciudad" },
    { interno: "direccion", externo: "Dirección" },
    { interno: "formato", externo: "Formato de firma electrónica" },
    { interno: "vigencia", externo: "Vigencia de la firma electrónica" },
    { interno: "express", externo: "Servicio Express" },
    { interno: "fileFront", externo: "Documento Frontal" },
    { interno: "fileBack", externo: "Documento Posterior" },
    { interno: "fileCarta", externo: "Documento Adicional" },
    { interno: "fileSelfie", externo: "Foto Selfie con su identificación" },
    { interno: "fileRUC", externo: "Copia del RUC" },
  ];

  useEffect(() => {
    ProvinciasRequest()
      .then((res) => {
        let provincias = [];
        res.response.forEach((provincia) => {
          provincias.push({
            key: provincia.id,
            value: provincia.id,
            text: provincia.nombre,
          });
        });
        setProvincias(provincias);
      })
      .catch((error) => {
        console.log("Error Provincias Request: ", error);
      });
    CiudadesRequest()
      .then((res) => {
        setCiudadesTodas(res.response);
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      let tempCiudades = ciudadesTodas.filter(
        (ciudad) => ciudad.provincia_id === selectedProvincia
      );
      let ciudadesProvincia = [];
      tempCiudades.forEach((ciudad) => {
        ciudadesProvincia.push({
          key: ciudad.id,
          value: ciudad.id,
          text: ciudad.nombre,
        });
      });
      setCiudades(ciudadesProvincia);
    }
  }, [selectedProvincia]);

  const initialValues = {
    nombreCompleto: "",
    fechaNacimiento: "",
    tipoIdentificacion: "",
    identificacion: "",
    nacionalidad: "",
    apellidoUno: "",
    apellidoDos: "",
    codigoDactilar: "",
    sexo: "",
    celular: "",
    celularDos: "",
    mail: "",
    mailDos: "",
    provincias: "",
    ciudades: "",
    direccion: "",
    formato: "",
    vigencia: "",
    express: 0,
    fileFront: "",
    fileBack: "",
    fileCarta: "",
    fileSelfie: "",
    fileRUC: "",
  };

  const validacionSchema = Yup.object({
    nombreCompleto: Yup.string().required("Campo obligatorio"),
    fechaNacimiento: Yup.date()
      .required("Campo obligatorio")
      .max(sub({ years: 18 }, new Date()), "Mínimo debe tener 18 años")
      .min(sub({ years: 75 }, new Date()), "Máximo debe tener 75 años"),
    tipoIdentificacion: Yup.string().required("Campo obligatorio"),
    identificacion: Yup.string("Ingrese sólo números")
      .required("Campo obligatorio")
      .when("tipoIdentificacion", {
        is: "CEDULA",
        then: (schema) =>
          schema.max(10, "La cédula debe tener máximo 10 dígitos"),
      })
      .when("tipoIdentificacion", {
        is: "CEDULA",
        then: (schema) =>
          schema.min(10, "La cédula debe tener mínimo 10 dígitos"),
      })
      .when("tipoIdentificacion", {
        is: "RUC",
        then: (schema) => schema.max(13, "El RUC debe tener máximo 13 dígitos"),
      })
      .when("tipoIdentificacion", {
        is: "RUC",
        then: (schema) => schema.min(13, "El RUC debe tener mínimo 13 dígitos"),
      }),
    nacionalidad: Yup.string().required("Campo obligatorio"),
    apellidoUno: Yup.string().required("Campo obligatorio"),
    apellidoDos: Yup.string().required("Campo obligatorio"),
    codigoDactilar: Yup.string().required("Campo obligatorio").max(10),
    sexo: Yup.string().required("Campo obligatorio"),
    celular: Yup.string()
      .required("Campo obligatorio")
      .min(10, "Faltan dígitos")
      .max(10, "El número de celular debe ser máximo de 10 dígitos"),
    celularDos: Yup.string()
      .min(10, "Faltan dígitos")
      .max(10, "El número de celular debe ser máximo de 10 dígitos"),
    mail: Yup.string()
      .email("No es un correo válido")
      .required("Campo obligatorio"),
    mailDos: Yup.string().email("No es un correo válido"),
    provincias: Yup.string().required("Campo obligatorio"),
    ciudades: Yup.string().required("Campo obligatorio"),
    direccion: Yup.string().required("Campo obligatorio"),
    formato: Yup.string().required("Campo obligatorio"),
    vigencia: Yup.string().required("Campo obligatorio"),
    express: Yup.bool(),
    firmaConRuc: Yup.string()
      .min(13, "El RUC debe tener mínimo 13 dígitos")
      .max(13, "El RUC debe tener máximo 13 dígitos")
      .test("Requerido", "Campo obligatorio", (value) => validateConRuc(value)),
    fileFront: Yup.mixed().required("Campo obligatorio"),
    fileBack: Yup.mixed().required("Campo obligatorio"),
    fileSelfie: Yup.mixed().required("Campo obligatorio"),
    fileCarta: Yup.mixed(),
    fileRUC: Yup.mixed().test("Requerido", "Campo obligatorio", (value) =>
      validateConRuc(value)
    ),
  });

  useEffect(() => {
    switch (tipoIdentificacion) {
      case "CEDULA":
        setMaxLengthIdentificacion(10);
        break;
      case "RUC":
        setMaxLengthIdentificacion(13);
      default:
        break;
    }
  }, [tipoIdentificacion]);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [showAlert]);

  useEffect(() => {
    if (showAlertError) {
      setTimeout(() => {
        setShowAlertError(false);
      }, 5000);
    }
  }, [showAlertError]);

  useEffect(() => {
    if (conRuc) {
      if (
        formik.values.identificacion.length > 0 &&
        formik.values.identificacion.length <= 10
      ) {
        formik.setFieldValue(
          "firmaConRuc",
          formik.values.identificacion + "001"
        );
      }
      if (formik.values.identificacion.length == 13) {
        formik.setFieldValue("firmaConRuc", formik.values.identificacion);
      }
    } else {
      formik.setFieldValue("firmaConRuc", "");
    }
  }, [conRuc]);

  useEffect(() => {
    if (clicGuardar) {
      if (Object.keys(formik.errors).length > 0) {
        setMostrarErrores(true);
      }
    }
  }, [clicGuardar]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (formData) => {
      save(formData);
    },
    validationSchema: validacionSchema,
  });

  const save = async (formData) => {
    const data = {
      ...formData,
      user_id: userAuth.id,
      estado: 'CREADA'
    }
    await saveFormularioRequest(data)
      .then((res) => {
        console.log(res);
        setShowAlert(true);
        formik.handleReset();
        regresar();
      })
      .catch((error) => {
        setShowAlertError(true);
        console.log(error);
      });
  };
  const regresar = () => {
    setContenedor(false);
  };
  const handleFileChange = (e, nombre) => {
    if (e.target.files) {
      // setFile(e.target.files[0]);
      formik.setFieldValue(nombre, e.target.files[0]);
    }
  };
  const dismiss = () => {
    setShowAlert(false);
  };

  const dismissError = () => {
    setShowAlertError(false);
  };

  const validateConRuc = (value) => {
    if (conRuc) {
      if (
        value === undefined ||
        value === "" ||
        value === "undefined" ||
        value === null
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const nombreAdornado = (field) => {
    let tempNombre = NombresCampo.find((nombre) => nombre.interno === field);
    return tempNombre.externo;
  };

  return (
    <Container>
      <br />
      <h1 style={{ textAlign: "center" }}>INGRESE SUS DATOS:</h1>
      <h4 style={{ textAlign: "center" }}>
        Con esta información generaremos tu firma electrónica
      </h4>
      <Form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
        {contenedor ? (
          // <Documentos setContenedor={setContenedor} formik={formik} />
          <>
            <h3 style={{ textAlign: "center" }}>DOCUMENTOS NECESARIOS</h3>
            {showAlertError && (
              <>
                <Message floating negative onDismiss={dismissError}>
                  <Message.Header>¡Error!</Message.Header>
                  <p>Ocurrió un error, intente más tarde.</p>
                </Message>
              </>
            )}
            <div className="ui two column grid">
              <div className="column">
                <div className="ui segment">
                  <>
                    <a className="ui medium image">
                      <img src={idfront} />
                      <Form.Input
                        id="fileFront"
                        type="file"
                        name="fileFront"
                        onChange={(e) => handleFileChange(e, "fileFront")}
                        error={
                          formik.touched.fileFront && formik.errors.fileFront
                            ? formik.errors.fileFront
                            : null
                        }
                      ></Form.Input>
                      <h4>Foto lado frontal de su Cédula</h4>
                    </a>
                  </>
                  {/* <input type="file" onChange={handleFileChange} /> */}
                </div>
              </div>
              <div className="column">
                <div className="ui segment">
                  <>
                    <a className="ui medium image">
                      <img src={idback} />
                      <Form.Input
                        type="file"
                        name="fileBack"
                        onChange={(e) => handleFileChange(e, "fileBack")}
                        error={
                          formik.touched.fileBack && formik.errors.fileBack
                            ? formik.errors.fileBack
                            : null
                        }
                      />
                      <h4>Foto lado posterior de su Cédula</h4>
                    </a>
                  </>
                </div>
              </div>
            </div>
            <div className="ui two column grid">
              <div className="column">
                <div className="ui segment">
                  <>
                    <a className="ui medium image">
                      <img src={selfie} />
                      <Form.Input
                        type="file"
                        name="fileSelfie"
                        onChange={(e) => handleFileChange(e, "fileSelfie")}
                        error={
                          formik.touched.fileSelfie && formik.errors.fileSelfie
                            ? formik.errors.fileSelfie
                            : null
                        }
                      />
                      <h4>Foto selfie con su Cédula</h4>
                    </a>
                  </>
                </div>
              </div>
              {conRuc && (
                <div className="column">
                  <div className="ui segment">
                    <>
                      <a className="ui medium image">
                        <img src={cartaAutorizacion} />
                        <Form.Input
                          type="file"
                          name="fileRUC"
                          onChange={(e) => handleFileChange(e, "fileRUC")}
                          error={
                            formik.touched.fileRUC && formik.errors.fileRUC
                              ? formik.errors.fileRUC
                              : null
                          }
                        />
                        <h4>Copia del RUC</h4>
                      </a>
                    </>
                  </div>
                </div>
              )}
              <div className="column">
                <div className="ui segment">
                  <>
                    <a className="ui medium image">
                      <img src={cartaAutorizacion} />
                      <Form.Input
                        type="file"
                        name="fileCarta"
                        onChange={(e) => handleFileChange(e, "fileCarta")}
                        error={
                          formik.touched.fileCarta && formik.errors.fileCarta
                            ? formik.errors.fileCarta
                            : null
                        }
                      />
                      <h4>Documento Adicional</h4>
                    </a>
                  </>
                </div>
              </div>
            </div>
            <button className="ui secondary button" onClick={() => regresar()}>
              Regresar
            </button>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: "center" }}>DATOS PERSONALES</h3>
            {showAlert && (
              <>
                <Message floating info onDismiss={dismiss}>
                  <Message.Header>¡Exito!</Message.Header>
                  <p>Información almacenada con éxito</p>
                </Message>
              </>
            )}
            <div className="ui three column grid">
              <div className="column">
                <Form.Field>Tipo de Identificación</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={IdentificacionOption}
                  name="tipoIdentificacion"
                  selection
                  error={
                    formik.touched.tipoIdentificacion &&
                      formik.errors.tipoIdentificacion
                      ? formik.errors.tipoIdentificacion
                      : null
                  }
                  value={formik.values.tipoIdentificacion}
                  onChange={(_, data) => {
                    formik.setFieldValue("tipoIdentificacion", data.value);
                    setTipoIdentificacion(data.value);
                  }}
                />
                <Form.Field>Nombres</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Nombres completos"
                  name="nombreCompleto"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.nombreCompleto &&
                      formik.errors.nombreCompleto
                      ? formik.errors.nombreCompleto
                      : null
                  }
                  value={formik.values.nombreCompleto}
                />
                <Form.Field>Fecha de nacimiento</Form.Field>
                <Form.Input
                  type="date"
                  name="fechaNacimiento"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fechaNacimiento &&
                      formik.errors.fechaNacimiento
                      ? formik.errors.fechaNacimiento
                      : null
                  }
                  value={formik.values.fechaNacimiento}
                />
              </div>
              <div className="column">
                <Form.Field>Identificación</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Identificación"
                  name="identificacion"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.identificacion &&
                      formik.errors.identificacion
                      ? formik.errors.identificacion
                      : null
                  }
                  value={formik.values.identificacion}
                  maxLength={maxLengthIdentificacion}
                />
                <Form.Field>Primer Apellido</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Primer apellido"
                  name="apellidoUno"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.apellidoUno && formik.errors.apellidoUno
                      ? formik.errors.apellidoUno
                      : null
                  }
                  value={formik.values.apellidoUno}
                />
                <Form.Field>Nacionalidad</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={Nacionalidad}
                  name="nacionalidad"
                  selection
                  error={
                    formik.touched.nacionalidad && formik.errors.nacionalidad
                      ? formik.errors.nacionalidad
                      : null
                  }
                  value={formik.values.nacionalidad}
                  onChange={(_, data) =>
                    formik.setFieldValue("nacionalidad", data.value)
                  }
                />
              </div>
              <div className="column">
                <Form.Field>Código Dactilar</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Código Dactilar"
                  name="codigoDactilar"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.codigoDactilar &&
                      formik.errors.codigoDactilar
                      ? formik.errors.codigoDactilar
                      : null
                  }
                  value={formik.values.codigoDactilar}
                  maxLength={10}
                />
                <Form.Field>Segundo Apellido</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Segundo apellido"
                  name="apellidoDos"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.apellidoDos && formik.errors.apellidoDos
                      ? formik.errors.apellidoDos
                      : null
                  }
                  value={formik.values.apellidoDos}
                />
                <Form.Field>Sexo</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={Sexo}
                  name="sexo"
                  selection
                  error={
                    formik.touched.sexo && formik.errors.sexo
                      ? formik.errors.sexo
                      : null
                  }
                  value={formik.values.sexo}
                  onChange={(_, data) =>
                    formik.setFieldValue("sexo", data.value)
                  }
                />
              </div>
            </div>
            <div className="ui two column grid">
              <div className="column">
                <Form.Field>Teléfono</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Celular"
                  name="celular"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.celular && formik.errors.celular
                      ? formik.errors.celular
                      : null
                  }
                  value={formik.values.celular}
                  maxLength={10}
                />
                <Form.Field>Otro Número Telefónico</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Otro número Celular"
                  name="celularDos"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.celularDos && formik.errors.celularDos
                      ? formik.errors.celularDos
                      : null
                  }
                  value={formik.values.celularDos}
                  maxLength={10}
                />
              </div>
              <div className="column">
              <Form.Field>Correo Electrónico</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Email"
                  name="mail"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.mail && formik.errors.mail
                      ? formik.errors.mail
                      : null
                  }
                  value={formik.values.mail}
                />
                <Form.Field>Correo Electrónico Alternativo</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Email alternativo"
                  name="mailDos"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.mailDos && formik.errors.mailDos
                      ? formik.errors.mailDos
                      : null
                  }
                  value={formik.values.mailDos}
                />
              </div>
            </div>
            <div className="ui three column grid">
              <div className="sixteen wide column">
                <div className="ui segment">
                  {/* ------------------CON RUC-------------- */}
                  {conRuc ? (
                    <div className="ui four column grid">
                      <div className="column">
                        <Form.Field>¿Con RUC?:</Form.Field>
                      </div>
                      <div className="column">
                        <Form.Field>
                          <Radio
                            label="Si"
                            name="conRuc"
                            onChange={() => {
                              setConRuc(true);
                            }}
                            checked={conRuc}
                          />
                        </Form.Field>
                      </div>
                      <div className="column">
                        <Form.Field>
                          <Radio
                            label="No"
                            name="conRuc"
                            onChange={() => {
                              setConRuc(false);
                            }}
                            checked={!conRuc}
                          />
                        </Form.Field>
                      </div>
                      <div className="column">
                        <Form.Field>
                          <Form.Input
                            type="text"
                            placeholder="RUC"
                            name="firmaConRuc"
                            onChange={formik.handleChange}
                            error={
                              formik.touched && formik.errors.firmaConRuc
                                ? formik.errors.firmaConRuc
                                : null
                            }
                            value={formik.values.firmaConRuc}
                            maxLength={13}
                          />
                        </Form.Field>
                      </div>
                    </div>
                  ) : (
                    <div className="ui three column grid">
                      <div className="column">
                        <Form.Field>¿Con RUC?:</Form.Field>
                      </div>
                      <div className="column">
                        <Form.Field>
                          <Radio
                            label="Si"
                            name="conRuc"
                            onChange={() => {
                              setConRuc(true);
                            }}
                            checked={conRuc}
                          />
                        </Form.Field>
                      </div>
                      <div className="column">
                        <Form.Field>
                          <Radio
                            label="No"
                            name="conRuc"
                            onChange={() => {
                              setConRuc(false);
                            }}
                            checked={!conRuc}
                          />
                        </Form.Field>
                      </div>
                    </div>
                  )}
                  {/* END------------CON RUC--------------END */}
                </div>
              </div>
            </div>
            <h3>Dirección Domicilio</h3>
            <div className="ui three column grid">
              <div className="column">
                <Form.Field>Provincia</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={provincias}
                  name="provincias"
                  selection
                  onChange={(_, data) => {
                    formik.setFieldValue("provincias", data.value);
                    setSelectedProvincia(data.value);
                  }}
                  error={
                    formik.touched.provincias && formik.errors.provincias
                      ? formik.errors.provincias
                      : null
                  }
                  value={formik.values.provincias}
                />
              </div>
              <div className="column">
                <Form.Field>Ciudad</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={ciudades}
                  name="ciudades"
                  selection
                  onChange={(_, data) => {
                    formik.setFieldValue("ciudades", data.value);
                  }}
                  error={
                    formik.touched.ciudades && formik.errors.ciudades
                      ? formik.errors.ciudades
                      : null
                  }
                  value={formik.values.ciudades}
                />
              </div>
              <div className="column">
                <Form.Field>Dirección Completa</Form.Field>
                <Form.Input
                  type="text"
                  placeholder="Dirección"
                  name="direccion"
                  onChange={(_, data) =>
                    formik.setFieldValue("direccion", data.value)
                  }
                  error={
                    formik.touched.direccion && formik.errors.direccion
                      ? formik.errors.direccion
                      : null
                  }
                  value={formik.values.direccion}
                />
              </div>
            </div>
            <h3>Formato y Tiempo de Vigencia</h3>
            <div className="ui two column grid">
              <div className="column">
                <Form.Field>En Formato</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={Formato}
                  name="formato"
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("formato", data.value)
                  }
                  error={
                    formik.touched.formato && formik.errors.formato
                      ? formik.errors.formato
                      : null
                  }
                  value={formik.values.formato}
                />
              </div>
              <div className="column">
                <Form.Field>Tiempo de Vigencia</Form.Field>
                <Form.Dropdown
                  placeholder="Seleccione..."
                  options={Vigencia}
                  name="vigencia"
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("vigencia", data.value)
                  }
                  error={
                    formik.touched.vigencia && formik.errors.vigencia
                      ? formik.errors.vigencia
                      : null
                  }
                  value={formik.values.vigencia}
                />
              </div>
              {/* <div className="column">
                <Form.Field></Form.Field>
                <Form.Checkbox
                  label="Serv. Express:"
                  name="express"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.express && formik.errors.express
                      ? formik.errors.express
                      : null
                  }
                />
              </div> */}
            </div>
            <br />
            <div className="ui two column grid">
              <div className="four column row">
                <div className="right floated column">
                  <Button
                    className="ui secondary button"
                    type="button"
                    onClick={formik.handleReset}
                  >
                    Limpiar
                  </Button>
                </div>
                <div className="left floated column">
                  <Button
                    className="ui primary button"
                    type="button"
                    onClick={() => setContenedor(true)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        {contenedor && (
          <>
            <Button
              className="ui primary button"
              type="submit"
              onClick={() => {
                setClicGuardar(true);
              }}
              disabled={mostrarErrores && Object.keys(formik.errors).length > 0}
            >
              Guardar
            </Button>
            <br />
            {mostrarErrores && Object.keys(formik.errors).length > 0 && (
              <>
                <Message floating color="yellow">
                  <Message.Content>
                    <strong>Los siguientes campos tienen errores:</strong>{" "}
                    {Object.keys(formik.errors).map(
                      (error) => " - " + nombreAdornado(error) + " - "
                    )}
                    .
                    <br />
                    <center>
                      <strong>
                        El botón de guardar se activará cuando los errores sean
                        corregidos.
                      </strong>
                    </center>
                  </Message.Content>
                </Message>
              </>
            )}
          </>
        )}
      </Form>
    </Container>
  );
};

export default Registro;
