import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { Order, RetailPagination } from 'src/retail_api/types'

@Resolver((of) => Order)
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query(() => [Order])
  async getOrders(): Promise<[Order[], RetailPagination]> {
    return this.retailService.getOrders()
  }

  @Query((returns) => Order)
  async order(@Args('number') id: string): Promise<Order> {
    return this.retailService.findOrder(id)
  }
}
