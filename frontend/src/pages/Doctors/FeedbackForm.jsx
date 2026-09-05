import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const handleClear = () => {
    setRating(0);
    setHover(0);
    setReviewText('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setLoading(false);
      return toast.error('Please log in to submit feedback');
    }

    try {
      if (!rating || !reviewText.trim()) {
        setLoading(false);
        return toast.error('Rating & Review text are required');
      }

      const res = await fetch(`${BASE_URL}/api/v1/doctors/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rating, reviewText: reviewText.trim() }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Failed to submit review');
      }

      setLoading(false);
      toast.success(result.message || 'Review submitted successfully');
      handleClear();
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmitReview}>
      <div>
        <h3 className='text-black text-[16px] leading-6 font-semibold mb-4 mt-0'>
          How would you rate the overall experience?
        </h3>
        <div>
          {[...Array(5).keys()].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={starValue}
                type='button'
                className={`${
                  starValue <= ((rating && hover) || hover || rating)
                    ? 'text-yellow-400 text-[30px]'
                    : 'text-gray-300 text-[30px]'
                } bg-transparent border-none outline-none cursor-pointer`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='mt-[30px]'>
        <h3 className='text-black text-[16px] leading-6 font-semibold mb-4 mt-0'>
          Share your feedback or suggestions*
        </h3>
        <textarea
          className='border border-solid border-gray-300 focus:outline-none focus:border-blue-500 w-full px-4 py-3 rounded-md'
          rows='5'
          placeholder='Write your review here...'
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
      </div>

      <div className='flex items-center gap-4 mt-4'>
        <button
          type='submit'
          disabled={loading}
          className='btn mt-0'
        >
          {loading ? <HashLoader size={25} color='#fff' /> : 'Submit Feedback'}
        </button>

        <button
          type='button'
          onClick={handleClear}
          className='py-3 px-6 rounded-[50px] border border-gray-400 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100'
        >
          Clear Form
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
