export interface AgeOptions {
  id: number;
  range: string;
}

export class Age {
  private props: AgeOptions;

  constructor(props: AgeOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get range(): string {
    return this.props.range;
  }

  // Setters
  set range(value: string) {
    this.props.range = value;
  }
}
