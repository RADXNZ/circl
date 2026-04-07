import React from 'react';
import { useData } from '../context/DataContext';
import { FileUploader } from './FileUploader';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';

export const UploadSetup: React.FC = () => {
  const { state, setMode, setBasicData, setCompareData } = useData();
  const { lang } = useLanguage();
  const t = (key: any) => getTranslation(lang, key);

  const isBasicReady = state.followersData && state.followingData;
  const isCompareReady = state.oldFollowersData && state.oldFollowingData && state.newFollowersData && state.newFollowingData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-4 mb-4">
        <button 
          className={state.mode === 'basic' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setMode('basic')}
        >
          {t('upload.modeBasic')}
        </button>
        <button 
          className={state.mode === 'compare' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setMode('compare')}
        >
          {t('upload.modeCompare')}
        </button>
      </div>

      <div className="card fade-in">
        <h3 className="mb-4">{state.mode === 'basic' ? t('upload.titleBasic') : t('upload.titleCompare')}</h3>
        <p className="mb-2 text-sm text-secondary">
          {t('upload.subtitle')}
        </p>
        <p className="mb-8 text-sm" style={{ fontWeight: 500, color: 'var(--success-color)' }}>
          {t('upload.privacyDisclaimer')}
        </p>

        {state.mode === 'basic' ? (
          <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <FileUploader 
              label={t('upload.followersBox')} 
              isUploaded={!!state.followersData}
              existingData={state.followersData}
              supportsMultiple={true}
              onDataParsed={(data) => setBasicData(data, state.followingData)}
            />
            <FileUploader 
              label={t('upload.followingBox')} 
              isUploaded={!!state.followingData}
              existingData={state.followingData}
              onDataParsed={(data) => setBasicData(state.followersData, data)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="mb-4">{t('upload.pastExport')}</h4>
              <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <FileUploader 
                  label={t('upload.oldFollowers')} 
                  isUploaded={!!state.oldFollowersData}
                  existingData={state.oldFollowersData}
                  supportsMultiple={true}
                  onDataParsed={(data) => setCompareData({ oldFollowersData: data })}
                />
                <FileUploader 
                  label={t('upload.oldFollowing')} 
                  isUploaded={!!state.oldFollowingData}
                  existingData={state.oldFollowingData}
                  onDataParsed={(data) => setCompareData({ oldFollowingData: data })}
                />
              </div>
            </div>
            <div>
              <h4 className="mb-4">{t('upload.recentExport')}</h4>
              <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <FileUploader 
                  label={t('upload.newFollowers')} 
                  isUploaded={!!state.newFollowersData}
                  existingData={state.newFollowersData}
                  supportsMultiple={true}
                  onDataParsed={(data) => setCompareData({ newFollowersData: data })}
                />
                <FileUploader 
                  label={t('upload.newFollowing')} 
                  isUploaded={!!state.newFollowingData}
                  existingData={state.newFollowingData}
                  onDataParsed={(data) => setCompareData({ newFollowingData: data })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {(state.mode === 'basic' ? isBasicReady : isCompareReady) && (
        <div className="flex justify-center mt-4">
          <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            {t('upload.ready')}
          </button>
        </div>
      )}
    </div>
  );
};
