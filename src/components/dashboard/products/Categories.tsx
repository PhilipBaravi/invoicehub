import { FC } from "react";

const Categories: FC = () => {
    return(
        <div className="w-full p-6 mx-auto flex flex-col items-start">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
      Categories
            </h1>
            <div className="flex flex-col lg:flex-row gap-[25px] ">
                <div className="w-[300px] h-[300px] flex justify-center items-center">
                    <div className="flex gap-[20px]">
                        <div className="w-[80px] h-[80px] rounded-[50%] bg-black">

                        </div>
                        <div className="flex flex-col items-start gap-[15px]">
                                <h3 className="text-lg font-bold text-stone-950 dark:text-stone-50">Accesorries</h3>
                                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">1 Product</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories