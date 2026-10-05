
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createUser = async (data: {
  username: string;
  password: string;
  role: UserRole;
}) => {
  const passwordHash = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      username: data.username,
      password: passwordHash,
      role: data.role,
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  id: number,
  data: {
    username: string;
    password?: string;
    role: UserRole;
  }
) => {
  const updateData: {
    username: string;
    role: UserRole;
    password?: string;
  } = {
    username: data.username,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: {
      id: id,
    },
    data: updateData,
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
};
