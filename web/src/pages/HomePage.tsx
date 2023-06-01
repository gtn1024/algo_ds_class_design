import React, {useState} from 'react'
import {message} from 'antd'
import {useNavigate} from 'react-router-dom'
import useSWR from 'swr'
import type {AxiosError} from 'axios'
import {http} from '../lib/Http.tsx'
import s from './HomePage.module.scss'

export const HomePage: React.FC = () => {
  const nav = useNavigate()
  const [type, setType] = useState<'default' | 'math' | 'english' | 'physics'>('default')
  const [failed, setFailed] = useState<boolean>(false)
  const {
    data,
    mutate,
  } = useSWR(`/?type=${type}&failed=${failed}`, async (path: string) => {
    return http.get<Student[]>(path)
      .then((res) => {
        return res.data.data
      })
      .catch((err: AxiosError<HttpResponse>) => {
        void message.error(err.response?.data.message ?? '获取成绩单失败')
        throw err
      })
  })
  const download = () => {
    http.get(
      '/download',
      {},
      {
        responseType: 'blob',
      },
    )
      .then(() => {
        void message.success('下载成功')
      })
      .catch((err: AxiosError<HttpResponse>) => {
        void message.error(err.response?.data.message ?? '下载失败')
        throw err
      })
  }
  const remove = (id: string) => {
    if (!confirm('确定删除吗？')) return
    http.delete(`/${id}`)
      .then(() => {
        void message.success('删除成功')
        void mutate()
      })
      .catch((err: AxiosError<HttpResponse>) => {
        void message.error(err.response?.data.message ?? '删除失败')
        throw err
      })
  }
  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div className={s.operation}>
          <div className={s.left}>
            <button onClick={() => nav('/new')}>新建</button>
            <button onClick={download}>导出</button>
          </div>
          <div className={s.right}>
            <button
              onClick={() => {
                setType('default');
                setFailed(false);
              }}
              disabled={type === 'default' && !failed}
            >
              总分排序
            </button>
            <button
              onClick={() => {
                setType('math');
                setFailed(false);
              }}
              disabled={type === 'math' && !failed}
            >
              数学排序
            </button>
            <button
              onClick={() => {
                setType('english');
                setFailed(false);
              }}
              disabled={type === 'english' && !failed}
            >
              英语排序
            </button>
            <button
              onClick={() => {
                setType('physics');
                setFailed(false);
              }}
              disabled={type === 'physics' && !failed}
            >
              物理排序
            </button>
            <button
              onClick={() => {
                setType('math');
                setFailed(true);
              }}
              disabled={type === 'math' && failed}
            >
              数学不及格
            </button>
            <button
              onClick={() => {
                setType('english');
                setFailed(true)
              }}
              disabled={type === 'english' && failed}
            >
              英语不及格
            </button>
            <button
              onClick={() => {
                setType('physics');
                setFailed(true)
              }}
              disabled={type === 'physics' && failed}
            >
              物理不及格
            </button>
          </div>
        </div>
        <table className={s.table}>
          <thead>
          <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>数学 {type === 'math' ? '↓' : null}</th>
            <th>英语 {type === 'english' ? '↓' : null}</th>
            <th>物理 {type === 'physics' ? '↓' : null}</th>
            <th>总分 {type === 'default' ? '↓' : null}</th>
            <th>排名</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td style={{
                color: item.mathScore < 60 ? 'red' : 'black',
                fontWeight: item.mathScore < 60 ? 'bold' : 'normal',
              }}>{item.mathScore}</td>
              <td style={{
                color: item.englishScore < 60 ? 'red' : 'black',
                fontWeight: item.englishScore < 60 ? 'bold' : 'normal',
              }}>{item.englishScore}</td>
              <td style={{
                color: item.physicsScore < 60 ? 'red' : 'black',
                fontWeight: item.physicsScore < 60 ? 'bold' : 'normal',
              }}>{item.physicsScore}</td>
              <td>{item.sum}</td>
              <td>{item.rank}</td>
              <td>
                <button onClick={() => remove(item.id)}>删除</button>
                <button onClick={() => {
                  nav(`/${item.id}/edit`)
                }}>修改
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td>{data?.length ?? 0}人</td>
            <td>{data?.length ?? 0}人</td>
            <td>{data?.length ?? 0}人</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
