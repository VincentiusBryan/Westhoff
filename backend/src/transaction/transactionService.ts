
    import { PrismaClient, TransactionType } from '@prisma/client';

    const prisma = new PrismaClient();

    type TransactionItemInput = {
    productId: number;
    quantity: number;
    };

    type CreateTransactionInput = {
    transactionNumber: string;
    type: TransactionType;
    fromLocationId?: number | null;
    toLocationId?: number | null;
    userId: number;
    notes?: string | null;
    items: TransactionItemInput[];
    };

    export const getTransactions = async () => {
    return await prisma.inventoryTransaction.findMany({
        include: {
        fromLocation: true,
        toLocation: true,
        user: true,
        items: {
            include: {
            product: {
                include: {
                category: true,
                unit: true,
                },
            },
            },
        },
        },
        orderBy: {
        id: 'desc',
        },
    });
    };

    export const getTransactionById = async (id: number) => {
    return await prisma.inventoryTransaction.findUnique({
        where: {
        id: id,
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
                unit: true,
                },
            },
            },
        },
        },
    });
    };

    export const createTransaction = async (
    data: CreateTransactionInput
    ) => {
    return await prisma.$transaction(async (tx) => {
       if (data.items.length === 0) {
  throw new Error('Transaction harus memiliki item');
}

if (data.type === TransactionType.PENGELUARAN) {
  const tokoLocation = await tx.location.findUnique({
    where: {
      name: 'TOKO',
    },
  });

  if (!tokoLocation) {
    throw new Error('Lokasi TOKO tidak ditemukan');
  }

  data.fromLocationId = tokoLocation.id;
  data.toLocationId = null;
}

        if (data.type === TransactionType.PRODUKSI) {
        if (!data.toLocationId) {
            throw new Error('PRODUKSI membutuhkan lokasi tujuan');
        }

        if (data.fromLocationId) {
            throw new Error('PRODUKSI tidak membutuhkan lokasi asal');
        }
        }

        if (data.type === TransactionType.MUTASI) {
        if (!data.fromLocationId || !data.toLocationId) {
            throw new Error('MUTASI membutuhkan lokasi asal dan tujuan');
        }

        if (data.fromLocationId === data.toLocationId) {
            throw new Error('Lokasi asal dan tujuan tidak boleh sama');
        }
        }

        if (data.type === TransactionType.PENGELUARAN) {
        if (!data.fromLocationId) {
            throw new Error('PENGELUARAN membutuhkan lokasi asal');
        }

        if (data.toLocationId) {
            throw new Error('PENGELUARAN tidak membutuhkan lokasi tujuan');
        }
        }

        for (const item of data.items) {
        if (item.quantity <= 0) {
            throw new Error('Quantity harus lebih besar dari 0');
        }

        const product = await tx.product.findUnique({
            where: {
            id: item.productId,
            },
        });

        if (!product) {
            throw new Error(
            `Product dengan ID ${item.productId} tidak ditemukan`
            );
        }
        }

        const transaction = await tx.inventoryTransaction.create({
        data: {
            transactionNumber: data.transactionNumber,
            type: data.type,
            fromLocationId: data.fromLocationId ?? null,
            toLocationId: data.toLocationId ?? null,
            userId: data.userId,
            notes: data.notes ?? null,
            items: {
            create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            },
        },
        });

        if (
        data.type === TransactionType.PRODUKSI &&
        data.toLocationId
        ) {
        for (const item of data.items) {
            await tx.stock.upsert({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: data.toLocationId,
                },
            },
            update: {
                quantity: {
                increment: item.quantity,
                },
            },
            create: {
                productId: item.productId,
                locationId: data.toLocationId,
                quantity: item.quantity,
            },
            });
        }
        }

        if (
        data.type === TransactionType.MUTASI &&
        data.fromLocationId &&
        data.toLocationId
        ) {
        for (const item of data.items) {
            const fromStock = await tx.stock.findUnique({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: data.fromLocationId,
                },
            },
            });

            if (!fromStock || fromStock.quantity < item.quantity) {
            throw new Error(
                `Stock product ID ${item.productId} tidak mencukupi di lokasi asal`
            );
            }

            await tx.stock.update({
            where: {
                id: fromStock.id,
            },
            data: {
                quantity: {
                decrement: item.quantity,
                },
            },
            });

            await tx.stock.upsert({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: data.toLocationId,
                },
            },
            update: {
                quantity: {
                increment: item.quantity,
                },
            },
            create: {
                productId: item.productId,
                locationId: data.toLocationId,
                quantity: item.quantity,
            },
            });
        }
        }

        if (
        data.type === TransactionType.PENGELUARAN &&
        data.fromLocationId
        ) {
        for (const item of data.items) {
            const stock = await tx.stock.findUnique({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: data.fromLocationId,
                },
            },
            });

            if (!stock || stock.quantity < item.quantity) {
            throw new Error(
                `Stock product ID ${item.productId} tidak mencukupi`
            );
            }

            await tx.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                quantity: {
                decrement: item.quantity,
                },
            },
            });
        }
        }

        return await tx.inventoryTransaction.findUnique({
        where: {
            id: transaction.id,
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
                    unit: true,
                },
                },
            },
            },
        },
        });
    });
    };

    export const deleteTransaction = async (id: number) => {
    return await prisma.$transaction(async (tx) => {
        const transaction = await tx.inventoryTransaction.findUnique({
        where: {
            id: id,
        },
        include: {
            items: true,
        },
        });

        if (!transaction) {
        throw new Error('Transaction tidak ditemukan');
        }

        for (const item of transaction.items) {
        if (
            transaction.type === TransactionType.PRODUKSI &&
            transaction.toLocationId
        ) {
            const stock = await tx.stock.findUnique({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: transaction.toLocationId,
                },
            },
            });

            if (!stock || stock.quantity < item.quantity) {
            throw new Error(
                `Stock tidak mencukupi untuk membatalkan transaksi`
            );
            }

            await tx.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                quantity: {
                decrement: item.quantity,
                },
            },
            });
        }

        if (
            transaction.type === TransactionType.MUTASI &&
            transaction.fromLocationId &&
            transaction.toLocationId
        ) {
            const toStock = await tx.stock.findUnique({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: transaction.toLocationId,
                },
            },
            });

            if (!toStock || toStock.quantity < item.quantity) {
            throw new Error(
                `Stock lokasi tujuan tidak mencukupi untuk membatalkan transaksi`
            );
            }

            await tx.stock.update({
            where: {
                id: toStock.id,
            },
            data: {
                quantity: {
                decrement: item.quantity,
                },
            },
            });

            await tx.stock.upsert({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: transaction.fromLocationId,
                },
            },
            update: {
                quantity: {
                increment: item.quantity,
                },
            },
            create: {
                productId: item.productId,
                locationId: transaction.fromLocationId,
                quantity: item.quantity,
            },
            });
        }

        if (
            transaction.type === TransactionType.PENGELUARAN &&
            transaction.fromLocationId
        ) {
            await tx.stock.upsert({
            where: {
                productId_locationId: {
                productId: item.productId,
                locationId: transaction.fromLocationId,
                },
            },
            update: {
                quantity: {
                increment: item.quantity,
                },
            },
            create: {
                productId: item.productId,
                locationId: transaction.fromLocationId,
                quantity: item.quantity,
            },
            });
        }
        }

        return await tx.inventoryTransaction.delete({
        where: {
            id: id,
        },
        });
    });
    };
