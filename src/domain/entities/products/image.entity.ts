export interface ImageOptions {
  id: number;
  productId?: number;
  imagePath: string;
  alt?: string | null;
  sortOrder: number;
  isMain: boolean;
  createdAt?: Date;
}
export class Image {
  private props: ImageOptions;

  constructor(props: ImageOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get productId(): number | undefined {
    return this.props.productId;
  }

  get imagePath(): string {
    return this.props.imagePath;
  }

  get alt(): string | null | undefined {
    return this.props.alt;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get isMain(): boolean {
    return this.props.isMain;
  }

  get createdAt(): Date  | undefined{
    return this.props.createdAt;
  }

  // Setters (opcionales, solo si piensas modificarlos)
  set alt(value: string | null | undefined) {
    this.props.alt = value;
  }

  set sortOrder(value: number) {
    this.props.sortOrder = value;
  }

  set isMain(value: boolean) {
    this.props.isMain = value;
  }
}
