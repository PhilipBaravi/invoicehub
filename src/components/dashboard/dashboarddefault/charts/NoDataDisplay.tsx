import React from 'react'
import { PieChartIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const NoDataDisplay: React.FC = () => {
  const { t } = useTranslation('dashboardDefault')
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/10 rounded-lg border border-dashed border-muted">
      <PieChartIcon className="w-16 h-16 mb-4 text-muted-foreground/50" />
      <p className="text-lg font-medium text-muted-foreground">{t('noData')}</p>
      <p className="mt-2 text-sm text-muted-foreground/75">{t('selectOtherOption')}</p>
    </div>
  )
}

