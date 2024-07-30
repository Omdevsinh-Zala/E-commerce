import { Products } from "../product/products";

export interface UserCart {
    products: Products[],
    user: string | unknown,
    completeOrder: false
}
