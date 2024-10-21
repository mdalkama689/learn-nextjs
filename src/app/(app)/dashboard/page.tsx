'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
const page = () => {
    
    const {data: session}  = useSession();

if(!session) return 
  return (
    <div>
    <h1>Welcome, {session?.user?.name}</h1>
    <p>Email: {session?.user?.email}</p>
  </div>
  )
}

export default page