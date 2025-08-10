export interface ColorOptions {
  id: number;
  color: string;
}

export class Color {
  private props: ColorOptions;

  constructor(props: ColorOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get color(): string {
    return this.props.color;
  }

  // Setters
  set color(value: string) {
    this.props.color = value;
  }
}
