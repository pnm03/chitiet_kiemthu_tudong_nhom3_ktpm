export interface InvoiceForDeleteTest {
  id: string
}

export interface DeleteInvoiceEventForTest {
  stopPropagation: () => void
}

export interface DeleteInvoiceDepsForTest {
  invoices: InvoiceForDeleteTest[]
  activeInvoiceIndex: number
  setInvoices: (invoices: InvoiceForDeleteTest[]) => void
  setActiveInvoiceIndex: (index: number) => void
  setQuantityErrors: (errors: Record<string, string>) => void
}

export const deleteInvoice = (
  index: number,
  event: DeleteInvoiceEventForTest,
  {
    invoices,
    activeInvoiceIndex,
    setInvoices,
    setActiveInvoiceIndex,
    setQuantityErrors,
  }: DeleteInvoiceDepsForTest
) => {
  event.stopPropagation()

  if (invoices.length <= 1) {
    alert('Kh\u00f4ng th\u1ec3 x\u00f3a h\u00f3a \u0111\u01a1n cu\u1ed1i c\u00f9ng')
    return
  }

  const updatedInvoices = [...invoices]
  updatedInvoices.splice(index, 1)
  setInvoices(updatedInvoices)

  if (index === activeInvoiceIndex) {
    setActiveInvoiceIndex(0)
  } else if (index < activeInvoiceIndex) {
    setActiveInvoiceIndex(activeInvoiceIndex - 1)
  }

  setQuantityErrors({})
}
