import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePhoneNumber, formatPhoneNumber } from '../../lib/validation';
import { apiPost } from '../../lib/api';
import { storage } from '../../lib/storage';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';
import { OTPScreen } from './OTPScreen';

interface DosttLoginProps {
  onBack?: () => void;
  onVerified?: () => void;
}

export function DosttLogin({ onBack, onVerified }: DosttLoginProps) {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const countries = [
    { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '+355', flag: '🇦🇱', name: 'Albania' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+1', flag: '🇦🇸', name: 'American Samoa' },
    { code: '+376', flag: '🇦🇩', name: 'Andorra' },
    { code: '+244', flag: '🇦🇴', name: 'Angola' },
    { code: '+1', flag: '🇦🇮', name: 'Anguilla' },
    { code: '+1', flag: '🇦🇬', name: 'Antigua and Barbuda' },
    { code: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: '+374', flag: '🇦🇲', name: 'Armenia' },
    { code: '+297', flag: '🇦🇼', name: 'Aruba' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+43', flag: '🇦🇹', name: 'Austria' },
    { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: '+1', flag: '🇧🇸', name: 'Bahamas' },
    { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+1', flag: '🇧🇧', name: 'Barbados' },
    { code: '+375', flag: '🇧🇾', name: 'Belarus' },
    { code: '+32', flag: '🇧🇪', name: 'Belgium' },
    { code: '+501', flag: '🇧🇿', name: 'Belize' },
    { code: '+229', flag: '🇧🇯', name: 'Benin' },
    { code: '+1', flag: '🇧🇲', name: 'Bermuda' },
    { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
    { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
    { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { code: '+267', flag: '🇧🇼', name: 'Botswana' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+246', flag: '🇮🇴', name: 'British Indian Ocean Territory' },
    { code: '+1', flag: '🇻🇬', name: 'British Virgin Islands' },
    { code: '+673', flag: '🇧🇳', name: 'Brunei' },
    { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
    { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
    { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
    { code: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
    { code: '+1', flag: '🇰🇾', name: 'Cayman Islands' },
    { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
    { code: '+235', flag: '🇹🇩', name: 'Chad' },
    { code: '+56', flag: '🇨🇱', name: 'Chile' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+61', flag: '🇨🇽', name: 'Christmas Island' },
    { code: '+61', flag: '🇨🇨', name: 'Cocos Islands' },
    { code: '+57', flag: '🇨🇴', name: 'Colombia' },
    { code: '+269', flag: '🇰🇲', name: 'Comoros' },
    { code: '+682', flag: '🇨🇰', name: 'Cook Islands' },
    { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '+385', flag: '🇭🇷', name: 'Croatia' },
    { code: '+53', flag: '🇨🇺', name: 'Cuba' },
    { code: '+599', flag: '🇨🇼', name: 'Curacao' },
    { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
    { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
    { code: '+45', flag: '🇩🇰', name: 'Denmark' },
    { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
    { code: '+1', flag: '🇩🇲', name: 'Dominica' },
    { code: '+1', flag: '🇩🇴', name: 'Dominican Republic' },
    { code: '+670', flag: '🇹🇱', name: 'East Timor' },
    { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
    { code: '+291', flag: '🇪🇷', name: 'Eritrea' },
    { code: '+372', flag: '🇪🇪', name: 'Estonia' },
    { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
    { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
    { code: '+298', flag: '🇫🇴', name: 'Faroe Islands' },
    { code: '+679', flag: '🇫🇯', name: 'Fiji' },
    { code: '+358', flag: '🇫🇮', name: 'Finland' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
    { code: '+241', flag: '🇬🇦', name: 'Gabon' },
    { code: '+220', flag: '🇬🇲', name: 'Gambia' },
    { code: '+995', flag: '🇬🇪', name: 'Georgia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: '+350', flag: '🇬🇮', name: 'Gibraltar' },
    { code: '+30', flag: '🇬🇷', name: 'Greece' },
    { code: '+299', flag: '🇬🇱', name: 'Greenland' },
    { code: '+1', flag: '🇬🇩', name: 'Grenada' },
    { code: '+1', flag: '🇬🇺', name: 'Guam' },
    { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '+44', flag: '🇬🇬', name: 'Guernsey' },
    { code: '+224', flag: '🇬🇳', name: 'Guinea' },
    { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { code: '+592', flag: '🇬🇾', name: 'Guyana' },
    { code: '+509', flag: '🇭🇹', name: 'Haiti' },
    { code: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+36', flag: '🇭🇺', name: 'Hungary' },
    { code: '+354', flag: '🇮🇸', name: 'Iceland' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+98', flag: '🇮🇷', name: 'Iran' },
    { code: '+964', flag: '🇮🇶', name: 'Iraq' },
    { code: '+353', flag: '🇮🇪', name: 'Ireland' },
    { code: '+44', flag: '🇮🇲', name: 'Isle of Man' },
    { code: '+972', flag: '🇮🇱', name: 'Israel' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
    { code: '+1', flag: '🇯🇲', name: 'Jamaica' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+44', flag: '🇯🇪', name: 'Jersey' },
    { code: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
    { code: '+383', flag: '🇽🇰', name: 'Kosovo' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: '+856', flag: '🇱🇦', name: 'Laos' },
    { code: '+371', flag: '🇱🇻', name: 'Latvia' },
    { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+266', flag: '🇱🇸', name: 'Lesotho' },
    { code: '+231', flag: '🇱🇷', name: 'Liberia' },
    { code: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
    { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
    { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
    { code: '+853', flag: '🇲🇴', name: 'Macao' },
    { code: '+389', flag: '🇲🇰', name: 'Macedonia' },
    { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
    { code: '+265', flag: '🇲🇼', name: 'Malawi' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+960', flag: '🇲🇻', name: 'Maldives' },
    { code: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: '+356', flag: '🇲🇹', name: 'Malta' },
    { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
    { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
    { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
    { code: '+262', flag: '🇾🇹', name: 'Mayotte' },
    { code: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: '+691', flag: '🇫🇲', name: 'Micronesia' },
    { code: '+373', flag: '🇲🇩', name: 'Moldova' },
    { code: '+377', flag: '🇲🇨', name: 'Monaco' },
    { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
    { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
    { code: '+1', flag: '🇲🇸', name: 'Montserrat' },
    { code: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
    { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '+264', flag: '🇳🇦', name: 'Namibia' },
    { code: '+674', flag: '🇳🇷', name: 'Nauru' },
    { code: '+977', flag: '🇳🇵', name: 'Nepal' },
    { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
    { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+683', flag: '🇳🇺', name: 'Niue' },
    { code: '+672', flag: '🇳🇫', name: 'Norfolk Island' },
    { code: '+850', flag: '🇰🇵', name: 'North Korea' },
    { code: '+1', flag: '🇲🇵', name: 'Northern Mariana Islands' },
    { code: '+47', flag: '🇳🇴', name: 'Norway' },
    { code: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+680', flag: '🇵🇼', name: 'Palau' },
    { code: '+970', flag: '🇵🇸', name: 'Palestine' },
    { code: '+507', flag: '🇵🇦', name: 'Panama' },
    { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
    { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
    { code: '+51', flag: '🇵🇪', name: 'Peru' },
    { code: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: '+48', flag: '🇵🇱', name: 'Poland' },
    { code: '+351', flag: '🇵🇹', name: 'Portugal' },
    { code: '+1', flag: '🇵🇷', name: 'Puerto Rico' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+242', flag: '🇨🇬', name: 'Republic of the Congo' },
    { code: '+262', flag: '🇷🇪', name: 'Reunion' },
    { code: '+40', flag: '🇷🇴', name: 'Romania' },
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: '+590', flag: '🇧🇱', name: 'Saint Barthelemy' },
    { code: '+290', flag: '🇸🇭', name: 'Saint Helena' },
    { code: '+1', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
    { code: '+1', flag: '🇱🇨', name: 'Saint Lucia' },
    { code: '+590', flag: '🇲🇫', name: 'Saint Martin' },
    { code: '+508', flag: '🇵🇲', name: 'Saint Pierre and Miquelon' },
    { code: '+1', flag: '🇻🇨', name: 'Saint Vincent and the Grenadines' },
    { code: '+685', flag: '🇼🇸', name: 'Samoa' },
    { code: '+378', flag: '🇸🇲', name: 'San Marino' },
    { code: '+239', flag: '🇸🇹', name: 'Sao Tome and Principe' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+221', flag: '🇸🇳', name: 'Senegal' },
    { code: '+381', flag: '🇷🇸', name: 'Serbia' },
    { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
    { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
    { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
    { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
    { code: '+252', flag: '🇸🇴', name: 'Somalia' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+211', flag: '🇸🇸', name: 'South Sudan' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: '+597', flag: '🇸🇷', name: 'Suriname' },
    { code: '+46', flag: '🇸🇪', name: 'Sweden' },
    { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
    { code: '+963', flag: '🇸🇾', name: 'Syria' },
    { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
    { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: '+690', flag: '🇹🇰', name: 'Tokelau' },
    { code: '+676', flag: '🇹🇴', name: 'Tonga' },
    { code: '+1', flag: '🇹🇹', name: 'Trinidad and Tobago' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
    { code: '+1', flag: '🇹🇨', name: 'Turks and Caicos Islands' },
    { code: '+688', flag: '🇹🇻', name: 'Tuvalu' },
    { code: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
    { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
    { code: '+1', flag: '🇻🇮', name: 'U.S. Virgin Islands' },
    { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
    { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
    { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
    { code: '+967', flag: '🇾🇪', name: 'Yemen' },
    { code: '+260', flag: '🇿🇲', name: 'Zambia' },
    { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid phone number');
      return;
    }

    setIsSendingOTP(true);
    setError(null);

    try {
      // Add country code and send to API
      const formattedPhone = selectedCountry.code + phoneNumber;
      
      await apiPost('/auth/send-otp', {
        phoneNumber: formattedPhone,
      });
      
      setShowOTP(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      await login(selectedCountry.code + phoneNumber, otp);

      // Check if user has already claimed signup bonus
      const hasClaimedBonus = storage.getHasClaimedSignupBonus();

      if (hasClaimedBonus) {
        navigate('/home');
      } else {
        navigate('/signup-bonus');
      }
      onVerified?.();
    } catch (err) {
      throw err;
    }
  };

  const handleBackToPhone = () => {
    setShowOTP(false);
    setError(null);
  };

  if (showOTP) {
    return (
      <OTPScreen
        phoneNumber={selectedCountry.code + phoneNumber}
        onVerify={handleVerifyOTP}
        onBack={handleBackToPhone}
        onResend={handleSendOTP}
      />
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="text-white/90 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <h1 className="text-white text-[28px] font-semibold leading-tight mb-2">
          Login/Signup
        </h1>
        <p className="text-white/80 text-base leading-relaxed mb-8">
          Enter your phone number and we'll send you an OTP to verify
        </p>

        <form onSubmit={handleSendOTP} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="sr-only">
              Phone Number
            </label>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md text-white placeholder-white/40 rounded-full border-2 border-white/20 focus-within:border-white/40 transition-colors flex items-center shadow-lg">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex items-center gap-2 px-4 py-4 text-white/70 hover:text-white transition-colors shrink-0"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-base">{selectedCountry.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-white/20" />
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  className="flex-1 bg-transparent text-white placeholder-white/40 px-4 py-4 outline-none text-base"
                  autoFocus
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'phone-error' : undefined}
                  disabled={isSendingOTP}
                />
              </div>
              {showCountryDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 z-10 shadow-xl">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full bg-white/5 text-white placeholder-white/40 px-3 py-2 rounded-lg outline-none mb-2 border border-white/10"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(country => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                          setCountrySearch('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-white">{country.name}</span>
                        <span className="text-white/70 ml-auto">{country.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {phoneNumber && (
              <p className="text-white/60 text-sm mt-2" aria-live="polite">
                {formatPhoneNumber(selectedCountry.code + phoneNumber)}
              </p>
            )}
            {error && (
              <p id="phone-error" className="text-red-400 text-sm mt-2" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={phoneNumber.length !== 10 || isSendingOTP}
            className="w-full bg-white text-[#1a1035] font-semibold py-4 rounded-full text-base shadow-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isSendingOTP ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Sending OTP...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <p className="text-white/50 text-xs mt-8 text-center leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Illustration */}
        <div className="flex-1 flex items-end justify-center pb-8">
          <div className="w-48 h-48 relative opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
