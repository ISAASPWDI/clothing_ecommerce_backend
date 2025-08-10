export interface DetailOptions {
  id: number;
  key: string;
  value?: string | null;
}
export class Detail {
  private props: DetailOptions;

  constructor(props: DetailOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get key(): string {
    return this.props.key;
  }

  get value(): string | null | undefined {
    return this.props.value;
  }

  // Setters
  set key(newKey: string) {
    this.props.key = newKey;
  }

  set value(newValue: string | null | undefined) {
    this.props.value = newValue;
  }
}
