import { Module } from '@nestjs/common'
import { RetailService } from './retail.service'

@Module({
  imports: [],
  providers: [RetailService],
})
export class RetailModule {}
