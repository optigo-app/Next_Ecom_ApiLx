// Central registry for static theme .
export async function resolveHome(themePage) {
  console.log(themePage , "themePage")
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/home/page.jsx")).default;
      case "julian.web":
        return (await import("@/app/theme/julian.web/home/page.jsx")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/home/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/home/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/home/page.jsx")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/home/page.jsx")).default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/home/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/home/page.jsx")).default;
  }
}

export async function resolveProductList(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/product/page.jsx"))
        .default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/product/page.jsx")).default;
    case "nxtelvee.web":
      case "elvee.web":
      
      return (await import("@/app/theme/elvee.web/product/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/product/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/product/page.jsx")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/product/page.jsx"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/product/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/product/page.jsx"))
        .default;
  }
}

export async function resolveProductDetail(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/detail/page.jsx"))
        .default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/detail/page.jsx")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/detail/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/detail/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/detail/page.jsx")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/detail/page.jsx")).default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/detail/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/detail/page.jsx"))
        .default;
  }
}

export async function resolveCart(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/cart/page.jsx")).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/cart/page.jsx")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/cart/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/cart/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/cart/page.jsx")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/cart/page.jsx")).default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/cart/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/cart/page.jsx")).default;
  }
}

export async function resolveWishlist(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/Wishlist/page.js"))
        .default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Wishlist/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Wishlist/page.js")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/Wishlist/page.js"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/Wishlist/page.js")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/Wishlist/page.js"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Wishlist/page.js")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/Wishlist/page.js"))
        .default;
  }
}

export async function resolveLoginWithEmail(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithEmail/page.js")
      ).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/LoginWithEmail/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Auth/LoginWithEmail/page.js"))
        .default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/LoginWithEmail/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/LoginWithEmail/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/LoginWithEmail/page.js")
      ).default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Auth/LoginWithEmail/page.js"))
        .default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithEmail/page.js")
      ).default;
  }
}

export async function resolveRegister(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/Auth/Register/page.js"))
        .default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/Register/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Auth/Register/page.js"))
        .default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/Auth/Register/page.js"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/Auth/Register/page.js"))
        .default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/Auth/Register/page.js"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Auth/Register/page.js"))
        .default;
    default:
      return (await import("@/app/theme/beluxjewel.web/Auth/Register/page.js"))
        .default;
  }
}

export async function resolveLoginOption(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginOption/page.js")
      ).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/LoginOption/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Auth/LoginOption/page.js"))
        .default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/LoginOption/page.js")
      ).default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/Auth/LoginOption/page.js"))
        .default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/Auth/LoginOption/page.js"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Auth/LoginOption/page.js"))
        .default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginOption/page.js")
      ).default;
  }
}

export async function resolveLoginWithMobileCode(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithMobileCode/page.js")
      ).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/LoginWithMobileCode/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (
        await import("@/app/theme/elvee.web/Auth/LoginWithMobileCode/page.js")
      ).default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/LoginWithMobileCode/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/LoginWithMobileCode/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/LoginWithMobileCode/page.js")
      ).default;
    case "hoq.web":
      return (
        await import("@/app/theme/hoq.web/Auth/LoginWithMobileCode/page.js")
      ).default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithMobileCode/page.js")
      ).default;
  }
}

export async function resolveLoginWithEmailCode(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithEmailCode/page.js")
      ).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/LoginWithEmailCode/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (
        await import("@/app/theme/elvee.web/Auth/LoginWithEmailCode/page.js")
      ).default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/LoginWithEmailCode/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/LoginWithEmailCode/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/LoginWithEmailCode/page.js")
      ).default;
    case "hoq.web":
      return (
        await import("@/app/theme/hoq.web/Auth/LoginWithEmailCode/page.js")
      ).default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/LoginWithEmailCode/page.js")
      ).default;
  }
}

export async function resolveForgotPassword(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ForgotPassword/page.js")
      ).default;
        case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/ForgotPassword/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Auth/ForgotPassword/page.js"))
        .default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/ForgotPassword/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/ForgotPassword/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/ForgotPassword/page.js")
      ).default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Auth/ForgotPassword/page.js"))
        .default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ForgotPassword/page.js")
      ).default;
  }
}

export async function resolveContinueWithEmail(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ContinueWithEmail/page.js")
      ).default;
      case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/ContinueWithEmail/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (
        await import("@/app/theme/elvee.web/Auth/ContinueWithEmail/page.js")
      ).default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/ContinueWithEmail/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/ContinueWithEmail/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/ContinueWithEmail/page.js")
      ).default;
    case "hoq.web":
      return (
        await import("@/app/theme/hoq.web/Auth/ContinueWithEmail/page.js")
      ).default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ContinueWithEmail/page.js")
      ).default;
  }
}

export async function resolveContinueWithMobile(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ContinueWithMobile/page.js")
      ).default;
      case "julian.web":
        return (await import("@/app/theme/julian.web/Auth/ContinueWithMobile/page.js")).default;
    case "nxtelvee.web":
      case "elvee.web":
      return (
        await import("@/app/theme/elvee.web/Auth/ContinueWithMobile/page.js")
      ).default;
    case "diamondtine.web":
      return (
        await import("@/app/theme/diamondtine.web/Auth/ContinueWithMobile/page.js")
      ).default;
    case "fgstore.web":
      return (
        await import("@/app/theme/fgstore.web/Auth/ContinueWithMobile/page.js")
      ).default;
    case "fgstore.mapp":
      return (
        await import("@/app/theme/fgstore.mapp/Auth/ContinueWithMobile/page.js")
      ).default;
    case "hoq.web":
      return (
        await import("@/app/theme/hoq.web/Auth/ContinueWithMobile/page.js")
      ).default;
    default:
      return (
        await import("@/app/theme/beluxjewel.web/Auth/ContinueWithMobile/page.js")
      ).default;
  }
}

export async function resolveConfirmation(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/confirmation/page.jsx"))
        .default;
        case "julian.web":
          return (await import("@/app/theme/julian.web/confirmation/page.jsx")).default; 
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/confirmation/page.jsx"))
        .default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/confirmation/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/confirmation/page.jsx"))
        .default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/confirmation/page.jsx"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/confirmation/page.jsx"))
        .default;
    default:
      return (await import("@/app/theme/beluxjewel.web/confirmation/page.jsx"))
        .default;
  }
}

export async function resolveLookbook(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/Lookbook/page.js"))
        .default;
        case "julian.web":
          return (await import("@/app/theme/julian.web/Lookbook/page.js")).default; 
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/Lookbook/page.js")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/Lookbook/page.js"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/Lookbook/page.js")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/Lookbook/page.js"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/Lookbook/page.js")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/Lookbook/page.js"))
        .default;
  }
}

export async function resolvePayment(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/payment/page.jsx"))
        .default;
        case "julian.web":
          return (await import("@/app/theme/julian.web/payment/page.jsx")).default; 
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/payment/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/payment/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/payment/page.jsx")).default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/payment/page.jsx"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/payment/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/payment/page.jsx"))
        .default;
  }
}

export async function resolveDelivery(themePage) {
  switch (themePage) {
    case "beluxjewel.web":
      return (await import("@/app/theme/beluxjewel.web/delivery/page.jsx"))
        .default;
        case "julian.web":
          return (await import("@/app/theme/julian.web/delivery/page.jsx")).default; 
    case "nxtelvee.web":
      case "elvee.web":
      return (await import("@/app/theme/elvee.web/delivery/page.jsx")).default;
    case "diamondtine.web":
      return (await import("@/app/theme/diamondtine.web/delivery/page.jsx"))
        .default;
    case "fgstore.web":
      return (await import("@/app/theme/fgstore.web/delivery/page.jsx"))
        .default;
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/delivery/page.jsx"))
        .default;
    case "hoq.web":
      return (await import("@/app/theme/hoq.web/delivery/page.jsx")).default;
    default:
      return (await import("@/app/theme/beluxjewel.web/delivery/page.jsx"))
        .default;
  }
}

export async function resolveMenu(themePage) {
  switch (themePage) {
    case "fgstore.mapp":
      return (await import("@/app/theme/fgstore.mapp/Menu/page.js")).default;
    default:
      return (await import("@/app/theme/fgstore.mapp/Menu/page.js")).default;
  }
}
