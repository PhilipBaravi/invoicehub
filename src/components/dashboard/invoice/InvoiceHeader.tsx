import { FC, useRef } from "react"
import { BusinessInfo } from "./invoicetypes"

interface InvoiceHeaderProps {
  logo: string | null
  setLogo: React.Dispatch<React.SetStateAction<string | null>>
  businessInfo: BusinessInfo
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>
}

const InvoiceHeader: FC<InvoiceHeaderProps> = ({
  logo,
  setLogo,
  businessInfo,
  setBusinessInfo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="mb-4 flex justify-between items-start">
      <div
        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {logo ? (
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        ) : (
          <span className="text-sm text-gray-500 w-[80%] text-center">
            Select a file
          </span>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleLogoUpload}
        accept="image/*"
      />
      <div>
        <p>{businessInfo.name}</p>
        {businessInfo.showPhone && <p>{businessInfo.phone}</p>}
        <p>{businessInfo.country}</p>
      </div>
    </div>
  )
}

export default InvoiceHeader