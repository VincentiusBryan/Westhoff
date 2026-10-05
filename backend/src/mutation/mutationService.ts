import { PrismaClient, MutationRequestStatus, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export const createMutationRequest = async (
  requestNumber: string,
  userId: number,
  notes: string | null,
  items: { productId: number; quantity: number }[]
) => {
  if (!items || items.length === 0) {
    throw new Error('Request harus memiliki minimal 1 barang');
  }

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Quantity harus berupa angka bulat lebih dari 0');
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product) {
      throw new Error(`Product dengan ID ${item.productId} tidak ditemukan`);
    }
  }

  const dapur = await prisma.location.findUnique({
    where: { name: 'DAPUR' }
  });

  const toko = await prisma.location.findUnique({
    where: { name: 'TOKO' }
  });

  if (!dapur || !toko) {
    throw new Error('Location DAPUR atau TOKO tidak ditemukan');
  }

  const request = await prisma.mutationRequest.create({
    data: {
      requestNumber,
      userId,
      fromLocationId: dapur.id,
      toLocationId: toko.id,
      notes,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    },
    include: {
      fromLocation: true,
      toLocation: true,
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
              unit: true
            }
          }
        }
      }
    }
  });

  return request;
};

export const getMutationRequests = async (
  userId: number,
  role: string
) => {
  const where =
    role === 'TOKO'
      ? { userId }
      : role === 'DAPUR'
        ? { status: MutationRequestStatus.REQUESTED }
        : {};

  return prisma.mutationRequest.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      fromLocation: true,
      toLocation: true,
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
              unit: true
            }
          }
        }
      }
    }
  });
};

export const completeMutationRequest = async (
  requestId: number,
  userId: number
) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.mutationRequest.findUnique({
      where: { id: requestId },
      include: {
        items: true
      }
    });

    if (!request) {
      throw new Error('Request tidak ditemukan');
    }

    if (request.status !== MutationRequestStatus.REQUESTED) {
      throw new Error('Request sudah selesai');
    }

    for (const item of request.items) {
      const stock = await tx.stock.findUnique({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: request.fromLocationId
          }
        }
      });

      if (!stock || stock.quantity < item.quantity) {
        throw new Error(
          `Stock tidak cukup untuk product ID ${item.productId}`
        );
      }
    }

    const transactionNumber = `MUT-${Date.now()}-${userId}`;

    const transaction = await tx.inventoryTransaction.create({
      data: {
        transactionNumber,
        type: TransactionType.MUTASI,
        fromLocationId: request.fromLocationId,
        toLocationId: request.toLocationId,
        userId,
        notes: request.notes,
        items: {
          create: request.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        fromLocation: true,
        toLocation: true,
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                unit: true
              }
            }
          }
        }
      }
    });

    for (const item of request.items) {
      await tx.stock.update({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: request.fromLocationId
          }
        },
        data: {
          quantity: {
            decrement: item.quantity
          }
        }
      });

      await tx.stock.upsert({
        where: {
          productId_locationId: {
            productId: item.productId,
            locationId: request.toLocationId
          }
        },
        create: {
          productId: item.productId,
          locationId: request.toLocationId,
          quantity: item.quantity
        },
        update: {
          quantity: {
            increment: item.quantity
          }
        }
      });
    }

    const completedRequest = await tx.mutationRequest.update({
      where: { id: requestId },
      data: {
        status: MutationRequestStatus.COMPLETED
      },
      include: {
        fromLocation: true,
        toLocation: true,
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                unit: true
              }
            }
          }
        }
      }
    });

    return {
      request: completedRequest,
      transaction
    };
  });
};