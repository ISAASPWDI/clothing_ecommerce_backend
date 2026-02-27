
export class OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;

  constructor(props: OrderItem) {

    if (!props.productId) throw new Error("OrderItem: productId is required");
    if (!props.name) throw new Error("OrderItem: name is required");
    if (!props.quantity) throw new Error("OrderItem: quantity is required");
    if (props.price === undefined) throw new Error("OrderItem: price is required");
    
    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.name = props.name;
    this.quantity = props.quantity;
    this.price = props.price;
    this.selectedColor = props.selectedColor;
    this.selectedSize = props.selectedSize;
  }
}