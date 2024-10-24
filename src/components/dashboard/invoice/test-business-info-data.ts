export interface businessInformation  {
    title: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    website: string
}

export interface businessInfoDataProps  {
    data: businessInformation[]
}

const testBusinessInfoData: businessInfoDataProps = {
    data : [
        {
            title: 'Name Of Business',
            addressLine1: 'Adress1',
            addressLine2: 'Address2',
            city: 'City Of Business',
            state: 'State of business',
            zipCode: 'ZipCode Of Business',
            phone: 'Phone Of Business',
            website: 'Website Of Business',
        }
    ]
}

export default testBusinessInfoData

