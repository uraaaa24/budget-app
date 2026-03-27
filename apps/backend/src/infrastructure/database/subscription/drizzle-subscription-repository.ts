import type {
  CreateSubscriptionInput,
  SubscriptionListResult,
  SubscriptionRepository,
  UpdateSubscriptionInput,
} from "@/domain/subscription/subscription-repository"
import type {
  Subscription,
  SubscriptionSummary,
} from "@/domain/subscription/subscription"
import { subscriptions } from "@/infrastructure/database/schema"
import { and, desc, eq } from "drizzle-orm"
import type { DbClient } from "@/infrastructure/database/client"

export class DrizzleSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly db: DbClient) {}

  async create(
    userId: string,
    input: CreateSubscriptionInput,
  ): Promise<Subscription> {
    const [row] = await this.db
      .insert(subscriptions)
      .values({
        userId,
        name: input.name,
        amount: input.amount,
        currency: input.currency ?? "JPY",
        billingCycle: input.billingCycle,
        startDate: new Date(input.startDate),
        nextBillingDate: new Date(input.nextBillingDate),
        status: input.status,
        memo: input.memo,
        paymentMethod: input.paymentMethod,
        categoryId: input.categoryId,
      })
      .returning()

    if (!row) {
      throw new Error("Failed to create subscription")
    }

    return this.rowToEntity(row)
  }

  async findByUserId(userId: string): Promise<SubscriptionListResult> {
    const rows = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))

    const items = rows.map((row) => this.rowToEntity(row))
    const summary = this.calculateSummary(items)

    return { items, summary }
  }

  async findById(userId: string, id: string): Promise<Subscription | null> {
    const [row] = await this.db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .limit(1)

    return row ? this.rowToEntity(row) : null
  }

  async update(
    userId: string,
    id: string,
    input: UpdateSubscriptionInput,
  ): Promise<Subscription> {
    const [row] = await this.db
      .update(subscriptions)
      .set({
        name: input.name,
        amount: input.amount,
        currency: input.currency ?? "JPY",
        billingCycle: input.billingCycle,
        startDate: new Date(input.startDate),
        nextBillingDate: new Date(input.nextBillingDate),
        status: input.status,
        memo: input.memo,
        paymentMethod: input.paymentMethod,
        categoryId: input.categoryId,
        updatedAt: new Date(),
      })
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning()

    if (!row) {
      throw new Error("Subscription not found")
    }

    return this.rowToEntity(row)
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
  }

  async findDueForBilling(date: Date): Promise<Subscription[]> {
    // Find active subscriptions where next billing date is today or earlier
    const rows = await this.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, "active"),
          // nextBillingDate <= date (billing is due)
          // Using SQL to compare dates properly
        ),
      )

    // Filter in memory for date comparison (simpler with Drizzle)
    const dueRows = rows.filter((row) => {
      const billingDate = new Date(row.nextBillingDate)
      billingDate.setHours(0, 0, 0, 0)
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      return billingDate <= checkDate
    })

    return dueRows.map((row) => this.rowToEntity(row))
  }

  async updateNextBillingDate(
    id: string,
    nextBillingDate: Date,
  ): Promise<void> {
    await this.db
      .update(subscriptions)
      .set({
        nextBillingDate: nextBillingDate,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id))
  }

  private rowToEntity(row: typeof subscriptions.$inferSelect): Subscription {
    const { monthlyAmount, yearlyAmount } = this.calculateNormalizedAmounts(
      row.amount,
      row.billingCycle,
    )

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      amount: row.amount,
      currency: row.currency,
      billingCycle: row.billingCycle as "monthly" | "yearly" | "weekly",
      startDate: row.startDate.toISOString(),
      nextBillingDate: row.nextBillingDate.toISOString(),
      status: row.status as "active" | "paused" | "canceled",
      memo: row.memo ?? undefined,
      paymentMethod: row.paymentMethod ?? undefined,
      categoryId: row.categoryId ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      monthlyAmount,
      yearlyAmount,
    }
  }

  private calculateNormalizedAmounts(
    amount: number,
    billingCycle: string,
  ): {
    monthlyAmount: number
    yearlyAmount: number
  } {
    let monthlyAmount: number
    let yearlyAmount: number

    switch (billingCycle) {
      case "monthly":
        monthlyAmount = amount
        yearlyAmount = amount * 12
        break
      case "yearly":
        monthlyAmount = amount / 12
        yearlyAmount = amount
        break
      case "weekly":
        monthlyAmount = (amount * 52) / 12
        yearlyAmount = amount * 52
        break
      default:
        monthlyAmount = amount
        yearlyAmount = amount * 12
    }

    return { monthlyAmount, yearlyAmount }
  }

  private calculateSummary(subscriptions: Subscription[]): SubscriptionSummary {
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active",
    )
    const pausedSubscriptions = subscriptions.filter(
      (s) => s.status === "paused",
    )
    const canceledSubscriptions = subscriptions.filter(
      (s) => s.status === "canceled",
    )

    const monthlyTotal = activeSubscriptions.reduce(
      (sum, s) => sum + s.monthlyAmount,
      0,
    )
    const yearlyTotal = activeSubscriptions.reduce(
      (sum, s) => sum + s.yearlyAmount,
      0,
    )

    return {
      activeCount: activeSubscriptions.length,
      pausedCount: pausedSubscriptions.length,
      canceledCount: canceledSubscriptions.length,
      monthlyTotal,
      yearlyTotal,
    }
  }
}
