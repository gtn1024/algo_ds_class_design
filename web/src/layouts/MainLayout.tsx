import React from 'react'
import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import s from './MainLayout.module.scss'

const { Header, Content, Footer } = Layout
export const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout className={s.layout}>
      <Header className={s.header} style={{ background: colorBgContainer }}>
        <div className={s.logo}>
          成绩管理系统
        </div>
      </Header>
      <Content className={s.content}>
        <Outlet/>
      </Content>
      <Footer className={s.footer}>
        <div>
          成绩管理系统 ©2023 Created by gtn1024
        </div>
      </Footer>
    </Layout>
  )
}
