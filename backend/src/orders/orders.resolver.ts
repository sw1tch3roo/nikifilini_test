import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { Order, OrdersFilter, RetailPagination } from 'src/retail_api/types'

@Resolver((of) => Order)
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query(() => [Order])
  async getOrders(
    @Args('page', { nullable: true }) page?: number,
  ): Promise<[Order[], RetailPagination]> {
    return this.retailService.getOrders(page)
  }

  @Query(() => Order)
  async order(@Args('number') number: string): Promise<Order> {
    return this.retailService.findOrder(number)
  }
}
