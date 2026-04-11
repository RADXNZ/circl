import React, { useState } from 'react';
import { Shield, EyeOff, Search, ChevronDown, ChevronUp, Zap, Settings, Mail, FileJson } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { lang } = useLanguage();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const t = (key: any) => getTranslation(lang, key);

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6')
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="landing-page fade-in">
      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center text-center mt-8 mb-16">
        <h1 style={{ marginBottom: '1.25rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          {t('hero.title')} <span className="gradient-text">Circl</span>.
        </h1>
        <p className="text-secondary" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: 600, marginBottom: '2.5rem', lineHeight: 1.6 }}>
          {t('hero.subtitle')}
        </p>
        <button 
          className="btn-primary" 
          style={{ 
            padding: 'clamp(0.9rem, 3vw, 1.25rem) clamp(2rem, 6vw, 3.5rem)', 
            fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
            borderRadius: '100px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            boxShadow: '0 8px 30px rgba(29, 158, 117, 0.3)' 
          }} 
          onClick={onStart}
        >
          <Zap size={20} />
          <span>{t('hero.cta')}</span>
        </button>
      </section>

      {/* Features Section */}
      <section className="features-section mb-16">
        <div className="text-center mb-10">
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('features.title')}</h2>
          <p className="text-secondary">{t('features.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="feature-card glass-panel" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '20px' }}>
            <div className="icon-wrapper bg-card outline-border mb-5" style={{ width: 56, height: 56, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EyeOff size={28} color="var(--primary-color)" />
            </div>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '0.75rem', fontWeight: 600 }}>{t('features.feat1Title')}</h3>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>
              {t('features.feat1Desc')}
            </p>
          </div>

          <div className="feature-card glass-panel" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '20px' }}>
            <div className="icon-wrapper bg-card outline-border mb-5" style={{ width: 56, height: 56, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={28} color="var(--primary-color)" />
            </div>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '0.75rem', fontWeight: 600 }}>{t('features.feat2Title')}</h3>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>
              {t('features.feat2Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="tutorial-section mb-16">
        <div className="text-center mb-10">
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('tutorial.title')}</h2>
          <p className="text-secondary">{t('tutorial.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STEP 1 */}
          <div className="step-card bg-card outline-border mt-4" style={{ padding: '2rem', borderRadius: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="step-number" style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>1</div>
            <div className="icon-wrapper mb-4 mt-2" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Settings size={32} className="text-primary" />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{t('tutorial.step1Title')}</h4>
            <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: 1.5 }}>
              {t('tutorial.step1Desc')}
            </p>
          </div>

          {/* STEP 2 */}
          <div className="step-card bg-card outline-border mt-4" style={{ padding: '2rem', borderRadius: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="step-number" style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>2</div>
            <div className="icon-wrapper mb-4 mt-2" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Mail size={32} className="text-primary" />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{t('tutorial.step2Title')}</h4>
            <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: 1.5 }}>
              {t('tutorial.step2Desc')}
            </p>
          </div>

          {/* STEP 3 */}
          <div className="step-card bg-card outline-border mt-4" style={{ padding: '2rem', borderRadius: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="step-number" style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>3</div>
            <div className="icon-wrapper mb-4 mt-2" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <FileJson size={32} className="text-primary" />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{t('tutorial.step3Title')}</h4>
            <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: 1.5 }}>
              {t('tutorial.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
      />
      <section className="faq-section mb-16">
        <div className="text-center mb-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Shield size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('faq.guarantee')}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('faq.title')}</h2>
        </div>

        <div className="faq-list max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item p-5 rounded-2xl cursor-pointer transition-all duration-300 ${openFaq === index ? 'bg-card outline-border' : 'bg-transparent hover:bg-white/5 border border-transparent'}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center gap-4">
                <h4 style={{ fontSize: '1.125rem', fontWeight: 500 }}>{faq.question}</h4>
                {openFaq === index ? <ChevronUp size={20} className="text-secondary flex-shrink-0" /> : <ChevronDown size={20} className="text-secondary flex-shrink-0" />}
              </div>
              
              <div 
                className="faq-answer text-secondary" 
                style={{ 
                  maxHeight: openFaq === index ? '300px' : '0', 
                  overflow: 'hidden',
                  marginTop: openFaq === index ? '1rem' : '0',
                  opacity: openFaq === index ? 1 : 0,
                  transition: 'all 0.3s ease',
                  lineHeight: 1.6
                }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
