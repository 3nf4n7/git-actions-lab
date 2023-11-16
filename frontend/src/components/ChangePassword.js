import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Alert } from 'antd';

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function (props) {
let { userName, regExp = /(.*?)/, setIsUserLogged = () => {}} = props;
    const [ showAlert, setShowAlert ] = useState(false)
    const [ showSuccessAlert, setShowSuccessAlert ] = useState(false)
    const onFinish = (value) => {
        value.userName = userName;
        fetch('http://localhost:8000/change-password', {
            method: "POST",
            headers: {
                'body': JSON.stringify(value)
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res.result)
                if (res.result) {
                    setShowAlert(false)
                    setShowSuccessAlert(true)
                    setTimeout(() => { 
                        setIsUserLogged()}, 1000)
                }
                else {
                    setShowAlert(true)
                    setShowSuccessAlert(false)
                }
            })
    }

    return (
        <Form
            name="basic"
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: 600,
            }}

            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {showAlert ? (
                <Alert
                    message="Неверный пароль"
                    showIcon
                    type='error'
                    style={{
                        marginBottom: '10px'
                    }}
                />
            ) : ''}
            {showSuccessAlert ? (
                <Alert
                    message="Пароль успешно изменен!"
                    showIcon
                    type='success'
                    style={{
                        marginBottom: '10px'
                    }}
                />
            ) : ''}
            <Form.Item
                label="Текущий пароль"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Введите пароль!',
                    },

                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Новый пароль"
                name="newPassword"
                rules={[
                    {
                        required: true,
                        message: 'Введите пароль!',
                    },
                    () => ({
                          validator(_, value) {
                            if (regExp.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароль не соответствует ограничениям!'));
                          }
                    })
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 6,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Установить новый пароль
                </Button>
            </Form.Item>
        </Form>
    )

}