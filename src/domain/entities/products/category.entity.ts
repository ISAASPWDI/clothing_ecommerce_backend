export interface CategoryOptions {
    id: number;
    name: string;
    slug: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
}

export class Category {
    private props: CategoryOptions;

    constructor(props: CategoryOptions) {
        this.props = props;
    }
    // Getters
    get id(): number {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get slug(): string {
        return this.props.slug;
    }

    get metaTitle(): string | null | undefined {
        return this.props.metaTitle;
    }

    get metaDescription(): string | null | undefined {
        return this.props.metaDescription;
    }

    get metaKeywords(): string | null | undefined {
        return this.props.metaKeywords;
    }

    // Setters 
    set name(value: string) {
        this.props.name = value;
    }

    set slug(value: string) {
        this.props.slug = value;
    }

    set metaTitle(value: string | undefined) {
        this.props.metaTitle = value;
    }

    set metaDescription(value: string | undefined) {
        this.props.metaDescription = value;
    }

    set metaKeywords(value: string | undefined) {
        this.props.metaKeywords = value;
    }

}