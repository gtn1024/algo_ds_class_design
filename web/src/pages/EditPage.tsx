import type { FormInstance } from 'antd'
import { Button, Form, Input, InputNumber, message } from 'antd'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { http } from '../lib/Http.tsx'
import s from './EditPage.module.scss'

export const EditPage: React.FC = () => {
  const { pathname } = useLocation()
  const mode = pathname.split('/').pop() === 'new' ? '新建' : '修改'
  const { id } = useParams()
  const nav = useNavigate()
  const formRef = useRef<FormInstance<Student>>(null)
  useEffect(() => {
    if (mode === '修改' && id) {
      http.get<Student>(`/${id}`)
        .then((res) => {
          formRef?.current?.setFieldsValue({
            id: res.data.data.id ?? '',
            name: res.data.data.name ?? '',
            mathScore: res.data.data.mathScore ?? 0,
            englishScore: res.data.data.englishScore ?? 0,
            physicsScore: res.data.data.physicsScore ?? 0,
          })
        })
        .catch((err: AxiosError<HttpResponse>) => {
          void message.error(err.response?.data.message ?? '获取成绩失败')
          throw err
        })
    }
  }, [mode, id, formRef])

  const onSubmit = (v: Student) => {
    if (mode === '新建') {
      http.post<Student>('/', { ...v })
        .then(() => {
          void message.success('新建成功')
          nav('/')
        })
        .catch((err: AxiosError<HttpResponse>) => {
          void message.error(err.response?.data.message ?? '新建失败')
          throw err
        })
    } else {
      http.patch<void>(`/${id ?? 0}`, { ...v })
        .then(() => {
          void message.success('修改成功')
          nav('/')
        })
        .catch((err: AxiosError<HttpResponse>) => {
          void message.error(err.response?.data.message ?? '修改失败')
          throw err
        })
    }
  }

  return (
    <div className={s.wrapper}>
      <Form
        name="basic"
        layout='vertical'
        onFinish={onSubmit}
        autoComplete="off"
        ref={formRef}
      >
        <Form.Item label="学号" rules={[{ required: true, message: '请输入学号！' }]} name="id">
          <Input disabled={mode === '修改'}/>
        </Form.Item>

        <Form.Item label="姓名" rules={[{ required: true, message: '请输入姓名！' }]} name="name">
          <Input/>
        </Form.Item>

        <Form.Item label="数学成绩" rules={[{ required: true, message: '请输入数学成绩！' }]} name="mathScore">
          <InputNumber min={0} max={100}/>
        </Form.Item>

        <Form.Item label="英语成绩" rules={[{ required: true, message: '请输入英语成绩！' }]} name="englishScore">
          <InputNumber min={0} max={100}/>
        </Form.Item>

        <Form.Item label="物理成绩" rules={[{ required: true, message: '请输入物理成绩！' }]} name="physicsScore">
          <InputNumber min={0} max={100}/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {mode === '新建' ? '新建' : '修改'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
