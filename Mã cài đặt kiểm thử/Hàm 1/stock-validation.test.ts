import {
  type InvoiceForTest,
  validateStockBeforeCheckout,
} from './stock-validation'

describe('validateStockBeforeCheckout', () => {
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
      title: 'B1 | Kh\u00f4ng c\u00f3 h\u00f3a \u0111\u01a1n | H\u00e0m tr\u1ea3 v\u1ec1 True',
      invoices: [] as InvoiceForTest[],
      expected: true,
    },
    {
      path: 'B2',
      title: 'B2 | H\u00f3a \u0111\u01a1n kh\u00f4ng c\u00f3 s\u1ea3n ph\u1ea9m | H\u00e0m tr\u1ea3 v\u1ec1 True',
      invoices: [{ products: [] }],
      expected: true,
    },
    {
      path: 'B3',
      title: 'B3 | M\u1ed9t s\u1ea3n ph\u1ea9m \u0111\u1ee7 t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 True',
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
      title:
        'B4 | C\u00f9ng product_id \u0111\u01b0\u1ee3c c\u1ed9ng d\u1ed3n \u0111\u00fang v\u00e0 v\u1eabn \u0111\u1ee7 t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 True',
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
      title:
        'B5 | Nhi\u1ec1u h\u00f3a \u0111\u01a1n, t\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m \u0111\u1ec1u \u0111\u1ee7 t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 True',
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
      title: 'B6 | S\u1ea3n ph\u1ea9m \u0111\u1ea7u ti\u00ean thi\u1ebfu t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 False',
      invoices: [
        {
          products: [
            { product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: 1 },
          ],
        },
      ],
      expected: false,
      expectedAlert:
        'Kh\u00f4ng \u0111\u1ee7 t\u1ed3n kho cho c\u00e1c s\u1ea3n ph\u1ea9m sau:\n\n- A: C\u1ea7n 2, ch\u1ec9 c\u00f2n 1 trong kho\n\nVui l\u00f2ng \u0111i\u1ec1u ch\u1ec9nh s\u1ed1 l\u01b0\u1ee3ng ho\u1eb7c ch\u1ecdn s\u1ea3n ph\u1ea9m kh\u00e1c.',
    },
    {
      path: 'B7',
      title:
        'B7 | C\u00f9ng h\u00f3a \u0111\u01a1n c\u00f3 s\u1ea3n ph\u1ea9m thi\u1ebfu t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 False',
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
        'Kh\u00f4ng \u0111\u1ee7 t\u1ed3n kho cho c\u00e1c s\u1ea3n ph\u1ea9m sau:\n\n- B: C\u1ea7n 4, ch\u1ec9 c\u00f2n 2 trong kho\n\nVui l\u00f2ng \u0111i\u1ec1u ch\u1ec9nh s\u1ed1 l\u01b0\u1ee3ng ho\u1eb7c ch\u1ecdn s\u1ea3n ph\u1ea9m kh\u00e1c.',
    },
    {
      path: 'B8',
      title:
        'B8 | H\u00f3a \u0111\u01a1n sau m\u1edbi ph\u00e1t sinh thi\u1ebfu t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 False',
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
        'Kh\u00f4ng \u0111\u1ee7 t\u1ed3n kho cho c\u00e1c s\u1ea3n ph\u1ea9m sau:\n\n- B: C\u1ea7n 4, ch\u1ec9 c\u00f2n 2 trong kho\n\nVui l\u00f2ng \u0111i\u1ec1u ch\u1ec9nh s\u1ed1 l\u01b0\u1ee3ng ho\u1eb7c ch\u1ecdn s\u1ea3n ph\u1ea9m kh\u00e1c.',
    },
    {
      path: 'B9',
      title:
        'B9 | Kh\u00f4ng truy\u1ec1n quantity n\u00ean l\u1ea5y m\u1eb7c \u0111\u1ecbnh 1 v\u00e0 v\u1eabn \u0111\u1ee7 t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 True',
      invoices: [
        {
          products: [{ product_id: 'A', product_name: 'A', stock_quantity: 5 }],
        },
      ],
      expected: true,
    },
    {
      path: 'B10',
      title:
        'B10 | stock_quantity = null n\u00ean l\u1ea5y m\u1eb7c \u0111\u1ecbnh 0 v\u00e0 ph\u00e1t sinh thi\u1ebfu t\u1ed3n kho | H\u00e0m tr\u1ea3 v\u1ec1 False',
      invoices: [
        {
          products: [{ product_id: 'A', product_name: 'A', quantity: 2, stock_quantity: null }],
        },
      ],
      expected: false,
      expectedAlert:
        'Kh\u00f4ng \u0111\u1ee7 t\u1ed3n kho cho c\u00e1c s\u1ea3n ph\u1ea9m sau:\n\n- A: C\u1ea7n 2, ch\u1ec9 c\u00f2n 0 trong kho\n\nVui l\u00f2ng \u0111i\u1ec1u ch\u1ec9nh s\u1ed1 l\u01b0\u1ee3ng ho\u1eb7c ch\u1ecdn s\u1ea3n ph\u1ea9m kh\u00e1c.',
    },
  ])('$title', ({ invoices, expected, expectedAlert }) => {
    const result = validateStockBeforeCheckout(invoices)

    expect(result).toBe(expected)

    if (expectedAlert) {
      expect(alertSpy).toHaveBeenCalledWith(expectedAlert)
    } else {
      expect(alertSpy).not.toHaveBeenCalled()
    }
  })
})
