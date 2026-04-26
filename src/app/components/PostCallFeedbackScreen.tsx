import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, X } from 'lucide-react';

interface PostCallFeedbackScreenProps {
  listenerName: string;
  listenerAvatar: string;
  callDuration: string;
  isVideoCall: boolean;
  onSubmit: (feedback: FeedbackData) => void;
  onSkip: () => void;
}

interface FeedbackData {
  rating: number;
  wasHelpful: boolean | null;
  tags: string[];
  comment: string;
  reportIssue: boolean;
}

const feedbackTags = [
  '😊 Great listener',
  '❤️ Very supportive',
  '🎯 Helpful advice',
  '⏰ Good timing',
  '🗣️ Easy to talk to',
  '🤝 Understanding',
  '💡 Insightful',
  '🌟 Professional',
];

const reportReasons = [
  'Inappropriate behavior',
  'Technical issues',
  'Poor call quality',
  'Listener was unprofessional',
  'Other',
];

export function PostCallFeedbackScreen({
  listenerName,
  listenerAvatar,
  callDuration,
  isVideoCall,
  onSubmit,
  onSkip,
}: PostCallFeedbackScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      rating,
      wasHelpful,
      tags: selectedTags,
      comment,
      reportIssue: showReport && reportReason !== '',
    });
  };

  const canSubmit = rating > 0;

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-2xl font-bold">How was your call?</h1>
            <button onClick={onSkip} className="text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Listener Info */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 flex items-center gap-3">
            <img
              src={listenerAvatar}
              alt={listenerName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-lg">{listenerName}</p>
              <p className="text-white/60 text-sm">
                {isVideoCall ? 'Video' : 'Voice'} call • {callDuration}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-3">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-white/60 text-sm mt-2">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Great!'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Could be better'}
                {rating === 1 && 'Not great'}
              </p>
            )}
          </div>

          {/* Was it helpful? */}
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-3">Did this call help you?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setWasHelpful(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  wasHelpful === true
                    ? 'bg-green-600 text-white'
                    : 'bg-[#1a1a1a] text-white/60 hover:bg-[#2a2a2a]'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Yes, it helped</span>
              </button>
              <button
                onClick={() => setWasHelpful(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  wasHelpful === false
                    ? 'bg-red-600 text-white'
                    : 'bg-[#1a1a1a] text-white/60 hover:bg-[#2a2a2a]'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>Not really</span>
              </button>
            </div>
          </div>

          {/* Feedback Tags */}
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-3">What stood out? (Optional)</p>
            <div className="flex flex-wrap gap-2">
              {feedbackTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#1a1a1a] text-white/60 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-3">Additional comments (Optional)</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience..."
              className="w-full bg-[#1a1a1a] text-white rounded-xl p-3 min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={500}
            />
            <p className="text-white/40 text-xs mt-1">{comment.length}/500</p>
          </div>

          {/* Report Issue */}
          <button
            onClick={() => setShowReport(!showReport)}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 mb-4"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm">Report an issue</span>
          </button>

          {showReport && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 mb-6">
              <p className="text-white/80 text-sm mb-3">What went wrong?</p>
              <div className="space-y-2">
                {reportReasons.map((reason) => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="report"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="text-red-500"
                    />
                    <span className="text-white/70 text-sm">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-[#0d0d0d] border-t border-[#2a2a2a]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-full font-semibold transition-all ${
              canSubmit
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                : 'bg-[#2a2a2a] text-white/40 cursor-not-allowed'
            }`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
