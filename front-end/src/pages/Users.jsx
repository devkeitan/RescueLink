import UserTable from '@/features/users/user-table'
import React from 'react'

const Users = () => {
  return (
<div className='space-y-6'>
        <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage drivers, responders, and administrators</p>
    </div>

    <UserTable/>
    </div>
  )
}

export default Users