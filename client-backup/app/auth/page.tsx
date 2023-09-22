'use client'

import { useState } from 'react'
import Router from 'next/router'
import useRequest from '@/hooks/use-request'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    await doRequest()

  }

  return (
    <form className='container mx-auto p-24' onSubmit={onSubmit}>
      <label className='block'>
        <span className='block text-sm font-medium text-sky'>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          className='mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          text-black
      focus:outline-none  focus:ring-1
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500'
        />
      </label>

      <label>
        <span className='block text-sm font-medium text-sky'>Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='mt-1 text-black block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500'
        />
        <p className='mt-2 invisible peer-invalid:visible text-pink-600 text-sm'>
          Please provide a valid password.
        </p>
      </label>
      {errors}
      <button className='bg-sky-700 text-white hover:bg-sky-400 text-black p-4 rounded-lg w-full'>
        Register
      </button>
    </form>
  )
}
