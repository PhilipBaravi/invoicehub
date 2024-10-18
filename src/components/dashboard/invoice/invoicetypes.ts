export interface BusinessInfo {
  name: string
  phone: string
  country: string
  address1: string
  address2: string
  town: string
  state: string
  postalCode: string
  taxName: string
  taxNumber: string
  showPhone: boolean
  showAddress: boolean
  showTax: boolean
}

export interface Client {
  id: number
  name: string
  email: string
}

export interface Tax {
  price: number
  name: string
  number: string
}

export interface InvoiceItem {
  id: number
  name: string
  description: string
  price: number
  qty: number
  taxes: Tax[]
}