import { FC, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LanguageSelector: FC = () => {
    const [language, setLanguage] = useState("en");
    return(
        <Select onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] bg-white dark:bg-stone-800">
              <SelectValue placeholder={language === "en" ? "English" : language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
    )
}

export default LanguageSelector