import { FC } from "react";

const RotationMessage: FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-stone-900 dark:to-stone-950 p-4 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
    <div className="relative z-10 max-w-md w-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 ease-in-out hover:shadow-xl">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl animate-pulse"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-primary animate-[spin_3s_ease-in-out_infinite]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-stone-800 dark:text-white">
        Please Rotate Your Device
      </h2>
      <p className="text-base text-stone-600 dark:text-stone-300 mb-6">
        For the best experience, please use landscape orientation on your mobile
        device.
      </p>
      <div className="flex justify-center items-center space-x-2">
        <div className="w-12 h-20 border-2 border-stone-300 dark:border-stone-600 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-16 bg-stone-200 dark:bg-stone-700 rounded"></div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary animate-[bounce_1s_ease-in-out_infinite]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <div className="w-20 h-12 border-2 border-stone-300 dark:border-stone-600 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-stone-200 dark:bg-stone-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default RotationMessage;
