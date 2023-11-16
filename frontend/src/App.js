import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Alert } from 'antd';

import AdminPanel from './components/AdminPanel';
import ChangePassword from './components/ChangePassword';

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const App = () => {
  const [userName, setUserName] = useState('')
  const [userExists, setUserExists] = useState({ result: 'No', passwordLimitation: /(.*?)/ })
  const [isUserLogged, setIsUserLogged] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const [tries, setTries] = useState(0)

  const onContinue = (value) => {
    setUserName(value.username)
    fetch('http://localhost:8000/check-user-name/?name=' + value.username)
      .then(res => res.json())
      .then(res => setUserExists(res))
  }
  const onFinish = (values, type) => {
    console.log('Success:', values);
    values.username = userName

    if (type === 'registration')
      fetch('http://localhost:8000/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'body': JSON.stringify(values)
        },
        body: {}
      })
        .then(res => res.json())
        .then(res => {
          if (res.result == "OK")
            setIsUserLogged(true);
        })
    if (type === 'login')
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'body': JSON.stringify(values)
        },
        body: {}
      })
        .then(res => res.json())
        .then(res => {
          if (res.result == 'OK') {
            setIsUserLogged(true);
            setShowAlert(false)
          }
          else {
            setShowAlert(true)
            setTries(tries+1)
            console.log(tries)
            if (tries > 3)
              setDisabled(true)
          }
        })

  };
  return (
    <>
      {showAlert ? (
        <Alert
          message="Неверный пароль"
          showIcon
          type='error'
        />
      ) : ''}

      {isUserLogged ? (
        <>
          {userName === 'ADMIN' ? (
            <AdminPanel userName={userName}></AdminPanel>
          ) : (
            <>
              <a href='#' onClick={() => { setUserName(''); setIsUserLogged(false) }}>Выйти</a><br /><br />
              <div>nu privet {userName} вот тебе анекдот </div>
              <div><br /><br />Заходит в бар улитка и говорит:
                <br />
                – Можно виски с колой?
                <br></br>
                – Простите, но мы не обслуживаем улиток, – отвечает бармен и вышвыривает ее за дверь.
                <br />
                Через неделю заходит опять эта улитка и спрашивает:
                <br />
                – Зачем ты это сделал?</div>

              <Button style={{
                marginTop: '20px',

              }} onClick={() => setChangePassword(!changePassword)}>Сменить пароль</Button>

              {changePassword ? (<>
                {!userExists.passwordLimit ? (
                  <>
                  <ChangePassword userName={userName} setIsUserLogged={() => setIsUserLogged(true)}></ChangePassword></>
                ) : (
                  <><ChangePassword userName={userName} regExp={/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\+\-\*\/])/su} setIsUserLogged={() => setIsUserLogged(true)}></ChangePassword></>
                )}
               </> 
              ) : ''}
            </>
          )}
        </>
      ) : (
        <>
          {userName ? (
            <>
              {userExists.result == 'No' ? (
                <>
                  <a onClick={() => setUserName('')}>Вернуться</a>
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

                    onFinish={(e) => onFinish(e, 'registration')}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <h1 style={{
                      textAlign: 'center',
                    }}> Это первый вход для {userName} </h1>
                    <h2 style={{
                      textAlign: 'center',
                      marginBottom: '69px',
                    }}> Чтобы завершить регистрацию, придумайте пароль </h2>

                    <Form.Item
                      label="Пароль"
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
                      name="confirm"
                      label="Подтвердите пароль"
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Подтвердите пароль!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают!'));
                          },
                        }),
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
                        Зарегистрироваться
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ) : userExists.result !== 'BANNED' ? (
                <>
                  {userExists.passwordLimitation !== 'OK' ? (
                    <>
                      <a onClick={() => setUserName('')}>Вернуться</a>
                      <h1 style={{
                        textAlign: 'center'
                      }}> На пароль пользователя были наложены ограничения </h1>
                      <h2 style={{
                        textAlign: 'center'
                      }}> Измените пароль, подходящий критериям: </h2>
                      <h2 style={{
                        textAlign: 'center',
                        marginBottom: '40px'
                      }}> Наличие строчных и прописных букв, а также знаков арифметических операций </h2>
                      <ChangePassword userName={userName} regExp={/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\+\-\*\/])/su}></ChangePassword>
                    </>
                  ) : (
                    <><a onClick={() => { setUserName(''); setShowAlert(false); setDisabled(false); setTries(0) }}>Вернуться</a>
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

                        onFinish={(e) => onFinish(e, 'login')}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <h1 style={{
                          textAlign: 'center',
                          marginBottom: '69px',
                        }}> Авторизация для {userName} </h1>

                        <Form.Item
                          label="Пароль"
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: 'Введите пароль!',
                            },

                          ]}
                        >
                          <Input.Password disabled={disabled}/>
                        </Form.Item>
                        <Form.Item
                          style={{

                          }}
                          wrapperCol={{
                            offset: 6,
                            span: 16,
                          }}
                        >
                          <Button type="primary" htmlType="submit" lable="Войти">
                            Войти
                          </Button>
                        </Form.Item>
                      </Form></>
                  )}

                </>) : (<>
                  <>
                    <Alert
                      message={"Пользователь " + userName + " заблокирован"}
                      showIcon
                      type='error'
                    />
                    <h1 style={{
                      textAlign: 'center',
                      marginBottom: '69px',
                    }}>Авторизация</h1>
                    <Form
                      name="basic"
                      labelCol={{
                        span: 8,
                      }}
                      wrapperCol={{
                        span: 16,
                      }}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        maxWidth: 600,
                      }}

                      onFinish={onContinue}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Имя пользователя"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: 'Вы не указали имя пользователя!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        wrapperCol={{
                          offset: 8,
                          span: 16,
                        }}
                      >
                        <Button htmlType="submit">
                          Далее
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                </>
              )}

            </>
          ) : (
            <>
              <h1 style={{
                textAlign: 'center',
                marginBottom: '69px',
              }}>Авторизация</h1>
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  maxWidth: 600,
                }}

                onFinish={onContinue}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Имя пользователя"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Вы не указали имя пользователя!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button htmlType="submit">
                    Далее
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </>
      )}


    </>
  )
}

export default App;
