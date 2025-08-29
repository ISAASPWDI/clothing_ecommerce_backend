export interface GenreOptions {
    id: number;
    genre: string;
}
export class Genre {
  private props: GenreOptions;

  constructor(props: GenreOptions) {
    this.props = props;
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get genre(): string {
    return this.props.genre;
  }

  // Setters
  set genre(value: string) {
    this.props.genre = value;
  }
}

  

  