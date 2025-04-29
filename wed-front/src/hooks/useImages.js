import { useState, useEffect } from 'react';
import apiClient from '../pages/AxiosInstance';

/**
 * Custom hook to fetch images from the API
 * @param {boolean} includeImage4 - Whether to include image_4 in the result
 * @returns {Object} - Object containing loading state, error, and images data
 */
const useImages = (includeImage4 = false) => {
  const [images, setImages] = useState({
    image_1: '',
    image_2: '',
    image_3: '',
    ...(includeImage4 ? { image_4: '' } : {})
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('get_images/');
        const data = response.data;
        
        setImages({
          image_1: data.image_1,
          image_2: data.image_2,
          image_3: data.image_3,
          ...(includeImage4 && data.image_4 ? { image_4: data.image_4 } : {})
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [includeImage4]);

  return { images, loading, error };
};

export default useImages;