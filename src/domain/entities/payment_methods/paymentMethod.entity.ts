// src/domain/entities/paymentMethod.entity.ts

export class PaymentMethod {
  id: number;
  name: string;
  description?: string;
  code?: string;
  settings?: string;

  constructor(props: PaymentMethod) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.code = props.code;
    this.settings = props.settings;
  }
}
