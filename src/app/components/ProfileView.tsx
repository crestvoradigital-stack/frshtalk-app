import { Settings, Edit, Camera } from 'lucide-react';

export function ProfileView() {
  const userProfile = {
    name: 'You',
    age: 27,
    bio: 'Love to travel and meet new people. Always looking for the next adventure!',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1592234789031-94bf65f630ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Travel', 'Photography', 'Food', 'Music', 'Hiking', 'Art'],
    photos: [
      'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1668804985095-0e6c33f99fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1592234789031-94bf65f630ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    ]
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        <img
          src={userProfile.image}
          alt={userProfile.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          <Settings className="w-6 h-6" />
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl mb-1">{userProfile.name}, {userProfile.age}</h1>
          <p className="text-white/90">{userProfile.location}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg">About Me</h2>
            <button className="text-pink-500">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-700">{userProfile.bio}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg">Interests</h2>
            <button className="text-pink-500">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((interest, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg">Photos</h2>
            <button className="text-pink-500">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {userProfile.photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
