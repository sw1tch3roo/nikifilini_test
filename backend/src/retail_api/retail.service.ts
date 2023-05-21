import { Injectable } from '@nestjs/common'
import { Order, RetailPagination } from './types'
import { plainToClass } from 'class-transformer'
import axios, { AxiosInstance } from 'axios'
import { DeliveryType, OrderStatus, ProductStatus } from 'src/graphql'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {
        'X-API-KEY': process.env.RETAIL_KEY,
      },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url);
      return config
    })

    this.axios.interceptors.response.use(
      (response) => {
        // console.log('Result:', response.data);
        return response
      },
      (error) => {
        // console.log('Error:', error.response.data);
        return error
      },
    )
  }

  async getOrders(page?: number): Promise<[Order[], RetailPagination]> {
    const variables = {
      page,
    }

    const response = await this.axios.post('/graphql', {
      query: `
        query GetOrders($page: Int) {
          getOrders(page: $page) {
            orders {
              number
              id
              site
              createdAt
              status
              delivery {
                code
              }
              items {
                id
                status
                quantity
                offer {
                  externalId
                  displayName
                  article
                }
                comment
              }
            }
            pagination {
              limit
              totalCount
              currentPage
              totalPageCount
            }
          }
        }
      `,
      variables,
    })

    const data = response.data.data.getOrders
    const orders = plainToClass(Order, data.orders as Array<any>)
    const pagination: RetailPagination = data.pagination

    return [orders, pagination]
  }

  async findOrder(number: string): Promise<Order | null> {
    const variables = {
      number,
    }

    const response = await this.axios.post('/graphql', {
      query: `
        query GetOrder($number: String!) {
          order(number: $number) {
            number
            id
            site
            createdAt
            status
            delivery {
              code
            }
            items {
              id
              status
              quantity
              offer {
                externalId
                displayName
                article
              }
              comment
            }
          }
        }
      `,
      variables,
    })

    const data = response.data.data.order
    const order: Order = plainToClass(Order, data)

    return order
  }

  async orderStatuses(): Promise<OrderStatus[]> {
    const response = await this.axios.get('/orderStatuses')
    const statusesOrder: OrderStatus[] = response.data.statuses

    return statusesOrder
  }

  async productStatuses(): Promise<ProductStatus[]> {
    const response = await this.axios.get('/productStatuses')
    const statusesProduct: ProductStatus[] = response.data.statuses

    return statusesProduct
  }

  async deliveryTypes(): Promise<DeliveryType[]> {
    const response = await this.axios.get('/deliveryTypes')
    const typesDelivery: DeliveryType[] = response.data.types

    return typesDelivery
  }
}
