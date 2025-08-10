export class SizeResponseDTO {
  id: number;
  size: string;
  
  constructor(size: any) {
    this.id = size.id;
    this.size = size.size;
  }
}