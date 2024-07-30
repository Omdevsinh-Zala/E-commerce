export interface ReciveData {
    limit: number
    products: Products[]
    skip: number
    total: number
}

export interface Products {
    id: string,
    title: string,
    description: string,
    category: string,
    price: number,
    discountPercentage: number,
    rating: number,
    stock: number,
    tags: string[],
    brand: string,
    sku: string,
    weight: number,
    dimensions: dimensions,
    warrantyInformation: string,
    shippingInformation: string,
    availabilityStatus: string,
    reviews: reviews[],
    returnPolicy: string,
    minimumOrderQuantity: number,
    meta: meta,
    images: string[],
    thumbnail: string,
    quantity:number
}

interface dimensions {
    width: number,
    height: number,
    depth: number
}

interface reviews {
    rating: number,
    comment: string,
    date: string,
    reviewerName: string,
    reviewerEmail: string
}

interface meta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}