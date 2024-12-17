import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutAi: FC = () => {
  const { t } = useTranslation('landingPage')
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t('aboutAI.title')}</span>
            </motion.div>
          </motion.div>
        </AnimatedSection>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Right Column - Chat Interface */}
          <div className="w-full md:w-1/2">
            <AnimatedSection delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Bot className="w-6 h-6 text-primary" />
                      <span className="font-semibold">{t('aboutAI.aiAssistant')}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Bot className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <p className="text-sm bg-secondary/50 rounded-lg p-3">
                          {t('aboutAI.aiMsg')}
                        </p>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <p className="text-sm bg-primary/10 rounded-lg p-3">
                          {t('aboutAI.userMsg')}
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Bot className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <p className="text-sm bg-secondary/50 rounded-lg p-3">
                          {t('aboutAI.aiResponse')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Left Column - Content */}
          <div className="w-full md:w-1/2">
            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold tracking-tight mb-6">
                  {t('aboutAI.name')}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                 {t('aboutAI.about')}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8"
                >
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="group"
                    >
                      {t('aboutAI.try')}
                      <Bot className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAi;