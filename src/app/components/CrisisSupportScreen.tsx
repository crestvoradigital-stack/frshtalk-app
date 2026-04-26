import { ArrowLeft, Phone, MessageCircle, Globe, Heart, AlertCircle, ExternalLink } from 'lucide-react';

interface CrisisSupportScreenProps {
  onBack: () => void;
}

interface HelplineResource {
  id: string;
  name: string;
  number: string;
  description: string;
  availability: string;
  type: 'suicide' | 'mental' | 'domestic' | 'child' | 'general';
  languages?: string[];
}

const helplines: HelplineResource[] = [
  {
    id: '1',
    name: 'National Suicide Prevention',
    number: '9152987821',
    description: 'Confidential support for people in distress',
    availability: '24/7',
    type: 'suicide',
    languages: ['English', 'Hindi', 'Telugu'],
  },
  {
    id: '2',
    name: 'AASRA - 24/7 Crisis Helpline',
    number: '9820466726',
    description: 'Emotional support and crisis intervention',
    availability: '24/7',
    type: 'suicide',
    languages: ['English', 'Hindi'],
  },
  {
    id: '3',
    name: 'Vandrevala Foundation',
    number: '18602662345',
    description: 'Mental health support and counseling',
    availability: '24/7',
    type: 'mental',
    languages: ['English', 'Hindi', 'Multiple'],
  },
  {
    id: '4',
    name: 'NIMHANS Crisis Helpline',
    number: '08046110007',
    description: 'Mental health emergency services',
    availability: 'Mon-Sat, 9AM-5PM',
    type: 'mental',
    languages: ['English', 'Kannada', 'Hindi'],
  },
  {
    id: '5',
    name: 'Women Helpline',
    number: '1091',
    description: 'Support for women in distress',
    availability: '24/7',
    type: 'domestic',
    languages: ['Multiple'],
  },
  {
    id: '6',
    name: 'Child Helpline',
    number: '1098',
    description: 'Support and protection for children',
    availability: '24/7',
    type: 'child',
    languages: ['Multiple'],
  },
];

const onlineResources = [
  {
    name: 'YourDOST',
    description: 'Professional counseling and emotional support',
    url: 'https://yourdost.com',
  },
  {
    name: 'Mpower',
    description: 'Mental health resources and articles',
    url: 'https://mpowerminds.com',
  },
  {
    name: 'Pause for Perspective',
    description: 'Free mental health support',
    url: 'https://pauseforperspective.org',
  },
];

function getTypeColor(type: string): string {
  switch (type) {
    case 'suicide':
      return 'from-red-600 to-red-800';
    case 'mental':
      return 'from-blue-600 to-blue-800';
    case 'domestic':
      return 'from-purple-600 to-purple-800';
    case 'child':
      return 'from-green-600 to-green-800';
    default:
      return 'from-gray-600 to-gray-800';
  }
}

export function CrisisSupportScreen({ onBack }: CrisisSupportScreenProps) {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0 bg-red-900/20">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold ml-4">Crisis Support</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-5 mb-6 mt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <h2 className="text-white text-lg font-bold mb-2">You're Not Alone</h2>
              <p className="text-white/90 text-sm leading-relaxed">
                If you're experiencing a crisis or having thoughts of self-harm, please reach out immediately. Help is
                available 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Helplines */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            Crisis Helplines
          </h3>
          <div className="space-y-3">
            {helplines.map((helpline) => (
              <div key={helpline.id} className="bg-[#1a1a1a] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{helpline.name}</h4>
                    <p className="text-white/60 text-sm mb-2">{helpline.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-[#2a2a2a] text-white/70 px-2 py-1 rounded-full">
                        {helpline.availability}
                      </span>
                      {helpline.languages && (
                        <span className="text-xs bg-[#2a2a2a] text-white/70 px-2 py-1 rounded-full">
                          {helpline.languages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${getTypeColor(helpline.type)} rounded-lg p-2 ml-2`}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => handleCall(helpline.number)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call {helpline.number}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Online Resources */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Online Resources
          </h3>
          <div className="space-y-3">
            {onlineResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{resource.name}</h4>
                    <p className="text-white/60 text-sm">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-400 flex-shrink-0 ml-2" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Chat Option */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Not Ready to Call?</h3>
              <p className="text-white/90 text-sm">Connect with a listener on FrshTalk for support</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Find a Listener
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4">
          <p className="text-white/40 text-xs leading-relaxed">
            <strong className="text-white/60">Important:</strong> FrshTalk listeners are not professional therapists or
            crisis counselors. In case of emergency, please contact the helplines above or seek immediate professional
            help.
          </p>
        </div>
      </div>
    </div>
  );
}
