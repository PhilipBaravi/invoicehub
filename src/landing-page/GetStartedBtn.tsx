import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type GetStartedBtnProps = {
  isVisible: boolean;
};

const GetStartedBtn: FC<GetStartedBtnProps> = ({ isVisible }) => {
  return (
    <Link to="register">
     <Button
      className={`${
        isVisible ? "block" : "hidden"
      } md:block`}
    >
      Get Started
    </Button>
    </Link>
   
  );
};

export default memo(GetStartedBtn);
