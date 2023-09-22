import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { BadRequestError, validateRequest } from '@aogallotickets/common'
import { Password } from '../services/password'

const router = Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = Password.compare(existingUser.password, password)

    if (!passwordsMatch) {
      throw new BadRequestError('User and Password are incorrect')
    }

    // Genere JWT token
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(201).json(existingUser)
  }
)

export { router as signIn }
