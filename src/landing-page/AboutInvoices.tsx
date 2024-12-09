import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PlusCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutInvoices: FC = () => {
  const { t } = useTranslation('landingPage');
  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="space-y-24">
          {/* Generate Invoices Section */}
          <AnimatedSection className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <motion.h3 
                className="text-3xl font-semibold mb-4 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t('section.generate')}
              </motion.h3>
              <motion.p 
                className="text-lg mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('section.generateText')}
              </motion.p>
              <Link to="register">
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <PlusCircle className="w-4 h-4" />
                  {t('section.generateBtn')}
                </Button>
              </motion.div>
              </Link>
            </div>
            <motion.div 
              className="w-full md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img
                    src="/images/invoiceGeneration.png"
                    alt="Invoice generation interface"
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>

          {/* Manage Invoices Section */}
          <AnimatedSection className="flex flex-col md:flex-row-reverse items-center gap-8" delay={0.2}>
            <div className="w-full md:w-1/2">
              <motion.h3 
                className="text-3xl font-semibold mb-4 tracking-tight"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t('section.product')}
              </motion.h3>
              <motion.p 
                className="text-lg mb-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('section.productText')}
              </motion.p>
              <motion.div 
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="hover:scale-105 transition-transform">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{t('section.total')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">152</p>
                  </CardContent>
                </Card>
                <Card className="hover:scale-105 transition-transform">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{t('section.active')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">128</p>
                  </CardContent>
                </Card>
                <Card className="hover:scale-105 transition-transform">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{t('section.draft')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-600">24</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img
                    src="/images/productManagement.png"
                    alt="Invoice management dashboard"
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>

          {/* Track Invoices Section */}
          <AnimatedSection className="flex flex-col md:flex-row items-center gap-8" delay={0.4}>
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <motion.h3 
                className="text-3xl font-semibold mb-4 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t('section.tracking')}
              </motion.h3>
              <motion.p 
                className="text-lg mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('section.trackingText')}
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="register">
                <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <CheckCircle className="w-4 h-4" />
                  {t('section.trackingBtn')}
                </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              className="w-full md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img
                    src="/images/track.png"
                    alt="Invoice tracking and analytics"
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>
        </div>
        {/* Call to Action */}
        <AnimatedSection className="relative flex items-center pt-24" delay={0.6}>
          <div className="mx-auto max-w-7xl px-2 lg:px-4">
            <motion.div 
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-poppins text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl dark:text-stone-50">
                {t('footer.more')}
              </h1>
              <motion.div 
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="register">
                <Button 
                  size="lg" 
                  className="group hover:scale-105 transition-transform"
                >
                  {t('footer.btn')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutInvoices;