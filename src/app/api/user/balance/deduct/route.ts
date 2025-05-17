import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { initRepository } from "@/app/models/connect";
import { Order, User } from "@/app/models/entities";
import { authOptions } from "@/app/auth/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { amount, order_id } = await request.json();

    // Validate input
    if (!amount || !order_id) {
      return NextResponse.json(
        { error: "Missing required fields: amount and order_id" },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Initialize repositories
    const userRepository = await initRepository(User);
    const orderRepository = await initRepository(Order);

    // Get user
    const user = await userRepository.findOne({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to this user
    const order = await orderRepository.findOne({
      where: { id: order_id, user_id: session.user.id }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or does not belong to this user" },
        { status: 404 }
      );
    }

    // Start transaction
    const queryRunner = userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update user balance
      await queryRunner.manager.update(
        User,
        { id: session.user.id },
        { balance: () => `balance - ${amount}` }
      );

      // Create transaction record if you have a Transaction entity
      // This is optional but recommended for keeping track of balance changes
      // We assume you might have a Transaction entity, if not, you can comment this out
      /*
      const transactionRepository = await initRepository(Transaction);
      const transaction = transactionRepository.create({
        user_id: session.user.id,
        amount: -amount, // negative because it's a deduction
        order_id: order_id,
        description: `Deducted balance for order #${order_id}`,
        type: 'purchase',
      });
      await queryRunner.manager.save(transaction);
      */

      // Commit transaction
      await queryRunner.commitTransaction();

      return NextResponse.json({
        result: true,
        message: "Balance deducted successfully",
        new_balance: user.balance - amount
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      console.error("Error deducting balance:", error);
      return NextResponse.json(
        { error: "Error deducting balance: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}