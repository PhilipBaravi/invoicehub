import { FC } from 'react';
import AboutDataFirstChart from './AboutDataFirstChart';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

const DataVisualizationShowcase: FC = () => {
  const { t } = useTranslation('landingPage')
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="py-12 w-full"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="font-poppins text-[1.8rem] leading-large font-bold text-center mb-8 tracking-tight"
        >
          {t('aboutData.title')}
        </motion.h2>
        <motion.div
          variants={itemVariants}
          className="transform-gpu"
        >
          <AboutDataFirstChart />
        </motion.div>
      </div>

      {/* Background decoration */}
      <motion.div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-stone-200 to-stone-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default DataVisualizationShowcase;