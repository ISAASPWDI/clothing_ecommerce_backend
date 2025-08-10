export interface SizeOptions {
  id: number;
  size: string;
}

export class Size {
  private props: SizeOptions;

  constructor(props: SizeOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get size(): string {
    return this.props.size;
  }

  // Setters
  set size(value: string) {
    this.props.size = value;
  }
}
