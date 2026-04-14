import Product from "../models/product.model.js";

export const addToCart = async (req,res) => {
    try {
        const {productId} = req.body;
        const user = req.user
        const existingProduct = user.cartItems.find(item => item.id.toString() === productId)
        if(existingProduct){
            existingProduct.quantity += 1
        }else{
            user.cartItems.push({ id: productId, quantity: 1 });
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log("error in addToCart")
       res.status(500).json({message: "error to add product in cart"});
    }
}

export const removeAllFromCart = async (req,res) => {
    try {
        const {productId} = req.body;
        const user = req.user;
        if(!productId){
            user.cartItems = []
        }else{
           user.cartItems =  user.cartItems.filter(item => item.id !== productId)
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
         res.status(500).json({message: "error to in cart items"});
    }
}

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // Find product in cart
    const existingProduct = user.cartItems.find(item => item.id === productId);

    if (existingProduct) {
      if (quantity === 0) {
        // Remove product if quantity is 0
        user.cartItems = user.cartItems.filter(item => item.id !== productId);
      } else {
        // Update quantity
        existingProduct.quantity = quantity;
      }

      await user.save();
      res.json(user.cartItems);
    } else {
      res.json({ message: "No product found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating cart items" });
  }
};

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id: {$in: req.user.cartItems}})
        
        //add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id )
            return{...product.toJSON(), quantity: item.quantity}
        })
        res.status(200).json(cartItems)

    } catch (error) {
        res.status(500).json({message: "error to in updating cart items"});
    }
}         
 
