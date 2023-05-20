import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'
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
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async getOrders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) {
      throw new Error('RETAIL CRM ERROR: Empty response data')
    }

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrder(id: string): Promise<Order | null> {
    const params = serialize(id, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const order: Order = plainToClass(Order, resp.data.orders)

    return order
  }

  async orderStatuses(): Promise<OrderStatus[]> {
    const resp = await this.axios.get('/orderStatuses')

    if (!resp.data || !resp.data.statuses) {
      throw new Error('RETAIL CRM ERROR: Empty or invalid response data')
    }

    const statusesOrder: OrderStatus[] = resp.data.statuses

    return statusesOrder
  }

  async productStatuses(): Promise<ProductStatus[]> {
    const resp = await this.axios.get('/productStatuses')

    if (!resp.data || !resp.data.statuses) {
      throw new Error('RETAIL CRM ERROR: Empty or invalid response data')
    }

    const statusesProduct: ProductStatus[] = resp.data.statuses

    return statusesProduct
  }

  async deliveryTypes(): Promise<DeliveryType[]> {
    const resp = await this.axios.get('/deliveryTypes')

    if (!resp.data || !resp.data.types) {
      throw new Error('RETAIL CRM ERROR: Empty or invalid response data')
    }

    const typesDelivery: DeliveryType[] = resp.data.types

    return typesDelivery
  }
}
