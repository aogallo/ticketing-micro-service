import axios from 'axios'
import Link from 'next/link'
import { cookies } from 'next/headers'

async function getData() {
  const cookieStore = cookies()
  console.log('cookies', cookieStore.getAll())
  if (typeof window === 'undefined') {
    //service name. namespace
    const { data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
      headers: {
        Host: 'ticketing.dev'
      }
    })

    console.log('server data', data)
    return data || {}
  } else {
    const { data } = await axios.get('/api/users/currentuser')
    console.log('client data', data)

    return data || {}
  }
}

export default async function Home() {
  const data = await getData()
  console.log('data', data)
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Link href='/auth'>Register</Link>
    </main>
  )
}
