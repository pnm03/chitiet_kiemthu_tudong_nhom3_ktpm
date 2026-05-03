export interface ProductInOrderForTest {
  product_id: string
  product_name: string
  quantity?: number
  stock_quantity?: number | null
}

export interface InvoiceForTest {
  products: ProductInOrderForTest[]
}

export const validateStockBeforeCheckout = (invoices: InvoiceForTest[]) => {
  // Tạo một Map để theo dõi tổng số lượng cần mua cho mỗi sản phẩm
  const productQuantities = new Map()

  // Tính tổng số lượng cần mua cho mỗi sản phẩm
  for (const invoice of invoices) {
    for (const product of invoice.products) {
      const productId = product.product_id
      const quantity = product.quantity || 1

      if (productQuantities.has(productId)) {
        productQuantities.set(productId, productQuantities.get(productId) + quantity)
      } else {
        productQuantities.set(productId, quantity)
      }
    }
  }

  // Kiểm tra tồn kho cho từng sản phẩm
  let hasStockError = false
  const stockErrors = []

  for (const invoice of invoices) {
    for (const product of invoice.products) {
      const productId = product.product_id
      const totalQuantity = productQuantities.get(productId)
      const stockQuantity = product.stock_quantity || 0

      if (totalQuantity > stockQuantity) {
        hasStockError = true
        stockErrors.push({
          productId,
          productName: product.product_name,
          required: totalQuantity,
          available: stockQuantity,
        })
      }
    }
  }

  // Hiển thị thông báo lỗi nếu có sản phẩm vượt quá tồn kho
  if (hasStockError) {
    let errorMessage = 'Không đủ tồn kho cho các sản phẩm sau:\n\n'

    stockErrors.forEach((error) => {
      errorMessage += `- ${error.productName}: Cần ${error.required}, chỉ còn ${error.available} trong kho\n`
    })

    errorMessage += '\nVui lòng điều chỉnh số lượng hoặc chọn sản phẩm khác.'

    alert(errorMessage)
    return false
  }

  return true
}
