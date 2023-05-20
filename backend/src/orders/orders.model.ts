import { Order, Pagination } from 'src/retail_api/types'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class OrdersResponse {
  @Field((type) => [Order])
  orders: Order[]

  @Field((type) => Pagination)
  pagination: Pagination
}
