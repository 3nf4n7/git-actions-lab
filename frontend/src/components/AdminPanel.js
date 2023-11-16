import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, Form, Input, Row } from 'antd';
import ChangePassword from './ChangePassword';
const { Column, ColumnGroup } = Table;

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
export default function (props) {
    let { userName } = props;
    const [changePassword, setChangePassword] = useState(false)
    let data = []
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/users')
            .then(res => res.json())
            .then(res => setTableData([...res]))
    }, [])

    const banUser = (value) => {
        fetch('http://localhost:8000/ban-user/?name=' + value)
            .then(res => res.json())
            .then(res => setTableData([...res]))
    }

    const limitUsersPassword = (value) => {
        fetch('http://localhost:8000/limit-users-password/?name=' + value)
            .then(res => res.json())
            .then(res => setTableData([...res]))
    }

    const onFinish = (value) => {
        fetch('http://localhost:8000/new-user/?name=' + value.username)
            .then(res => res.json())
            .then(res => setTableData([...res]))
    }

    return (
        <>
            <Form
                style={{
                    marginTop: '10px',
                    marginBottom: '10px'
                }}
                layout='inline'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        Добавить пользователя
                    </Button>
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Вы не указали имя пользователя!',
                        },
                    ]}
                >
                    <Input

                        placeholder="Имя пользователя"
                    />
                </Form.Item>
            </Form>
            <Table dataSource={tableData}>
                <Row>
                    <Column title='name' dataIndex="name" key='name'></Column>
                    <Column title='role' dataIndex="role" key='role'></Column>
                    <Column title='passwordLimitation' dataIndex="passwordLimitation" key='passwordLimitation'></Column>
                    <Column title='banStatus' dataIndex="banStatus" key='banStatus'></Column>
                    <Column title='ban' key='ban' render={(_, record) => (
                        <Space size="middle">
                            <Button danger onClick={() => banUser(record.name)}> { record.banStatus == "BANNED" ? 'Разбанить' : 'Забанить' }</Button>
                        </Space>
                    )}></Column>
                    <Column title='limit password' key='limitPassword' render={(_, record) => (
                        <Space size="middle">
                            <Button onClick={() => limitUsersPassword(record.name)}> { record.passwordLimitation == 'LIMITED' ? "Разграничить" : "Ограничение" }</Button>
                        </Space>
                    )} >
                    </Column>
                </Row>
            </Table >

            <Button style={{
                marginTop: '20px',

            }} onClick={() => setChangePassword(!changePassword)}>Сменить пароль</Button>
            {
                changePassword ? (
                    <ChangePassword userName={userName}></ChangePassword>
                ) : ''
            }
        </>
    )
}