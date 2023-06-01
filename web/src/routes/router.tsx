import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.tsx'
import { ErrorPage } from '../pages/ErrorPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { EditPage } from '../pages/EditPage.tsx'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout/>,
      errorElement: <ErrorPage/>,
      children: [
        { index: true, element: <HomePage/> },
        { path: 'new', element: <EditPage/> },
        { path: ':id/edit', element: <EditPage/> },
      ],
    },
  ],
)
