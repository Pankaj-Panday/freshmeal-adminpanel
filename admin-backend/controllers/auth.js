import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendMailWithRetry } from "../utils/emailQueue.js";
import logger from "../utils/logger.js";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function signUp(req, res) {
  const { email, password, phone } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      phone,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to Fresh Meals",
    html: `
  <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px 0;">
    
    <div style="max-width:500px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <div style="text-align:center; padding:25px; background:#16a34a;">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" 
          alt="Fresh Meals"
          style="width:60px; height:60px;"
        />
        <h1 style="color:white; margin-top:10px; font-size:22px;">
          Fresh Meals
        </h1>
      </div>

      <div style="padding:30px; text-align:center;">
        <h2 style="margin-bottom:10px;">Welcome aboard! 🎉</h2>
        
        <p style="color:#4b5563; font-size:15px; line-height:1.6;">
          Your account has been successfully created.  
          You're now ready to explore fresh and delicious meals delivered straight to your doorstep.
        </p>

        <a 
          href="#"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 24px;
            background:#16a34a;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Explore Meals
        </a>
      </div>

      <div style="padding:20px; text-align:center; font-size:12px; color:#9ca3af; background:#f3f4f6;">
        © ${new Date().getFullYear()} Fresh Meals. All rights reserved.
      </div>

    </div>

  </div>
  `,
  };

  sendMailWithRetry(mailOptions, 3).catch((error) =>
    logger.error("Failed to send welcome email", error),
  );

  const userWithoutPassword = {
    id: user.id,
    createdAt: user.createdAt,
    googleId: user.googleId,
    updatedAt: user.updatedAt,
    email: user.email,
    phone: user.phone,
  };

  res.status(201).json({
    success: true,
    data: userWithoutPassword,
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
}

async function googleLogin(req, res) {
  const { idToken } = req.body;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name } = payload;

  let user = await prisma.user.findFirst({
    where: {
      googleId,
    },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          googleId,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
        },
      });
    }
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
}

export { signUp, login, googleLogin };
