import React, { useState } from 'react';
import { 
  BiBuilding, BiCodeAlt, BiBrain, BiCloud, BiMoney, 
  BiPlusMedical, BiGlobe, BiRocket, BiUserCheck, BiBriefcase, 
  BiShieldQuarter, BiPalette 
} from 'react-icons/bi';

const COMPANY_PRESETS = {
  'techcorp': {
    bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    icon: <BiCodeAlt />,
    short: 'TC',
    color: '#ffffff'
  },
  'innovate': {
    bg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    icon: <BiBrain />,
    short: 'IL',
    color: '#ffffff'
  },
  'cloudscale': {
    bg: 'linear-gradient(135deg, #0284c7, #0369a1)',
    icon: <BiCloud />,
    short: 'CS',
    color: '#ffffff'
  },
  'apex': {
    bg: 'linear-gradient(135deg, #059669, #047857)',
    icon: <BiMoney />,
    short: 'AF',
    color: '#ffffff'
  },
  'stellar': {
    bg: 'linear-gradient(135deg, #e11d48, #be123c)',
    icon: <BiPlusMedical />,
    short: 'SH',
    color: '#ffffff'
  },
  'vanguard': {
    bg: 'linear-gradient(135deg, #d97706, #b45309)',
    icon: <BiGlobe />,
    short: 'VL',
    color: '#ffffff'
  },
  'growthpulse': {
    bg: 'linear-gradient(135deg, #db2777, #9d174d)',
    icon: <BiRocket />,
    short: 'GP',
    color: '#ffffff'
  },
  'elevate': {
    bg: 'linear-gradient(135deg, #4f46e5, #3730a3)',
    icon: <BiUserCheck />,
    short: 'ET',
    color: '#ffffff'
  },
  'zenith': {
    bg: 'linear-gradient(135deg, #334155, #0f172a)',
    icon: <BiBriefcase />,
    short: 'ZC',
    color: '#ffffff'
  }
};

const getPresetForCompany = (name = '', industry = '') => {
  const n = (name || '').toLowerCase();
  for (const [key, preset] of Object.entries(COMPANY_PRESETS)) {
    if (n.includes(key)) return preset;
  }
  const ind = (industry || '').toLowerCase();
  if (ind.includes('health') || ind.includes('medical')) return COMPANY_PRESETS.stellar;
  if (ind.includes('finance') || ind.includes('bank')) return COMPANY_PRESETS.apex;
  if (ind.includes('market') || ind.includes('media')) return COMPANY_PRESETS.growthpulse;
  if (ind.includes('logistics') || ind.includes('supply')) return COMPANY_PRESETS.vanguard;
  if (ind.includes('cloud') || ind.includes('devops')) return COMPANY_PRESETS.cloudscale;
  if (ind.includes('ai') || ind.includes('data')) return COMPANY_PRESETS.innovate;
  if (ind.includes('hr') || ind.includes('talent')) return COMPANY_PRESETS.elevate;
  if (ind.includes('software') || ind.includes('tech')) return COMPANY_PRESETS.techcorp;

  return {
    bg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    icon: <BiBuilding />,
    short: name ? name.substring(0, 2).toUpperCase() : 'CO',
    color: '#ffffff'
  };
};

const CompanyLogo = ({ company, size = 52, rounded = 'rounded-3', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const preset = getPresetForCompany(company?.name, company?.industry);
  const iconSize = Math.max(16, Math.floor(size * 0.42));
  const fontSize = Math.max(13, Math.floor(size * 0.32));

  if (company?.logo && !imgFailed) {
    return (
      <div 
        className={`d-inline-flex align-items-center justify-content-center overflow-hidden bg-white shadow-sm border ${rounded} ${className}`}
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <img 
          src={`http://localhost:8080/uploads/${company.logo}`} 
          alt={company.name || 'Company'} 
          className="img-fluid w-100 h-100" 
          style={{ objectFit: 'cover' }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div 
      className={`d-inline-flex flex-column align-items-center justify-content-center position-relative shadow-sm text-white fw-bold ${rounded} ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: preset.bg, 
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      title={company?.name || 'Company'}
    >
      <span style={{ fontSize: `${iconSize}px`, lineHeight: 1 }}>{preset.icon}</span>
      <span style={{ fontSize: `${fontSize}px`, fontWeight: 800, letterSpacing: '0.5px', marginTop: '2px', lineHeight: 1 }}>
        {preset.short}
      </span>
    </div>
  );
};

export default CompanyLogo;
