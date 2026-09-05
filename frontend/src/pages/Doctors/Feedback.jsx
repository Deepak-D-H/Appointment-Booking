import React, { useState } from 'react';
import avatar from '../../assets/images/avatar-icon.png';
import { formatDate } from '../../utils/formateDate';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';

const Feedback = ({ reviews, totalRating }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  return (
    <div>
      <div className='mb-[50px]'>
        <h4 className='text-[20px] leading-[30px] font-bold text-black mb-6'>
          All reviews ({totalRating || 0})
        </h4>

        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => {
            const starCount = Math.max(0, Math.min(5, Math.floor(review?.rating || 0)));
            return (
              <div key={index} className='flex justify-between gap-10 mb-[30px] border-b border-gray-100 pb-4'>
                <div className='flex gap-3'>
                  <figure className='w-10 h-10 rounded-full overflow-hidden shrink-0'>
                    <img
                      className='w-full h-full object-cover'
                      src={review?.user?.photo || avatar}
                      alt={review?.user?.name || 'Reviewer'}
                    />
                  </figure>
                  <div>
                    <h5 className='text-[16px] leading-6 text-blue-600 font-bold'>
                      {review?.user?.name || 'Patient'}
                    </h5>
                    <p className='text-[14px] leading-6 text-[#4E545F]'>
                      {formatDate(review?.createdAt)}
                    </p>
                    <p className='text__para font-medium mt-2 text-[15px]'>
                      {review?.reviewText}
                    </p>
                  </div>
                </div>
                <div className='flex gap-1 shrink-0'>
                  {[...Array(starCount).keys()].map((_, starIndex) => (
                    <AiFillStar key={starIndex} color='#60A5FA' size={18} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-gray-500 italic py-4'>No reviews yet for this doctor. Be the first to share your experience!</p>
        )}
      </div>

      {!showFeedbackForm && (
        <div className='text-center'>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className='btn cursor-pointer'
          >
            Give Feedback
          </button>
        </div>
      )}

      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};

export default Feedback;
