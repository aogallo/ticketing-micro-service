import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { validateRequest, BadRequestError } from '@aogallotickets/common'

const router = Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }

    const newUser = User.build({ email, password })

    await newUser.save()

    // Genere JWT token
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(201).json(newUser)
  }
)

export { router as signUp }
