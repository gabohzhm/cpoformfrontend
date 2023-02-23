import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginRequest } from '../../api/AuthRequest';
import { useNavigate } from 'react-router-dom';
import logo from "./aplogo.png";
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth';

function LoginForm() {

    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const [auth, setAuth] = useRecoilState(authState);
    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false);
                navigate('/firma-electronica/registro');
            }, 3000);
        }
    }, [showAlert]);

    const dismiss = () => {
        setShowAlert(false);
    };
    const loginRequest = (data) => {
        LoginRequest(data)
            .then((res) => {
                if (res) {
                    setShowAlert(true);
                    setAuth(res.data.usuario);
                    console.log(res.data.usuario);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            repeatPassword: '',
        },
        onSubmit: (formData) => {
            //console.log(formData);
            loginRequest(formData);
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Campo obligatorio').email('No es un email válido.'),
            password: Yup.string().required('Campo obligatorio').min(8, 'Mínimo 8 caracteres.').max(12, 'Máximo 12 caracteres.'),
        })
    });

    return <React.Fragment>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src={logo} /> AP SoftIndustries
                </Header>
                {showAlert && <>
                    <Message floating info onDismiss={dismiss} >
                        <Message.Header>¡Éxito!</Message.Header>
                        <Message.Content>
                            <p>Ingresando al Sistema</p>
                        </Message.Content>
                    </Message>
                </>}
                <Form size='large' onSubmit={formik.handleSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='Correo electrónico'
                            name='email'
                            onChange={formik.handleChange}
                            error={formik.errors.email}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Contraseña'
                            type='password'
                            name='password'
                            onChange={formik.handleChange}
                            error={formik.errors.password}
                        />

                        <Button color='teal' fluid size='large' type='submit'>
                            Iniciar Sesión
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    ¿Eres nuevo? <Link to={'/firma-electronica/signup'}>Regístrate</Link>
                </Message>
            </Grid.Column>
        </Grid>
    </React.Fragment>
}





export default LoginForm;