import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import 'antd/dist/reset.css'
import { router } from './routes/router.tsx'

export const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router}/>
    </ConfigProvider>
  )
}
