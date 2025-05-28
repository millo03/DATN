import { Outlet } from 'react-router-dom'
import Sidebar_Profile from './_component/sidebar'

const Layout_Profile = () => {
  return (
    <div className='grid grid-cols-[250px_auto] gap-x-10 *:border border'>
        <Sidebar_Profile/>
        <div className='min-h-[80vh]'>
        <Outlet/>
        </div>
    </div>
  )
}

export default Layout_Profile