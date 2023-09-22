import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signIn } from './routes/signin'
import { signOut } from './routes/signout'
import { signUp } from './routes/signup'

import { NotFoundError, errorHandler } from '@aogallotickets/common'


const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter)
app.use(signIn)
app.use(signOut)
app.use(signUp)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
