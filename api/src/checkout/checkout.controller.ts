import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';

@ApiTags('checkout')
@Controller('api/checkout/orders')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  startOrder() {
    return this.checkoutService.startOrder();
  }

  @Post(':orderId/items')
  addItem(@Param('orderId') orderId: string, @Body() body: { barcode: string; quantity: number }) {
    return this.checkoutService.addItemToOrder(orderId, body.barcode, body.quantity);
  }

  @Get(':orderId')
  getOrderState(@Param('orderId') orderId: string) {
    return this.checkoutService.getOrderState(orderId);
  }

  @Post(':orderId/pay')
  processPayment(@Param('orderId') orderId: string, @Body() body: { paymentAmount: number }) {
    return this.checkoutService.processPayment(orderId, body.paymentAmount);
  }
}
