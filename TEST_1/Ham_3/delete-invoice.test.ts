import {
  deleteInvoice,
  type DeleteInvoiceDepsForTest,
  type InvoiceForDeleteTest,
} from './delete-invoice'

interface ExecuteDeleteInvoiceArgs {
  index: number
  invoices: InvoiceForDeleteTest[]
  activeInvoiceIndex: number
}

function executeDeleteInvoice({
  index,
  invoices,
  activeInvoiceIndex,
}: ExecuteDeleteInvoiceArgs) {
  const stopPropagation = jest.fn()
  const setInvoices = jest.fn()
  const setActiveInvoiceIndex = jest.fn()
  const setQuantityErrors = jest.fn()
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

  const deps: DeleteInvoiceDepsForTest = {
    invoices,
    activeInvoiceIndex,
    setInvoices,
    setActiveInvoiceIndex,
    setQuantityErrors,
  }

  deleteInvoice(index, { stopPropagation }, deps)

  return {
    stopPropagation,
    setInvoices,
    setActiveInvoiceIndex,
    setQuantityErrors,
    alertSpy,
  }
}

describe('deleteInvoice', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test.each([
    {
      testcase: 'B1',
      title:
        'B1 | invoices.length = 1 | Hi\u1ec3n th\u1ecb alert v\u00e0 k\u1ebft th\u00fac h\u00e0m',
      input: {
        index: 0,
        invoices: [{ id: 'INV-01' }],
        activeInvoiceIndex: 0,
      },
      verify(result: ReturnType<typeof executeDeleteInvoice>) {
        expect(result.stopPropagation).toHaveBeenCalledTimes(1)
        expect(result.alertSpy).toHaveBeenCalledWith(
          'Kh\u00f4ng th\u1ec3 x\u00f3a h\u00f3a \u0111\u01a1n cu\u1ed1i c\u00f9ng'
        )
        expect(result.setInvoices).not.toHaveBeenCalled()
        expect(result.setActiveInvoiceIndex).not.toHaveBeenCalled()
        expect(result.setQuantityErrors).not.toHaveBeenCalled()
      },
    },
    {
      testcase: 'B2',
      title:
        'B2 | invoices.length > 1; index = activeInvoiceIndex | X\u00f3a h\u00f3a \u0111\u01a1n v\u00e0 \u0111\u1eb7t activeInvoiceIndex = 0',
      input: {
        index: 1,
        invoices: [{ id: 'INV-01' }, { id: 'INV-02' }, { id: 'INV-03' }],
        activeInvoiceIndex: 1,
      },
      verify(result: ReturnType<typeof executeDeleteInvoice>) {
        expect(result.stopPropagation).toHaveBeenCalledTimes(1)
        expect(result.alertSpy).not.toHaveBeenCalled()
        expect(result.setInvoices).toHaveBeenCalledWith([{ id: 'INV-01' }, { id: 'INV-03' }])
        expect(result.setActiveInvoiceIndex).toHaveBeenCalledWith(0)
        expect(result.setQuantityErrors).toHaveBeenCalledWith({})
      },
    },
    {
      testcase: 'B3',
      title:
        'B3 | invoices.length > 1; index < activeInvoiceIndex | X\u00f3a h\u00f3a \u0111\u01a1n v\u00e0 gi\u1ea3m activeInvoiceIndex \u0111i 1',
      input: {
        index: 0,
        invoices: [{ id: 'INV-01' }, { id: 'INV-02' }, { id: 'INV-03' }],
        activeInvoiceIndex: 2,
      },
      verify(result: ReturnType<typeof executeDeleteInvoice>) {
        expect(result.stopPropagation).toHaveBeenCalledTimes(1)
        expect(result.alertSpy).not.toHaveBeenCalled()
        expect(result.setInvoices).toHaveBeenCalledWith([{ id: 'INV-02' }, { id: 'INV-03' }])
        expect(result.setActiveInvoiceIndex).toHaveBeenCalledWith(1)
        expect(result.setQuantityErrors).toHaveBeenCalledWith({})
      },
    },
    {
      testcase: 'B4',
      title:
        'B4 | invoices.length > 1; index > activeInvoiceIndex | X\u00f3a h\u00f3a \u0111\u01a1n v\u00e0 gi\u1eef nguy\u00ean activeInvoiceIndex',
      input: {
        index: 2,
        invoices: [{ id: 'INV-01' }, { id: 'INV-02' }, { id: 'INV-03' }],
        activeInvoiceIndex: 0,
      },
      verify(result: ReturnType<typeof executeDeleteInvoice>) {
        expect(result.stopPropagation).toHaveBeenCalledTimes(1)
        expect(result.alertSpy).not.toHaveBeenCalled()
        expect(result.setInvoices).toHaveBeenCalledWith([{ id: 'INV-01' }, { id: 'INV-02' }])
        expect(result.setActiveInvoiceIndex).not.toHaveBeenCalled()
        expect(result.setQuantityErrors).toHaveBeenCalledWith({})
      },
    },
  ])('$title', ({ input, verify }) => {
    const result = executeDeleteInvoice(input)
    verify(result)
  })
})
