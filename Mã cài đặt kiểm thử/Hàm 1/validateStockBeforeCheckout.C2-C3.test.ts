import {
  type InvoiceForTest,
  validateStockBeforeCheckout,
} from './stock-validation'

describe('validateStockBeforeCheckout - lan 2 - bo ca kiem thu C2/C3', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

  afterEach(() => {
    alertSpy.mockClear()
  })

  afterAll(() => {
    alertSpy.mockRestore()
  })

  test.each([
    {
      path: 'B1',
      title: 'B1 | Khong co hoa don | Ham tra ve True',
      invoices: [] as InvoiceForTest[],
      expected: true,
    },
    {
      path: 'B2',
      title: 'B2 | Hoa don khong co san pham | Ham tra ve True',
      invoices: [{ products: [] }],
      expected: true,
    },
    {
      path: 'B3',
      title: 'B3 | Mot san pham du ton kho | Ham tra ve True',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 5 },
          ],
        },
      ],
      expected: true,
    },
    {
      path: 'B4',
      title: 'B4 | Cung product_id duoc cong don dung va van du ton kho | Ham tra ve True',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 5 },
            { product_id: 'A', product_name: 'A', quantity: 1, stock_quantity: 5 },
          ],
        },
      ],
      expected: true,
    },
    {
      path: 'B5',
      title: 'B5 | Nhieu hoa don, tat ca san pham deu du ton kho | Ham tra ve True',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 5 },
          ],
        },
        {
          products: [
            { product_id: 'B', product_name: 'B', quantity: 1, stock_quantity: 4 },
          ],
        },
      ],
      expected: true,
    },
    {
      path: 'B6',
      title: 'B6 | San pham dau tien thieu ton kho | Ham tra ve False',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 1 },
          ],
        },
      ],
      expected: false,
      expectedAlert:
        'Không đủ tồn kho cho các sản phẩm sau:\n\n- A: Cần 2, chỉ còn 1 trong kho\n\nVui lòng điều chỉnh số lượng hoặc chọn sản phẩm khác.',
    },
    {
      path: 'B7',
      title: 'B7 | Cung hoa don co san pham thieu ton kho | Ham tra ve False',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 5 },
            { product_id: 'B', product_name: 'B', quantity: 4, stock_quantity: 2 },
          ],
        },
      ],
      expected: false,
      expectedAlert:
        'Không đủ tồn kho cho các sản phẩm sau:\n\n- B: Cần 4, chỉ còn 2 trong kho\n\nVui lòng điều chỉnh số lượng hoặc chọn sản phẩm khác.',
    },
    {
      path: 'B8',
      title: 'B8 | Hoa don sau moi phat sinh thieu ton kho | Ham tra ve False',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 5 },
          ],
        },
        {
          products: [
            { product_id: 'B', product_name: 'B', quantity: 4, stock_quantity: 2 },
          ],
        },
      ],
      expected: false,
      expectedAlert:
        'Không đủ tồn kho cho các sản phẩm sau:\n\n- B: Cần 4, chỉ còn 2 trong kho\n\nVui lòng điều chỉnh số lượng hoặc chọn sản phẩm khác.',
    },
    {
      path: 'B9',
      title: 'B9 | Khong truyen quantity nen lay mac dinh 1 va van du ton kho | Ham tra ve True',
      invoices: [
        {
          products: [{ product_id: 'A', product_name: 'A', stock_quantity: 5 }],
        },
      ],
      expected: true,
    },
    {
      path: 'B10',
      title: 'B10 | stock_quantity = null nen lay mac dinh 0 va phat sinh thieu ton kho | Ham tra ve False',
      invoices: [
        {
          products: [{ product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: null }],
        },
      ],
      expected: false,
      expectedAlert:
        'Không đủ tồn kho cho các sản phẩm sau:\n\n- A: Cần 2, chỉ còn 0 trong kho\n\nVui lòng điều chỉnh số lượng hoặc chọn sản phẩm khác.',
    },
  ])('$path - $title', ({ invoices, expected, expectedAlert }) => {
    const result = validateStockBeforeCheckout(invoices)

    expect(result).toBe(expected)

    if (expectedAlert) {
      expect(alertSpy).toHaveBeenCalledWith(expectedAlert)
    } else {
      expect(alertSpy).not.toHaveBeenCalled()
    }
  })
})
