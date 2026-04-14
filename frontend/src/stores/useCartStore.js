import { create } from "zustand"
import { toast } from "react-hot-toast"
import axios from "../lib/axios"


export const useCartStore = create((set, get) => ({

    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    isCouponApplied: false,

    getMyCoupon: async ()=> {
        try {
            const response = await axios.get("/coupon")
            set({coupon: response.data})
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error to get Coupon")
        }
    },

    applyCoupon: async (code)=> {
        try {
            const response = await axios.post("/coupon/validate", {code})
            set({coupon: response.data, isCouponApplied: true})
            get().calculateTotals()
            toast.success("Coupon applied successfully")
        } catch (error) {
            toast.error(error?.response?.data?.message|| "Error to apply coupon")
        }

    },

    removeCoupon: async () => {
        set({coupon: null, isCouponApplied: false})
        get().calculateTotals()
        toast.success("coupon removed successfully")

    },

    getCartItems: async () => {
        try {
            const response = await axios.get("/cart")
            set({ cart: response.data })
            get().calculateTotals()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error to get Cart items")
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }
        set({ subtotal, total });
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete("/cart", { data: { productId } })
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }))
            get().calculateTotals()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error to delete.")
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            if (quantity === 0) {
                get().removeFromCart(productId);
                return;
            }
            await axios.put(`/cart/:${productId}`, { quantity })
            set((prevState) => ({
                cart: prevState.cart.map(
                    (item) => item._id == productId ? { ...item, quantity } : item)
            }))
            get().calculateTotals()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error to updateQuantity.")
        }
    },

    clearCart: async ()=> {
        set({cart: [], total: 0, subTotal: 0})
    }


}))