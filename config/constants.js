module.exports = {
    NOAUTH: [
        "appInitialize",
    ],

    LIST_LIMIT: 10,
    LOCAL_LANG: 'en',

    TOKEN_EXPIRED: 994,
    DATA_MISS: 995,
    NO_DATA: 996,
    SUCCESS: 997,
    AUTH_ERROR: 998,
    EXCEPTION: 999,
    ADDED_TO_CART: 1000,
    ALLREADY_IN_CART: 1001,
    OUT_OF_STOCK: 1002,
    UPDATE_CART: 1003,
    DELETE_CART: 1004,
    USER_NOT_LOGIN: 1005,
    CHECKOUT_SUCCESS: 1006,
    LOGIN_SUCCESS: 1007,


    codes: {
        994: "Token has expired",
        995: "Required data missing",
        996: "No data found",
        997: "Success",
        998: "Authentication error!",
        999: "Something went wrong!",
        1000: "Product added successfully",
        1001: "Product already in cart",
        1002: "Product out of stock",
        1003: "Cart updated successfully",
        1004: "Product removed successfully from cart",
        1005: "User not login",
        1006: "Checkout successfully",
        1007: "Login successfully",
    }

}