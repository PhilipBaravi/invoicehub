import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type GetStartedBtnProps = {
  isVisible: boolean;
};

const GetStartedBtn: FC<GetStartedBtnProps> = ({ isVisible }) => {
  const { t } = useTranslation('landingPage')
  return (
    <Link to="register">
     <Button
      className={`${
        isVisible ? "block" : "hidden"
      } md:block`}
    >
      {t('main.btn')}
    </Button>
    </Link>
   
  );
};

export default memo(GetStartedBtn);
